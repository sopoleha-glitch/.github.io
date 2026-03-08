// Конфигурация API DeepSeek
const DEEPSEEK_API_KEY = 'sk-b0cd3404db484031bb40542ac5db480f';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Класс для управления сайтом
class DocumentMaster {
    constructor() {
        this.currentUser = null;
        this.generatedDoc = null;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateStats();
    }
    
    setupEventListeners() {
        // Генерация документа
        document.getElementById('generateBtn').addEventListener('click', () => this.generateDocument());
        
        // Проверка документа
        document.getElementById('checkBtn').addEventListener('click', () => this.checkDocument());
        
        // Копирование и скачивание
        document.getElementById('copyBtn').addEventListener('click', () => this.copyDocument());
        document.getElementById('downloadTxtBtn').addEventListener('click', () => this.downloadAsTxt());
        document.getElementById('downloadPdfBtn').addEventListener('click', () => this.downloadAsPdf());
        
        // Новый документ
        document.getElementById('newDocBtn').addEventListener('click', () => this.resetForm());
        
        // Табы
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e));
        });
        
        // Шаблоны
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', (e) => this.loadTemplate(e));
        });
        
        // Модальное окно тарифов
        document.getElementById('tariffBtn').addEventListener('click', () => this.openModal('tariffModal'));
        document.getElementById('closeTariffModal').addEventListener('click', () => this.closeModal('tariffModal'));
        
        // Закрытие по клику вне модалки
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });
        
        // О проекте
        document.getElementById('aboutBtn').addEventListener('click', () => {
            this.showToast('ДокументМастер PRO - сервис для создания документов с помощью нейросети DeepSeek');
        });
    }
    
    // Переключение табов
    switchTab(e) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        const tabId = e.target.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        if (tabId === 'ai') {
            document.getElementById('aiTab').classList.add('active');
        } else if (tabId === 'templates') {
            document.getElementById('templatesTab').classList.add('active');
        } else if (tabId === 'check') {
            document.getElementById('checkTab').classList.add('active');
        }
    }
    
    // Загрузка шаблона
    loadTemplate(e) {
        const template = e.currentTarget.dataset.template;
        let prompt = '';
        
        switch(template) {
            case 'rent':
                prompt = 'Составь договор аренды квартиры. Шаблон должен включать: предмет договора (квартира), стороны (арендодатель и арендатор), срок аренды, размер арендной платы, порядок расчетов, права и обязанности сторон, ответственность сторон, порядок расторжения, подписи.';
                break;
            case 'car':
                prompt = 'Составь договор купли-продажи автомобиля. Шаблон должен включать: предмет договора (автомобиль с характеристиками), стороны (продавец и покупатель), цена, порядок расчетов, передача автомобиля, ответственность сторон, подписи.';
                break;
            case 'loan':
                prompt = 'Составь расписку о получении денег в долг. Шаблон должен включать: ФИО займодавца и заемщика, сумма долга цифрами и прописью, срок возврата, процентная ставка (если есть), ответственность за просрочку, подписи, дата.';
                break;
            default:
                prompt = 'Составь юридически грамотный документ по шаблону';
        }
        
        document.getElementById('userRequest').value = prompt;
        this.switchToAITab();
    }
    
    // Переключение на вкладку AI
    switchToAITab() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === 'ai') {
                btn.classList.add('active');
            }
        });
        
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById('aiTab').classList.add('active');
    }
    
    // Генерация документа через DeepSeek
    async generateDocument() {
        const request = document.getElementById('userRequest').value.trim();
        
        if (!request) {
            this.showToast('Пожалуйста, опишите, какой документ вам нужен');
            return;
        }
        
        // Показываем загрузку
        document.getElementById('loadingIndicator').style.display = 'block';
        document.getElementById('resultSection').style.display = 'none';
        
        try {
            const docType = document.getElementById('docType').value;
            const docStyle = document.getElementById('docStyle').value;
            
            let systemPrompt = 'Ты - профессиональный юрист и помощник по созданию юридических документов. ';
            
            if (docType !== 'auto') {
                const typeNames = {
                    contract: 'договор',
                    application: 'заявление',
                    receipt: 'расписка',
                    claim: 'претензия',
                    complaint: 'жалоба',
                    agreement: 'соглашение'
                };
                systemPrompt += `Создай ${typeNames[docType]}. `;
            }
            
            if (docStyle === 'official') {
                systemPrompt += 'Используй официальный юридический стиль, со всеми необходимыми статьями и ссылками на законы. ';
            } else if (docStyle === 'simple') {
                systemPrompt += 'Напиши простым и понятным языком, но с сохранением юридической силы. ';
            } else if (docStyle === 'detailed') {
                systemPrompt += 'Сделай максимально подробный документ, включи все возможные нюансы. ';
            }
            
            systemPrompt += 'Оформи документ красиво, с заголовками, разделами и подписями.';
            
            const response = await fetch(DEEPSEEK_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: request
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 4000
                })
            });
            
            const data = await response.json();
            
            if (data.choices && data.choices[0]) {
                this.generatedDoc = data.choices[0].message.content;
                this.displayResult(this.generatedDoc);
            } else {
                throw new Error('Не удалось получить ответ от нейросети');
            }
            
        } catch (error) {
            console.error('Ошибка:', error);
            this.showToast('Произошла ошибка при генерации документа. Попробуйте еще раз.');
            
            // Для теста, если API не работает
            this.generatedDoc = this.getTestDocument(request);
            this.displayResult(this.generatedDoc);
            
        } finally {
            document.getElementById('loadingIndicator').style.display = 'none';
        }
    }
    
    // Проверка документа
    async checkDocument() {
        const docText = document.getElementById('docToCheck').value.trim();
        
        if (!docText) {
            this.showToast('Вставьте текст документа для проверки');
            return;
        }
        
        document.getElementById('loadingIndicator').style.display = 'block';
        
        try {
            const response = await fetch(DEEPSEEK_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: 'Ты - профессиональный юрист. Проверь документ на юридические ошибки, укажи на слабые места, предложи улучшения. Ответ напиши в формате: 1) Общая оценка 2) Найденные проблемы 3) Рекомендации по улучшению'
                        },
                        {
                            role: 'user',
                            content: docText
                        }
                    ],
                    temperature: 0.5,
                    max_tokens: 2000
                })
            });
            
            const data = await response.json();
            
            if (data.choices && data.choices[0]) {
                this.generatedDoc = data.choices[0].message.content;
                this.displayResult(this.generatedDoc);
            }
            
        } catch (error) {
            this.showToast('Ошибка при проверке документа');
        } finally {
            document.getElementById('loadingIndicator').style.display = 'none';
        }
    }
    
    // Отображение результата
    displayResult(content) {
        document.getElementById('resultContent').textContent = content;
        document.getElementById('resultSection').style.display = 'block';
        
        // Прокрутка к результату
        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Копирование в буфер обмена
    copyDocument() {
        if (!this.generatedDoc) return;
        
        navigator.clipboard.writeText(this.generatedDoc).then(() => {
            this.showToast('Документ скопирован в буфер обмена');
        });
    }
    
    // Скачать как TXT
    downloadAsTxt() {
        if (!this.generatedDoc) return;
        
        const blob = new Blob([this.generatedDoc], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('Файл скачан');
    }
    
    // Скачать как PDF (имитация)
    downloadAsPdf() {
        if (!this.generatedDoc) return;
        
        this.showToast('PDF версия будет доступна в PRO-тарифе');
        
        // В реальности здесь должна быть генерация PDF через библиотеку
        // Например, через jsPDF или отправка на сервер
    }
    
    // Сброс формы
    resetForm() {
        document.getElementById('userRequest').value = '';
        document.getElementById('resultSection').style.display = 'none';
        this.generatedDoc = null;
    }
    
    // Обновление статистики
    updateStats() {
        // Можно получать с сервера
        document.getElementById('totalDocs').textContent = '157';
    }
    
    // Открыть модальное окно
    openModal(modalId) {
        document.getElementById(modalId).classList.add('show');
    }
    
    // Закрыть модальное окно
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    }
    
    // Показать уведомление
    showToast(message) {
        // Создаем уведомление, если его нет
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: var(--gray-900);
                color: white;
                padding: 15px 25px;
                border-radius: var(--radius-md);
                font-size: 0.95rem;
                box-shadow: var(--shadow-lg);
                z-index: 1100;
                display: none;
            `;
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
    
    // Тестовый документ (если API не работает)
    getTestDocument(request) {
        return `ДОГОВОР АРЕНДЫ КВАРТИРЫ

г. Москва                                          «${new Date().getDate()}» ${new Date().toLocaleString('ru', { month: 'long' })} ${new Date().getFullYear()} г.

Гражданин РФ Иванов Иван Иванович, ${new Date().getFullYear() - 30} года рождения, паспорт серия 1234 № 567890, выдан ОУФМС России по г. Москве в районе Хамовники 15.05.2010, зарегистрированный по адресу: г. Москва, ул. Ленина, д. 1, кв. 1, именуемый в дальнейшем "Арендодатель", с одной стороны, и

Гражданин РФ Петров Петр Петрович, ${new Date().getFullYear() - 25} года рождения, паспорт серия 4321 № 098765, выдан ОУФМС России по г. Москве в районе Арбат 20.03.2015, зарегистрированный по адресу: г. Москва, ул. Тверская, д. 2, кв. 2, именуемый в дальнейшем "Арендатор", с другой стороны, совместно именуемые "Стороны", заключили настоящий Договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА

1.1. Арендодатель передает, а Арендатор принимает во временное владение и пользование (аренду) квартиру, расположенную по адресу: г. Москва, ул. Ленина, д. 1, кв. 5 (далее - "Квартира"), для проживания.

1.2. Квартира принадлежит Арендодателю на праве собственности, что подтверждается Свидетельством о государственной регистрации права серия 77-АБ № 123456, выданным Управлением Росреестра по г. Москве 10.01.2015.

1.3. Характеристики Квартиры:
- общая площадь: 45 кв. м;
- количество комнат: 2;
- этаж: 5;
- состояние: с отделкой, меблирована, оборудована необходимой техникой.

1.4. Квартира передается в аренду вместе с имуществом согласно Приложению № 1 к настоящему Договору (Опись имущества).

2. СРОК АРЕНДЫ

2.1. Срок аренды устанавливается с «01» апреля 2026 г. по «28» февраля 2027 г. (11 месяцев).

2.2. По истечении срока действия Договора Арендатор обязан освободить Квартиру и передать ее Арендодателю по Акту приема-передачи.

2.3. Если за 30 дней до окончания срока действия Договора ни одна из Сторон не заявит о своем намерении его расторгнуть, Договор считается продленным на тех же условиях на следующие 11 месяцев.

3. АРЕНДНАЯ ПЛАТА И ПОРЯДОК РАСЧЕТОВ

3.1. Арендная плата за пользование Квартирой устанавливается в размере 30 000 (Тридцать тысяч) рублей в месяц.

3.2. Оплата производится ежемесячно путем перечисления денежных средств на банковскую карту Арендодателя или наличными денежными средствами не позднее 5-го числа текущего месяца.

3.3. В обеспечение исполнения обязательств по настоящему Договору Арендатор уплачивает Арендодателю гарантийный депозит в размере 10 000 (Десять тысяч) рублей, который вносится до подписания Акта приема-передачи Квартиры.

3.4. Гарантийный депозит подлежит возврату Арендатору при освобождении Квартиры за вычетом:
- суммы ущерба, причиненного Квартире или имуществу (при наличии);
- суммы задолженности по арендной плате и коммунальным услугам.

3.5. Коммунальные услуги (электроэнергия, водоснабжение, отопление, вывоз мусора) оплачиваются Арендатором отдельно на основании показаний приборов учета и выставленных счетов.

4. ПРАВА И ОБЯЗАННОСТИ СТОРОН

4.1. Арендодатель обязуется:
4.1.1. Передать Квартиру Арендатору в состоянии, пригодном для проживания, по Акту приема-передачи в течение 3 дней с момента подписания настоящего Договора.
4.1.2. Обеспечить свободный доступ Арендатора в Квартиру и передать ключи.
4.1.3. Не чинить препятствий Арендатору в пользовании Квартирой.
4.1.4. Производить капитальный ремонт Квартиры за свой счет (при необходимости).

4.2. Арендатор обязуется:
4.2.1. Использовать Квартиру исключительно для проживания.
4.2.2. Своевременно вносить арендную плату и оплачивать коммунальные услуги.
4.2.3. Обеспечивать сохранность Квартиры и находящегося в ней имущества.
4.2.4. Поддерживать Квартиру в надлежащем состоянии, производить текущий ремонт за свой счет.
4.2.5. Не производить перепланировку и переоборудование Квартиры без письменного согласия Арендодателя.
4.2.6. Не сдавать Квартиру в поднаем без письменного согласия Арендодателя.
4.2.7. Обеспечивать доступ Арендодателя в Квартиру для осмотра ее состояния не чаще одного раза в месяц с предварительным уведомлением не менее чем за 24 часа.
4.2.8. При освобождении Квартиры передать ее Арендодателю по Акту приема-возврата в том же состоянии, с учетом нормального износа.

5. ОТВЕТСТВЕННОСТЬ СТОРОН

5.1. За просрочку внесения арендной платы Арендатор уплачивает пеню в размере 0,5% от суммы задолженности за каждый день просрочки.

5.2. В случае досрочного расторжения Договора по инициативе Арендатора без уважительных причин, гарантийный депозит не возвращается.

5.3. Арендатор несет полную материальную ответственность за ущерб, причиненный Квартире или имуществу, произошедший по его вине.

6. ФОРС-МАЖОР

6.1. Стороны освобождаются от ответственности за частичное или полное неисполнение обязательств по настоящему Договору, если это неисполнение явилось следствием обстоятельств непреодолимой силы (пожар, наводнение, землетрясение, военные действия, изменения законодательства и т.п.), возникших после заключения Договора и непосредственно повлиявших на возможность исполнения обязательств.

7. РАСТОРЖЕНИЕ ДОГОВОРА

7.1. Договор может быть расторгнут досрочно:
7.1.1. По соглашению Сторон.
7.1.2. В одностороннем порядке по инициативе Арендодателя в случаях:
- невнесения арендной платы более 2 месяцев подряд;
- использования Квартиры не по назначению;
- умышленного ухудшения состояния Квартиры;
- нарушения иных существенных условий Договора.
7.1.3. В одностороннем порядке по инициативе Арендатора с обязательным письменным уведомлением Арендодателя не менее чем за 30 дней.

8. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ

8.1. Все изменения и дополнения к настоящему Договору действительны только в том случае, если они совершены в письменной форме и подписаны обеими Сторонами.

8.2. Споры и разногласия, возникающие между Сторонами, разрешаются путем переговоров. При недостижении согласия споры передаются на рассмотрение в суд в соответствии с законодательством РФ.

8.3. Настоящий Договор составлен в двух экземплярах, имеющих одинаковую юридическую силу, по одному для каждой из Сторон.

9. АДРЕСА, РЕКВИЗИТЫ И ПОДПИСИ СТОРОН

АРЕНДОДАТЕЛЬ:
Иванов Иван Иванович
Паспорт: 1234 567890, выдан ОУФМС России по г. Москве в районе Хамовники 15.05.2010
Адрес: г. Москва, ул. Ленина, д. 1, кв. 1
Телефон: +7 (999) 123-45-67
Email: ivanov@mail.ru

_____________ /Иванов И.И./

АРЕНДАТОР:
Петров Петр Петрович
Паспорт: 4321 098765, выдан ОУФМС России по г. Москве в районе Арбат 20.03.2015
Адрес: г. Москва, ул. Тверская, д. 2, кв. 2
Телефон: +7 (999) 234-56-78
Email: petrov@mail.ru

_____________ /Петров П.П./

Приложение № 1
ОПИСЬ ИМУЩЕСТВА

1. Кухонный гарнитур - 1 шт.
2. Холодильник Samsung - 1 шт.
3. Газовая плита Gefest - 1 шт.
4. Стиральная машина LG - 1 шт.
5. Диван-кровать - 1 шт.
6. Кровать двуспальная - 1 шт.
7. Шкаф-купе - 2 шт.
8. Стол обеденный - 1 шт.
9. Стулья - 4 шт.
10. Телевизор LG - 1 шт.
11. Микроволновая печь - 1 шт.
12. Посуда (набор) - 1 компл.

Арендодатель: _____________ /Иванов И.И./
Арендатор: _____________ /Петров П.П./

Дата составления описи: «${new Date().getDate()}» ${new Date().toLocaleString('ru', { month: 'long' })} ${new Date().getFullYear()} г.`;
    }
}

// Инициализация приложения
const app = new DocumentMaster();

// Глобальные функции для тарифов
function startFree() {
    app.closeModal('tariffModal');
    app.showToast('Вы выбрали бесплатный тариф. Доступно 3 документа в день.');
}

function selectPro() {
    app.closeModal('tariffModal');
    app.showToast('Тариф PRO подключен! Теперь вам доступно 50 документов в день и PDF.');
}

function selectBusiness() {
    app.closeModal('tariffModal');
    app.showToast('Бизнес-тариф активирован. С вами свяжется менеджер.');
}
