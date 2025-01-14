const canvas: HTMLCanvasElement = document.getElementById('game')
const btnMove: HTMLButtonElement = document.getElementById('move')
const btnStop: HTMLButtonElement = document.getElementById('stop')
const btnPlay: HTMLButtonElement = document.getElementById('play')
const btnReset: HTMLButtonElement = document.getElementById('reset')

var soundGameOver: HTMLAudioElement = document.getElementById('game-over');
var soundRedLightGreenLight: HTMLAudioElement = document.getElementById('red-light-green-light');
const imageSoldier = document.getElementById("soldier");
const imageDoll = document.getElementById("doll");
const imagePlayer = document.getElementById("player");

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

btnPlay.addEventListener('click', () => {
    btnPlay.hidden = true
    btnReset.hidden = true
    loop()
})

btnReset.addEventListener('click', () => {
    location.reload()
})

function drawPlayer(x, y, fill) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.closePath();
    ctx.drawImage(imagePlayer, x-25, y-100, 50, 100)
}

function drawLine(from, to) {
    const [fromX,fromY] = from
    const [toX, toY] = to
    ctx.moveTo(fromX, fromY)
    ctx.lineTo(toX, toY)
    ctx.stroke();
}

function drawFinishingLine() {
    drawLine([0, 120], [canvasWidth, 120])
}

function drawDoll(x, y, colorHex) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = colorHex;
    ctx.fill();
    ctx.closePath();
    ctx.drawImage(imageDoll, 354        , 0, 90, 120);
}

function drawPlayers(count) {
    const playerPosY = (canvasHeight - 30) + playersY * playersDy
    const playerPosX = 120

    for (let i = 0; i < count; i++) {
        drawPlayer(playerPosX + (i * 100), playerPosY, i < playersEliminated ? '#a81423' : '#98dc58')
    }

}

function drawPlayerEliminated() {
    ctx.font = "12px monospace";
    ctx.fillStyle = "#ff5959"
    ctx.fillText("All Players Eliminated!", canvasWidth/2 - 100, canvasHeight/2);
}

function drawImages() {
    ctx.drawImage(imageSoldier, 100, 10, 70, 80);
    ctx.drawImage(imageSoldier, 200, 10, 70, 80);
    ctx.drawImage(imageSoldier, 500, 10, 70, 80);
    ctx.drawImage(imageSoldier, 600, 10, 70, 80);
}

function drawObjects() {
    drawPlayers(playersCount)
    drawDoll(canvasWidth/2, 20, isDollSinging ? '#98dc58' : '#a81423')
    drawFinishingLine()
    drawImages()

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
        alert('YOU LOST!')
        btnReset.hidden = false
    }

    if (playersY ==-4620 && playersEliminated < playersCount) {
        isGameOver = true
        soundRedLightGreenLight.pause()
        alert('YOU WON!')
        btnReset.hidden = false
    }
}

