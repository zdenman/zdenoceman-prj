import { generateRandomNumbers } from './mines-generator.js';
// Selecting all required elements from the DOM
const grid = document.querySelectorAll('.field');
const balance = document.querySelector('.balance');
const message = document.querySelector('.message');
const display = document.querySelector('.display');
const minBet = document.querySelector('#min-bet');
const maxBet = document.querySelector('#max-bet');
const betMinus = document.querySelector('#bet-minus');
const betPlus = document.querySelector('#bet-plus');
const add3 = document.querySelector('#add-3');
const add5 = document.querySelector('#add-5');
const addMinus = document.querySelector('#add-minus');
const addPlus = document.querySelector('#add-plus');
const add10 = document.querySelector('#add-10');
const add20 = document.querySelector('#add-20');
const minePanel = document.querySelector('.mine-panel');
const minesNum = document.querySelector('.mines-num');
const start = document.querySelector('#start');
const restart = document.querySelector('#restart');
const multi = document.querySelector('.multiplier');
const collect = document.querySelector('#collect');
const mbet = document.querySelector('.my-bet');
// Parts needed for the logic
let selected = []
let credit = 100
let bet = []
let totalBet = 0
let minimumBet = 1
let maximumBet = 100
let multiplier = 0.20
let win = 0
let myRandomNumbers = []
let safeSteps = 0;
// Functions -----------------------------------------------------------
export let mines = 2
document.addEventListener('DOMContentLoaded', () => {
    balance.innerHTML = `Balance: ${credit}`
    // multi.innerHTML = `${multiplier}x`
})

function calculateTotalBet() {
    totalBet = bet.reduce((acc, current) => {
        acc += current
        return acc
    }, 0)
}
function deMine(){
    balance.innerHTML = `Balance: ${(credit).toFixed(2)}`
    collect.innerHTML = "Collect: 0"
    win = 0
    totalBet = 0
    selected = []
    safeSteps = 0
    mbet.innerHTML = `Bet: 0`
    message.innerHTML = "Place a bet to play again!"
        let mines = document.querySelectorAll('.field.bomb')
        let field = document.querySelectorAll(".field.active")
    mines.forEach(mine => {
        mine.classList.remove('bomb')
        mine.classList.remove('no-hovera')
        mine.classList.remove('no-hoverm')
    })
    field.forEach(field => {
        field.classList.remove('active')
        
    })
    

}
//  Clearing all fields and values for next round after 5sec - used: on mine hit
function autoDeMine(){
    setTimeout(() => {
        deMine()
    }, 3000);
}
function startBtn() {
    if (totalBet > 0 || credit >= minimumBet) {
        if (totalBet > 0) {
            myRandomNumbers = generateRandomNumbers()
            message.innerHTML = ""
            message.innerHTML = "Good luck!"
            // calculateTotalBet()
            console.log(myRandomNumbers)
        } else {
            message.innerHTML = ""
            message.innerHTML = "Minimum bet is 1"
            console.log("Minimum bet is 1")
        }

    } else {
        message.innerHTML = ""
        message.innerHTML = "You don't have enough money"
        console.log("You don't have enough money")
    }
}
// --------------------------------------------------------------------------------
// Min Bet button
minBet.addEventListener('click', () => {
    if(credit >= minimumBet) {
        
            mbet.innerHTML = `${minimumBet}`
            credit = credit - minimumBet
            bet.push(minimumBet)
            calculateTotalBet()
            balance.innerHTML = `Balance: ${(credit).toFixed(2)}`
            mbet.innerHTML = `Bet: ${totalBet}`
            console.log(totalBet)
        
        
    }else{
        message.innerHTML = ""
        message.innerHTML = "You don't have enough money"
        console.log("You don't have enough money")
    }
})
// Max bet button
maxBet.addEventListener('click', () => {
    if(credit >= maximumBet) {
        credit -= maximumBet
        bet.push(maximumBet)
        calculateTotalBet()
        balance.innerHTML = `Balance: ${(credit).toFixed(2)}`
        mbet.innerHTML = `Bet: ${totalBet}`
        console.log(totalBet)
    }else{
        message.innerHTML = ""
        message.innerHTML = "You don't have enough money"
        console.log("You don't have enough money")
    }
})
// Bet minus button
betMinus.addEventListener('click', () => {
    if(totalBet >= 1) {
        credit += 1
        totalBet -= 1
        balance.innerHTML = `Balance: ${(credit).toFixed(2)}`
        mbet.innerHTML = `Bet: ${totalBet}`
        
    }else{
        message.innerHTML = ""
        message.innerHTML = "You can't bet less than 1"
        console.log("You can't bet less than 1")
    }
})
// Bet plus button
betPlus.addEventListener('click', () => {
    if(credit >= 1) {
        credit -= 1
        totalBet += 1
        balance.innerHTML = `Balance: ${(credit).toFixed(2)}`
        mbet.innerHTML = `Bet: ${totalBet}`
        console.log(totalBet)
    }else{
        message.innerHTML = ""
        message.innerHTML = "You don't have enough money"
        console.log("You don't have enough money")
    }
})
// Add + mines
addPlus.addEventListener('click', () => {
    if(mines < 24){
        mines += 1
        minesNum.innerHTML = `${mines}`
        // multi.innerHTML = `${(multiplier += 0.10).toFixed(2)}x`
    }else{
        message.innerHTML = ""
        message.innerHTML = "You can't add more than 24 mines"
        console.log("You can't add more than 24 mines")
    }
})
// Add - mines
addMinus.addEventListener('click', () => {
    if(mines > 2){
        mines -= 1
        minesNum.innerHTML = `${mines}`
        // multi.innerHTML = `${(multiplier -= 0.10).toFixed(2)}x`
    }else{
        message.innerHTML = ""
        message.innerHTML = "You can't remove mines. Minimum mines to play  is 2"
        console.log("You can't remove mines. Minimum mines is 2")
    }
})
// Add 3 mines
// add3.addEventListener('click', () => {
    
