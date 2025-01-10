document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname;

    console.log('Aktuálna stránka:', currentPage);
    console.log('Token získaný z localStorage:', token); // Skontroluj obsah tokenu

    // ✅ 1. Overenie tokenu a presmerovanie
    if (!token && currentPage.endsWith('dashboard.html')) {
        console.warn('Žiadny token. Presmerovanie na index.html');
        window.location.href = 'index.html';
        return; // Ukončenie skriptu
    }

    if (token && currentPage.endsWith('index.html')) {
        try {
            const response = await fetch('https://monty-88po.onrender.com/api/auth/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Overenie tokenu - HTTP status:', response.status);

            if (response.ok) {
                console.log('Token overený. Presmerovanie na dashboard.html');
                window.location.href = 'dashboard.html';
                return; // Ukončenie skriptu
            } else {
                console.warn('Token neplatný. Odstránenie z localStorage.');
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Chyba pri overovaní tokenu:', error);
            localStorage.removeItem('token');
        }
    }

    // ✅ 2. Funkcia na odhlásenie
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log('Používateľ sa odhlásil.');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }

    // ✅ 3. Nastavenie pozdravu používateľa
    const userGreeting = document.getElementById('userGreeting');
    const userAvatar = document.querySelector('.avatar');

    if (token && currentPage.endsWith('dashboard.html')) {
        try {
            const response = await fetch('https://monty-88po.onrender.com/api/auth/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('HTTP status pre načítanie údajov:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Dáta prijaté zo servera:', data); // Log odpovede

                // Nastavenie pozdravu
                userGreeting.textContent = `Pekný deň, ${data.nickname && data.nickname.trim() ? data.nickname : 'tester'}!`;
                userAvatar.src = data.avatar || 'avatar.png';
            } else {
                console.warn('Chyba pri načítaní údajov používateľa:', response.status);
            }
        } catch (error) {
            console.error('Chyba pri načítaní používateľských údajov:', error);
        }
    }
});
