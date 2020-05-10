/////// MAIN ///////////////////////////////////////////////////////////////////////////////////////////////////
const FPS = 60;
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;
const GRID_SIZE = 32;
const BACKGROUND_COLOR = '#ffffff';
const GRID_COLOR = '#e6e6e6';

var player = {
        x: 10,
        y: 10,
        body: [] //array vetor x, y
}

function addBodyFold(x, y) {
    // add new point for line break (fold for direction)
    player.body.push({x, y});
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getArrowKeyDirection (keyCode) {
    return {
      37: 'left',
      39: 'right',
      38: 'up',
      40: 'down'
    }[keyCode];
}

function keyUpdate() {

    document.addEventListener('keydown', function (event) {
    var direction,
        keyCode = event.keyCode;
    direction = getArrowKeyDirection(keyCode);
    console.log(direction);
    if (direction != player1.dir) {
        player1.oldDir = player1.dir;
        player1.dir = direction;
    }    
        
    });
}

function moveDir(obj) {
    if (obj.dir == "up") {
        obj.y -= GRID_SIZE;
    } else if (obj.dir == "down") {
        obj.y += GRID_SIZE;
    } else if (obj.dir == "left") {
        obj.x -= GRID_SIZE;
    } else if (obj.dir == "right") {
        obj.x += GRID_SIZE;
    }
    // player1.x += GRID_SIZE;
    // player1.y += GRID_SIZE;
}


function moveSnake(player) {
    moveDir(player);
}

function drawSnake(player) {

}

function draw() {
    // clear buffer
    b.fillStyle = BACKGROUND_COLOR;
    b.fillRect (0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
    

    b.lineWidth = 1;
    // draw grid
    for (let i = 0; i <= CANVAS_WIDTH / GRID_SIZE; i++) {
        for (let j = 0; j <= CANVAS_HEIGHT / GRID_SIZE; j++) {
            b.strokeStyle = GRID_COLOR;
            b.strokeRect(i*GRID_SIZE, j*GRID_SIZE, i*GRID_SIZE+GRID_SIZE, j*GRID_SIZE+GRID_SIZE);
        }
    }

    //drawSnake(player1);

    // draw in canvas
    c.drawImage(buffer, 0, 0);
}

function update() {
    keyUpdate();
    //moveSnake(player1);
    draw();
}


// canvas DOM
var c = document.getElementById('appcanvas').getContext('2d', { alpha: false });

// buffer canvas
var buffer = document.createElement('canvas');
buffer.width = CANVAS_WIDTH;
buffer.height = CANVAS_HEIGHT;

var b = buffer.getContext('2d', { alpha: false });
setInterval(update, 1000 / FPS);