import { mines } from "./app.js";
// Function to generate an array of x random numbers between 1 and 25
export function generateRandomNumbers() {
    const randomNumbers = [];
    for (let i = 0; i < mines; i++) {
        // Generate a random number between 1 and 25
        const randomNumber = Math.floor(Math.random() * 25) + 1;
        // Check if the random number is already in the array and redraw if it is
        if(randomNumbers.includes(randomNumber)) {
            i--;
            console.log(randomNumber, "redraw");
            continue;
        }
        randomNumbers.push(randomNumber);
    }
    return randomNumbers;
}