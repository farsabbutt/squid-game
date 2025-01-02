const canvas: HTMLCanvasElement = document.getElementById('game')
const btnMove: HTMLButtonElement = document.getElementById('move')
const btnStop: HTMLButtonElement = document.getElementById('stop')

var soundGameOver: HTMLAudioElement = document.getElementById('game-over');
var soundRedLightGreenLight: HTMLAudioElement = document.getElementById('red-light-green-light');

const ctx = canvas.getContext("2d")
const canvasWidth = canvas.width
const canvasHeight = canvas.height

let arePlayersMoving = false
let isDollSinging = false
let playersY = 0
let playersDy = 0.1

let playersCount = 6
let playersEliminated = 0

btnMove.addEventListener('click', () => {
    arePlayersMoving = true
})

btnStop.addEventListener('click', () => {
    arePlayersMoving = false
})


// Create an image element
const img = new Image();

// Use a placeholder image since we can't load external images
img.src = 'https://www.pngplay.com/wp-content/uploads/13/Squid-Game-Soldier-Triangle-Cartoon-PNG.png';

img.onload = function() {
    console.log('drawing....')
    // Draw the image at position (50,50)
    console.log(img)
    ctx.drawImage(img, 100, 100, 100, 100);

    // You can also specify width and height:
    // ctx.drawImage(img, 50, 50, 100, 100);
};



function drawPlayer(x, y, fill) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.closePath();
}

function drawLine(from, to) {
    const [fromX,fromY] = from
    const [toX, toY] = to
    ctx.moveTo(fromX, fromY)
    ctx.lineTo(toX, toY)
    ctx.stroke();
}

function drawFinishingLine() {
    drawLine([0, 40], [canvasWidth, 40])
}

function drawDoll(x, y, colorHex) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = colorHex;
    ctx.fill();
    ctx.closePath();
}

function drawPlayers(count) {
    const playerPosY = (canvasHeight - 30) + playersY * playersDy
    const playerPosX = 40

    for (let i = 0; i < count; i++) {
        drawPlayer(playerPosX + (i * 40), playerPosY, i < playersEliminated ? '#000000' : '#0095DD')
    }

}

function drawPlayerEliminated() {
    ctx.font = "12px monospace";
    ctx.fillStyle = "#ff5959"
    ctx.fillText("All Players Eliminated!", canvasWidth/2 - 100, canvasHeight/2);
}


function drawObjects() {
    drawPlayers(playersCount)
    drawDoll(canvasWidth/2, 20, isDollSinging ? '#98dc58' : '#a81423')
    drawFinishingLine()
}

let timeout = null

let animationFrameId = null

let isGameOver = false

function loop() {

    if (isGameOver) {
        soundRedLightGreenLight.pause()
        cancelAnimationFrame(animationFrameId);
        return
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawObjects()

    if (!timeout && !isGameOver) {
        timeout = setTimeout(() => {
            if (isDollSinging) {
                isDollSinging = false
                soundRedLightGreenLight.pause()
            } else {
                isDollSinging = true
                soundRedLightGreenLight.play()
            }
            timeout = null
        }, isDollSinging ? Math.floor(Math.random() * 10) * 1000 : 1500)
    }

    if (!isDollSinging && arePlayersMoving) {
        playersEliminated++
        soundGameOver.play().then(() => {
            drawPlayerEliminated()
            arePlayersMoving = false
        })

    }


    if (arePlayersMoving) {
        playersY = playersY - 10
    }


   animationFrameId = requestAnimationFrame(loop)

    if (playersEliminated === playersCount) {
        isGameOver = true
        soundRedLightGreenLight.pause()
        alert('LOST!')
    }

    if (playersY ==-5450 && playersEliminated < playersCount) {
        isGameOver = true
        soundRedLightGreenLight.pause()
        alert('WON!')
    }
}

loop()

