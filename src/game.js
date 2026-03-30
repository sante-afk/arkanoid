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
        ];
    }
}

class CustomStyle {
    constructor() {
        this.brickGap = 2;
        this.brickWidth = 25;
        this.brickHeight = 12;
        this.wallSize = 12;

        this.colorMap = {
            'R': '#ff3366',    
            'O': '#ff9900',    
            'G': '#33ff33',     
            'Y': '#ffff33'      
        };
    }
}

class Ball {
    constructor() {
        this.x = 130,
        this.y = 260,
        this.speed = 2.5,
        this.dx = 0,
        this.dy = 0,
        this.width = 8,  
        this.height = 8;
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
};

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
        paddle.dx = -3.5;
    }
    if (e.key === 'ArrowRight') {
        paddle.dx = 3.5;
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

function drawToxicBackground() {
    const gradient = holst.context.createLinearGradient(0, 0, 0, holst.canvas.height);
    gradient.addColorStop(0, '#0a1f0a');
    gradient.addColorStop(0.5, '#0c2a0c');
    gradient.addColorStop(1, '#051005');
    holst.context.fillStyle = gradient;
    holst.context.fillRect(0, 0, holst.canvas.width, holst.canvas.height);
    
    holst.context.save();
    holst.context.globalAlpha = 0.3;
    for(let i = 0; i < 50; i++) {
        holst.context.beginPath();
        holst.context.arc(
            (Date.now() * 0.001 + i * 123) % holst.canvas.width,
            (Date.now() * 0.0005 + i * 73) % holst.canvas.height,
            2 + (i % 3),
            0,
            Math.PI * 2
        );
        holst.context.fillStyle = `rgba(0, 255, 0, ${0.2 + Math.sin(Date.now() * 0.002 + i) * 0.1})`;
        holst.context.fill();
    }
    holst.context.restore();
    
    holst.context.save();
    holst.context.strokeStyle = '#00ff00';
    holst.context.globalAlpha = 0.15;
    holst.context.lineWidth = 0.5;
    for(let i = 0; i < holst.canvas.width; i += 40) {
        holst.context.beginPath();
        holst.context.moveTo(i, 0);
        holst.context.lineTo(i, holst.canvas.height);
        holst.context.stroke();
        
        holst.context.beginPath();
        holst.context.moveTo(0, i);
        holst.context.lineTo(holst.canvas.width, i);
        holst.context.stroke();
    }
    holst.context.restore();
    
    const radGrad = holst.context.createRadialGradient(
        holst.canvas.width / 2, 
        holst.canvas.height / 2, 
        50,
        holst.canvas.width / 2, 
        holst.canvas.height / 2, 
        250
    );
    radGrad.addColorStop(0, 'rgba(0, 255, 0, 0.05)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    holst.context.fillStyle = radGrad;
    holst.context.fillRect(0, 0, holst.canvas.width, holst.canvas.height);
}

function drawToxicWalls() {
    const wallGradient = holst.context.createLinearGradient(0, 0, 0, style.wallSize);
    wallGradient.addColorStop(0, '#00ff00');
    wallGradient.addColorStop(1, '#006600');
    holst.context.fillStyle = wallGradient;
    holst.context.fillRect(0, 0, holst.canvas.width, style.wallSize);
    
    holst.context.fillStyle = '#00ff00';
    holst.context.fillRect(0, 0, style.wallSize, holst.canvas.height);
    
    holst.context.fillRect(holst.canvas.width - style.wallSize, 0, style.wallSize, holst.canvas.height);
    
    holst.context.save();
    holst.context.shadowBlur = 8;
    holst.context.shadowColor = '#00ff00';
    holst.context.strokeStyle = '#33ff33';
    holst.context.lineWidth = 1;
    holst.context.strokeRect(2, 2, holst.canvas.width - 4, style.wallSize - 2);
    holst.context.strokeRect(2, 2, style.wallSize - 2, holst.canvas.height - 4);
    holst.context.strokeRect(holst.canvas.width - style.wallSize + 1, 2, style.wallSize - 2, holst.canvas.height - 4);
    holst.context.restore();
}

function drawBricksWithGlow() {
    bricks.forEach(function(brick) {
        holst.context.save();
        holst.context.shadowBlur = 5;
        holst.context.shadowColor = brick.color;
        holst.context.fillStyle = brick.color;
        holst.context.fillRect(brick.x, brick.y, brick.width, brick.height);
        
        holst.context.fillStyle = 'rgba(255, 255, 255, 0.3)';
        holst.context.fillRect(brick.x + 2, brick.y + 1, brick.width - 4, 2);
        holst.context.restore();
        
        holst.context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        holst.context.strokeRect(brick.x, brick.y, brick.width, brick.height);
    });
}

function drawToxicBall() {
    holst.context.save();
    
    holst.context.shadowBlur = 10;
    holst.context.shadowColor = '#00ff00';
    
    const ballGradient = holst.context.createRadialGradient(
        ball.x + ball.width/2 - 2, 
        ball.y + ball.height/2 - 2, 
        2,
        ball.x + ball.width/2, 
        ball.y + ball.height/2, 
        ball.width/2
    );
    ballGradient.addColorStop(0, '#ffffff');
    ballGradient.addColorStop(0.5, '#88ff88');
    ballGradient.addColorStop(1, '#00cc00');
    
    holst.context.fillStyle = ballGradient;
    holst.context.fillRect(ball.x, ball.y, ball.width, ball.height);
    
    holst.context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    holst.context.fillRect(ball.x + 2, ball.y + 2, 2, 2);
    
    holst.context.restore();
}

function drawToxicPaddle() {
    holst.context.save();
    
    holst.context.shadowBlur = 8;
    holst.context.shadowColor = '#33ff33';
    
    const paddleGradient = holst.context.createLinearGradient(
        paddle.x, paddle.y, 
        paddle.x + paddle.width, paddle.y
    );
    paddleGradient.addColorStop(0, '#33ff33');
    paddleGradient.addColorStop(0.5, '#88ff88');
    paddleGradient.addColorStop(1, '#33ff33');
    
    holst.context.fillStyle = paddleGradient;
    holst.context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    holst.context.fillStyle = 'rgba(0, 0, 0, 0.3)';
    holst.context.fillRect(paddle.x + 5, paddle.y + 2, paddle.width - 10, 3);
    
    holst.context.restore();
}

function loop() {
    requestAnimationFrame(loop);
    drawToxicBackground();
    drawToxicWalls();

    paddle.x += paddle.dx;
    if (paddle.x < style.wallSize) {
        paddle.x = style.wallSize;
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
        
        let hitPos = (ball.x + ball.width/2) - (paddle.x + paddle.width/2);
        let angle = hitPos / (paddle.width/2) * 0.7;
        ball.dx = angle * ball.speed;
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
    
    drawBricksWithGlow();
    drawToxicBall();
    drawToxicPaddle();
    
    holst.context.save();
    holst.context.globalAlpha = 0.2;
    for(let i = 0; i < 20; i++) {
        holst.context.beginPath();
        holst.context.moveTo(
            (Date.now() * 0.003 + i * 50) % holst.canvas.width,
            0
        );
        holst.context.lineTo(
            (Date.now() * 0.003 + i * 50 + 10) % holst.canvas.width,
            holst.canvas.height
        );
        holst.context.strokeStyle = '#00ff00';
        holst.context.lineWidth = 0.5;
        holst.context.stroke();
    }
    holst.context.restore();
    holst.context.font = 'bold 12px "Courier New", monospace';
    holst.context.fillStyle = '#00ff00';
    holst.context.shadowBlur = 3;
    holst.context.shadowColor = '#00ff00';
    holst.context.fillText(`BRICKS: ${bricks.length}`, 30, 30);
    holst.context.fillText(holst.canvas.width - 70, 30);
    holst.context.shadowBlur = 0;
}

createBricks();
requestAnimationFrame(loop);