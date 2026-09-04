import { moonSk, moonEn, moonSr } from "./moonphases.js";
import { switchUvIndex } from "./uvIndex.js";
import { weatherIconSwitcher } from "./weatherIcons.js";
import { moonphaseSwitcher } from "./moonphaseSwicher.js";
import { windSwitcher } from "./windSwitcher.js";
import { lang } from "./lang.js";
import baufortScale from "./baufortScale.js";

// language switcher----------------------------------------------------
let leng;
function changeLanguage(leng) {
  document.querySelectorAll("[data-translate-key]").forEach((elem) => {
    const key = elem.getAttribute("data-translate-key");
    elem.textContent = lang[leng][key];
  });
  // Adding prefered language to the local storage
  localStorage.setItem("language", leng);
}
// if theres language set in localStorage then use it
document.addEventListener("DOMContentLoaded", (event) => {
  showLoader();
  // Simulate data fetching for 1 second
  setTimeout(hideLoader, 700);
  // Check for a saved theme in localStorage and apply it
  if (localStorage.getItem("language")) {
    leng = localStorage.getItem("language");
    changeLanguage(leng);
  } else {
    leng = "sk";
    changeLanguage(leng);
  }
});

function showLoader() {
  document.getElementById("loader").style.display = "flex";
}
function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

// Choose langugae buttons
$("#enBtn").on("click", () => {
  leng = "en";
  changeLanguage(leng);
  location.reload(true);
});
$("#skBtn").on("click", () => {
  leng = "sk";
  changeLanguage(leng);
  location.reload(true);
});
$("#srBtn").on("click", () => {
  leng = "sr";
  changeLanguage(leng);
  location.reload(true);
});
// -----------------------------------------------------------------------
// Option button for horly forecast
let btnOptions = document.querySelectorAll(".hourly-options .btn");

btnOptions.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelector(".btn.active").classList.remove("active");
    e.currentTarget.classList.add("active");
    document.querySelector(".hourly.show").classList.remove("show");
    if (e.currentTarget.dataset.action === "temp") {
      document.querySelector("#temp").classList.add("show");
    }
    if (e.currentTarget.dataset.action === "rain") {
      document.querySelector("#zrazky").classList.add("show");
    }
    if (e.currentTarget.dataset.action === "wind") {
      document.querySelector("#vietor").classList.add("show");
    }
    if (e.currentTarget.dataset.action === "preassure") {
      document.querySelector("#tlak").classList.add("show");
    }
  });
});
// --------------------------------------------------------------------
// Menu button for mobile and slide panel------------------------------
let menuBtn = document.querySelector("#menu");

menuBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  document.querySelector(".side-panel").classList.toggle("menu-active");
});
let closeMenu = document.querySelector(".x");
closeMenu.addEventListener("click", (event) => {
  event.stopPropagation();
  document.querySelector(".side-panel").classList.remove("menu-active");
});

