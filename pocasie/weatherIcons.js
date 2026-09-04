export function weatherIconSwitcher(cycle, weatherCode) {
  if (cycle === 1) {
    switch (weatherCode) {
      case 1000:
        $("#icon").attr("src", `./img/clear-day.svg`);
        break;
      case 1003:
        $("#icon").attr("src", `./img/partly-cloudy-day.svg`);
        break;
      case 1006:
        $("#icon").attr("src", `./img/cloudy.svg`);
        break;
      case 1009:
        $("#icon").attr("src", `./img/overcast.svg`);
        break;
      case 1030:
        $("#icon").attr("src", `./img/haze.svg`);
        break;
      case 1153:
        $("#icon").attr("src", `./img/drizzle.svg`);
        break;
      case 1183:
        $("#icon").attr("src", `./img/drizzle.svg`);
        break;
      case 1189:
        $("#icon").attr("src", `./img/drizzle.svg`);
        break;
      case 1063:
        $("#icon").attr("src", `./img/partly-cloudy-day-rain.svg`);
        break;
      case 1135:
        $("#icon").attr("src", `./img/fog.svg`);
        break;
      case 1180:
        $("#icon").attr("src", `./img/partly-cloudy-day-rain.svg`);
        break;
      case 1222:
        $("#icon").attr("src", `./img/snow.svg`);
        break;
    }
  } else {
    switch (weatherCode) {
      case 1000:
        $("#icon").attr("src", `./img/clear-night.svg`);
        break;
      case 1003:
        $("#icon").attr("src", `./img/partly-cloudy-night.svg`);
        break;
      case 1006:
        $("#icon").attr("src", `./img/cloudy.svg`);
        break;
      case 1009:
        $("#icon").attr("src", `./img/overcast.svg`);
        break;
      case 1030:
        $("#icon").attr("src", `./img/haze-night.svg`);
        break;
      case 1153:
        $("#icon").attr("src", `./img/drizzle.svg`);
        break;
      case 1183:
        $("#icon").attr("src", `./img/drizzle.svg`);
        break;
      case 1189:
        $("#icon").attr("src", `./img/drizzle.svg`);
        break;
      case 1063:
        $("#icon").attr("src", `./img/partly-cloudy-night-rain.svg`);
        break;
      case 1135:
        $("#icon").attr("src", `./img/fog.svg`);
        break;
      case 1180:
        $("#icon").attr("src", `./img/partly-cloudy-night-rain.svg`);
        break;
      case 1222:
        $("#icon").attr("src", `./img/snow.svg`);
        break;
    }
  }
}
