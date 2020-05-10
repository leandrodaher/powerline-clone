import * as utils from './utils.js';

class Point {
    constructor (x,y) {
        this._x = x;
        this._y = y;
    }

    get x() {return this._x}
    set x(x) {this._x = x}
    get y() {return this._y}
    set y(y) {this._y = y}
}

export class Line {
    constructor(id) {
        this._id = id;
        this._points = new Array() //of Point;  _points[0] is head
        this._scale =5;
        this._color = '#4cff00';
        this._color2 = '#4cff00';
        this._speed = 50;
        this._keyPressed = 0;
        this._angle = utils.directionType.up;
        this._size = 100;


        this._points.push( new Point(100, 100) );
        this._points.push( new Point(100, 100+this._size) );
    }

    set points(points) {this._points = points;}

    // calcula tamanho real da snake
    calcLen() {
        let size = 0;
        for (let i = 0; i < this._points.length - 1; i++) {
            size += utils.distance(this._points[i], this._points[i+1]);
        }

        return Math.floor(size);
    }

    draw(ctx) {
        console.log(this.calcLen());
        
        ctx.shadowBlur = this._scale+3;
        ctx.shadowColor = "#4cff00";
        ctx.strokeStyle = this._color;
        ctx.lineWidth = this._scale;
        ctx.lineCap = 'round';

        for (let i = 0; i < this._points.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(this._points[i].x, this._points[i].y);
            ctx.lineTo(this._points[i+1].x, this._points[i+1].y);
            ctx.stroke();
        }

        ctx.strokeStyle =  'white';
        ctx.shadowColor = "white";
        ctx.fillStyle = 'white';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this._points[0].x, this._points[0].y, this._scale*0.45, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        ctx.shadowBlur = 0;
    }

    
   
    keyProcess(command) {
        let ang = 0;
            this._keyPressed = command.keyPressed;
            switch (this._keyPressed) {
                case "ArrowUp":
                    ang = utils.directionType.up;
                break;
                case "ArrowDown":
                    ang = utils.directionType.down;
                break;
                case "ArrowLeft":
                    ang = utils.directionType.left;
                break;
                case "ArrowRight":
                    ang = utils.directionType.right;
                break;
            }
            if (ang != this._angle) {
                //this._points.push(new Point(this._points[0].x, this._points[0].y));
                this._points.splice( 1, 0, new Point(this._points[0].x, this._points[0].y) );
                this._angle = ang;
                //console.log(ang, this._angle)
            }
            this._keyPressed = null;
    }


    /////////////////////////////////

    // Retorna se o ponto 2 está acima, abaixo, à direita ou à esquerda
    // do ponto 1. Só detecta direção horizontal e vertical,
    // neste jogo não usaremos cálculos de sen e cos pois
    // os movimentos são apenas em ângulo de 90º
    // extremamente simples.
    _relativeDirection(pt1, pt2) {
        if (pt1.y == pt2.y && pt1.x != pt2.x) {
            if (pt2.x > pt1.x)
                return utils.directionType.right;
            else return utils.directionType.left;
        } else if (pt1.x == pt2.x && pt1.y != pt2.y) {
            if (pt2.y > pt1.y)
                return utils.directionType.down;
            else return utils.directionType.up;
        } else return -1;
    }

    _moveToPoint(from, to, elapsedTime) {
        switch (this._relativeDirection(from, to)) {
            case utils.directionType.up:
                from.y -= this._speed * (elapsedTime / 1000);
            break;
            case utils.directionType.down:
                from.y += this._speed * (elapsedTime / 1000);
            break;
            case utils.directionType.left:
                from.x -= this._speed * (elapsedTime / 1000);
            break;
            case utils.directionType.right:
                from.x += this._speed * (elapsedTime / 1000);
            break;
        }
    }

    _moveToDir(from, dir, elapsedTime) {
        switch (dir) {
            case utils.directionType.up:
                from.y -= this._speed * (elapsedTime / 1000);
            break;
            case utils.directionType.down:
                from.y += this._speed * (elapsedTime / 1000);
            break;
            case utils.directionType.left:
                from.x -= this._speed * (elapsedTime / 1000);
            break;
            case utils.directionType.right:
                from.x += this._speed * (elapsedTime / 1000);
            break;
        }
    }

    update(elapsedTime) {
        this._moveToDir(this._points[0], this._angle, elapsedTime);

        let i = this._points.length-1,
            dx = Math.abs(this._points[i].x - this._points[i-1].x),
            dy = Math.abs(this._points[i].y - this._points[i-1].y);

        if (dx < 1 && dy < 1) {
            let spliced = this._points.splice(i-1, 1);
            i = this._points.length-1;
            this._points[i] = spliced[0];
            i = this._points.length-1;
        } else
            this._moveToPoint(this._points[i], this._points[i-1], elapsedTime);
    }
}