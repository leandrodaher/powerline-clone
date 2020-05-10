/////// MAIN ///////////////////////////////////////////////////////////////////////////////////////////////////
const FPS = 60;
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;
const GRID_SIZE = 32;
const BACKGROUND_COLOR = '#0f1014';
const GRID_COLOR = '#e6e6e6';
var pause = false;

var snake = {
    x: 6*GRID_SIZE,
    y: 6*GRID_SIZE,
    size: GRID_SIZE,
    speed: 1,
    angle: 0,
    color: 'red',
    folds: [], //{x, y}
    endsnake: {
        x: 0,
        y: 6*GRID_SIZE,
        angle: 0,
        speed: 1
    },
    km: 10*GRID_SIZE
};

// canvas DOM
var c = document.getElementById('appcanvas').getContext('2d', { alpha: false });
// buffer canvas
var buffer = document.createElement('canvas');
buffer.width = CANVAS_WIDTH;
buffer.height = CANVAS_HEIGHT;
var b = buffer.getContext('2d', { alpha: false });
setInterval(update, 1000 / FPS);

////////////////////////////////////////////////////////////////////////

function getArrowKeyDirection (keyCode) {
    return {
      37: 'left',
      39: 'right',
      38: 'up',
      40: 'down',
      32: 'space'
    }[keyCode];
}

function keyUpdate() {

    document.addEventListener('keydown', function (event) {
    var direction,
        keyCode = event.keyCode;
    direction = getArrowKeyDirection(keyCode);
    //console.log(direction);
    if (direction == 'up' && snake.angle != 270) {
        snake.angle = 270;
        snake.folds.push({
            x: snake.x,
            y: snake.y
        })  
    }    
    if (direction == 'down' && snake.angle != 90) {
        snake.angle = 90;
        snake.folds.push({
            x: snake.x,
            y: snake.y
        })
    }    
    if (direction == 'left' && snake.angle != 180) {
        snake.angle = 180;
        snake.folds.push({
            x: snake.x,
            y: snake.y
        })  
    }   
    if (direction == 'right' && snake.angle != 0) {
        snake.angle = 0;
        snake.folds.push({
            x: snake.x,
            y: snake.y
        })  
    }  
    if (direction == 'space') {
        //let pausar = !pause;
        pause = !pause;
    }  

    });
}

function addPlayerChain(player) {
    var c = new Chain(0,0,"#8fbfab");
    var cl = player.chain.length;
    player.chain.push(c)
}


function moveToAngle(player) {
    player.x += player.speed * Math.cos(player.angle * Math.PI / 180);
    player.y += player.speed * Math.sin(player.angle * Math.PI / 180);
}

function moveSnake(player) {
    moveToAngle(player);
    //if (player.folds.length < 1 && Math.abs( player.endsnake.x - player.x) > player.km) {
    if ( player.folds.length < 1 
        && distanciaQuadrada(player.endsnake, player) >= player.km ) {
        player.endsnake.angle = angleBetweenPointsDegress(player.endsnake, player);
        moveToAngle(player.endsnake);
    } else if ( player.folds.length >= 1 ) {
        //console.log(player.endsnake);
        //console.log(distanciaQuadrada(player.endsnake, player.folds[0]));
        //let fid = player.folds.length - 1;
        /* o endsnake so deveria se mover se a soma do tamanho de
        todas as linhas forem igual ao snake.km (pendente implementar)*/
        if ( distanciaQuadrada(player.endsnake, player.folds[0]) > 1 /* 0 da bug */ ) {
                player.endsnake.angle = angleBetweenPointsDegress(player.endsnake, player.folds[0]);
                moveToAngle(player.endsnake);
            } else {
                player.folds.splice(0, 1);
                console.log("spliced");}
    }
}

/*function moveSnake(player) {
    moveToAngle(player);
    if (player.folds.length > 0) {
        player.endsnake.angle = angleBetweenPointsDegress(player.endsnake, player.folds[0]);
        if ( distanciaQuadrada(player.endsnake, player.folds[0]) <= 0 ) 
            player.folds.splice(0,1);
        else
            moveToAngle(player.endsnake);
        
    }
}*/

