const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");
const notFoundSection = document.querySelector(".not-found");
const countryText = document.querySelector(".country-txt");
const tempText = document.querySelector(".temp-txt");
const conditionText = document.querySelector(".condition-txt");
const humidityText = document.querySelector(".humidity-value-txt");
const windText = document.querySelector(".wind-value-txt");
const weatherImage = document.querySelector(".weather-summary-image");
const currentDate = document.querySelector(".current-data-txt");
const forecastItemContainer = document.querySelector(
  ".forecast-item-container"
);

const apiKey = "d9844ee57a11011b9556330d795f5dd7";

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() !== "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && cityInput.value.trim() !== "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);
  if (weatherData.cod != 200) {
    showDisplaySection(notFoundSection);
    return;
  }
  console.log(weatherData);
  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryText.textContent = country;
  tempText.textContent = Math.round(temp) + "°C";
  conditionText.textContent = main;
  humidityText.textContent = humidity + "%";
  windText.textContent = speed + "M/s";
  weatherImage.src = `/weather/${getWeatherIcon(id)}.svg`;
  currentDate.textContent = getCurrentDate();
  await updateForecastData(city);
  showDisplaySection(weatherInfoSection);
}

async function getFetchData(endpoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}

function showDisplaySection(section) {
  [searchCitySection, weatherInfoSection, notFoundSection].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "flex";
}
function getWeatherIcon(id) {
  if (id >= 200 && id <= 232) return "thunderstorm";
  if (id >= 300 && id <= 321) return "drizzle";
  if (id >= 500 && id <= 531) return "rain";
  if (id >= 600 && id <= 622) return "snow";
  if (id >= 701 && id <= 781) return "atmosphere";
  if (id <= 800) return "clear";
  else return "clouds";
}
function getCurrentDate() {
  const date = new Date();
  const options = { weekday: "short", month: "short", day: "2-digit" };
  return date.toLocaleDateString("en-US", options);
}
async function updateForecastData(city) {
  const forecastData = await getFetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];
  forecastItemContainer.innerHTML = "";
  
  forecastData.list.forEach((forecastWeather) => {
    if (
      !forecastWeather.dt_txt.includes(todayDate) && 
      forecastWeather.dt_txt.includes(timeTaken)
    ) {
      updateForecastInfo(forecastWeather);
    }
  });
}
function updateForecastInfo(weatherData) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;
  const dateTaken = new Date(date);
  const dateFormate = { weekday: 'short', month: "short", day: "2-digit" };
  const formattedDate = dateTaken.toLocaleDateString("en-US", dateFormate);

  const forecastItem = `<div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${formattedDate}</h5>
            <img src="/weather/${getWeatherIcon(id)}.svg" alt="" class="forecast-item-img" />
            <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
          </div>`;
  forecastItemContainer.insertAdjacentHTML("beforeend", forecastItem);
}
