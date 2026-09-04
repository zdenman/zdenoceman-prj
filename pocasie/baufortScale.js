export default function baufortScale(windSpeed) {
      if(windSpeed > 0 && windSpeed <= 2){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b0.svg">`);
      }
      if(windSpeed > 2 && windSpeed <= 5){
          $(".wind").append(`<img class="baufort" src="./img/baufort/b1.svg">`);
        }
      if(windSpeed > 5 && windSpeed <= 11){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b2.svg">`);
      }
      if(windSpeed > 11 && windSpeed <= 19){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b3.svg">`);
      }
      if(windSpeed > 19 && windSpeed <= 28){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b4.svg">`);
      }
      if(windSpeed > 28 && windSpeed <= 38){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b5.svg">`);
      }
      if(windSpeed > 38 && windSpeed <= 49){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b6.svg">`);
      }
      if(windSpeed > 49 && windSpeed <= 61){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b7.svg">`);
      }
      if(windSpeed > 61 && windSpeed <= 74){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b8.svg">`);
      }
      if(windSpeed > 74 && windSpeed <= 88){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b9.svg">`);
      }
      if(windSpeed > 88 && windSpeed <= 102){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b10.svg">`);
      }
      if(windSpeed > 102 && windSpeed <= 117){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b11.svg">`);
      }
      if(windSpeed > 117 && windSpeed <= 133){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b12.svg">`);
      }
      if(windSpeed > 133 && windSpeed <= 148){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b13.svg">`);
      }
      if(windSpeed > 148 && windSpeed <= 165){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b14.svg">`);
      }
      if(windSpeed > 165 && windSpeed <= 183){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b15.svg">`);
      }
      if(windSpeed > 183 && windSpeed <= 200){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b16.svg">`);
      }
      if(windSpeed > 200 && windSpeed <= 300){
        $(".wind").append(`<img class="baufort" src="./img/baufort/b17.svg">`);
      }
}