const gameContainer = document.getElementById('gameContainer');
const player = document.getElementById('player');
const timerElement = document.getElementById('timer');
const restartButton = document.getElementById('restartButton');
const gameWidth = gameContainer.clientWidth;
const gameHeight = gameContainer.clientHeight;

let playerPosition = { x: gameWidth / 2 - player.clientWidth / 2, y: gameHeight - player.clientHeight - 10 };
let gameInterval;
let obstacleInterval;
let timerInterval;
let obstacles = [];
let timeSurvived = 0;
let invincible = false;

document.addEventListener('keydown', movePlayer);
restartButton.addEventListener('click', restartGame);

function movePlayer(event) {
    switch (event.key) {
        case 'ArrowLeft':
        case 'a':
            if (playerPosition.x > 0) playerPosition.x -= 10;
            break;
        case 'ArrowRight':
        case 'd':
            if (playerPosition.x < gameWidth - player.clientWidth) playerPosition.x += 10;
            break;
    }
    player.style.left = `${playerPosition.x}px`;
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = `${Math.random() * (gameWidth - 30)}px`;
    obstacle.style.top = `-30px`;
    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);
}

function moveObstacles() {
    obstacles.forEach(obstacle => {
        const currentTop = parseFloat(obstacle.style.top);
        if (currentTop > gameHeight) {
            obstacle.remove();
            obstacles = obstacles.filter(o => o !== obstacle);
        } else {
            obstacle.style.top = `${currentTop + 2}px`;
            if (!invincible) checkCollision(obstacle);
        }
    });
}

function checkCollision(obstacle) {
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    if (
        playerRect.left < obstacleRect.left + obstacleRect.width &&
        playerRect.left + playerRect.width > obstacleRect.left &&
        playerRect.top < obstacleRect.top + obstacleRect.height &&
        playerRect.height + playerRect.top > obstacleRect.top
    ) {
        endGame();
    }
}

function updateTimer() {
    timeSurvived++;
    timerElement.textContent = timeSurvived;
}

function startGame() {
    playerPosition = { x: gameWidth / 2 - player.clientWidth / 2, y: gameHeight - player.clientHeight - 10 };
    player.style.left = `${playerPosition.x}px`;
    player.style.top = `${playerPosition.y}px`;
    timeSurvived = 0;
    timerElement.textContent = timeSurvived;
    gameInterval = setInterval(() => {
        moveObstacles();
    }, 20);
    obstacleInterval = setInterval(createObstacle, 1000);
    timerInterval = setInterval(updateTimer, 1000);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    clearInterval(timerInterval);
    alert(`Game Over! You survived for ${timeSurvived} seconds.`);
}

function restartGame() {
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    clearInterval(timerInterval);
    obstacles.forEach(obstacle => obstacle.remove());
    obstacles = [];
    startGame();
}

startGame();