// Menu options ------------------------------------------------------------
let menuOptions = document.querySelectorAll(".side-panel-menu #menuBtn");
console.log(menuOptions);
menuOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    // console.log(e.currentTarget);
    // console.log(e.currentTarget.dataset.action);
    // document.querySelectorAll("#menuBtn").classList.remove("active")

    if (e.currentTarget.dataset.action === "home") {
      // e.currentTarget.classList.add("active")
      document.querySelector(".astro-container").classList.remove("show");
      document.querySelector(".astro-moonphases-desc").classList.remove("show");
      document.querySelector(".baufort-container").classList.remove("show");
      document.querySelector(".settings-container").classList.remove("show");
      document.querySelector(".help-container").classList.remove("show");
      document.querySelector(".credits-container").classList.remove("show");
      document.querySelector(".container").classList.add("show");
      document.querySelector(".side-panel").classList.remove("menu-active");
    }
    if (e.currentTarget.dataset.action === "astro") {
      // e.currentTarget.classList.add("active")
      document.querySelector(".container").classList.remove("show");
      document.querySelector(".astro-moonphases-desc").classList.remove("show");
      document.querySelector(".baufort-container").classList.remove("show");
      document.querySelector(".settings-container").classList.remove("show");
      document.querySelector(".help-container").classList.remove("show");
      document.querySelector(".credits-container").classList.remove("show");
      document.querySelector(".astro-container").classList.add("show");
      document.querySelector(".side-panel").classList.remove("menu-active");
    }
    if (e.currentTarget.dataset.action === "baufort") {
      // e.currentTarget.classList.add("active")
      document.querySelector(".container").classList.remove("show");
      document.querySelector(".astro-moonphases-desc").classList.remove("show");
      document.querySelector(".settings-container").classList.remove("show");
      document.querySelector(".help-container").classList.remove("show");
      document.querySelector(".credits-container").classList.remove("show");
      document.querySelector(".astro-container").classList.remove("show");
      document.querySelector(".baufort-container").classList.add("show");
      document.querySelector(".side-panel").classList.remove("menu-active");
    }
    if (e.currentTarget.dataset.action === "settings") {
      // e.currentTarget.classList.add("active")
      document.querySelector(".container").classList.remove("show");
      document.querySelector(".astro-container").classList.remove("show");
      document.querySelector(".astro-moonphases-desc").classList.remove("show");
      document.querySelector(".baufort-container").classList.remove("show");
      document.querySelector(".help-container").classList.remove("show");
      document.querySelector(".credits-container").classList.remove("show");
      document.querySelector(".settings-container").classList.add("show");
      document.querySelector(".side-panel").classList.remove("menu-active");
    }
    if (e.currentTarget.dataset.action === "help") {
      // e.currentTarget.classList.add("active")
      document.querySelector(".container").classList.remove("show");
      document.querySelector(".astro-container").classList.remove("show");
      document.querySelector(".astro-moonphases-desc").classList.remove("show");
      document.querySelector(".baufort-container").classList.remove("show");
      document.querySelector(".settings-container").classList.remove("show");
      document.querySelector(".credits-container").classList.remove("show");
      document.querySelector(".help-container").classList.add("show");
      document.querySelector(".side-panel").classList.remove("menu-active");
    }
    if (e.currentTarget.dataset.action === "credits") {
      // e.currentTarget.classList.add("active")
      document.querySelector(".container").classList.remove("show");
      document.querySelector(".astro-container").classList.remove("show");
      document.querySelector(".astro-moonphases-desc").classList.remove("show");
      document.querySelector(".baufort-container").classList.remove("show");
      document.querySelector(".settings-container").classList.remove("show");
      document.querySelector(".help-container").classList.remove("show");
      document.querySelector(".credits-container").classList.add("show");
      document.querySelector(".side-panel").classList.remove("menu-active");
    }
  });
});
// Settings page -----------------------------------------------------------
// ----------------Theme Swithcer -----------------------------------------
let blueMarlin = document.querySelector("#blue-marlin");
let MoonlitAsteroid = document.querySelector("#moonlit-asteroid");
let deepSpace = document.querySelector("#deep-space");
let sandBlue = document.querySelector("#sand-blue");
let visionsGrandeur = document.querySelector("#visions-grandeur");
// On document load ..
document.addEventListener("DOMContentLoaded", (event) => {
  // Check for a saved theme in localStorage and apply it
  if (localStorage.getItem("theme")) {
    document.body.className = localStorage.getItem("theme");
  }
});

