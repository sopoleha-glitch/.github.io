// Данные объявлений
let adsData = [
    {
        id: 1,
        title: "iPhone 15 Pro Max 256GB",
        category: "electronics",
        price: 85000,
        location: "Москва",
        description: "Отличное состояние, полный комплект, чехол и стекло в подарок. Покупал в ноябре, продаю из-за покупки другого телефона.",
        seller: {
            name: "Алексей",
            rating: 4.8,
            deals: 34
        },
        phone: "+7 (999) 123-45-67",
        date: "2024-01-15",
        views: 127,
        isUrgent: true,
        images: []
    },
    {
        id: 2,
        title: "Hyundai Solaris 2018",
        category: "transport",
        price: 750000,
        location: "Санкт-Петербург",
        description: "1.6 AT, комплектация Comfort, пробег 85000 км, обслуживание у дилера, новый аккумулятор, зимняя резина в комплекте.",
        seller: {
            name: "Дмитрий",
            rating: 4.9,
            deals: 56
        },
        phone: "+7 (999) 234-56-78",
        date: "2024-01-14",
        views: 89,
        isUrgent: false,
        images: []
    },
    {
        id: 3,
        title: "Диван угловой",
        category: "home",
        price: 15000,
        location: "Казань",
        description: "Угловой диван, состояние хорошее, обивка микрофибра, без повреждений. Размеры: 250x150 см.",
        seller: {
            name: "Елена",
            rating: 4.7,
            deals: 23
        },
        phone: "+7 (999) 345-67-89",
        date: "2024-01-15",
        views: 45,
        isUrgent: true,
        images: []
    },
    {
        id: 4,
        title: "Квартира 2-комнатная",
        category: "realty",
        price: 12000000,
        location: "Москва",
        description: "52 кв.м, 8/14 этаж, хороший ремонт, мебель и техника в подарок. Рядом метро, парк, школа.",
        seller: {
            name: "Ольга",
            rating: 4.9,
            deals: 12
        },
        phone: "+7 (999) 456-78-90",
        date: "2024-01-13",
        views: 234,
        isUrgent: false,
        images: []
    },
    {
        id: 5,
        title: "MacBook Pro M3 14''",
        category: "electronics",
        price: 185000,
        location: "Новосибирск",
        description: "Новый, в упаковке, 18GB RAM, 512GB SSD. Подарочный сертификат на 5000₽ в придачу.",
        seller: {
            name: "Иван",
            rating: 5.0,
            deals: 78
        },
        phone: "+7 (999) 567-89-01",
        date: "2024-01-15",
        views: 312,
        isUrgent: true,
        images: []
    },
    {
        id: 6,
        title: "Велосипед Stels Navigator",
        category: "hobby",
        price: 12000,
        location: "Екатеринбург",
        description: "Горный велосипед, 26 дюймов, передняя амортизация, 21 скорость. Покупали для покатушек, почти не использовали.",
        seller: {
            name: "Сергей",
            rating: 4.6,
            deals: 15
        },
        phone: "+7 (999) 678-90-12",
        date: "2024-01-14",
        views: 67,
        isUrgent: false,
        images: []
    },
    {
        id: 7,
        title: "Куртка зимняя The North Face",
        category: "personal",
        price: 18000,
        location: "Москва",
        description: "Размер M, цвет черный, состояние новой. Покупал в прошлом году, ношу аккуратно.",
        seller: {
            name: "Анна",
            rating: 4.8,
            deals: 42
        },
        phone: "+7 (999) 789-01-23",
        date: "2024-01-15",
        views: 89,
        isUrgent: false,
        images: []
    },
    {
        id: 8,
        title: "Кофемашина DeLonghi",
        category: "home",
        price: 35000,
        location: "Санкт-Петербург",
        description: "Автоматическая, готовит эспрессо, капучино. Регулярно чистилась, все функции работают отлично.",
        seller: {
            name: "Михаил",
            rating: 4.7,
            deals: 28
        },
        phone: "+7 (999) 890-12-34",
        date: "2024-01-13",
        views: 156,
        isUrgent: true,
        images: []
    },
    {
        id: 9,
        title: "Щенки хаски",
        category: "animals",
        price: 25000,
        location: "Краснодар",
        description: "3 мальчика, 2 девочки. Привиты, ветпаспорта. Родители с родословной, окрас серо-белый.",
        seller: {
            name: "Виктория",
            rating: 4.9,
            deals: 67
        },
        phone: "+7 (999) 901-23-45",
        date: "2024-01-15",
        views: 445,
        isUrgent: false,
        images: []
    },
    {
        id: 10,
        title: "Гитара Fender Stratocaster",
        category: "hobby",
        price: 45000,
        location: "Москва",
        description: "Made in Mexico, цвет sunburst, кейс в комплекте. Продаю из-за нехватки времени.",
        seller: {
            name: "Павел",
            rating: 4.8,
            deals: 34
        },
        phone: "+7 (999) 012-34-56",
        date: "2024-01-14",
        views: 178,
        isUrgent: false,
        images: []
    }
];

