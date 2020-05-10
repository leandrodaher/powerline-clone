import * as utils from './js/utils.js';
import { Line } from './js/line.js';
import { keyboardListener } from './js/keyboardListener.js';


var 
    c,
    buffer,
    b,
    lin,
    pt,
    paused = false,
    startTime = 0,
    startTime = 0,
    lastTime = 0,
    elapsedTime = 0,
    fps = 0,
    lastFpsUpdate = { time: 0, value: 0 },
    keyboard;

function calculateFps(now) {
    elapsedTime = now - lastTime;
    fps = 1000 / elapsedTime;
    lastTime = now;
 }
 
 function updateFps(time) {
    //var now = Date.now();
    var now = time;

    calculateFps(now);
    
    /*if (now - startTime < 2000) {
       return;
    }*/
 
    //if (now - lastFpsUpdate.time > 1000) {
       lastFpsUpdate.time = now;
       lastFpsUpdate.value = fps;
    //}
 }

function update(time) {
    if (time === undefined) {
        time = Date.now();
    }
    
    if (!paused) {
        lin.update(elapsedTime);
    }
    draw();
    
    updateFps(time);
    window.requestAnimationFrame(update);
}

function draw() {
    // clear buffer
    b.fillStyle = '#17151c';
    b.fillRect (0,0,utils.CANVAS_WIDTH, utils.CANVAS_HEIGHT);
    

    lin.draw(b);

    b.fillStyle = 'cornflowerblue';
    b.font = "15px Verdana";
    b.fillText(lastFpsUpdate.value.toFixed() + ' fps', 10, 20);

    // draw in canvas
    c.drawImage(buffer, 0, 0);
}

// canvas DOM
c = document.getElementById('game').getContext('2d'/*, { alpha: false }*/);
// buffer canvas
buffer = document.createElement('canvas');
buffer.width = utils.CANVAS_WIDTH;
buffer.height = utils.CANVAS_HEIGHT;
b = buffer.getContext('2d'/*, { alpha: false }*/);
//setInterval(update, 1000 / FPS);

lin = new Line('teste1');
//pt = [{x: 300,y: 50}, {x: 300,y: 100}, {x: 300,y: 300, n: "teste2"}, {x: 200,y: 300, n: "teste1"}, {x: 200,y: 400}];
//lin.points = pt;
keyboard = new keyboardListener();
keyboard.registerPlayerId(lin._id);
// https://developer.mozilla.org/pt-BR/docs/Web/API/Element/addEventListener
keyboard.subscribe(lin.keyProcess.bind(lin));

utils.buildLegacyRequestAnimationFrame();
startTime = Date.now();
window.requestAnimationFrame(update);