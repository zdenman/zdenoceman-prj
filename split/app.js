import {User} from "./user.js"

let expenses = [];
let userBase = [];
let transactions = [];
let shareAmout;
let splitBtn = document.getElementById('split')



const addExpense = amount => expenses.push(amount);

const showTotalExpences = () => {
    return expenses.reduce((acc, i) => acc + i, 0)
}
// Button click trigger create new user function
document.addEventListener('DOMContentLoaded', () => {
document.getElementById('registerBtn').addEventListener('click', createUser);
});
// Create new users from input form and push them to the userbase array
let createUser = () => {
    let userName = document.getElementById('username').value
    if(userName){
        let newUser = new User(userName)
        userBase.push(newUser)
        console.log(userBase);
        createUserBlock(newUser)
        document.getElementById('username').value = ''
        document.getElementById('message').textContent = 'User created'
        clearResults();
        updateChartWithUserData(userBase)

        // Show message and start fade-out
        let messageElement = document.getElementById('message');
        messageElement.textContent = 'User created';
        messageElement.style.opacity = 1; // Reset opacity to 1 to show the message
        // Fade out message after 3 seconds
        setTimeout(() => {
            messageElement.style.opacity = 0;
        }, 1000);
        let splitBtnElement = document.getElementById('split')
        if(newUser.id === 2){
            splitBtnElement.style.opacity = 1;
        }
    }else{
        document.getElementById('message').textContent = 'Please enter username'
    }
}

function addMoneyToValet(userId, inputId){
    let amount = parseFloat(document.getElementById(inputId).value);
    if(isNaN(amount) || amount <= 0){
        alert("Please enter valid amount.")
        return;
    }
    let user = userBase.find(user => user.id === userId);
    if(user){
        user.addMoney(amount);
        expenses.push(amount);
        document.getElementById('total-expenses').textContent = `Total expenses: ${showTotalExpences()} 💰`
        document.getElementById(`valet-${userId}`).textContent = `Wallet 💵: ${user.valet.join(', ')}`
        updateChartWithUserData(userBase)
    }else{
        alert('user not found')
    }
}
// This adds functionality to create each user visual block with all data
function createUserBlock(newUser){
    let userContainer = document.getElementById('user-container')
    let userDiv = document.createElement('div');
        userDiv.className = 'user-block';
        userDiv.id = `user-${newUser.id}`;

    let uniqueInputId = `addToValet-${newUser.id}`
    let uniqueButtonId = `addMoneyButton-${newUser.id}`
    let uniqueRectangleId = `rectangle-${newUser.id}`
    

    userDiv.innerHTML = `
        <div class="user-name"><div id="${uniqueRectangleId}" style="width: 40px; height: 12px;"></div><h3>${newUser.name}</h3></div><input type="number" id="${uniqueInputId}" class="addToValedInput" placeholder="Add value"><button id="${uniqueButtonId}" class="addBtn">Add</button>
        <p class="user-valet" id="valet-${newUser.id}">Wallet 💵:${newUser.valet.join(', ')}</p>
        `
        
    userContainer.appendChild(userDiv);
// Colored rectangle in the user block
    let rectangle = document.getElementById(uniqueRectangleId)
    let colorString = newUser.color;
    let colorCode = colorString.replace(/'/g, ''); 
        rectangle.style.backgroundColor = `${colorCode}`
        console.log(colorCode);
    
    

     // Attach event listener to the button
     document.getElementById(uniqueButtonId).addEventListener('click', () => {
        addMoneyToValet(newUser.id, uniqueInputId);
    });
}
// Splitshre function and display result to the element
let splitShare = () => {
    let numberUsers = userBase.length
    let equalShare;
    clearResults();
    equalShare = showTotalExpences() / numberUsers
    console.log(equalShare);
    document.getElementById('equal-share').textContent = `Equal share: 💵${(equalShare.toFixed(2))}`
    userBase.forEach(user => {
            shareAmout = equalShare - user.showValet()
            // adding shareAmount to the user.balance for further calc
            if(user.balance.length > 0){
                user.balance.shift()
                user.balance.push(shareAmout)
            }else{
                user.balance.push(shareAmout)
            }
            
            // console.log(userBase);
            // console.log(user.balance);
            // console.log(transactions);
        let splitResultContainer = document.getElementById('split-result')
        let resultDiv = document.createElement('div');
            resultDiv.className = 'user-result';
            resultDiv.id = `result-${user.id}`
            
        
        if(shareAmout > 0){
            resultDiv.innerHTML = `
                <p><span>${user.name}</span> needs to add 💵${Math.abs((shareAmout).toFixed(2))}</p>
            `
            splitResultContainer.appendChild(resultDiv)
        }else{
            resultDiv.innerHTML = `
                <p><span>${user.name}</span> needs to receive 💵${Math.abs((shareAmout).toFixed(2))}</p>
            `
            splitResultContainer.appendChild(resultDiv)
        }
    })
    // Create a list where each entry represents a user's debt (negative balance) or credit (positive balance).
let balances = userBase.map(user => {
    return {
        name: user.name,
        balance: user.balance // assuming you've calculated this
    };
});
// Sort the list so that all debts (negative balances) are at the beginning and all credits (positive balances) are at the end.
balances.sort((a, b) => a.balance - b.balance);

// Iterate through the list, settling debts. For each person who owes money, find people who are owed money and settle the debt until the debtor's balance is zero.

while (balances.some(b => b.balance < 0)) {
    let debtor = balances.find(b => b.balance < 0);
    let creditor = balances.find(b => b.balance > 0);

    let amount = Math.min(-debtor.balance, creditor.balance);
    transactions.push({ from: debtor.name, to: creditor.name, amount: amount });

    debtor.balance += amount;
    creditor.balance -= amount;
}

};

splitBtn.addEventListener('click', ()=>{
    splitShare()
})

function clearResults() {
    let splitResultContainer = document.getElementById('split-result');
    if (splitResultContainer) {
        splitResultContainer.innerHTML = '';
    }
}
// Update graph function ///////////////////////////////////////////////
function updateChartWithUserData(userBase){
    // Clear existing data
    myChart.data.labels = [];
    myChart.data.datasets[0].data = [];
    myChart.data.datasets[0].backgroundColor = [];
    
    // Populate chart data with user data
    userBase.forEach(user => {
        myChart.data.labels.push(user.name)
        myChart.data.datasets[0].data.push(user.showValet());
        myChart.data.datasets[0].backgroundColor.push(user.color);
    })
    // Update the chart
    myChart.update();
}
// get random chart color
export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
const data = {
    labels: [], //usernames
    datasets: [{
        data: [], // Wallet totals
        backgroundColor: [], // Different color for each user
        borderColor: '#2d2d2d',
        color: '#ffffff',
    }]
};

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        // Additional options can be added here
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 16
                        }
                    }
                }
            }
        
    }
});
