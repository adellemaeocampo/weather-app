
const searchForm = document.getElementById("searchForm");
const searchBtn = document.getElementById("searchBtn");
const inputForm = document.getElementById("formInput");
const searchedCity = document.getElementById("curcity");
const searchSection = document.getElementById("searchSec");
const date = dayjs().format("DD/MM/YYYY");

//add weather of a city to page when page intially loads
const fillPage = () => {
  searchedCity.textContent = "London The " + date;
  fetchCurWeather("London");
  fetchForecast("London");
};

//event listeners that listen for search botton clicked of eneter button
searchBtn.addEventListener('click', searchBtnClicked);
inputForm.addEventListener('keydown', function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        searchBtnClicked();
    }
});

//when the event is triggered this funtion runs
function searchBtnClicked(){
  const city = inputForm.value.trim();
  fetchCurWeather(city);
  fetchForecast(city);

  localStorage.clear();
  localStorage.setItem("SearchedCities", city);
  renderSearchHis();


};

//renders searched countries into a button
const renderSearchHis = () => {
  for (i = 0; i < localStorage.length; i++) {
    const city = localStorage.getItem(localStorage.key(i));

    const button = document.createElement("button");
    button.classList.add("recentSearch");
    button.textContent = city;
    searchSection.appendChild(button);

    button.addEventListener("click", (e) => {
      e.preventDefault();

      fetchCurWeather(city);
      fetchForecast(city);
    });
  }
};


//fetches current data for area
const fetchCurWeather = async (city) => {
  const apiKey = "d2707a03673958582864157c9c6a4b80";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);

    if (response.status === 200) {
      const data = await response.json();
      console.log("Successfully featched data for current weather");
      CurrentWeatherLoad(data);
    } else {
      throw new Error("Failed to fetch data for current weather");
    }
  } catch (error) {
    console.error("Fetch Failed", error);
    throw error;
  }
};

//fetches five dat forecast data for area
const fetchForecast = async (city) => {
  const apiKey = "d2707a03673958582864157c9c6a4b80";
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);

    if (response.status === 200) {
      const data = await response.json();
      fiveDayWeather(data);
      console.log("Successfully featched data for forecast");
    } else {
      throw new Error("Failed to fetch data for forecast");
    }
  } catch (error) {
    console.error("Fetch Failed", error);
    throw error;
  }
};


//loads the data into current weather card
const CurrentWeatherLoad = (city) => {
  searchedCity.textContent = `${city.name} ${date}`;

  const iconCode = city.weather[0].icon;
  const curWeathIcon = document.getElementById('curWeatherIcon');
  curWeathIcon.src = `http://openweathermap.org/img/wn/${iconCode}.png`;
  searchedCity.append(curWeathIcon);

  const tempData = city.main.temp;
  curTemp.textContent = `Temperature: ${tempData} C`;

  const windData = city.wind.speed;
  curWind.textContent = `Wind Speed: ${windData} km/h`;

  const humidityData = city.main.humidity;
  curHumidity.textContent = `Humidity: ${humidityData}%`;
};


//loads data into forecast card
const fiveDayWeather = (cityData) => {
  const forecastList = cityData.list;
  const dailyForecasts = [];

  for (let i = 0; i < forecastList.length; i += 8) {
    const forecast = forecastList[i];
    const date = forecast.dt_txt.split(" ")[0];
    const weather = {
      date: dayjs(date).format("DD/MM/YYYY"),
      temp: forecast.main.temp,
      wind: forecast.wind.speed,
      humidity: forecast.main.humidity,
      icon: forecast.weather[0].icon,
    };
    dailyForecasts.push(weather);
  }
  dailyForecasts.forEach((forecast, index) => {
    const fiveDayFore = document.querySelector(`.forecast${index + 1}`);

    const forecastDate = fiveDayFore.querySelector(".foreDate");
    forecastDate.textContent = forecast.date;

    const weatherIcon = document.querySelector(".forecastIcon");
    weatherIcon.src = `http://openweathermap.org/img/wn/${forecast.icon}.png`;
    forecastDate.appendChild(weatherIcon);

    const foreTemp = fiveDayFore.querySelector('.forecastTemp');
    foreTemp.textContent = `Temperature: ${forecast.temp} C`;

    const foreWind = fiveDayFore.querySelector('.forecastWind');
    foreWind.textContent = `Wind Speed: ${forecast.wind}km/h`;

    const foreHumidity = fiveDayFore.querySelector('.forecastHumidity');
    foreHumidity.textContent = `Humidity: ${forecast.humidity}%`;
  });
};

//calls function
fillPage();
