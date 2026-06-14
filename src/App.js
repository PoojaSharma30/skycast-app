import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const API_KEY = "fe2ee36e4acc8250b04fb8cbb056df40";

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError('');
    setWeather(null);
    setForecast(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod !== 200) {
        setError('City not found! Please try again.');
      } else {
        setWeather(data);
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastRes.json();
        const daily = forecastData.list.filter(item =>
          item.dt_txt.includes("12:00:00")
        );
        setForecast(daily);
      }
    } catch (err) {
      setError('Something went wrong!');
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchWeather();
  };

  return (
    <div className={`App ${darkMode ? 'dark' : 'light'}`}>

      <div className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </div>

      <h1>🌤️ Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weather && weather.weather && (
        <div className="weather-card">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <h3>{Math.round(weather.main.temp)}°C</h3>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>{weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}

      {forecast && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-grid">
            {forecast.map((item, index) => (
              <div className="forecast-card" key={index}>
                <p className="day">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(item.dt_txt).getDay()]}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                  alt=""
                />
                <p className="temp">{Math.round(item.main.temp)}°C</p>
                <p className="desc">{item.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;