const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/"
};


const videoContainer = document.querySelector(".video-container");
const hoverVideo = document.getElementById("hover-video");



const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', (evt) => {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
});

const getLocationButton = document.querySelector('.get-location-button');
getLocationButton.addEventListener('click', getLocation);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      getWeatherByCoordinates(latitude, longitude);
    });
  } else {
    alert('Geolocation is not supported by your browser.');
  }
}

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then((weather) => {
      return weather.json();
    })
    .then(displayResults);
}

function getWeatherByCoordinates(latitude, longitude) {
  fetch(`${api.base}weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`)
    .then((weather) => {
      return weather.json();
    })
    .then(displayResults);
}

function displayResults(weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;


  let hilow = document.querySelector('.hi-low');
  hilow.innerText = ` ${Math.round(weather.main.temp_min)}°c / Max: ${Math.round(weather.main.temp_max)}°c`;

  let humid = document.querySelector('.humidity');
  humid.innerText = `Humidity: ${weather.main.humidity}%`;

  let wind = document.querySelector('.wind');
  wind.innerText = `Wind: ${weather.wind.speed} km/h`;

  if (weather.wind.speed > 32) {
    alert('Warning! Wind speed is high!');
  }

  if (weather.main.humidity >= 70) {
    alert('Warning! Humidity is high!');
  }

  if (weather.main.temp > 32) {
    alert('Warning! Temperature is high!');
  }

  if (weather.main.temp < 0) {
    alert('Warning! Temperature is low!');
  }
}


function dateBuilder(d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}
