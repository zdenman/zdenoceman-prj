

$(document).ready(function(){
  let day = 1
  let counter = 0
  let population = 0

  let wood = 0
  let stone = 0
  let gold = 0
  let coal = 0

  let woodPrice = 15
  let stonePrice = 1.5
  let coalPrice = 2.5

  let stoneMinePrice = 200
  let coalMakerPrice = 300

  let stonePlus = 1
  let woodPlus = 1
  let coalPlus = 1

  let autoStonePlus = 0
  let autoWoodPlus = 0
  let autoCoalPlus = 0

  let autoStonePrice = 50
  let autoWoodPrice = 50
  let autoCoalPrice = 50
  
  let autoChopperActivatedTime
  let autoChopperExpirationTime = 5 * 60 * 1000 // 5 minutes in milliseconds
  let autoStoneMinerActivatedTime
  let autoStoneMinerExpirationTime = 5 * 60 * 1000 // 5 minutes in milliseconds
  let autoCoalMakerActivatedTime
  let autoCoalMakerExpirationTime = 10 * 60 * 1000 // 10 minutes in milliseconds

  let coalMakerUpgradeCost = 100
  let coalMakerLvl = 1
  let coalMakerProduction = 1

  // Prototype of new resource
const iron = {
  output: {
    unit: 1,
    level: 1
  },
  req: {
    cost: 100,
    workers: 4,
    coal: 2,
    ironOre: 1,
    upgradeCost: 50
  }
}
console.log(iron);

updateMarket()

// day night cycle
setInterval(() => {
  counter++
  if (counter % 2 === 0) {
    document.body.style.background = "#ffe4c4" // white for day
  } else {
    document.body.style.background = "#ffe4c4" // black for night
  }
  if (counter === 2) {
    counter = 0
    day++
  }
}, 2 * 60 * 1000) // 10 minutes in milliseconds

setInterval(() => {
  $("#day").html(`Day: ${day}`)
  population = population + Math.floor(Math.random() * 10) 
  $("#population").html(`Population: ${population}`)
  console.log(population);
}, 2 * 60 * 1000) // 10 minutes in milliseconds

// auto resources gatherer --------------------------------------
// WOOD

  setInterval(() => {
    let percentage = 100;
    if (autoWoodPlus > 0 && autoChopperActivatedTime && Date.now() - autoChopperActivatedTime > autoChopperExpirationTime) {
    autoWoodPlus = 0
    alert("Auto chopper has expired")
    } else if (autoWoodPlus > 0 && autoChopperActivatedTime) {
    let timeLeft = (autoChopperExpirationTime - (Date.now() - autoChopperActivatedTime)) / 1000;
    percentage = (timeLeft / (autoChopperExpirationTime / 1000)) * 100;
    // $("#auto-chopper-timer").html(`Timer: ${percentage.toFixed(0)}%`)
    
    }
    let progressBar = document.getElementById("auto-chopper-timer")
      function updateProgressBar(progress){
        progressBar.style.width = progress + "%";
      }
    wood += autoWoodPlus
    $(".wood-lvl").html(`Level: ${autoWoodPlus}`)
    updateresources()
    updateMarket()
    updateProgressBar(percentage)
    console.log(percentage)
    }, 2000);

  // STONE
  setInterval(() => {
    let percentage = 100
    if (autoStonePlus > 0 && autoStoneMinerActivatedTime && Date.now() - autoStoneMinerActivatedTime > autoStoneMinerExpirationTime) {
    autoStonePlus = 0
    alert("Auto stone miner has expired")
    } else if (autoStonePlus > 0 && autoStoneMinerActivatedTime) {
    let timeLeft = (autoStoneMinerExpirationTime - (Date.now() - autoStoneMinerActivatedTime)) / 1000;
    percentage = (timeLeft / (autoStoneMinerExpirationTime / 1000)) * 100;
    // $("#auto-stone-timer").html(`Timer: ${percentage.toFixed(0)}%`)
    }
    let progressBar = document.getElementById("auto-stone-timer")
      function updateProgressBar(progress){
        progressBar.style.width = progress + "%";
      }
    stone += autoStonePlus
    $(".stone-lvl").html(`Level: ${autoStonePlus}`)
    updateresources()
    updateMarket()
    updateProgressBar(percentage)
    }, 2000);

  // COAL
  setInterval(() => {
    let percentage = 100
    if (autoCoalPlus > 0 && autoCoalMakerActivatedTime && Date.now() - autoCoalMakerActivatedTime > autoCoalMakerExpirationTime) {
    autoCoalPlus = 0
    alert("Auto coal miner has expired")
    } else if (autoCoalPlus > 0 && autoCoalMakerActivatedTime) {
    let timeLeft = (autoCoalMakerExpirationTime - (Date.now() - autoCoalMakerActivatedTime)) / 1000;
    percentage = (timeLeft / (autoCoalMakerExpirationTime / 1000)) * 100;
    // $("#auto-coal-timer").html(`Timer: ${percentage.toFixed(0)}%`)
    }
    let progressBar = document.getElementById("auto-coal-timer")
      function updateProgressBar(progress){
        progressBar.style.width = progress + "%";
      }
    wood -= autoCoalPlus * 2
    coal += autoCoalPlus
    $(".coal-lvl").html(`Level: ${autoCoalPlus}`)
    updateresources()
    updateMarket()
    updateProgressBar(percentage)
    }, 4000);
  

  // Gathering --------------------------------------------
  $("#chop-wood").click(function(){
    wood += woodPlus
    
    updateresources()
    updateMarket()
  })

  $("#mine-stone").click(function(){
    stone += stonePlus
    
    updateresources()
    updateMarket()
  })
  
  $("#coal-maker").click(() => {
  if (wood >= 2) {
    wood -= 2
    coal += coalPlus
    updateresources()
    updateMarket()
  } else {
    alert("Not enough resources")
  }
})
// upgrade coal maker
$("#auto-coalMaker").click(() => {
  if (gold >= coalMakerUpgradeCost) {
    gold -= coalMakerUpgradeCost
    autoCoalPlus++
    autoCoalMakerActivatedTime = Date.now()
    updateresources()
    updateMarket()
  } else {
    alert("Not enough resources")
  }
})

  $("#auto-chopper").click(function () {
    gold -= autoWoodPrice
    autoWoodPlus++
    autoChopperActivatedTime = Date.now()
    updateresources()
    updateMarket()
  })

  $("#auto-stoneMiner").click(function () {
    gold -= autoStonePrice
    autoStonePlus++
    autoStoneMinerActivatedTime = Date.now()
    updateresources()
    updateMarket()
  })


// Resources panel ---------------------------------------
  function updateresources(){
    $("#wood").html(`Wood: ${wood}`)
    $("#gold").html(`Gold: ${gold}`)
    $("#stone").html(`Stone: ${stone}`)
    $("#coal").html(`Coal: ${coal}`)
    
  }

 
// Marketplace -------------------------------------------
  // $(".marketplace").click(function(){
  //   $(".marketplace-container").toggle("hidden")
  // })
  // document.querySelector(".marketplace").addEventListener('click', function(){
  //   document.querySelector(".marketplace-container").classList.toggle("hidden")
  // })
function updateMarket(){
  // market sell buttons
  // coal
  if(coal >= 1){
    $(".coal-container").css("display", "flex")
  }else{
    $(".coal-container").css("display", "none")
  }
  // Sell 10 buttons
  if(wood >= 10){
    $("#sell10").css("display", "block")
  }else{
    $("#sell10").css("display", "none")
  }

  if(stone >= 10){
    $("#sellStone10").css("display", "block")
  }else{
    $("#sellStone10").css("display", "none")
  }

  if(coal >= 10){
    $("#sellCoal10").css("display", "block")
  }else{
    $("#sellCoal10").css("display", "none")
  }

  // Autogatherer upgrades
  if(gold >= autoWoodPrice){
    $("#auto-chopper").css("display", "block")
  }else{
    $("#auto-chopper").css("display", "none")
  }

  if(gold >= autoStonePrice){
    $("#auto-stoneMiner").css("display", "block")
  }else{
    $("#auto-stoneMiner").css("display", "none")
  }

  if(gold >= autoCoalPrice){
    $("#auto-coalMaker").css("display", "block")
  }else{
    $("#auto-coalMaker").css("display", "none")
  }

// build buttons
  if(gold >= stoneMinePrice){
    $("#buy-stoneMine").css("display", "block")
  }else{
    $("#buy-stoneMine").css("display", "none")
  }

  if(gold >= coalMakerPrice){
    $("#buy-coalMaker").css("display", "block")
  }else{
    $("#buy-coalMaker").css("display", "none")
  }

  // if($("#mine-stone").css("display", "block")){
  //   $("#buy-stoneMine").css("display", "none")
  // }


}
  // sell wood
  $("#sell1").click(function(){
    sellWood(1)
  })

  $("#sell10").click(function(){
    sellWood(10)
  })

  $("#sellAll").click(function(){
    sellWood(wood)
  })

  function sellWood(amount){
    if(wood > 0){
      gold = gold + woodPrice * amount
      wood = wood - amount
    }else{
      alert('you dont have minimum of 10 wood')
      
    }
    updateresources()
    updateMarket()
  }

   // sell stone
   $("#sellStone1").click(function(){
    sellStone(1)
  })

  $("#sellStone10").click(function(){
    sellStone(10)
  })

  $("#sellStoneAll").click(function(){
    sellStone(stone)
  })

  function sellStone(amount){
    if(stone > 0){
      gold = gold + stonePrice * amount
      stone = stone - amount
    }else{
      alert('you dont have minimum of 1 stone')
      
    }
    updateresources()
    updateMarket()
  }

  // sell coal
  $("#sellCoal1").click(function(){
    sellCoal(1)
  })

  $("#sellCoal10").click(function(){
    sellCoal(10)
  })

  $("#sellCoalAll").click(function(){
    sellCoal(coal)
  })

  function sellCoal(amount){
    if(coal > 0){
      gold = gold + coalPrice * amount
      coal = coal - amount
    }else{
      alert('you dont have minimum of 1 coal')
      
    }
    updateresources()
    updateMarket()
  }

  // Build ----------------------------------------------------
  // Stone mine
  $("#buy-stoneMine").click(function(){
    $("#mine-stone").css("display", "block")
      gold = gold - stoneMinePrice 
      updateresources()
      updateMarket()    
  })

  $("#buy-coalMaker").click(function(){
    $("#coal-maker").css("display", "block")
      gold = gold - coalMakerPrice 
      updateresources()
      updateMarket()    
  })

  // end ------------------------------------------------------------
})