// Класс для управления доской объявлений
class PreepBoard {
    constructor() {
        this.ads = adsData;
        this.user = null;
        this.filters = {
            search: '',
            category: 'all',
            city: '',
            price: '',
            sort: 'newest'
        };
        
        this.init();
    }
    
    init() {
        // Загружаем данные
        this.displayAds();
        this.updateStats();
        this.populateCities();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Поиск
        document.getElementById('searchButton').addEventListener('click', () => this.handleSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        
        // Фильтры
        document.getElementById('cityFilter').addEventListener('change', (e) => {
            this.filters.city = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('priceFilter').addEventListener('change', (e) => {
            this.filters.price = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('sortFilter').addEventListener('change', (e) => {
            this.filters.sort = e.target.value;
            this.applyFilters();
        });
        
        // Категории
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filters.category = e.target.dataset.category;
                this.applyFilters();
            });
        });
        
        // Модальные окна
        document.getElementById('addAdBtn').addEventListener('click', () => this.openModal('addAdModal'));
        document.getElementById('loginBtn').addEventListener('click', () => this.openModal('loginModal'));
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal('adModal'));
        document.getElementById('closeAddModal').addEventListener('click', () => this.closeModal('addAdModal'));
        document.getElementById('closeLoginModal').addEventListener('click', () => this.closeModal('loginModal'));
        
        // Форма добавления
        document.getElementById('addAdForm').addEventListener('submit', (e) => this.handleAddAd(e));
        
        // Закрытие по клику вне модалки
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });
        
        // Кнопка связи с продавцом
        document.getElementById('contactSellerBtn').addEventListener('click', () => {
            this.showToast('Функция связи появится в ближайшее время!');
        });
        
        // Поделиться
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareAd();
        });
    }
    
    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        this.filters.search = searchInput.value.toLowerCase();
        this.applyFilters();
    }
    
    applyFilters() {
        this.displayAds();
        this.updateActiveFilters();
    }
    
    filterAds() {
        let filtered = [...this.ads];
        
        // Поиск по тексту
        if (this.filters.search) {
            const search = this.filters.search.toLowerCase();
            filtered = filtered.filter(ad => 
                ad.title.toLowerCase().includes(search) ||
                ad.description.toLowerCase().includes(search)
            );
        }
        
        // Категория
        if (this.filters.category && this.filters.category !== 'all') {
            filtered = filtered.filter(ad => ad.category === this.filters.category);
        }
        
        // Город
        if (this.filters.city) {
            filtered = filtered.filter(ad => ad.location === this.filters.city);
        }
        
        // Цена
        if (this.filters.price) {
            const [min, max] = this.filters.price.split('-').map(Number);
            filtered = filtered.filter(ad => ad.price >= min && ad.price <= max);
        }
        
        // Сортировка
        switch(this.filters.sort) {
            case 'price_asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
                filtered.sort((a, b) => b.views - a.views);
                break;
            default: // newest
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        return filtered;
    }
    
    displayAds() {
        const filteredAds = this.filterAds();
        const container = document.getElementById('adsContainer');
        const adsFound = document.getElementById('adsFound');
        
        if (filteredAds.length === 0) {
            container.innerHTML = `
                <div class="no-ads">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h3>Ничего не найдено</h3>
                    <p>Попробуйте изменить параметры поиска</p>
                </div>
            `;
            adsFound.textContent = '0';
            return;
        }
        
        adsFound.textContent = filteredAds.length;
        
        container.innerHTML = filteredAds.map(ad => `
            <div class="ad-card" onclick="preep.showAdDetails(${ad.id})">
                <div class="ad-image">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" stroke-width="1.5">
                        <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5" fill="var(--gray-400)"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    ${ad.isUrgent ? '<span class="ad-badge">🔥 Срочно</span>' : ''}
                </div>
                <div class="ad-content">
                    <div class="ad-title">
                        ${ad.title}
                        <span class="ad-price">${ad.price.toLocaleString()} ₽</span>
                    </div>
                    <span class="ad-category">${this.getCategoryName(ad.category)}</span>
                    <p class="ad-description">${ad.description.substring(0, 80)}...</p>
                    <div class="ad-meta">
                        <span class="ad-location">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            ${ad.location}
                        </span>
                        <span class="ad-date">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            ${this.formatDate(ad.date)}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    showAdDetails(adId) {
        const ad = this.ads.find(a => a.id === adId);
        if (!ad) return;
        
        // Увеличиваем счетчик просмотров
        ad.views++;
        
        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = `
            <div class="ad-detail-header">
                <h2 class="ad-detail-title">${ad.title}</h2>
                <div class="ad-detail-price">${ad.price.toLocaleString()} ₽</div>
                <div class="ad-detail-meta">
                    <span>👁 ${ad.views} просмотров</span>
                    <span>📅 ${this.formatDate(ad.date)}</span>
                    <span>📍 ${ad.location}</span>
                    <span>📁 ${this.getCategoryName(ad.category)}</span>
                </div>
            </div>
            
            <div class="ad-detail-seller">
                <div class="seller-name">
                    ${ad.seller.name}
                    <span class="seller-rating">★ ${ad.seller.rating}</span>
                </div>
                <div class="seller-deals">✅ ${ad.seller.deals} завершенных сделок</div>
                <div style="margin-top: 10px; color: var(--gray-600);">📞 ${ad.phone}</div>
            </div>
            
            <div class="ad-detail-description">
                <h3 style="margin-bottom: 10px;">Описание</h3>
                <p>${ad.description}</p>
            </div>
        `;
        
        this.openModal('adModal');
    }
    
    handleAddAd(e) {
        e.preventDefault();
        
        const newAd = {
            id: this.ads.length + 1,
            title: document.getElementById('adTitle').value,
            category: document.getElementById('adCategory').value,
            price: parseInt(document.getElementById('adPrice').value),
            location: document.getElementById('adCity').value,
            description: document.getElementById('adDescription').value,
            seller: {
                name: document.getElementById('adSellerName').value,
                rating: 5.0,
                deals: 0
            },
            phone: document.getElementById('adPhone').value,
            date: new Date().toISOString().split('T')[0],
            views: 0,
            isUrgent: false,
            images: []
        };
        
        this.ads.unshift(newAd);
        this.displayAds();
        this.updateStats();
        this.populateCities();
        
        this.closeModal('addAdModal');
        this.showToast('Объявление успешно опубликовано!');
        
        // Очищаем форму
        e.target.reset();
    }
    
    shareAd() {
        const dummy = document.createElement('textarea');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        
        this.showToast('Ссылка скопирована в буфер обмена!');
    }
    
    updateStats() {
        document.getElementById('totalAds').textContent = this.ads.length;
        document.getElementById('totalUsers').textContent = [...new Set(this.ads.map(ad => ad.seller.name))].length;
    }
    
    populateCities() {
        const cities = [...new Set(this.ads.map(ad => ad.location))].sort();
        const select = document.getElementById('cityFilter');
        
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            select.appendChild(option);
        });
    }
    
    getCategoryName(category) {
        const categories = {
            'electronics': '📱 Электроника',
            'transport': '🚗 Транспорт',
            'realty': '🏠 Недвижимость',
            'home': '🛋 Для дома',
            'personal': '👕 Личные вещи',
            'hobby': '🎸 Хобби',
            'animals': '🐶 Животные',
            'business': '💼 Бизнес'
        };
        return categories[category] || category;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'сегодня';
        if (diffDays === 1) return 'вчера';
        if (diffDays < 7) return `${diffDays} дня назад`;
        return date.toLocaleDateString('ru-RU');
    }
    
    updateActiveFilters() {
        const container = document.getElementById('activeFilters');
        const filters = [];
        
        if (this.filters.search) {
            filters.push({
                type: 'search',
                label: `Поиск: "${this.filters.search}"`
            });
        }
        
        if (this.filters.category && this.filters.category !== 'all') {
            filters.push({
                type: 'category',
                label: this.getCategoryName(this.filters.category)
            });
        }
        
        if (this.filters.city) {
            filters.push({
                type: 'city',
                label: `Город: ${this.filters.city}`
            });
        }
        
        if (this.filters.price) {
            const [min, max] = this.filters.price.split('-');
            filters.push({
                type: 'price',
                label: `Цена: ${min === '0' ? 'до' : 'от'} ${min === '0' ? max : min} ${min === '0' ? '' : '-'} ${max === '9999999' ? '₽' : ''}`
            });
        }
        
        if (filters.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = filters.map(filter => `
            <span class="filter-tag">
                ${filter.label}
                <button onclick="preep.removeFilter('${filter.type}')">&times;</button>
            </span>
        `).join('');
    }
    
    removeFilter(filterType) {
        if (filterType === 'search') {
            this.filters.search = '';
            document.getElementById('searchInput').value = '';
        } else if (filterType === 'category') {
            this.filters.category = 'all';
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.category === 'all') {
                    btn.classList.add('active');
                }
            });
        } else {
            this.filters[filterType] = '';
            document.getElementById(filterType + 'Filter').value = '';
        }
        
        this.applyFilters();
    }
    
    openModal(modalId) {
        document.getElementById(modalId).classList.add('show');
    }
    
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    }
    
    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Добавляем стили для отсутствия результатов
const style = document.createElement('style');
style.textContent = `
    .no-ads {
        grid-column: 1 / -1;
        text-align: center;
        padding: 80px 20px;
        background: white;
        border-radius: var(--radius-lg);
        color: var(--gray-500);
    }
    
    .no-ads svg {
        margin-bottom: 20px;
    }
    
    .no-ads h3 {
        font-size: 1.5rem;
        margin-bottom: 10px;
        color: var(--gray-700);
    }
`;
document.head.appendChild(style);

// Инициализация приложения
const preep = new PreepBoard();
