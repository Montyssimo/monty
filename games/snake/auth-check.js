document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Ak token neexistuje, presmeruj na prihlasovaciu stránku
        window.location.href = '/index.html'; // Cesta podľa projektu
    }
});
