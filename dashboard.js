document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname;

// Overenie JWT tokenu pri načítaní dashboardu
if (window.location.pathname.endsWith('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', async () => {
        const token = localStorage.getItem('token');
        const currentPage = window.location.pathname;
    
        // Ak je token a sme na index.html, presmeruj na dashboard
        if (token && currentPage.endsWith('index.html')) {
            try {
                const response = await fetch('https://monty-88po.onrender.com/api/auth/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (response.ok) {
                    window.location.href = 'dashboard.html';
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Chyba pri overovaní tokenu:', error);
                localStorage.removeItem('token');
            }
        }
    
        // Ak nie je token a sme na dashboard.html, vráť používateľa na index
        if (!token && currentPage.endsWith('dashboard.html')) {
            window.location.href = 'index.html';
        }
    });
}

    // Funkcia na odhlásenie
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }
});