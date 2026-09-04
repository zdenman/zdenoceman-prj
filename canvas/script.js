// Defining canvas
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 
const particleArray = []
let hue = 0

// add dimension to our canvas every time we resize a brower
window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; 
    

})

// Object inside which we store our mouse cordinates from event
const mouse = {
    x: undefined,
    y: undefined
}
// add event listener to mouse click which get cordinates and call drawCircle funtion
canvas.addEventListener('click', function(event){
    mouse.x = event.x
    mouse.y = event.y
    for(let i = 0; i < 10; i++){
        particleArray.push(new Particle())
    }
    
})
// add event listener to mouse move to draw circle on mouse move
canvas.addEventListener('mousemove', function(){
    mouse.x = event.x
    mouse.y = event.y
    for(let i = 0; i < 5; i++){
        particleArray.push(new Particle())
    }
})
// Defining our cicrcle function on canvas
// function drawCircle(){
//     ctx.fillStyle = 'red';
//     ctx.strokeStyle = 'red';
//     ctx.beginPath();
//     ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
//     ctx.stroke()
// }

class Particle {
    constructor(){
        this.x = mouse.x
        this.y = mouse.y
        // this.x = Math.random() * canvas.width
        // this.y = Math.random() * canvas.height
        this.size = Math.random() * 10 + 1
        this.speedX = Math.random() * 3 - 1.51
        this.speedY = Math.random() * 3 - 1.51
        this.color = `hsl(` + hue + `, 100%, 50%)`;
    }
    // build in js method update()
    update(){
        this.x += this.speedX
        this.y += this.speedY
        if(this.size > 0.2) this.size -= 0.1;
    }
    draw(){
        ctx.fillStyle = this.color;
        // ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // ctx.stroke() 
        ctx.fill()
    }
}

// function particleInit(){
//     for(let i = 0; i < 100; i++){
//         particleArray.push(new Particle())
//     }
// }
// particleInit()
console.log(particleArray);

function handleParticles(){
    for(let i = 0; i < particleArray.length; i++){
        particleArray[i].update()
        particleArray[i].draw()
        
        for(let j = i; j < particleArray.length; j++ ){
            const dx = particleArray[i].x - particleArray[j].x
            const dy = particleArray[i].y - particleArray[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if(distance < 100){
                ctx.beginPath();
                ctx.strokeStyle = particleArray[i].color;
                ctx.moveTo(particleArray[i].x, particleArray[i].y);
                ctx.lineTo(particleArray[j].x, particleArray[j].y);
                ctx.stroke();
            }
        }
        if(particleArray[i].size <= 0.3){
            particleArray.splice(i, 1)
            i--
        }
    }
}
// we create function animate and and call it with requestAnimationFrame() inside animate function. This way we create loop. With clearRect() we clear whole canvas and while uncomented will draw only circle in 1 frame deleting the rest..
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height)
    handleParticles()
    hue++
    requestAnimationFrame(animate)
    
}
animate()
