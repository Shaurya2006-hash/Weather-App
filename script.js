document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "926280284da9ae9e296072849438b80c"; 
  const cityInput = document.getElementById("city-input");
  const addCityBtn = document.getElementById("add-city-btn");
  const cityList = document.getElementById("city-list");
  const weatherContainer = document.getElementById("weather-container");

  let cities = JSON.parse(localStorage.getItem("cities")) || [];

  renderCities();
  addCityBtn.addEventListener("click", addCity);
  cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addCity();
    }
  });

  function addCity() {
    const city = cityInput.value.trim();

    if (city && !cities.includes(city)) {
      cities.push(city);
      saveCities();
      renderCities();
    }

    cityInput.value = "";
  }
 cityList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const li = e.target.closest("li");
    const cityName = li.getAttribute("data-city");

    cities = cities.filter((c) => c !== cityName);
    saveCities();
    renderCities();

    weatherContainer.innerHTML =
      "<p>Select a city to view its weather information.</p>";

    return;
  }

  if (e.target.tagName === "LI") {
    const city = e.target.getAttribute("data-city");
    showLoading();
    const data = await fetchWeatherData(city);
    if (data) displayWeather(data);
  }

});

function renderCities() {
  cityList.innerHTML = "";

  if (cities.length === 0) {
    cityList.innerHTML = "<p>No cities saved</p>";
    return;
  }

  cities.forEach((city) => {
    const li = document.createElement("li");

    li.setAttribute("data-city", city);

    li.innerHTML = `
      <span>${city}</span>
      <button class="delete-btn">X</button>
    `;

    cityList.appendChild(li);
  });
}

  async function fetchWeatherData(city) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        weatherContainer.innerHTML =
          "<p>City not found. Please try again.</p>";
        return null;
      }

      return await response.json();
    } catch (error) {
      weatherContainer.innerHTML =
        "<p>Error fetching weather data. Try again later.</p>";
      return null;
    }
  }

  function showLoading() {
    weatherContainer.innerHTML = "<p>Loading weather data...</p>";
  }

  function displayWeather(data) {
    const icon = data.weather[0].icon;

    weatherContainer.innerHTML = `
      <h3>${data.name}</h3>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon">
      <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
      <p><strong>Weather:</strong> ${data.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;
  }

  function saveCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
  }
});