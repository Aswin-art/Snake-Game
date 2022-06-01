const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

const maxWidth = canvas.width
const maxHeight = canvas.height

let speed = 7
let tileCount = 20
let tileSize = maxWidth / tileCount - 2
let headX = 10
let headY = 10

// velocity
let xVelocity = 0
let yVelocity = 0

// apple position
let appleX = 5
let appleY = 5

// score
let score = 0

// sound
const gulpSound = new Audio('gulp.mp3')

class SnakePart{
    constructor(x, y){
        this.x = x
        this.y = y
    }
}

// array of snakes
const snakeParts = []
let tailLength = 2

// game loop
function drawGame(){
    changeSnakePosition()
    let result = isGameOver()
    if(result){
        return
    }
    ctx.clearRect(0, 0, maxWidth, maxHeight)
    // detectCollision()
    detectAppleCollision()
    drawApple()
    drawSnake()
    drawScore()
    setTimeout(drawGame, 1000 / speed)
}

function isGameOver(){
    let gameOver = false

    // check game start or not
    if(xVelocity == 0 && yVelocity == 0){
        return false
    }

    // check walls
    if((headX < 0) || (headX >= tileCount) || (headY < 0) || (headY >= tileCount)){
        gameOver = true
    }

    // check head crush tail
    for(let i = 0; i < snakeParts.length; ++i){
        let part = snakeParts[i]
        if(part.x == headX && part.y == headY){
            gameOver = true
            break
        }
    }

    if(gameOver){
        ctx.font = '50px Verdana'
        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
        gradient.addColorStop(0, 'magenta')
        gradient.addColorStop(0.5, 'blue')
        gradient.addColorStop(1, 'red')
        ctx.fillStyle = gradient
        ctx.fillText('GAME OVER!', canvas.width / 10, canvas.height / 2)
    }

    return gameOver
}

function drawSnake(){
    // draw body of snake
    ctx.fillStyle = 'green'
    for(let i = 0; i < snakeParts.length; ++i){
        let part = snakeParts[i]
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }

    snakeParts.push(new SnakePart(headX, headY)) // put an item at the end of snake
    while(snakeParts.length > tailLength){ // remove the further item from snake
        snakeParts.shift()
    }


    // draw head of snake
    ctx.fillStyle = 'orange'
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize)
}

function drawScore(){
    ctx.fillStyle = 'white'
    ctx.font = '10px Verdana'
    ctx.fillText('Score: ' + score, maxWidth - 60, 10)
}

function drawApple(){
    ctx.fillStyle = 'red'
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}

function changeSnakePosition(){
    headX = headX + xVelocity
    headY = headY + yVelocity
}

function changeVelocity(event){
    switch(event.keyCode){
        case 38:
            if(yVelocity == 1){
                return
            }
            yVelocity = -1
            xVelocity = 0
            break;
        case 40:
            if(yVelocity == -1){
                return
            }
            yVelocity = 1
            xVelocity = 0
            break;
        case 37:
            if(xVelocity == 1){
                return
            }
            yVelocity = 0
            xVelocity = -1
            break;
        case 39:
            if(xVelocity == -1){
                return
            }
            yVelocity = 0
            xVelocity = 1
            break;
        default:
            break;
    }
}

function detectCollision(){
    if(((headX * tileCount) + tileSize) >= maxWidth || headX <= 0){
        alert('dead')
    }
}

function addScore(){
    score += 10
}

function addTailLength(){
    tailLength++
}

function addSpeed(){
    if(score % 50 == 0){
        speed++
    }
}

function playSound(){
    gulpSound.play()
}

function detectAppleCollision(){
    if(headX == appleX && headY == appleY){
        appleX = Math.floor(Math.random() * 15 + 3)
        appleY = Math.floor(Math.random() * 15 + 3)
        addScore()
        addTailLength()
        addSpeed()
        playSound()
    }
}

document.addEventListener('keydown', changeVelocity)

drawGame()