////////////////////////////////////////////////////////////////////////
function drawSnake(player) {
    //b.translate(player.x, player.y);
    //b.rotate(player.angle * Math.PI/180);

    // draw player1
    b.fillStyle = player.color;
    b.fillRect(player.x, player.y, player.size, player.size);

    // draw folds
    for (let i = 0; i < player.folds.length; i++) {
        b.fillRect(player.folds[i].x, player.folds[i].y, player.size, player.size);
        if (player.folds.length > 1 && i < player.folds.length-1) {
            b.strokeStyle = 'yellow';
            b.lineWidth = 5;
            //
            b.lineWidth = 15;
            b.lineCap = 'round';
            //
            b.beginPath();
            b.moveTo(player.folds[i].x+(player.size/2), player.folds[i].y+(player.size/2));
            b.lineTo(player.folds[i+1].x+(player.size/2), player.folds[i+1].y+(player.size/2));
            b.stroke();
        } 
    }
    
    if (player.folds.length > 0) {
        let j = player.folds.length - 1;
        b.strokeStyle = 'green';
        b.lineWidth = 5;
        b.beginPath();
        b.moveTo(player.folds[j].x+(player.size/2), player.folds[j].y+(player.size/2));
        b.lineTo(player.x+(player.size/2), player.y+(player.size/2));
        b.stroke();
    }


    // draw end-of-line
    b.fillStyle = player.color;
    b.fillRect(player.endsnake.x, player.endsnake.y, player.size, player.size);
    b.strokeStyle = 'blue';
    b.lineWidth = 5;
    b.beginPath();
    if (player.folds.length > 0) {
        let i = player.folds.length - 1;
        b.moveTo(player.endsnake.x+(player.size/2), player.endsnake.y+(player.size/2));
        b.lineTo(player.folds[0].x+(player.size/2), player.folds[0].y+(player.size/2));
    } else {
        b.moveTo(player.endsnake.x+(player.size/2), player.endsnake.y+(player.size/2));
        b.lineTo(player.x+(player.size/2), player.y+(player.size/2));
    }
    b.stroke();
}

function draw() {
    // clear buffer
    b.fillStyle = BACKGROUND_COLOR;
    b.fillRect (0,0,CANVAS_WIDTH, CANVAS_HEIGHT);

    /*
    // draw grid
    b.lineWidth = 1;
    b.strokeStyle = GRID_COLOR;
    for (let i = 0; i <= CANVAS_WIDTH / GRID_SIZE; i++) {
        for (let j = 0; j <= CANVAS_HEIGHT / GRID_SIZE; j++) {
            b.strokeRect(i*GRID_SIZE, j*GRID_SIZE, i*GRID_SIZE+GRID_SIZE, j*GRID_SIZE+GRID_SIZE);
        }
    }
    */
   /*
   // teste desempenho
    b.fillStyle = 'white';
   for (let i =0; i < 1000; i++) {
       let pp=randomPosition();
      b.fillRect(pp.x,pp.y,1,1);
   }
   */

    drawSnake(snake);
    //drawGlowSquare()

    // draw in canvas
    c.drawImage(buffer, 0, 0);
}

function update() {
    if (!pause) {
        // Set the end and start times
        var start = (new Date).getTime(), end, nFPS;

        keyUpdate();
        moveSnake(snake);
        draw();

        end = (new Date).getTime();
        // since the times are by millisecond, use 1000 (1000ms = 1s)
        // then multiply the result by (MaxFPS / 1000)
        // FPS = (1000 - (end - start)) * (MaxFPS / 1000)
        nFPS = Math.round((1000 - (end - start)) * (FPS / 1000));
        //console.log(nFPS);
    }
    
}


function drawGlowSquare() {
    b.shadowBlur = 20;
    b.shadowColor = "#ff0000";
    //b.fillStyle = 'red';
    //b.fillRect(6*32, 6*32, 32, 32);
    b.strokeStyle = 'red';
    b.lineWidth = 4;
    b.strokeRect(snake.x, snake.y, 32, 32);
    b.shadowBlur = 0;
}

////////////////////////////////////////////////////////////////////////
// Distância 2d 
function distanciaQuadrada(o1, o2) {
    let distX = o1.x - o2.x;
    let distY = o1.y - o2.y;
    let distance = Math.sqrt( (distX*distX) + (distY*distY) );
    return distance;
}


// Colisão círculo x círculo
function colCircleCircle( c1x,  c1y,  c1r,  c2x,  c2y,  c2r) {

    // get distance between the circle's centers
    // use the Pythagorean Theorem to compute the distance
    let distX = c1x - c2x;
    let distY = c1y - c2y;
    let distance = Math.sqrt( (distX*distX) + (distY*distY) );
  
    // if the distance is less than the sum of the circle's
    // radii, the circles are touching!
    /*if (distance <= c1r+c2r) {
      return true;
    } else return false;*/
    return (distance <= c1r+c2r);
}

// Colisão retângulo x retângulo
function colAABB(x1, y1, w1, h1, 
    x2, y2, w2, h2) {
    return (x1 < x2 + w2 &&
      x1 + w1 > x2 &&
      y1 < y2 + h2 &&
      y1 + h1 > y2);
  }

function checkCollision(obj1, obj2) {
    return collisionAABB(obj1.x, obj1.y, obj1.size, obj1.size,
      obj2.x, obj2.y, obj2.size, obj2.size);
  }

function randomPosition() {
    let random_x = Math.floor(Math.random() * CANVAS_WIDTH)
    let random_y = Math.floor(Math.random() * CANVAS_HEIGHT)
    
    let pos = {
      x: Math.floor(random_x / GRID_SIZE) * GRID_SIZE,
      y: Math.floor(random_y / GRID_SIZE) * GRID_SIZE
    }
    
    return pos;
}

function angleBetweenPointsRadians(p1, p2) {
    // angle in radians
    let angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    return angleRadians;
}

function angleBetweenPointsDegress(p1, p2) {
    // angle in degrees
    let angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    return angleDeg;
}

