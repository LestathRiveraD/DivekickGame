const canvas = document.getElementById("gameplay");
const ctx = canvas.getContext("2d");

class Player {
    constructor(x, y, color, controls) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 100;
        this.color = color;
        this.controls = controls;
    }

    velocity = [0, 0];

    state = "idle";
    isOnFloor = true;
    jumpStrength = -15;

    moveLeft = () => {
        this.velocity[0] = -5;
    }
    moveRight = () => {
        this.velocity[0] = 5;
    }

    jump = () => {
        if (!this.isOnFloor) return;
        this.velocity[1] = this.jumpStrength;
        this.isOnFloor = false;
    }

    move() {
        //clamp values for velocity
        this.velocity[0] = Math.max(Math.min(this.velocity[0], 5), -5);
        this.velocity[1] = Math.max(Math.min(this.velocity[1], 10), this.jumpStrength);

        //clamp position to floor and walls
        if (this.y + this.height + this.velocity[1] + 100 > canvas.height) {
            this.y = canvas.height - this.height - 100;
            this.velocity[1] = 0;
            this.isOnFloor = true;
        }
        if (this.x + this.velocity[0] < 0) {
            this.x = 0;
            this.velocity[0] = 0;
        }
        if (this.x + this.width + this.velocity[0] > canvas.width) {
            this.x = canvas.width - this.width;
            this.velocity[0] = 0;
        }
        this.x += this.velocity[0];
        this.velocity[1] += 0.5; // gravity
        this.y += this.velocity[1];
    }


}


const player1 = new Player(100, 400, "red", ["a", "d", "w", "s"]);
const player2 = new Player(1000,400, "blue", ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);

document.addEventListener("keydown", (e) => {
    console.log(e.keyCode);
    if(controller[e.keyCode]){
        controller[e.keyCode].pressed = true
    }
})
document.addEventListener("keyup", (e) => {
    if(controller[e.keyCode]){
        if (e.keyCode === 65 || e.keyCode === 68) {
        player1.velocity[0] = 0;
    }
        if (e.keyCode === 37 || e.keyCode === 39) {
        player2.velocity[0] = 0;
    }
        controller[e.keyCode].pressed = false
    }
})

const executeMoves = () => {
    Object.keys(controller).forEach(key=> {
        controller[key].pressed && controller[key].func()
    })
}

const controller = {
    // and d for player 1, left and right arrows for player 2
    65: {pressed: false, func: player1.moveLeft},
    68: {pressed: false, func: player1.moveRight},
    87: {pressed: false, func: player1.jump},
    37: {pressed: false, func: player2.moveLeft},
    39: {pressed: false, func: player2.moveRight},
    38: {pressed: false, func: player2.jump},
}

function step() {
    //console.log("Step executed");
    executeMoves();
    player1.move();
    player2.move();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
    requestAnimationFrame(step);
}

requestAnimationFrame(step);