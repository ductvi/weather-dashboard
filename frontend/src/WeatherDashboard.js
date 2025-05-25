import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGeolocated } from 'react-geolocated';

const WeatherDashboard = () => {
    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: false,
        },
        userDecisionTimeout: 5000,
    });

    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (coords) {
            const fetchWeather = async () => {
                try {
                    const { latitude: lat, longitude: lon } = coords;
                    const response = await axios.get(`http://localhost:5000/api/weather?lat=${lat}&lon=${lon}`);
                    setWeather(response.data);
                    setLoading(false);
                } catch (err) {
                    setError('Não foi possível carregar os dados do clima');
                    setLoading(false);
                    console.error('Erro ao buscar dados:', err);
                }
            };

            fetchWeather();

            // Atualiza a cada 5 minutos
            const interval = setInterval(fetchWeather, 300000);
            return () => clearInterval(interval);
        }
    }, [coords]);

    if (!isGeolocationAvailable) {
        return <div className="error-message">Seu navegador não suporta geolocalização.</div>;
    }

    if (!isGeolocationEnabled) {
        return <div className="error-message">Por favor, permita o acesso à sua localização para ver o clima.</div>;
    }

    if (loading && coords) {
        return <div className="loading-message">Carregando dados do clima...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!weather) {
        return <div className="loading-message">Obtendo localização...</div>;
    }

    return (
         <div className="weather-container">
    <div className="weather-header">
      <h2>Clima em {weather.city}, {weather.country}</h2>
    </div>

    <div className="weather-main">
      <div className="temperature-display">
        <span className="current-temp">{Math.round(weather.temperature)}°C</span>
        <span className="weather-desc">{weather.description}</span>
        <img 
          src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`} 
          alt={weather.description}
          className="weather-icon"
        />
      </div>

                <div className="weather-details">
                    <div className="detail-card">
                        <span className="detail-label">Sensação</span>
                        <span className="detail-value">{Math.round(weather.feels_like)}°C</span>
                    </div>
                    <div className="detail-card">
                        <span className="detail-label">Vento</span>
                        <div className="wind-info">
                            <span className="detail-value">{weather.wind_speed} km/h</span>
                            {weather.wind_deg && (
                                <div 
                                    className="wind-direction"
                                    style={{ transform: `rotate(${weather.wind_deg}deg)` }}
                                >
                                    ↑
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="detail-card">
                        <span className="detail-label">Umidade</span>
                        <span className="detail-value">{weather.humidity}%</span>
                    </div>
                    <div className="detail-card">
                        <span className="detail-label">Pressão</span>
                        <span className="detail-value">{weather.pressure} hPa</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherDashboard;