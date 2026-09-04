$(document).ready(()=>{

let credit = 200
let bet = 1
let jackpot = 500 * bet
let win = 0
let wheel1_1 = 1
let wheel1_2 = 1
let wheel1_3 = 1
let wheel2_1 = 1
let wheel2_2 = 1
let wheel2_3 = 1
let wheel3_1 = 1
let wheel3_2 = 1
let wheel3_3 = 1
let wheel4_1 = 1
let wheel4_2 = 1
let wheel4_3 = 1
let wheel5_1 = 1
let wheel5_2 = 1
let wheel5_3 = 1
let width 
let height
let choice
let draw
let drawHistory = []


updateNumbers()
function spinWheels(){
    $(".wheel1_1").removeClass("win-marker")
    $(".wheel1_2").removeClass("win-marker")
    $(".wheel1_3").removeClass("win-marker")
    $(".wheel2_1").removeClass("win-marker")
    $(".wheel2_2").removeClass("win-marker")
    $(".wheel2_3").removeClass("win-marker")
    $(".wheel3_1").removeClass("win-marker")
    $(".wheel3_2").removeClass("win-marker")
    $(".wheel3_3").removeClass("win-marker")
    $(".wheel4_1").removeClass("win-marker")
    $(".wheel4_2").removeClass("win-marker")
    $(".wheel4_3").removeClass("win-marker")
    $(".wheel5_1").removeClass("win-marker")
    $(".wheel5_2").removeClass("win-marker")
    $(".wheel5_3").removeClass("win-marker")  


    
        wheel1_1 = Math.floor(Math.random() * 8) + 1
        wheel1_2 = Math.floor(Math.random() * 8) + 1
        wheel1_3 = Math.floor(Math.random() * 8) + 1
        wheel2_1 = Math.floor(Math.random() * 8) + 1
        wheel2_2 = Math.floor(Math.random() * 8) + 1
        wheel2_3 = Math.floor(Math.random() * 8) + 1
        wheel3_1 = Math.floor(Math.random() * 8) + 1
        wheel3_2 = Math.floor(Math.random() * 8) + 1
        wheel3_3 = Math.floor(Math.random() * 8) + 1
        wheel4_1 = Math.floor(Math.random() * 8) + 1
        wheel4_2 = Math.floor(Math.random() * 8) + 1
        wheel4_3 = Math.floor(Math.random() * 8) + 1
        wheel5_1 = Math.floor(Math.random() * 8) + 1
        wheel5_2 = Math.floor(Math.random() * 8) + 1
        wheel5_3 = Math.floor(Math.random() * 8) + 1
  

    

    if (credit >= bet) {
        credit -= bet
        if (wheel1_2 === wheel2_2 && wheel2_2 === wheel3_2 && wheel3_2 === wheel4_2 && wheel4_2 === wheel5_2){
            jackpot = jackpot * bet
            win += jackpot
            $(".message").html(`Jackpot!!🏆 ${jackpot}`)
            $(".wheel1_2").addClass("win-marker")
            $(".wheel2_2").addClass("win-marker")
            $(".wheel3_2").addClass("win-marker")
            $(".wheel4_2").addClass("win-marker")
            $(".wheel5_2").addClass("win-marker")
            $(".risk").css("display", "block")
        }else if(wheel1_1 === wheel2_2 && wheel2_2 === wheel3_3 && wheel3_3 === wheel4_2 && wheel4_2 === wheel5_1){
            win = win + bet * 50
            $(".risk").css("display", "block")
            $(".message").html(`Win ${win}`)
            $(".wheel1_1").addClass("win-marker")
            $(".wheel2_2").addClass("win-marker")
            $(".wheel3_3").addClass("win-marker")
            $(".wheel4_2").addClass("win-marker")
            $(".wheel5_1").addClass("win-marker")
        }else if(wheel1_3 === wheel2_2 && wheel2_2 === wheel3_1 && wheel3_1 === wheel4_2 && wheel4_2 === wheel5_3){
            win = win + bet * 50
            $(".risk").css("display", "block")
            $(".message").html(`Win ${win}`)
            $(".wheel1_3").addClass("win-marker")
            $(".wheel2_2").addClass("win-marker")
            $(".wheel3_1").addClass("win-marker")
            $(".wheel4_2").addClass("win-marker")
            $(".wheel5_3").addClass("win-marker")
        }else if(wheel1_1 === wheel2_2 && wheel2_2 === wheel3_3 ){
            win = win + bet * 10
            $(".risk").css("display", "block")
            $(".message").html(`Win ${win}`)
            $(".wheel1_1").addClass("win-marker")
            $(".wheel2_2").addClass("win-marker")
            $(".wheel3_3").addClass("win-marker")
        }else if(wheel1_3 === wheel2_2 && wheel2_2 === wheel3_1 ){
            win = win + bet * 10
            $(".risk").css("display", "block")
            $(".message").html(`Win ${win}`)
            $(".wheel1_3").addClass("win-marker")
            $(".wheel2_2").addClass("win-marker")
            $(".wheel3_1").addClass("win-marker")
        }else if (wheel1_2 === wheel2_2 && wheel2_2 === wheel3_2){
            win = win + bet * 3
            $(".risk").css("display", "block")
            $(".message").html(`Win ${win}`)
            $(".wheel1_2").addClass("win-marker")
            $(".wheel2_2").addClass("win-marker")
            $(".wheel3_2").addClass("win-marker")
        }else if(wheel1_2 === wheel2_2){
            win = win + bet * 2
            $(".risk").css("display", "block")
            $(".message").html(`Win ${win}`)
            setTimeout(() => {
                $(".wheel1_2").addClass("win-marker")
                $(".wheel2_2").addClass("win-marker")
            }, 200);
        }else{
            $(".message").html("Spin again")
        }
    } else {
        if (credit === 0) {
            $(".message").html("Game Over! ⛔")
            $("#spin").css("display", "none")
            $(".slot-wrapper").css("display", "none")
            $(".jackpot").css("display", "none")
        } else {
            $(".message").html("Bet exceeds available credit! ⚠️")
        }
    }
}
// add click event to the risk button
// Risk it mechanism
function riskIt() {
    let card
    card = Math.floor(Math.random() * 10) + 1

    if (card % 2 === 0){
        draw = 'red'
        $(".card").html(`<img src="img/A.png">`)
        
        if(drawHistory.length <= 9){
            drawHistory.push(draw)
        }else{
            drawHistory.push(draw)
            drawHistory.shift()
        }
    }else{
        draw = 'black'
        if(drawHistory.length <= 9){
            drawHistory.push(draw)
        }else{
            drawHistory.push(draw)
            drawHistory.shift()
        }
        $(".card").html(`<img src="img/A_black.png">`)
    }
    console.log(drawHistory);
}

function cardHistory(){
    for(let i = 0; i < drawHistory.length; i++){
        console.log("-----");
        console.log(drawHistory[i])
        if(drawHistory[i] === "red"){
            $('.history-rect').append(`<img src="img/A.png" class="card-history-img" />`) 
        }else{
            $('.history-rect').append(`<img src="img/A_black.png" class="card-history-img" />`)
        }
        
     }
}
$(".risk").click(()=>{
    $(".risk-container").removeClass("hidden")
    $(".result-panel").html(`Win: ${win}`)
    cardHistory()
})
$(".red").click(()=>{
   choice = 'red'
   riskIt()
//    cardHistory()
   if (choice === draw){
    win = win * 2
   }else{
    win = 0
    
    $(".risk").css("display", "none")
    $(".result-panel").html(`Win: ${win}`)
    $(".message").html(`Win ${win}`)
    
    setTimeout(() => {
        $(".risk-container").addClass("hidden")
        $('.history-rect').empty()
    }, 2000);
   }
    $(".result-panel").html(`Win: ${win}`)
})

$(".black").click(()=>{
    choice = 'black'
    riskIt()
    // cardHistory()
    if (choice === draw){
     win = win * 2
    }else{
     win = 0
     
     $(".risk").css("display", "none")
     $(".result-panel").html(`Win: ${win}`)
     $(".message").html(`Win ${win}`)
     setTimeout(() => {
        $(".risk-container").addClass("hidden")
        $('.history-rect').empty()
    }, 2000);
    }
     $(".result-panel").html(`Win: ${win}`)
 })

 $(".collect").click(()=>{
    credit += win
    win = 0
    $(".credit").html(`Credit: ${credit}`)
    $(".risk-container").addClass("hidden")
    $(".result-panel").html(`Win: ${win}`)
    $(".risk").css("display", "none")
    $('.history-rect').empty()
    
     
 })

function updateNumbers(){
    $(".credit").html(`Credit: ${credit}`)
    $(".bet").html(`Bet: ${bet}`)
    $(".jackpot").html(`Jackpot: ${jackpot * bet}`)
    
    setTimeout(() => {
        $(".wheel1_1").html(`<img class="wheel-img" src="img/${wheel1_1}.png">`).animate({
            top: '200px',

        })
    }, 100);
    setTimeout(() => {
        $(".wheel1_2").html(`<img class="wheel-img" src="img/${wheel1_2}.png">`)
    }, 200);
    setTimeout(() => {
        $(".wheel1_3").html(`<img class="wheel-img" src="img/${wheel1_3}.png">`)
    }, 300);
    setTimeout(() => {
        $(".wheel2_1").html(`<img class="wheel-img" src="img/${wheel2_1}.png">`)
    }, 100);
    setTimeout(() => {
        $(".wheel2_2").html(`<img class="wheel-img" src="img/${wheel2_2}.png">`)
    }, 200);
    setTimeout(() => {
        $(".wheel2_3").html(`<img class="wheel-img" src="img/${wheel2_3}.png">`)
    }, 300);
    setTimeout(() => {
        $(".wheel3_1").html(`<img class="wheel-img" src="img/${wheel3_1}.png">`)
    }, 100);
    setTimeout(() => {
        $(".wheel3_2").html(`<img class="wheel-img" src="img/${wheel3_2}.png">`)
    }, 200);
    setTimeout(() => {
        $(".wheel3_3").html(`<img class="wheel-img" src="img/${wheel3_3}.png">`)
    }, 300);
    setTimeout(() => {
        $(".wheel4_1").html(`<img class="wheel-img" src="img/${wheel4_1}.png">`)
    }, 100);
    setTimeout(() => {
        $(".wheel4_2").html(`<img class="wheel-img" src="img/${wheel4_2}.png">`)
    }, 200);
    setTimeout(() => {
        $(".wheel4_3").html(`<img class="wheel-img" src="img/${wheel4_3}.png">`)
    }, 300);
    setTimeout(() => {
        $(".wheel5_1").html(`<img class="wheel-img" src="img/${wheel5_1}.png">`)
    }, 100);
    setTimeout(() => {
        $(".wheel5_2").html(`<img class="wheel-img" src="img/${wheel5_2}.png">`)
    }, 200);
    setTimeout(() => {
        $(".wheel5_3").html(`<img class="wheel-img" src="img/${wheel5_3}.png">`)
    }, 300);

}
$(".plus").click(()=>{
    bet++
    // updateNumbers()
    $(".bet").html(`Bet: ${bet}`)
    $(".jackpot").html(`Jackpot: ${jackpot * bet}`)
})
$(".minus").click(()=>{
    bet--
    // updateNumbers()
    $(".bet").html(`Bet: ${bet}`)
    $(".jackpot").html(`Jackpot: ${jackpot * bet}`)
})

$("#spin").click(()=>{
    credit += win
    spinWheels()
    updateNumbers()
    
    
    

    })
})

