//Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';

//Mouse interactivity
//set up coordinate system where origin is bound in the rectangle
let canvasPosition = canvas.getBoundingClientRect();


console.log(canvasPosition);
//initial setup of mouse location. this is reason why ball move to initial location in the beginning.
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false 
}

canvas.addEventListener('mousedown', function(event) {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});

canvas.addEventListener('mouseup', function() {
    mouse.click = false;
})



// Player
const playerLeft = new Image();
playerLeft.src = 'fish.png'
const playerRight = new Image();
playerRight.src = 'fish-flip.png'   

class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 30;
        this.spriteHeight = 30;
    }
    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        if (mouse.x != this.x) {
            this.x -= dx/30;
        }
        if (mouse.y != this.y) {
            this.y -= dy/30;
        }
    }
    draw() {
        if (mouse.click) {
            ctx.linewidth = 0.1;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(this.x, this.y, this.radius, 10)

        //ctw.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 50, this.y - 50, this.spriteWidth, this.spriteHeight);
    }
}

const player = new Player();



// Bubbles
const bubblesArray = [];
class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance ;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }

    update() {
        this.y -= this.speed;
        const dx = this.x - player.x; 
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }
}

//create sound
const bubblePop1 = document.createElement('audio');
bubblePop1.src = 'Plop.ogg';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = 'bubbles-single2.wav';

//draw, pop, add sound to the bubble 
function handleBubbles() {
    if (gameFrame % 70 == 0) {
        bubblesArray.push(new Bubble());

    }
    for (let i=0; i < bubblesArray.length; i++) {
        bubblesArray[i].update();
        bubblesArray[i].draw();
        
    }
    for (let i = 0; i < bubblesArray.length; i++) {
        if (bubblesArray[i].y < 0 - this.radius * 2) {
            bubblesArray.splice(i, 1);
        }
        if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
            if (!bubblesArray[i].counted) {
                if (bubblesArray[i].sound == 'sound1') {
                    bubblePop1.play();
                } else {
                    bubblePop2.play();
                }
                score++
                bubblesArray[i].counted = true;
                bubblesArray.splice(i, 1);
            }
    
        }
    }
}


// Animation loop

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBubbles();
    player.update();
    player.draw();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;
    // console.log(gameFrame);
    requestAnimationFrame(animate);
}

animate()