//     if(mines + 3 <= 24){
//         mines += 3
//         minesNum.innerHTML = `${mines}`
//         multi.innerHTML = `${(multiplier + 3 * 0.10).toFixed(2)}x`
//     }else{
//         message.innerHTML = ""
//         message.innerHTML = "You can't add more than 24 mines"
//         console.log("You can't add more than 24 mines")
//     }
// })
// Add 5 mines
// add5.addEventListener('click', () => {
//     if(mines + 5 <= 24){
//         mines += 5
//         minesNum.innerHTML = `${mines}`
//         multi.innerHTML = `${(multiplier + 5 * 0.10).toFixed(2)}x`

//     }else{
//         message.innerHTML = ""
//         message.innerHTML = "You can't add more than 24 mines"
//         console.log("You can't add more than 24 mines")
//     }
// })
// Add 10 mines
// add10.addEventListener('click', () => {
//     if(mines + 10 <= 24){
//         mines += 10
//         minesNum.innerHTML = `${mines}`
//         multi.innerHTML = `${(multiplier + 10 * 0.10).toFixed(2)}x`
//     }else{
//         message.innerHTML = ""
//         message.innerHTML = "You can't add more than 24 mines"
//         console.log("You can't add more than 24 mines")
//     }
// })
// Add 20 mines
// add20.addEventListener('click', () => {
//     if(mines + 20 <= 24){
//         mines += 20
//         minesNum.innerHTML = `${mines}`
//         multi.innerHTML = `${(multiplier + 20 * 0.10).toFixed(2)}x`
//     }else{
//         message.innerHTML = ""
//         message.innerHTML = "You can't add more than 24 mines"
//         console.log("You can't add more than 24 mines")
//     }
// })


start.addEventListener('click', startBtn)


// Function to update multiplier and calculate win
function updateMultiplier(safeSteps, totalBet, multiplier) {
    let currentMultiplier;
    let stepMultiplierIncrease;
    let potentialWin;
    // Initial multiplier adjustment based on the number of mines at the start
    currentMultiplier = multiplier; // Base multiplier could be dynamic based on mines
    // Increase multiplier for each safe step
    stepMultiplierIncrease = safeSteps * 0.05; // Adjust the rate as needed
    currentMultiplier += stepMultiplierIncrease;
    // Calculate current potential win
    potentialWin = totalBet * currentMultiplier * mines;
    // Update the global win variable (if you want to accumulate wins)
    win = potentialWin;
    console.log('Win:', win.toFixed(2), 'Safe steps:', safeSteps, 'Total Bet:', totalBet, 'Multiplier:', currentMultiplier.toFixed(2));
    collect.innerHTML = `Collect: ${win.toFixed(2)}`;
}

// Collect button
collect.addEventListener('click', () => {
    credit = win + credit
    balance.innerHTML = `Balance: ${(credit).toFixed(2)}`
    collect.innerHTML = "Collect: 0"
    win = 0
    totalBet = []
    let field = document.querySelectorAll(".field.active")
    field.forEach(field => {
        field.classList.remove('active')
    })
    selected = []
    safeSteps = 0
    mbet.innerHTML = `Bet: 0`
    message.innerHTML = "You collected your win!"
    // console.log("win:", win, "total Bet:", totalBet, "selected:", selected, "safe steps:", safeSteps);
})

// Event listener for your grid fields
function onFieldClick(event) {
    // Get the ID of the clicked field
    const fieldId = Number.parseInt(event.currentTarget.id);
    // Check if the field is already selected
    if (!selected.includes(fieldId)) {
        if(myRandomNumbers.includes(fieldId)) {
            console.log("bomb!");
            event.currentTarget.classList.add('bomb')
            event.currentTarget.classList.add('no-hoverm');
            message.innerHTML = "You hit a mine! You lose!"
            myRandomNumbers.forEach(field => {
                document.getElementById(field).classList.add('bomb')
                // grid[field].classList.add('bomb')
                autoDeMine()
            })
        }else{
            // If not, add the ID to the selected array
            safeSteps++
            updateMultiplier(safeSteps, totalBet, multiplier)
            selected.push(fieldId);
            event.currentTarget.classList.add('active')
            event.currentTarget.classList.add('no-hovera');
            
        }  
    } else {
        // If the field is already selected
        console.log("This field has already been selected.");
        // ... or any other handling for already selected fields ...
    }
}
// Event listener for grid fields
grid.forEach(field => {
    field.addEventListener('click', onFieldClick);
});
// win = maxBet * multiplier
// grid.forEach( item => {
//     item.addEventListener('click', event =>{
//         // document.querySelector('.field.active').classList.remove('active')
//         if(selected.length <= 12){
//             event.currentTarget.classList.add('active')
//             for(let i = 0; i < selected.length; i++){
//                 if(selected[i] === Number.parseInt(event.currentTarget.id)){
//                     alert('you cant select the same number twice')
//                     // event.currentTarget.classList.remove('active')
//                     // selected.splice(i, 1)
//                     break;
//                 }else{
//                     selected.push(Number.parseInt(event.currentTarget.id))
//                     console.log(selected);
//                 }
//             }
//         }else{
//             alert('You can only select 12 fields')
//         }
        
// })
// })