

let formatDate = ()=>{
    let now = new Date()
    let year = now.getFullYear()
    let month = '' + now.getMonth() + 1
    let day = '' + now.getDate()

    if(day.length < 2){
        day = '0' + day
    }

    return [year, month, day].join('-')


}
console.log(formatDate());
fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur.json').then(response => response.json()).then(data => {
    document.getElementById('rsd').textContent = `1 EUR = ${data.eur.rsd} RSD`;
    document.getElementById('czk').textContent = `1 EUR = ${data.eur.czk} CZK`
    window.rates = data.eur; // storing data for later use
})

let convertEurRsd = function(){
    let amount = document.getElementById('amount-eur').value
    if(amount && window.rates.rsd){
        let convertedRsd = amount * window.rates.rsd
        document.getElementById('converted-money-fr-eur').textContent = `${(convertedRsd).toFixed(2)} RSD`
    }else{
        document.getElementById('converted-money-fr-eur').textContent = `Enter amount of eur to convert`
    }
}
let convertEurCzk = function(){
    let amount = document.getElementById('amount-eur').value
    if(amount && window.rates.czk){
        let convertedCzk = amount * window.rates.czk
        document.getElementById('converted-money-fr-eur').textContent = `${(convertedCzk).toFixed(2)} CZK`

    }else{
        document.getElementById('converted-money-fr-eur').textContent = `Enter amount of eur to convert`
}
}
let convertRsdEur = function(){
    let amount = document.getElementById('amount-rsd').value
    if(amount && window.rates.rsd){
        let convertedRsd = amount / window.rates.rsd
        document.getElementById('converted-money-fr-rsd').textContent = `${(convertedRsd).toFixed(2)} EUR`

    }else{
        document.getElementById('converted-money-fr-rsd').textContent = `Enter amount of RSD to convert`
}
}
let convertRsdCzk = function(){
    let amount = document.getElementById('amount-rsd').value
    if(amount && window.rates.czk){
        let convertedCzk = (amount / window.rates.rsd) * window.rates.czk
        document.getElementById('converted-money-fr-rsd').textContent = `${(convertedCzk).toFixed(2)} CZK`

    }else{
        document.getElementById('converted-money-fr-rsd').textContent = `Enter amount of RSD to convert`
}
}
let convertCzkEur = function(){
    let amount = document.getElementById('amount-czk').value
    if(amount && window.rates.czk){
        let convertedCzk = amount / window.rates.czk
        document.getElementById('converted-money-fr-czk').textContent = `${(convertedCzk).toFixed(2)} EUR`

    }else{
        document.getElementById('converted-money-fr-czk').textContent = `Enter amount of CZK to convert`
}
}
let convertCzkRsd = function(){
    let amount = document.getElementById('amount-czk').value
    if(amount && window.rates.rsd){
        let convertedCzk = amount * (window.rates.eur / window.rates.czk) / (window.rates.eur / window.rates.rsd)
        document.getElementById('converted-money-fr-czk').textContent = `${(convertedCzk).toFixed(2)} RSD`

    }else{
        document.getElementById('converted-money-fr-czk').textContent = `Enter amount of CZK to convert`
}
}