const api = {
    key: "fcc8de7015bbb202209bbf0261babf4c",
    base: "https://api.openweathermap.org/data/2.5/"
  };
  
  
  const getDataFor7Days = async (lat, lon) => {
    const api = 'fcc8de7015bbb202209bbf0261babf4c'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api}`;
  
    try {
      const res = await fetch(url);
  
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
  
      const data = await res.json();
      console.log("Data received:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  // Call the function with valid lat and lon values
  
  
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
        getForecastByCoordinates(latitude, longitude);
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
  
  // function getResults(query) {
  //   fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
  //     .then((weather) => {
  //       return weather.json();
  //     })
  //     .then(displayResults);
  // }
  
  
  function getResults(query) {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
      .then((weather) => {
        return weather.json();
      })
      .then((weatherData) => {
        displayResults(weatherData);
        // Call getForecastByCoordinates with the new coordinates
        const latitude = weatherData.coord.lat;
        const longitude = weatherData.coord.lon;
        getForecastByCoordinates(latitude, longitude);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  
  
  function getWeatherByCoordinates(latitude, longitude) {
    fetch(`${api.base}weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`)
      .then((weather) => {
        return weather.json();
      })
      .then(displayResults);
  }
  
  // function getForecastByCoordinates(latitude, longitude) {
  //   fetch(`${api.base}onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&units=metric&APPID=${api.key}`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`Request failed with status ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       displayForecast(data);
  //       console.log("data") // Pass the data to the displayForecast function
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // }
  
  function getForecastByCoordinates(latitude, longitude) {
    fetch(`${api.base}onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&units=metric&APPID=${api.key}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        displayForecast(data); // Call displayForecast with the new data
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
  
  function displayForecast(data) {
    const forecastData = data.daily.slice(1, 8); // Extract data for the next 7 days (excluding the current day)
  
    forecastData.forEach((dayData, index) => {
      const date = new Date(dayData.dt * 1000); // Update date calculation
      const temperature = dayData.temp.day;
      const minTemperature = dayData.temp.min;
      const maxTemperature = dayData.temp.max;
      const humidity = dayData.humidity;
      const windSpeed = dayData.wind_speed;
      const weatherType = dayData.weather[0].main;
  
      // Update the HTML elements for each day's forecast
      const dateElement = document.querySelector(`.date${index + 1}`);
      const tempElement = document.querySelector(`.temp${index + 1}`);
      const weatherElement = document.querySelector(`.weather${index + 1}`);
      const hiLowElement = document.querySelector(`.hi-low${index + 1}`);
      const humidityElement = document.querySelector(`.humidity${index + 1}`);
      const windElement = document.querySelector(`.wind${index + 1}`);
  
      dateElement.innerText = getDayOfWeek(date); // Update day of the week
      tempElement.innerHTML = `${Math.round(temperature)}<span>°C</span>`;
      weatherElement.innerText = weatherType;
      hiLowElement.innerText = `${Math.round(minTemperature)}°C / Max: ${Math.round(maxTemperature)}°C`;
      humidityElement.innerText = `Humidity: ${humidity}%`;
      windElement.innerText = `Wind: ${windSpeed} m/s`;
    });
  }
  
  
  function getDayOfWeek(date) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[date.getDay()];
  }
  
  // Usage: Replace the coordinates with the desired location
  
  
  
  // Usage: Replace the coordinates with the desired location278); // Example coordinates (London)
  
  
   // Example coordinates (London)
  
  // Assuming 'data' contains your API response data
  
  
  
  function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day} ${date} ${month} ${year}`;
  }   