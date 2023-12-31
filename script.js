// fetching required elements
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfocontainer = document.querySelector(".user-info-container");
const errorScreen = document.querySelector(".error");

// any varibales needed initially
let currentTab = userTab;
currentTab.classList.add("current-tab");
// ek kaam aur pending hai?
// check initially if location present already and render weatherInfo
getFromSessionStorage();

// switching tabs
userTab.addEventListener("click", () => {
    // passing clicked tab as input
    errorScreen.classList.remove("active");
    switchTab(userTab);
});
searchTab.addEventListener("click", () => {
    // passing clicked tab
    errorScreen.classList.remove("active");
    switchTab(searchTab);
});
function switchTab(clickedTab) {
    // if diffrent -> need to switch tab
    if (clickedTab != currentTab) {
        // step 1 remove color from switch tab btn
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        
        // step 2 getting which is the current tab
        if (!searchForm.classList.contains("active")) {
            // if search tab is not visible that means user wants to see it thats why clickded to switch tab
            userInfocontainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            // search vala visible hai already dusre pe jao
            searchForm.classList.remove("active");
            userInfocontainer.classList.remove("active");
            // now we are going to main tab so check if location already in storage and display their current location weather data
            getFromSessionStorage();
            // grantAccessContainer.classList.remove('active');
        }
    }
}

// check if location avialable
function getFromSessionStorage() {
    errorScreen.classList.remove("active");
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
const API_KEY = "81dab2665e684f328e2124557232912";
// fetch data according to available info coordinates
async function fetchUserWeatherInfo(coordinates) {
  errorScreen.classList.remove("active");
  const { lat, lon } = coordinates;
  // make grant container invisible
  grantAccessContainer.classList.remove("active");
  // make loader visible
  loadingScreen.classList.add("active");

  // API CAll
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    // console.log('before cll');
    // console.log(data?.location?.country);
    // console.log('before if');
    if (data?.location?.country == undefined) {
      errorScreen.classList.add("active");
    } else {
      userInfocontainer.classList.add("active");
      renderWeatherInfo(data);
    }
  } catch (error) {
    loadingScreen.classList.remove("active");
    errorScreen.classList.add("active");
    // alert('error fetching user weather info')
    // HW
  }
}

// input values form api to ui
function renderWeatherInfo(weatherInfo) {
  //  firstly fetch the elements
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector(" [data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  // fetch values form weather info object
  cityName.innerText = weatherInfo?.location?.name;
  let code = getCountryCode(`${weatherInfo?.location?.country}`);
  countryIcon.src = `https://flagsapi.com/${code}/shiny/64.png`;
  countryIcon.alt = `${weatherInfo?.location?.country}`;
  desc.innerText = weatherInfo?.current?.condition?.text;
  weatherIcon.src = `http:${weatherInfo?.current?.condition?.icon}`;
  temp.innerText = weatherInfo?.current?.feelslike_c.toFixed(2) + " °C";
  windSpeed.innerText = weatherInfo?.current?.wind_kph + "m/s";
  humidity.innerText = weatherInfo?.current?.humidity + "%";
  cloudiness.innerText = weatherInfo?.current?.cloud + "%";
}

// function to get country code from country name
let countryCodesJson = undefined;
async function getCountryCodejson(countryName) {
  const response = await fetch(`https://flagcdn.com/en/codes.json`);
  const data = await response.json();
  countryCodesJson = data;
  // console.log(data);
}
getCountryCodejson();
function getCountryCode(countryName) {
  for (let key in countryCodesJson) {
    if (countryCodesJson[key] == countryName) {
      key = key.toUpperCase();
      // console.log(key);
      return key;
    }
  }
}

// grant access function
const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click", getLocation());
function getLocation() {
  if (navigator.geolocation) {
    // using callback
    // navigator.geolocation.getCurrentPosition(position());
    // using arrow
    navigator.geolocation.getCurrentPosition((pos) => {
      const userCoordinates = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      };
      sessionStorage.setItem(
        "user-coordinates",
        JSON.stringify(userCoordinates)
      );
      fetchUserWeatherInfo(userCoordinates);
    });
  } else {
    // make this a alert
    grantAccessContainer.classList.remove('active');
    errorScreen.classList.add("active");
    alert("No Location data Support");
    console.log("No Location data Support");
  }
}
// function position(pos) {
//   const userCoordinates = {
//     lat: pos.coords.latitude,
//     lon: pos.coords.longitude,
//   };
//   sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
//   fetchUserWeatherInfo(userCoordinates);
// }

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchInput.value === "") return;
  else{
    fetchSearchWeatherInfo(searchInput.value);
  }
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfocontainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    let response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    console.log(data?.location?.country);
    if (data?.location?.country == undefined) {
        errorScreen.classList.add("active");
    } else {
        errorScreen.classList.remove("active");
        userInfocontainer.classList.add("active");
        renderWeatherInfo(data);
    }
} catch {
    loadingScreen.classList.remove("active");
    errorScreen.classList.add("active");
    console.log("errr hagya hue hue");
  }
}