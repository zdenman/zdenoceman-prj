let players = JSON.parse(localStorage.getItem('players')) || [];
let holes = JSON.parse(localStorage.getItem('holes')) || 0;
let currentHole = JSON.parse(localStorage.getItem('currentHole')) || 1;
let currentPlayerIndex = 0;
let currentAttempts = Array(players.length).fill(1); // Initialize attempt counts for all players

function setupPlayers() {
    const numPlayers = document.getElementById('players').value;
    const playerNamesDiv = document.getElementById('playerNames');
    playerNamesDiv.innerHTML = '';
    for (let i = 0; i < numPlayers; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Player ${i + 1} Name`;
        playerNamesDiv.appendChild(input);
    }
}

function startGame() {
    const playerInputs = document.getElementById('playerNames').querySelectorAll('input');
    players = Array.from(playerInputs).map(input => ({ name: input.value, scores: [] }));
    holes = document.getElementById('holes').value;
    currentHole = 1;
    currentPlayerIndex = 0;
    currentAttempts = Array(players.length).fill(1); // Reset attempt counts for all players
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('holes', JSON.stringify(holes));
    localStorage.setItem('currentHole', JSON.stringify(currentHole));
    document.getElementById('setup').style.display = 'none';
    document.getElementById('playerScreen').style.display = 'block';
    showPlayerScreen();
}

function showPlayerScreen() {
    const player = players[currentPlayerIndex];
    document.getElementById('currentHolePlayer').innerHTML = `<img src="https://zdenoceman.com/projects/mini-golf/img/ghole.svg"> ${currentHole}`;
    document.getElementById('currentPlayer').innerHTML = `Hráč: <br><span>${player.name}</span>`;
    document.getElementById('attempts').textContent = `Pokus: ${currentAttempts[currentPlayerIndex]}`;
    document.getElementById('scored').checked = false;
    // Update the Next Player button text based on the game state
    updateNextPlayerButtonText();
}

function updateNextPlayerButtonText() {
    const nextPlayerButton = document.getElementById('nextPlayerButton'); // Replace with the actual ID of your Next Player button
    
    // Check if the current hole is the last one and all players have scored
    if (currentHole >= holes && players.every((player) => player.scores[currentHole - 1] != null)) {
        nextPlayerButton.textContent = 'Zobrazit výsledky '; // Change the button text to 'Show Result'
    } else {
        nextPlayerButton.textContent = 'Nasledovný hráč'; // Otherwise, set it back to 'Next Player'
    }
}

function nextPlayer() {
    const scoredCheckbox = document.getElementById('scored');
    
    if (!scoredCheckbox.checked && currentAttempts[currentPlayerIndex] >= 6) {
        players[currentPlayerIndex].scores[currentHole - 1] = 7;
    } else if (scoredCheckbox.checked) {
        players[currentPlayerIndex].scores[currentHole - 1] = currentAttempts[currentPlayerIndex];
    } else {
        currentAttempts[currentPlayerIndex]++;
    }

    localStorage.setItem('players', JSON.stringify(players));
    
    // Update the Next Player button text based on the game state
    updateNextPlayerButtonText();

    function updateNextPlayerButtonText() {
        const nextPlayerButton = document.getElementById('nextPlayerButton'); // Replace with the actual ID of your Next Player button
        
        // Check if the current hole is the last one and all players have scored
        if (currentHole >= holes && players.every((player) => player.scores[currentHole - 1] != null)) {
            nextPlayerButton.textContent = 'Zobrazit výsledky'; // Change the button text to 'Show Result'
        } else {
            nextPlayerButton.textContent = 'Nasledovný hráč'; // Otherwise, set it back to 'Next Player'
        }
    }
    // Check if all players have finished the hole
    if (players.every((player, index) => player.scores[currentHole - 1] != null)) {
        if (currentHole >= holes) {
            endGame();
            return;
        } else {
            showIntermediateScreen();
            return;
        }
    }

    // Switch to the next player
    do {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    } while (players[currentPlayerIndex].scores[currentHole - 1] != null); // Skip players who have finished the hole

    showPlayerScreen();
}

// Add an event listener to the scored checkbox to update the score and the Next Player button text when checked
document.getElementById('scored').addEventListener('change', function() {
    if (this.checked) {
        players[currentPlayerIndex].scores[currentHole - 1] = currentAttempts[currentPlayerIndex];
        localStorage.setItem('players', JSON.stringify(players));
        
        // Update the Next Player button text based on the game state
        updateNextPlayerButtonText();
    }
});

function showIntermediateScreen() {
    if (currentHole >= holes) return; // Do not show intermediate screen after the last hole
    
    document.getElementById('playerScreen').style.display = 'none';
    document.getElementById('intermediateScreen').style.display = 'block';
    document.getElementById('intermediateTitle').textContent = `Skóre po  ${currentHole} ${currentHole > 1 ? 'jamkách' : 'jamke'}`;
    
    const intermediateScores = document.getElementById('intermediateScores');
    intermediateScores.innerHTML = '';
    
    // Sort players by their scores in ascending order
    const sortedPlayers = [...players].sort((a, b) => {
        const totalScoreA = a.scores.reduce((acc, score) => acc + score, 0);
        const totalScoreB = b.scores.reduce((acc, score) => acc + score, 0);
        return totalScoreA - totalScoreB;
    });
    
    sortedPlayers.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name}: ${player.scores.reduce((acc, score) => acc + score, 0)}`;
        intermediateScores.appendChild(li);
    });
    
    // Update the button text on the last hole
    document.getElementById('continueButton').textContent = currentHole < holes ? 'Nasledovna jamka' : 'Zobrazit výsledky';
}

