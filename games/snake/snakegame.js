const gameContainer = document.getElementById('game-container');
const svg = document.getElementById('snake-svg');

const gridWidth = 20; // Počet buniek na šírku
const gridHeight = 15; // Počet buniek na výšku
const tileSize = 40; // Veľkosť jednej bunky v pixeloch (zodpovedá CSS background-size)

let snake = [{ x: 10, y: 8 }]; // Had začína v strede
let direction = { x: 0, y: 0 }; // Had sa na začiatku nehýbe
let nextDirection = { x: 0, y: 0 }; // Buffer pre nový smer
let food = generateFood(); // Inicializujeme jedlo
let gameOver = false;
let frameCounter = 0;
const framesPerMove = 8;

// Funkcia na generovanie náhodného jedla
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

// Funkcia na vykreslenie hry
function drawGame() {
    svg.innerHTML = '';
    snake.forEach((segment, index) => {
        let type = 'body';
        if (index === 0) type = 'head';
        else if (index === snake.length - 1) type = 'tail';

        const segmentElement = createSnakeSegment(segment.x, segment.y, type);
        svg.appendChild(segmentElement);
    });

    const foodElement = createSnakeSegment(food.x, food.y, 'food');
    svg.appendChild(foodElement);
}

// Funkcia na vytváranie segmentov
function createSnakeSegment(x, y, type) {
    const segment = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    let className;

    switch (type) {
        case 'head':
            className = 'snake-head';
            break;
        case 'body':
            className = 'snake-body';
            break;
        case 'tail':
            className = 'snake-tail';
            break;
        case 'food':
            className = 'food';
            break;
        default:
            className = 'snake-body';
    }

    segment.setAttribute("cx", x * tileSize + tileSize / 2);
    segment.setAttribute("cy", y * tileSize + tileSize / 2);
    segment.setAttribute("r", tileSize / 2.5);
    segment.setAttribute("class", className);

    return segment;
}

// Pohyb hada
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
        gameOver = true;
        alert('Game Over!');
        return;
    }

    snake.unshift(newHead);
    if (newHead.x === food.x && newHead.y === food.y) {
        food = generateFood();
    } else {
        snake.pop();
    }
}

// Hlavná herná slučka
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

// Ovládanie hada
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction.y === 0) nextDirection = { x: 0, y: -1 };
    if (e.key === 'ArrowDown' && direction.y === 0) nextDirection = { x: 0, y: 1 };
    if (e.key === 'ArrowLeft' && direction.x === 0) nextDirection = { x: -1, y: 0 };
    if (e.key === 'ArrowRight' && direction.x === 0) nextDirection = { x: 1, y: 0 };
});

// Načítanie hry
drawGame();
requestAnimationFrame(gameLoop);





