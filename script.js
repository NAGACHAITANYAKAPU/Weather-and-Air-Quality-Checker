document.getElementById('weatherForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const zipCode = document.getElementById('zipCode').value;
    const apiKey = '35f7174dd57b4407bbc125612242410';
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${zipCode}&aqi=yes`;

    fetch(url)
        .then(response => response.ok ? response.json() : response.json().then(err => Promise.reject(err.error.message)))
        .then(data => {
            renderWeatherData(data);
            clearError();
        })
        .catch(error => displayError(error || 'Network Error'));
});

function renderWeatherData(data) {
    const { name, region, country } = data.location;
    const { temp_c, temp_f, condition, air_quality } = data.current;
    const aqi = air_quality.pm2_5.toFixed(2);
    const aqiDescription = determineAQIDescription(aqi);

    const resultHTML = `
        <h2>Weather in ${name}, ${region}, ${country}</h2>
        <p>Temperature: ${temp_c}°C / ${temp_f}°F</p>
        <p>Condition: ${condition.text}</p>
        <p>Air Quality Index (AQI): ${aqi} (${aqiDescription})</p>
    `;

    document.getElementById('weatherResult').innerHTML = resultHTML;
}

function determineAQIDescription(aqi) {
    return aqi <= 50 ? 'Good' :
           aqi <= 100 ? 'Moderate' :
           aqi <= 150 ? 'Unhealthy for Sensitive Groups' :
           aqi <= 200 ? 'Unhealthy' :
           aqi <= 300 ? 'Very Unhealthy' : 'Hazardous';
}

function displayError(errorMessage) {
    document.getElementById('error').textContent = `Error: ${errorMessage}`;
    document.getElementById('weatherResult').innerHTML = '';
}

function clearError() {
    document.getElementById('error').textContent = '';
}
