export function switchUvIndex(uvIndex) {
    switch (uvIndex) {
        case (1):
          $(".uv").html(`<img class="uv-i" src="./img/uv-index-1.svg">`)
          break;
          case (2):
          $(".uv").html(`<img class="uv-i" src="./img/uv-index-2.svg">`)
          break;
          case (3):
          $(".uv").html(`<img class="uv-i" src="./img/uv-index-3.svg">`)
          break;
          case (4):
          $(".uv").html(`<img class="uv-i" src="./img/uv-index-4.svg">`)
          break;
          case (5):
          $(".uv").html(`<img class="uv-i" src="./img/uv-index-5.svg">`)
          break;
          case (6):
          $(".uv").html(`<img class="uv-i" src="./img/uv-index-6.svg">`)
          break;
          case (7):
          $(".uv").html(`<img class="uv-i" src="./img/uv-index-7.svg">`)
          break;
          case (8):
          $(".uv").html(`<img class="uv-i" src="./img/uv-index-8.svg">`)
          break;
          case (9):
          $(".uv").html(`<img class="uv-i" src="./img/uv-index-9.svg">`)
          break;
          case (10):
          $(".uv").html(`<img class="uv-i" src="./img/uv-index-10.svg">`)
          break;
          case (11):
          $(".uv").html(`<img class="uv-i" src="./img/uv-index-11.svg">`)
          break;
      
        default:
          $(".uv").html(`<img class="uv-i" src="./img/uv-index.svg">`)
          break;
      }
}