function continueGame() {
    currentHole++;
    localStorage.setItem('currentHole', JSON.stringify(currentHole));
    currentAttempts.fill(1); // Reset the attempt counts for the next hole
    
    if (currentHole > holes) {
        endGame();
        return;
    }
    
    document.getElementById('intermediateScreen').style.display = 'none';
    document.getElementById('playerScreen').style.display = 'block';
    showPlayerScreen();
}

function endGame() {
    document.getElementById('playerScreen').style.display = 'none';
    document.getElementById('finalScorePage').style.display = 'block';
    const podiumDiv = document.getElementById('podium');
    podiumDiv.innerHTML = '';
    const sortedPlayers = [...players].sort((a, b) => {
        const totalScoreA = a.scores.reduce((acc, score) => acc + score, 0);
        const totalScoreB = b.scores.reduce((acc, score) => acc + score, 0);
        return totalScoreA - totalScoreB;
    });
    sortedPlayers.forEach((player, index) => {
        const totalScore = player.scores.reduce((acc, score) => acc + score, 0);
        const div = document.createElement('div');
        div.className = 'podium-item ' +
            (index === 0 ? 'first' :
                index === 1 ? 'second' :
                    index === 2 ? 'third' :
                        index === 3 ? 'fourth' : 'fifth');
        div.setAttribute('data-rank', index + 1);
        div.innerHTML = `${player.name}:<br><span> ${totalScore}</span>`;
        podiumDiv.appendChild(div);
    });
}

function showSettings() {
    document.getElementById('settingsPage').style.display = 'block';
    document.getElementById('playerScreen').style.display = 'none';
    document.getElementById('finalScorePage').style.display = 'none';
    document.getElementById('setup').style.display = 'none';
}
function back() {
    document.getElementById('settingsPage').style.display = 'none';
    document.getElementById('playerScreen').style.display = 'block';
}
function begin(){ 
    document.getElementById('setup').style.display = 'block';
    document.getElementById('splash').style.display = 'none';
}

function resetGame() {
    localStorage.clear();
    document.getElementById('settingsPage').style.display = 'none';
    document.getElementById('setup').style.display = 'block';
    document.getElementById('playerNames').innerHTML = '';
}


// Function to show the settings screen
function showSettings() {
    document.getElementById('settingsPage').style.display = 'block';
    document.getElementById('playerScreen').style.display = 'none';
    document.getElementById('finalScorePage').style.display = 'none';
    document.getElementById('setup').style.display = 'none';
    document.getElementById('intermediateScreen').style.display = 'none'; // Hide intermediate screen if visible
}

// Function to restart the session
function restartSession() {
    players.forEach(player => player.scores = []); // Reset scores for all players
    currentHole = 1; // Reset the current hole to 1
    currentPlayerIndex = 0; // Reset the current player index to 0
    currentAttempts.fill(1); // Reset the current attempts for all players to 1
    localStorage.setItem('players', JSON.stringify(players)); // Update the players in local storage
    localStorage.setItem('currentHole', JSON.stringify(currentHole)); // Update the current hole in local storage
    document.getElementById('settingsPage').style.display = 'none';
    document.getElementById('playerScreen').style.display = 'block';
    showPlayerScreen();
}

// Function to restart the current hole
function restartHole() {
    players.forEach(player => player.scores[currentHole - 1] = undefined); // Reset the score for the current hole for all players
    currentPlayerIndex = 0; // Reset the current player index to 0
    currentAttempts.fill(1); // Reset the current attempts for all players to 1
    document.getElementById('settingsPage').style.display = 'none';
    document.getElementById('playerScreen').style.display = 'block';
    showPlayerScreen();
}