$(blueMarlin).on("click", () => {
  document.querySelector("body").classList.remove("visions-of-grandeur");
  document.querySelector("body").classList.remove("sand-blue");
  document.querySelector("body").classList.remove("moonlit-asteroid");
  document.querySelector("body").classList.remove("deep-space");
  document.querySelector("body").classList.add("blue-marlin");
  // Save the current theme to localStorage
  localStorage.setItem("theme", document.body.className);
});
$(MoonlitAsteroid).on("click", () => {
  document.querySelector("body").classList.remove("visions-of-grandeur");
  document.querySelector("body").classList.remove("sand-blue");
  document.querySelector("body").classList.remove("deep-space");
  document.querySelector("body").classList.remove("blue-marlin");
  document.querySelector("body").classList.add("moonlit-asteroid");
  // Save the current theme to localStorage
  localStorage.setItem("theme", document.body.className);
});
$(deepSpace).on("click", () => {
  document.querySelector("body").classList.remove("visions-of-grandeur");
  document.querySelector("body").classList.remove("sand-blue");
  document.querySelector("body").classList.remove("blue-marlin");
  document.querySelector("body").classList.remove("moonlit-asteroid");
  document.querySelector("body").classList.add("deep-space");
  // Save the current theme to localStorage
  localStorage.setItem("theme", document.body.className);
});
$(sandBlue).on("click", () => {
  document.querySelector("body").classList.remove("visions-of-grandeur");
  document.querySelector("body").classList.remove("blue-marlin");
  document.querySelector("body").classList.remove("moonlit-asteroid");
  document.querySelector("body").classList.remove("deep-space");
  document.querySelector("body").classList.add("sand-blue");
  // Save the current theme to localStorage
  localStorage.setItem("theme", document.body.className);
});
$(visionsGrandeur).on("click", () => {
  document.querySelector("body").classList.remove("blue-marlin");
  document.querySelector("body").classList.remove("moonlit-asteroid");
  document.querySelector("body").classList.remove("deep-space");
  document.querySelector("body").classList.remove("sand-blue");
  document.querySelector("body").classList.add("visions-of-grandeur");
  // Save the current theme to localStorage
  localStorage.setItem("theme", document.body.className);
});
// Current weather shortcuts to description page
$(".wind").on("click", () => {
  document.querySelector(".container").classList.remove("show");

  document.querySelector(".baufort-container").classList.add("show");
});

// ---------------------------------------------------------------------
// let coordinates
//           navigator.geolocation.getCurrentPosition((position, error) => {

//             coordinates = [position.coords.latitude, position.coords.longitude]
//               return coordinates
//             })
// console.log(coordinates);

//   const settings = {
//       "async": true,
//       "crossDomain": true,
//       "url": `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${coordinates.latitude},${coordinates.longitude}&days=3&lang=sk`,
//       "method": "GET",
//       "headers": {
//           "X-RapidAPI-Key": "50fd49fe0dmsh3c8fffffb4abcf2p1d9acbjsne124a32ccc50",
//           "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com"
//       }
//   };

// Using Fetch API
//   fetch(settings.url, {
//       method: settings.method,
//       headers: settings.headers
//   })
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error('Error:', error));
// }).catch(error => {
//   console.error('Geolocation Error:', error);
// });

// ------------end of geolocation -------------------------------------
// Maunual City selection from drop-down menu -------------------------
let places = [
  "Bratislava",
  "Kulpin",
  "London",
  "Prague",
  "Warsaw",
  "Zagreb",
  "Zurich",
  "Toroni",
  "Banska Stiavnica",
  "Povazska Bystrica",
];
let citySelector = document.querySelector("#city-drop");
let menuLocation = document.querySelector(".location");
let currentCity;
if (localStorage.getItem("city")) {
  currentCity = localStorage.getItem("city");
} else {
  currentCity = places[0];
  localStorage.setItem("city", `${currentCity}`);
}

places.forEach((place) => {
  citySelector.insertAdjacentHTML(
    "beforeend",
    `
    <li id="city-sel">${place}</li>
  `
  );
});
let menuCities = document.querySelectorAll("#city-sel");
menuCities.forEach((city) => {
  $(city).on("click", (e) => {
    currentCity = e.currentTarget.textContent;
    localStorage.setItem("city", `${currentCity}`);
    document.querySelector("#city-drop").classList.remove("city-drop-show");
    location.reload(true);
  });
});
let cityStorage = localStorage.getItem("city");
let city = JSON.stringify(cityStorage);
$(menuLocation).on("click", (e) => {
  e.preventDefault;
  e.stopPropagation();
  document.querySelector("#city-drop").classList.toggle("city-drop-show");
});
// Closing menus on click outside of them
let body = document.querySelector("body");
let sidePanel = document.querySelector(".side-panel");
let cityDrop = document.querySelector("#city-drop");
body.addEventListener("click", () => {
  if (sidePanel.classList.contains("menu-active")) {
    sidePanel.classList.remove("menu-active");
  }
  if (cityDrop.classList.contains("city-drop-show")) {
    cityDrop.classList.remove("city-drop-show");
  }
  // document.querySelector(".side-panel").classList.remove('menu-active');
  console.log("clicked");
});
// Load right language for global settings----------------------------
if (localStorage.getItem("language")) {
  leng = localStorage.getItem("language");
  changeLanguage(leng);
} else {
  leng = "sk";
  changeLanguage(leng);
}
console.log(leng);
// let city = document.querySelector("#city")
// function addCity(){
//   place.unshift(city.value)
//   console.log(place);
// }
// document.querySelector("#addCity").addEventListener("click", addCity)
const settings = {
  async: true,
  crossDomain: true,
  url: `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${city}&days=3&lang=${leng}`,
  // "url": url,
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "50fd49fe0dmsh3c8fffffb4abcf2p1d9acbjsne124a32ccc50",
    "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
  },
};

