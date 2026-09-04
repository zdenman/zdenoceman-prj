// 
document.addEventListener('DOMContentLoaded', ()=>{
    let button = document.getElementById('submit')
    let button2 = document.getElementById('submit2')

    button.addEventListener('click', ()=>{
        let package = document.getElementById('package').value //Food package in g
        let bottle = document.getElementById('feedingBottle').value //1 feeding meal portion in ml
        let interval = document.getElementById('dailyInterval').value //how many time in one day are kubko feeded
        let onePortionSpoons, onePortionMilk, dayMilk, packageLife;
        const spoon = 30 //Spoon size in capacity
        const spoonWeight = 4.3 //Spoon weight in grams
    
    // Calculating how many spoons in one portion
    onePortionSpoons = bottle / spoon
    // Calculation how many grams of raw milk in one portion
    onePortionMilk = onePortionSpoons * spoonWeight
    // One day milk in g
    dayMilk = onePortionMilk * interval
    // How many day will package last
    packageLife = package / dayMilk
    document.getElementById('result').textContent = `Balenie ${package}g bude stačiť ${(packageLife).toFixed(2)} dní.`
    console.log(package, bottle, interval);
    }) 
    // Second calculator
    button2.addEventListener('click', ()=>{
        let babyWeight = document.getElementById('babyWeight').value
        let feedPortion = document.getElementById('feedPortion').value //Feed portion from 150 to 180g on every kg dayly
        let interval = document.getElementById('interval2').value //daily feeding interval
        let dailyPortion, onePortion

        dailyPortion = feedPortion * babyWeight
        console.log(dailyPortion)
        onePortion = dailyPortion / interval
        document.getElementById('result2').textContent = `Dávka by mala byť ${(onePortion).toFixed(2)} ml`
        console.log((onePortion).toFixed(2));
    })
})


