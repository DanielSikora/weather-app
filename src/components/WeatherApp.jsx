import React, { useState, useEffect } from 'react';

const WeatherApp = () => {
  // Stan przechowujący listę stacji meteorologicznych
  const [stations, setStations] = useState([]);

  // Stan przechowujący nazwę wybranej stacji
  const [selectedStation, setSelectedStation] = useState('');

  // Stan przechowujący szczegółowe dane pogodowe dla wybranej stacji
  const [weatherData, setWeatherData] = useState(null);

  // Stan przechowujący informację o ładowaniu danych
  const [loading, setLoading] = useState(false);

  // Stan przechowujący ewentualny błąd podczas pobierania danych
  const [error, setError] = useState(null);

  // Hook `useEffect` - wykonuje się po pierwszym renderowaniu komponentu
  // Pobieramy listę stacji meteorologicznych z API
  useEffect(() => {
    fetch('https://danepubliczne.imgw.pl/api/data/synop')
      .then((response) => response.json()) // Parsowanie odpowiedzi jako JSON
      .then((data) => {
        setStations(data); // Ustawiamy listę stacji w stanie
      })
      .catch((err) => {
        console.error('Error fetching stations:', err);
        setError('Błąd pobierania danych o stacjach'); // Obsługa błędu
      });
  }, []); // Pusta tablica zależności oznacza, że efekt wykona się tylko raz, przy pierwszym renderze

  // Funkcja do pobierania danych pogodowych dla wybranej stacji
  const fetchWeatherData = () => {
    setLoading(true); // Ustawiamy stan ładowania na true
    const stationData = stations.find((station) => station.stacja === selectedStation); // Szukamy wybranej stacji w liście

    if (stationData) {
      setWeatherData(stationData); // Ustawiamy dane pogodowe w stanie
      setLoading(false); // Wyłączamy stan ładowania
    } else {
      setError('Nie znaleziono danych dla wybranej stacji'); // Obsługa sytuacji, gdy stacja nie została znaleziona
      setLoading(false); // Wyłączamy stan ładowania
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>Weather App</h1>
      <p>Wybierz stację, aby zobaczyć aktualne dane pogodowe:</p>

      {/* Dropdown do wyboru stacji */}
      <select
        value={selectedStation}
        onChange={(e) => setSelectedStation(e.target.value)} // Aktualizujemy wybraną stację w stanie
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      >
        <option value="">-- Wybierz stację --</option>
        {stations.map((station) => (
          <option key={station.id_stacji} value={station.stacja}>
            {station.stacja} {/* Wyświetlamy nazwę każdej stacji */}
          </option>
        ))}
      </select>

      {/* Przycisk pobierający dane pogodowe */}
      <button
        onClick={fetchWeatherData}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Pokaż dane
      </button>

      {/* Wyświetlanie komunikatu ładowania */}
      {loading && <p>Ładowanie...</p>}

      {/* Wyświetlanie błędów */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Wyświetlanie danych pogodowych, jeśli są dostępne */}
      {weatherData && (
        <div style={{ marginTop: '20px' }}>
          <h2>Dane dla stacji: {weatherData.stacja}</h2>
          <p>Data pomiaru: {weatherData.data_pomiaru}</p>
          <p>Godzina pomiaru: {weatherData.godzina_pomiaru}:00</p>
          <p>Temperatura: {weatherData.temperatura}°C</p>
          <p>Prędkość wiatru: {weatherData.predkosc_wiatru} m/s</p>
          <p>Kierunek wiatru: {weatherData.kierunek_wiatru}°</p>
          <p>Wilgotność: {weatherData.wilgotnosc_wzgledna}%</p>
          <p>Suma opadów: {weatherData.suma_opadu} mm</p>
          <p>Ciśnienie: {weatherData.cisnienie} hPa</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