// Getting current time and date and refreshing it on 1s intervals
setInterval(() => {
  // Create a new Date object
  let currentDate = new Date();
  let weekDays = [
    "Nedeľa",
    "Pondelok",
    "Utorok",
    "Streda",
    "Štvrtok",
    "Páteček",
    "Sobota",
  ];
  // Get the current date and time
  let day = currentDate.getDay(); //get week day
  // const todayKey = weekDays[day];
  // const translatedDay = lang.leng[todayKey];
  // console.log(translatedDay)
  let date = currentDate.getDate(); // Get the day as a number (1-31)
  let month = currentDate.getMonth() + 1; // Get the month as a number (0-11), adding 1 to match typical month numbers
  let year = currentDate.getFullYear(); // Get the four digit year (yyyy)
  let hours = currentDate.getHours(); // Get the hour (0-23)
  let minutes = currentDate.getMinutes(); // Get the minute (0-59)
  let seconds = currentDate.getSeconds(); // Get the second (0-59)

  $(".current-day").text(`${weekDays[day]}`);

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (date < 10) {
    date = "0" + date;
  }
  if (month < 10) {
    month = "0" + month;
  }
  $(".clock").html(`${hours}:${minutes}<span>:${seconds}</span>`);
  $(".date").text(`${date}.${month}.${year}`);
}, 1000);
// Refreshing page every 15 min to get updated weather information
setInterval(() => {
  location.reload(true);
}, 600000);

