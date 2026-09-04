import { getRandomColor } from "./app.js";
export class User {
    static lastId = 0;
    constructor(name){
        User.lastId += 1
        this.id = User.lastId
        this.name = name
        this.valet = []
        this.balance = []
        this.color = getRandomColor();
    }
    addMoney(money){
        this.valet.push(money)
    }
    showValet(){
        return this.valet.reduce((acc, i)=>acc + i,0)
    }
    displayValet(){

    }
    
}