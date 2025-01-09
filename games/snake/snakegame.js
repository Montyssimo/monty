const gameContainer = document.getElementById('game-container');
const svg = document.getElementById('snake-svg');
const gameOverModal = document.getElementById('game-over-modal');
const playAgainButton = document.getElementById('play-again-button');
const backToDashboardButton = document.getElementById('back-to-dashboard-button');

let gridWidth = 20;
let gridHeight = 15;
let tileSize = 40;
let snake = [{ x: 10, y: 8 }];
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let food = generateFood();
let gameOver = false;
let frameCounter = 0;
const framesPerMove = 8;

function endGame() {
    console.log('endGame called');
    gameOver = true;
    gameOverModal.classList.remove('hidden');
}

playAgainButton.addEventListener('click', () => {
    console.log('Play Again clicked');
    gameOver = false;
    snake = [{ x: 10, y: 8 }];
    direction = { x: 0, y: 0 };
    food = generateFood();
    gameOverModal.classList.add('hidden');
    drawGame();
    requestAnimationFrame(gameLoop);
});

backToDashboardButton.addEventListener('click', () => {
    window.location.href = '/dashboard.html';
});

function generateFood() {
    let foodPosition;
    let validPosition = false;
    while (!validPosition) {
        foodPosition = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight),
        };
        validPosition = !snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y);
    }
    return foodPosition;
}

function drawGame() {
    svg.innerHTML = '';
    snake.forEach((segment, index) => {
        const type = index === 0 ? 'head' : index === snake.length - 1 ? 'tail' : 'body';
        const segmentElement = createSnakeSegment(segment.x, segment.y, type);
        svg.appendChild(segmentElement);
    });
    const foodElement = createSnakeSegment(food.x, food.y, 'food');
    svg.appendChild(foodElement);
}

function createSnakeSegment(x, y, type) {
    const segment = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const className = type === 'head' ? 'snake-head' : type === 'tail' ? 'snake-tail' : type === 'food' ? 'food' : 'snake-body';
    segment.setAttribute('cx', x * tileSize + tileSize / 2);
    segment.setAttribute('cy', y * tileSize + tileSize / 2);
    segment.setAttribute('r', tileSize / 2.5);
    segment.setAttribute('class', className);
    return segment;
}

function moveSnake() {
    if (gameOver) return;
    direction = { ...nextDirection };
    if (direction.x === 0 && direction.y === 0) return;

    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
    };

    if (newHead.x < 0) newHead.x = gridWidth - 1;
    if (newHead.x >= gridWidth) newHead.x = 0;
    if (newHead.y < 0) newHead.y = gridHeight - 1;
    if (newHead.y >= gridHeight) newHead.y = 0;

    if (snake.some((segment, index) => index !== 0 && segment.x === newHead.x && segment.y === newHead.y)) {
        endGame();
        return;
    }

    snake.unshift(newHead);
    if (newHead.x === food.x && newHead.y === food.y) {
        food = generateFood();
    } else {
        snake.pop();
    }
}

function gameLoop() {
    frameCounter++;
    if (frameCounter >= framesPerMove) {
        moveSnake();
        drawGame();
        frameCounter = 0;
    }
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    console.log(gameOverModal.classList);
    gameOverModal.classList.add('hidden');
    console.log(gameOverModal.classList);
    gameOver = false;
    drawGame();
    requestAnimationFrame(gameLoop);
});

window.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && direction.y === 0) nextDirection = { x: 0, y: -1 };
    if (e.key === 'ArrowDown' && direction.y === 0) nextDirection = { x: 0, y: 1 };
    if (e.key === 'ArrowLeft' && direction.x === 0) nextDirection = { x: -1, y: 0 };
    if (e.key === 'ArrowRight' && direction.x === 0) nextDirection = { x: 1, y: 0 };
});