// Response ========================================================================
$.ajax(settings).done(function (response) {
  console.log(response);
  // Weather code for weather icon
  let weatherCode = response.current.condition.code;
  // Day or night cycle with wether icon
  let cycle = response.current.is_day;
  weatherIconSwitcher(cycle, weatherCode);

  // Convert some AM/PM response to 24h format------------------------------------
  function convertTo24Hour(timeStr) {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  }
  let sunrise = convertTo24Hour(response.forecast.forecastday[0].astro.sunrise);
  let sunset = convertTo24Hour(response.forecast.forecastday[0].astro.sunset);
  // ----------------------------------------------------------------------------------
  // UV Index -------------------------------------------------------------------------
  let uvIndex = response.current.uv;
  let windDirection = response.current.wind_degree;
  switchUvIndex(uvIndex);
  // ----------------------------------------------------------------------------------
  // Wind speed - Baufort scale
  let windSpeed = response.current.wind_kph;
  // console.log(windSpeed > 2 && windSpeed <= 5);
  $(".current-temp").html(
    `${Math.round(response.current.temp_c)}` + `<span>°C</span>`
  );
  // $("#icon").attr("src", `http:${response.current.condition.icon}`)
  $(".current-weather-text").html(`${response.current.condition.text}`);
  $(".sunrise").html(`<img class="sunrise-i" src="./img/sunrise.svg">`);
  $(".sunrise-res").html(`${sunrise}`);
  $(".sunset").html(`<img class="sunset-i" src="./img/sunset.svg">`);
  $(".sunset-res").html(`${sunset}`);
  $(".feels-like").html(
    `${Math.round(response.current.feelslike_c)}<span>°C</span>`
  );
  $(".min-temp").html(`<img class="min-i" src="./img/thermometer-colder.svg">`);
  $(".min-temp-res").html(
    `${Math.round(
      response.forecast.forecastday[0].day.mintemp_c
    )}<span>°C</span>`
  );
  $(".max-temp").html(`<img class="max-i" src="./img/thermometer-warmer.svg">`);
  $(".max-temp-res").html(
    `${Math.round(
      response.forecast.forecastday[0].day.maxtemp_c
    )}<span>°C</span>`
  );
  $(".chanse-of-rain").html(`<img class="rain-i" src="./img/umbrella.svg">`);
  $(".chanse-of-rain-res").html(
    `${response.forecast.forecastday[0].day.daily_chance_of_rain}<span>%</span>`
  );
  $(".humidity").html(`<img class="hum-i" src="./img/humidity.svg">`);
  $(".humidity-res").html(`${response.current.humidity}<span>%</span>`);
  $(".preasure").html(`<img class="pres-i" src="./img/barometer.svg">`);
  $(".preasure-res").html(`${response.current.pressure_mb}<span>mb</span>`);
  $(".wind").html(`<img class="wind-i" src="./img/wind.svg">`);
  baufortScale(windSpeed); //baufort scale level icon
  $(".wind-res").html(`${Math.round(windSpeed)}<span>kmh</span>`);
  $(".wind-direction").html(`<img class="wdir-i" src="./img/windsock.svg">`);
  $(".wind-arrow").html(`↓`);
  windSwitcher(windDirection); //Wind direction switch
  $(".location").html(
    `<img class="map-pin" src="./img/map_pin.svg"> ${response.location.name}`
  );
  // Baufort page--------------------------------------------------------------------
  $("#bicon0").html(`<img class="baufort-i" src="./img/baufort/b0.svg">`);
  $("#bicon1").html(`<img class="baufort-i" src="./img/baufort/b1.svg">`);
  $("#bicon2").html(`<img class="baufort-i" src="./img/baufort/b2.svg">`);
  $("#bicon3").html(`<img class="baufort-i" src="./img/baufort/b3.svg">`);
  $("#bicon4").html(`<img class="baufort-i" src="./img/baufort/b4.svg">`);
  $("#bicon5").html(`<img class="baufort-i" src="./img/baufort/b5.svg">`);
  $("#bicon6").html(`<img class="baufort-i" src="./img/baufort/b6.svg">`);
  $("#bicon7").html(`<img class="baufort-i" src="./img/baufort/b7.svg">`);
  $("#bicon8").html(`<img class="baufort-i" src="./img/baufort/b8.svg">`);
  $("#bicon9").html(`<img class="baufort-i" src="./img/baufort/b9.svg">`);
  $("#bicon10").html(`<img class="baufort-i" src="./img/baufort/b10.svg">`);
  $("#bicon11").html(`<img class="baufort-i" src="./img/baufort/b11.svg">`);
  $("#bicon12").html(`<img class="baufort-i" src="./img/baufort/b12.svg">`);
  // UV Index Scale page ----------------------------------------------------------
  $(".uv").on("click", () => {
    $(".container").removeClass("show");
    $(".uv-index-container").addClass("show");
  });
  $("#uv-icons-level1").append(
    `<img class="uv-page-i"src="./img/uv-index-1.svg">`
  );
  $("#uv-icons-level1").append(
    `<img class="uv-page-i"src="./img/uv-index-2.svg">`
  );
  $("#uv-icons-level2").append(
    `<img class="uv-page-i"src="./img/uv-index-3.svg">`
  );
  $("#uv-icons-level2").append(
    `<img class="uv-page-i"src="./img/uv-index-4.svg">`
  );
  $("#uv-icons-level2").append(
    `<img class="uv-page-i"src="./img/uv-index-5.svg">`
  );
  $("#uv-icons-level2").append(
    `<img class="uv-page-i"src="./img/uv-index-6.svg">`
  );
  $("#uv-icons-level2").append(
    `<img class="uv-page-i"src="./img/uv-index-7.svg">`
  );
  $("#uv-icons-level3").append(
    `<img class="uv-page-i"src="./img/uv-index-8.svg">`
  );
  $("#uv-icons-level3").append(
    `<img class="uv-page-i"src="./img/uv-index-9.svg">`
  );
  $("#uv-icons-level3").append(
    `<img class="uv-page-i"src="./img/uv-index-10.svg">`
  );
  $("#uv-icons-level3").append(
    `<img class="uv-page-i"src="./img/uv-index-11.svg">`
  );
  // Back buttons -----------------------------------------------------------------------
  $("#back-btn-uv").on("click", () => {
    $(".container").addClass("show");
    $(".uv-index-container").removeClass("show");
  });
  $("#back-btn-baufort").on("click", () => {
    $(".container").addClass("show");
    $(".baufort-container").removeClass("show");
  });
  $("#back-btn-astro").on("click", () => {
    $(".container").addClass("show");
    $(".astro-container").removeClass("show");
  });
  $("#back-btn-settings").on("click", () => {
    $(".container").addClass("show");
    $(".settings-container").removeClass("show");
  });
  $("#back-btn-help").on("click", () => {
    $(".container").addClass("show");
    $(".help-container").removeClass("show");
  });
  $("#back-btn-credits").on("click", () => {
    $(".container").addClass("show");
    $(".credits-container").removeClass("show");
  });
  $("#back-btn-moonphases-desc").on("click", () => {
    $(".astro-container").addClass("show");
    $(".astro-moonphases-desc").removeClass("show");
  });
  // Two day forecast-----------------------------------------------------------
  const twoDaysContainer = document.querySelector(".two-days-container");
  const twoDaysOne = document.querySelector(".day-one");
  const twoDaysTwo = document.querySelector(".day-two");

  $(".tomorrow-icon").attr(
    "src",
    `${response.forecast.forecastday[1].day.condition.icon}`
  );
  $(".day1-mintemp-c").html(
    `${Math.round(
      response.forecast.forecastday[1].day.mintemp_c
    )}<span>°</span>`
  );
  $(".day1-maxtemp-c").html(
    `${Math.round(
      response.forecast.forecastday[1].day.maxtemp_c
    )}<span>°</span>`
  );
  $(".day1-chance-rain").html(
    `${Math.round(
      response.forecast.forecastday[1].day.daily_chance_of_rain
    )}<span>%</span>`
  );
  $(".day1-wind").html(
    `${Math.round(
      response.forecast.forecastday[1].day.maxwind_kph
    )} <span></span>`
  );

  $(".overmorrow-icon").attr(
    "src",
    `${response.forecast.forecastday[2].day.condition.icon}`
  );
  $(".day2-mintemp-c").html(
    `${Math.round(
      response.forecast.forecastday[2].day.mintemp_c
    )}<span>°</span>`
  );
  $(".day2-maxtemp-c").html(
    `${Math.round(
      response.forecast.forecastday[2].day.maxtemp_c
    )}<span>°</span>`
  );
  $(".day2-chance-rain").html(
    `${Math.round(
      response.forecast.forecastday[2].day.daily_chance_of_rain
    )}<span>%</span>`
  );
  $(".day2-wind").html(
    `${Math.round(
      response.forecast.forecastday[2].day.maxwind_kph
    )} <span></span>`
  );
  // Astro ---------------------------------------------------------------------
  const moonPhase = response.forecast.forecastday[0].astro.moon_phase;
  const moonRise = response.forecast.forecastday[0].astro.moonrise;
  const moonSet = response.forecast.forecastday[0].astro.moonset;
  const illumination = response.forecast.forecastday[0].astro.moon_illumination;

  $(".moon-rise").html(
    `<img class="moon-rise-i" src="./img/moonrise.svg">${convertTo24Hour(
      moonRise
    )}`
  );
  $(".moon-set").html(
    `<img class="moon-set-i" src="./img/moonset.svg">${convertTo24Hour(
      moonSet
    )}`
  );
  // Astro moon phases img-----------------------------------------------------------
  // Switch language object based on language setting---
  let moon;
  if (leng === "en") {
    moon = moonEn;
  } else if (leng === "sk") {
    moon = moonSk;
  } else {
    moon = moonSr;
  }
  moonphaseSwitcher(moonPhase, moon, illumination);
  // Moon phases desscription about all moonphases ---------------------------------
  let astroMoonphasesDesc = document.querySelector(".astro-moonphases-desc");
  let allMoonphasesLink = document.querySelector("#all-moonphases-link");
  $(allMoonphasesLink).on("click", () => {
    document.querySelector(".astro-container").classList.remove("show");
    astroMoonphasesDesc.classList.add("show");
    // $(astroMoonphasesDesc).html(moonphasePage)
    $("#moonphase-img1").attr("src", `${moon.phase1.img}`);
    $("#moonphase-img2").attr("src", `${moon.phase2.img}`);
    $("#moonphase-img3").attr("src", `${moon.phase3.img}`);
    $("#moonphase-img4").attr("src", `${moon.phase4.img}`);
    $("#moonphase-img5").attr("src", `${moon.phase5.img}`);
    $("#moonphase-img6").attr("src", `${moon.phase6.img}`);
    $("#moonphase-img7").attr("src", `${moon.phase7.img}`);
    $("#moonphase-img8").attr("src", `${moon.phase8.img}`);
  });

  // Hourly data------------------------------------------------------------------------
  let hourlyData = response.forecast.forecastday[0].hour;
  let chartLabels = [];
  let tempData = [];
  let precipData = [];
  let windData = [];
  let pressureData = [];

  // Hourly data------------------------------------------------------------------------
  hourlyData.forEach((hour) => {
    let time = new Date(hour.time).getHours() + ":00";
    let dailyWindDirection = hour.wind_degree;
    let hourlyTime = new Date(hour.time).getHours(); // Extract the hour for comparison
    let isCurrentHour = hourlyTime === time; // Check if it's the current hour

    // console.log(dailyWindDirection);
    chartLabels.push(time);
    tempData.push(hour.temp_c);
    precipData.push(hour.precip_mm);
    windData.push(hour.wind_kph);
    pressureData.push(hour.pressure_mb);
    // console.log(hour.condition.code);

    // Teplota
    $("#temp").append(`<div class="hourly-data ${
      isCurrentHour ? "current-hour" : ""
    }" style="${isCurrentHour ? "border: 1px solid gold;" : ""}">
  <div class="htemp">${Math.round(hour.temp_c)}<span>°C</span></div>
  <div class="hicon"><img src="http:${hour.condition.icon}"/></div>
  <div class="htime">${time}</div>
  </div>
   `);
    //  Moznost zrazok
    $("#zrazky").append(`<div class="hourly-data data-time="${time}"">
                        <div class="htemp">${Math.round(
                          hour.precip_mm
                        )} <span>mm</span></div>
                        <div class="hicon"><img src="http:${
                          hour.condition.icon
                        }"/></div>
                        <div class="htime">${time}</div>
                        </div>
                                              `);
    // Vietor
    $("#vietor").append(`<div class="hourly-data data-time="${time}"">
                        <div class="htemp">${Math.round(
                          hour.wind_kph
                        )}<span>kmh</span></div>
                        <div class="hicon"><img src="http:${
                          hour.condition.icon
                        }"/></div>
                        <div class="htemp"><div class="daily-wind-arrow" data-time="${time}">↓</div></div>
                        <div class="htime">${time}</div>
                        </div>
                                              `);
    $(`.daily-wind-arrow[data-time="${time}"]`).css(
      "transform",
      `rotate(${dailyWindDirection}deg)`
    );
    // Tlak
    $("#tlak").append(`<div class="hourly-data data-time="${time}"">
                        <div class="htemp">${hour.pressure_mb} <span>mb</span></div>
                        <div class="hicon"><img src="http:${hour.condition.icon}"/></div>
                        <div class="htime">${time}</div>
                        </div>
                                              `);
  });

  // Graphs------------------------------------------------------------------------------------------------------------------
  createChart(
    "tempChart",
    "°C",
    tempData,
    "line",
    `rgba(255, 99, 132, 1)`,
    `rgba(255, 99, 132, 0.2)`,
    chartLabels
  );
  createChart(
    "precipChart",
    "mm",
    precipData,
    "line",
    "rgba(54, 162, 235, 1)",
    "rgba(54, 162, 235, 0.2)",
    chartLabels
  );
  createChart(
    "windChart",
    "km/h",
    windData,
    "bar",
    "rgba(75, 192, 192, 1)",
    "rgba(75, 192, 192, 0.2)",
    chartLabels
  );
  createChart(
    "pressureChart",
    "mb",
    pressureData,
    "line",
    "rgba(153, 102, 255, 1)",
    "rgba(153, 102, 255, 0.2)",
    chartLabels
  );
});
// Function to create charts -----------------------------------------------------------------------------------------------
function createChart(
  canvasId,
  label,
  data,
  type,
  borderColor,
  backgroundColor,
  chartLabels
) {
  var ctx = document.getElementById(canvasId).getContext("2d");
  var chart = new Chart(ctx, {
    type: type,
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: label,
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
          fill: type === "line",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#ffffff",
          },
        },
        x: {
          ticks: {
            color: "white",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
    },
  });
}
const ver = "1.7.14";
$(".version").html(`ver: ${ver} <a href="./changelog.md">Changelog</a>`);
