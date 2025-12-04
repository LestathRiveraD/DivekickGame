import Player from "./Player.js";
import EffectBresenhamCircle from "./EffectBresenhamCircle.js";
import UI from "./UI.js";

const canvas = document.getElementById("gameplay");
const ctx = canvas.getContext("2d");

const player1 = new Player(100, 400, "red", ["a", "d", "w", "s"], canvas);
const player2 = new Player(900,400, "blue", ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"], canvas);

player1.oponent = player2;
player2.oponent = player1;

let gamespeed = 60

let bg = new Image();
bg.src = "./imgs/bgsf2.gif";

bg.onload = () => {
    console.log("Background image loaded");
}

let score = [0,0];

let music = new Audio("./sfx/bgMusic.mp3");
music.loop = true;
music.volume = 0.5;



document.addEventListener("keydown", (e) => {
    console.log(e.keyCode);
    if(controller[e.keyCode]){
        controller[e.keyCode].pressed = true
    }
})
document.addEventListener("keyup", (e) => {
    if(controller[e.keyCode]){
        if ((e.keyCode === 65 || e.keyCode === 68)&& player1.state !== "kicking" && player1.state !== "dead") {
        player1.velocity[0] = 0;
    }
        if ((e.keyCode === 37 || e.keyCode === 39)&& player2.state !== "kicking" && player2.state !== "dead") {
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
    // a and d for player 1, left and right arrows for player 2
    // w for player 1 jump, up arrow for player 2 jump
    // s and down arrows for kick
    65: {pressed: false, func: player1.moveLeft},
    68: {pressed: false, func: player1.moveRight},
    87: {pressed: false, func: player1.jump},
    83: {pressed: false, func: player1.kick},
    37: {pressed: false, func: player2.moveLeft},
    39: {pressed: false, func: player2.moveRight},
    38: {pressed: false, func: player2.jump},
    40: {pressed: false, func: player2.kick},
}

const hitEffectCircle = new EffectBresenhamCircle(400, 300, 10, "green", ctx, 10);
const ui = new UI(ctx, canvas);

document.getElementById("playButton").addEventListener("click", () => {
    music.play();
});

function step() {
    //console.log("Step executed");
    executeMoves();
    player1.move();
    player2.move();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (bg.complete) ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    //if either player is dead, draw hit effect
    if (player1.state === "dead" || player2.state === "dead") {
        if (player1.state === "dead") {
            hitEffectCircle.x = player1.x + player1.width / 2;
            hitEffectCircle.y = player1.y + player1.height / 2;
            hitEffectCircle.color = "blue";
        } else {
            hitEffectCircle.x = player2.x + player2.width / 2;
            hitEffectCircle.y = player2.y + player2.height / 2;
            hitEffectCircle.color = "red";
        }
        hitEffectCircle.draw();
    }
    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
    ui.drawRoundStart(score);
    setTimeout(() => {
        requestAnimationFrame(step);
    }, 1000 / gamespeed);
}

requestAnimationFrame(step);

canvas.changeSpeed = (newSpeed) => {
    gamespeed = newSpeed;
    console.log("Game speed changed to: " + gamespeed);
}

canvas.reset = () => {
    if (player1.state === "dead") {
        score[1] += 1;
    } else {
        score[0] += 1;
    }


    player1.x = 100;
    player1.y = 400;
    player1.velocity = [0,0];
    player1.state = "idle";
    player1.isOnFloor = true;
    player1.color = "red";


    player2.x = 900;
    player2.y = 400;
    player2.velocity = [0,0];
    player2.state = "idle";
    player2.isOnFloor = true;
    player2.color = "blue";

    hitEffectCircle.radius = 10;
    
}