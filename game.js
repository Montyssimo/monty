const slovenskaAbeceda = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
let letters = []; // Dostupné písmená
let usedWords = []; // Zoznam vytvorených slov
let score = 0; // Celkové skóre

// Elementy DOM
const lettersElement = document.getElementById('letters');
const wordInput = document.getElementById('word-input');
const submitButton = document.getElementById('submit-word');
const wordsElement = document.getElementById('words');
const scoreElement = document.getElementById('score');

// Funkcia na generovanie 10 náhodných písmen
function generateLetters() {
    letters = [];
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * slovenskaAbeceda.length);
        letters.push(slovenskaAbeceda[randomIndex]);
    }
    lettersElement.textContent = letters.join(", ");
}

// Funkcia na kontrolu slova
function checkWord(word) {
    const wordLetters = word.toLowerCase().split('');
    const availableLetters = [...letters]; // Kópia dostupných písmen

    // Kontrola, či slovo je zložené z dostupných písmen
    for (let letter of wordLetters) {
        const index = availableLetters.indexOf(letter);
        if (index === -1) {
            return false; // Písmeno nie je k dispozícii
        }
        availableLetters.splice(index, 1); // Odstrániť použité písmeno
    }
    return true;
}

// Funkcia na pridanie slova
function addWord(word) {
    if (checkWord(word)) {
        usedWords.push(word);
        score += word.length;
        wordsElement.textContent = usedWords.join(", ");
        scoreElement.textContent = score;
        wordInput.value = ""; // Vyčistiť input
    } else {
        alert("Neplatné slovo! Skús znova.");
    }
}

// Inicializácia hry
function initGame() {
    generateLetters();
    usedWords = [];
    score = 0;
    wordsElement.textContent = "";
    scoreElement.textContent = "0";
}

// Event listener pre tlačidlo
submitButton.addEventListener('click', () => {
    const word = wordInput.value.trim();
    if (word) {
        addWord(word);
    }
});

// Spusti hru pri načítaní stránky
initGame();