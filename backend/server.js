require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração básica
app.use(cors());
app.use(express.json());

// Chave da API - crie uma conta gratuita em https://openweathermap.org/
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'sua_chave_aqui';

// Rota para obter dados do clima por coordenadas
app.get('/api/weather', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude e longitude são necessárias' });
        }

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`
        );

        // Formatar os dados para o frontend
        const weatherData = {
            temperature: response.data.main.temp,
            feels_like: response.data.main.feels_like,
            humidity: response.data.main.humidity,
            pressure: response.data.main.pressure,
            wind_speed: response.data.wind.speed,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
            city: response.data.name,
            country: response.data.sys.country,
            sunrise: response.data.sys.sunrise,
            sunset: response.data.sys.sunset
        };

        res.json(weatherData);
    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do clima' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});