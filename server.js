const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// API endpoint для генерации документов
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, type, style } = req.body;
        
        // Здесь будет вызов DeepSeek API
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY || req.body.apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: 'Ты - профессиональный юрист. Составляй юридически грамотные документы.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 4000
            })
        });
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ error: 'Ошибка генерации документа' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
