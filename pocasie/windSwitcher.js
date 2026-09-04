export function windSwitcher(windDirection) {
   document.querySelector(".wind-arrow").style.transform = `rotate(${windDirection}deg)`;
}
