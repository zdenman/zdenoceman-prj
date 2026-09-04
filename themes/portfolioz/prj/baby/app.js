const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://weatherapi-com.p.rapidapi.com/forecast.json?q=Bratislava&days=3",
	"method": "GET",
	"headers": {
		"X-RapidAPI-Key": "50fd49fe0dmsh3c8fffffb4abcf2p1d9acbjsne124a32ccc50",
		"X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com"
	}
};
// Getting current time and date and refreshing it on 1s intervals
setInterval(() => {
// Create a new Date object
let currentDate = new Date();
let weekDays = ["Nedela", "Pondelok", "Utork", "Streda", "Stvrtok", "Patecek", "Sobota"]
// Get the current date and time
let day = currentDate.getDay(); //get week day
let date = currentDate.getDate(); // Get the day as a number (1-31)
let month = currentDate.getMonth() + 1; // Get the month as a number (0-11), adding 1 to match typical month numbers
let year = currentDate.getFullYear(); // Get the four digit year (yyyy)
let hours = currentDate.getHours(); // Get the hour (0-23)
let minutes = currentDate.getMinutes(); // Get the minute (0-59)
let seconds = currentDate.getSeconds(); // Get the second (0-59)


minutes = (minutes < 10 ? "0" : "") + minutes;
seconds = (seconds < 10 ? "0" : "") + seconds;

$(".date").text(`Dnes je ${date}.${month}.${year}`)
$(".current-day").text(`${weekDays[day]}`)
$(".clock").text(`${hours}:${minutes}`)

// Variables for coundown day & week UNTIL son birthday
const startDate1 = new Date(currentDate);
const endDate1 = new Date('2023-07-23');
const weeksTill = countDownWeeks(startDate1, endDate1);
const daysTill = countDownDays(startDate1, endDate1);

// count week until son birrthday
function countDownWeeks(startDate1, endDate1) {
    const diffInMs = endDate1.getTime() - startDate1.getTime();
    const diffInWeeks = Math.floor(diffInMs / 604800000);
    return diffInWeeks;
  }
// count days until sun birthday
  function countDownDays(startDate1, endDate1) {
    const diffInMs = endDate1.getTime() - startDate1.getTime();
    const diffInDays = Math.floor(diffInMs / 86400000);
    return diffInDays;
  }
//   --------------------------------------------------------------
// Variables for count days & week up to now
const startDate2 = new Date('2022-10-20');
const endDate2 = new Date(currentDate);
const weeksTillNow = countDownWeeks(startDate2, endDate2);
const daysTillNow = countDownDays(startDate2, endDate2);

// count week until son birrthday
function countDownWeeks(startDate2, endDate2) {
    const diffInMs = endDate2.getTime() - startDate2.getTime();
    const diffInWeeks = Math.floor(diffInMs / 604800000);
    return diffInWeeks;
  }
// count days until sun birthday
  function countDownDays(startDate2, endDate2) {
    const diffInMs = endDate2.getTime() - startDate2.getTime();
    const diffInDays = Math.floor(diffInMs / 86400000);
    return diffInDays;
  }
//   --------------------------------------------------------------
$(".count-up-day").html(`Ubehlo: <span>${daysTillNow} dni</span>`)
$(".count-up-week").html(`Sme v: <span>${weeksTillNow} tyzdni</span>`)
$(".count-down-day").html(`Este: <span>${daysTill} dni</span>`)
$(".count-down-week").html(`Alebo: <span>${weeksTill} tyzdnov</span>`)

}, 1000);
// Refreshing page every 5 min to get updated weather information
setInterval(() => {
    location.reload(true); 
}, 600000);

$.ajax(settings).done(function (response) {
	console.log(response);

$(".current-temp").html(`${response.current.temp_c}` + `<span>°C</span>`)
$("#icon").attr("src", `http:${response.current.condition.icon}`)

$(".current-weather-text").html(`${response.current.condition.text}`)  
$(".sunrise").html(`<span>Vychod:</span> ${response.forecast.forecastday[0].astro.sunrise}`)  
$(".sunset").html(`<span>Zapad:</span> ${response.forecast.forecastday[0].astro.sunset}`) 
$(".feels-like").html(`Pocitovo  ${response.current.feelslike_c}<span>°C</span>`) 
$(".chanse-of-rain").html(`Zrazky:  ${response.forecast.forecastday[0].day.daily_chance_of_rain}<span>%</span>`)
$(".total-precip").html(`${response.forecast.forecastday[0].day.totalprecip_mm}<span>mm</span>`)
$(".min-temp").html(`Min: ${response.forecast.forecastday[0].day.mintemp_c}<span>°C</span>`)
$(".max-temp").html(`Max: ${response.forecast.forecastday[0].day.maxtemp_c}<span>°C</span>`)
$(".humidity").html(`Vlkost: ${response.current.humidity}%`) 
$(".preasure").html(`Tlak: ${response.current.pressure_mb}mb`)
$(".wind").html(`Vietor: ${response.current.wind_kph}km/h`)
$(".wind-direction").html(`Smer: ${response.current.wind_dir}`)
$(".uv").html(`UV Index: ${response.current.uv}`)





});



