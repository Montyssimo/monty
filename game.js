const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let x = canvas.width / 2;
let y = canvas.height / 2;
const size = 50;
const speed = 5;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, size, size);
}

function update() {
    // Tu môžeš pridať logiku pre pohyb a interakciu
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

// Príklad: Pohyb pomocou klávesnice
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') y -= speed;
    if (e.key === 'ArrowDown') y += speed;
    if (e.key === 'ArrowLeft') x -= speed;
    if (e.key === 'ArrowRight') x += speed;
});

// Príklad: Uloženie skóre po skončení hry
function saveScore(score) {
    fetch('/api/game/save-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ score })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Skóre uložené:', data);
    })
    .catch(error => {
        console.error('Chyba pri ukladaní skóre:', error);
    });
}