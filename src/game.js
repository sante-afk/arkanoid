"use strict";
class Canvas {
    constructor(){
        this.canvas = document.getElementById('game');
        this.context = this.canvas.getContext('2d');
    }
}

class Levels {
    constructor(){
        this.level1 = [
            ['R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
            ['R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
            ['O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
            ['O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
            ['G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
            ['G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
            ['Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y'],
            ['Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y'],
        ]
    }
}


class CustomStyle {
    constructor() {
        this.brickGap = 2;
        this.brickWidth = 25;
        this.brickHeight = 12;
        this.wallSize = 12;

        this.colorMap = {
            'R': 'red',
            'O': 'orange',
            'G': 'green',
            'Y': 'yellow'
        }
    }
}

class Ball {
    constructor() {
        this.x = 130,
        this.y = 260,
        this.speed = 2,
        this.dx = 0,
        this.dy = 0,
        this.width = 10; 
        this.height = 10;  
    }
}

const holst = new Canvas();
const levels = new Levels();
const style = new CustomStyle();
const ball = new Ball();

const paddle = {
    x: holst.canvas.width / 2 - style.brickWidth / 2,
    y: 440,
    width: style.brickWidth,
    height: style.brickHeight,
    dx: 0
}

const bricks = [];

function createBricks () {
    const level = levels.level1;
    for (let row = 0; row < level.length; row++) {
        for (let col = 0; col < level[row].length; col++) {

            const colorCode = level[row][col];

            bricks.push({
                x: style.wallSize + (style.brickWidth + style.brickGap) * col,
                y: style.wallSize + (style.brickHeight + style.brickGap) * row,
                color: style.colorMap[colorCode],
                width: style.brickWidth,
                height: style.brickHeight
            });
        }
    }
}

function collides(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width && 
        obj1.x + obj1.width > obj2.x && 
        obj1.y < obj2.y + obj2.height && 
        obj1.y + obj1.height > obj2.y
    );
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        paddle.dx = -3;
    }

    if (e.key === 'ArrowRight') {
        paddle.dx = 3;
    }

    if (!ball.dx && !ball.dy && e.key === ' ') {
        ball.dx = ball.speed;
        ball.dy = ball.speed;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        paddle.dx = 0;
    }
});


function loop() {
    requestAnimationFrame(loop);
    holst.context.clearRect(0, 0, holst.canvas.width, holst.canvas.height);
    paddle.x += paddle.dx;

    if (paddle.x < style.wallSize) {
        paddle.x = style.wallSize
    } else if (paddle.x + style.brickWidth > holst.canvas.width - style.wallSize) {
        paddle.x = holst.canvas.width - style.wallSize - style.brickWidth;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x < style.wallSize) {
        ball.x = style.wallSize;
        ball.dx *= -1;
    } else if (ball.x + ball.width > holst.canvas.width - style.wallSize) {
        ball.x = holst.canvas.width - style.wallSize - ball.width;
        ball.dx *= -1;
    }

    if (ball.y < style.wallSize) {
        ball.y = style.wallSize;
        ball.dy *= -1;
    }

    if (ball.y > holst.canvas.height) {
        ball.x = 130;
        ball.y = 260;
        ball.dx = 0;
        ball.dy = 0;
    }

    if (collides(ball, paddle)) {
        ball.dy *= -1;
        ball.y = paddle.y - ball.height;
    }

    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];

        if (collides(ball, brick)) {
            bricks.splice(i, 1);

            if (ball.y + ball.height - ball.speed <= brick.y || 
                ball.y >= brick.y + brick.height - ball.speed) {
                ball.dy *= -1;
            } else {
                ball.dx *= -1;
            }
            break;
        }
    }

    holst.context.fillStyle = 'lightgrey';
    holst.context.fillRect(0, 0, holst.canvas.width, style.wallSize);
    holst.context.fillRect(0, 0, style.wallSize, holst.canvas.height);
    holst.context.fillRect(holst.canvas.width - style.wallSize, 0, style.wallSize, holst.canvas.height);

    holst.context.fillStyle = 'black';
    holst.context.fillRect(ball.x, ball.y, ball.width, ball.height);


    bricks.forEach(function(brick) {
        holst.context.fillStyle = brick.color;
        holst.context.fillRect(brick.x, brick.y, brick.width, brick.height);
    });

    holst.context.fillStyle = 'black';
    holst.context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

}
createBricks();

requestAnimationFrame(loop);