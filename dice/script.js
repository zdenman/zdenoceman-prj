'use strict';

// Selectiong elements
const player0El = document.querySelector('.player--0')
const player1El = document.querySelector('.player--1')

const score0El = document.querySelector('#score--0')
const score1El = document.getElementById('score--1')
const current0El = document.getElementById('current--0')
const current1El = document.getElementById('current--1')

const diceEl = document.querySelector('.dice')
const btnRoll = document.querySelector('.btn--roll')
const btnNew = document.querySelector('.btn--new')
const btnHold = document.querySelector('.btn--hold')

// Starting condidtion
score0El.textContent = 0;
score1El.textContent = 0;
diceEl.classList.add('hidden')

const scores = [0, 0]
let currentScore = 0
let activePlayer = 0
let playing = true

const switchPlayer = function(){
    document.getElementById(`current--${activePlayer}`).textContent = 0
        currentScore = 0
        activePlayer = activePlayer === 0 ? 1 : 0;
        player0El.classList.toggle('player--active')
        player1El.classList.toggle('player--active')
}


btnRoll.addEventListener('click', function(){
    if (playing){
    //  1. generate random dice roll
    const dice = Math.floor(Math.random() * 6 + 1)
    console.log(dice);

    // 2. display dice
    diceEl.classList.remove('hidden')
    diceEl.src = `img/dice-${dice}.png`

    // 3. check for rolled 1: if true, switch to next player
    if(dice !== 1){
        currentScore += dice
        document.getElementById(`current--${activePlayer}`).textContent = currentScore
    }else{
        switchPlayer()
        console.log(scores)
    }
} 
})
// Hold button 
btnHold.addEventListener('click', function(){
    if(playing){
    // Add current score to active player
    scores[activePlayer] += currentScore

    document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer]
    // score0El.textContent = scores[0]
    // score1El.textContent = scores[1]
    currentScore = 0
    // check if score is >= 100
    // Finish game
    if (scores[activePlayer] >= 100){
        playing = false
        document.querySelector(`.player--${activePlayer}`).classList.add('player--winner')
        document.querySelector(`.player--${activePlayer}`).classList.remove('player--active')
        console.log(`Game over! Player ${activePlayer} wins!`)
        diceEl.classList.add('hidden')
        // btnRoll.classList.add('hidden')
        // btnHold.classList.add('hidden')
    }else{
    // Switch to next player
    switchPlayer();
    
    }
}
})

// New game button

btnNew.addEventListener('click', function(){
    playing = true
    currentScore = 0
    scores[0] = 0
    scores[1] = 0
    diceEl.classList.remove('hidden')
    // btnRoll.classList.remove('hidden')
    // btnHold.classList.remove('hidden')
    document.querySelector(`.player--${activePlayer}`).classList.remove('player--winner')
    document.querySelector(`.player--${activePlayer}`).classList.add('player--active')
    document.getElementById(`current--0`).textContent = currentScore
    document.getElementById(`current--1`).textContent = currentScore
    document.getElementById(`score--0`).textContent = scores[0]
    document.getElementById(`score--1`).textContent = scores[1]
})

