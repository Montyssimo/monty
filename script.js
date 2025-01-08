// Kontrola prihlásenia a presmerovania
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname;

    console.log('🛠️ Aktuálna stránka:', currentPage);
    console.log('🛠️ Token:', token);

    // Presmerovanie na dashboard, ak je token
    if (token && (currentPage === '/' || currentPage.endsWith('index.html'))) {
        window.location.href = 'dashboard.html';
    }

    // Presmerovanie na index, ak nie je token
    if (!token && currentPage.endsWith('dashboard.html')) {
        window.location.href = 'index.html';
    }
});

// Prepínanie medzi Login a Signup formulármi
document.addEventListener('DOMContentLoaded', () => {
    const formTitle = document.getElementById('formTitle');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const container = document.getElementById('container');
    const formContainer = document.querySelector('.form-container');

    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.add('hide');
            signupForm.classList.add('show');
            container.classList.add('expanded');
            formContainer.classList.add('expanded');
            formTitle.textContent = 'Vytvor si účet';
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.remove('hide');
            signupForm.classList.remove('show');
            container.classList.remove('expanded');
            formContainer.classList.remove('expanded');
            formTitle.textContent = 'Vitaj späť';
        });
    }
});

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

// Funkcionalita pre tlačidlá Login a Signup
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    // Login Functionality
    if (loginButton) {
        loginButton.addEventListener('click', async () => {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('https://monty-88po.onrender.com/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'dashboard.html';
                } else {
                    alert(data.message || 'Nepodarilo sa prihlásiť');
                }
            } catch (error) {
                console.error('Chyba pri prihlásení:', error);
            }
        });
    }

    // Signup Functionality
    if (signupButton) {
        signupButton.addEventListener('click', async () => {
            const nickname = document.getElementById('signupNickname').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;

            try {
                const response = await fetch('https://monty-88po.onrender.com/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nickname, email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Úspešne si sa zaregistroval. Skontroluj svoj e-mail pre overenie.');
                } else {
                    alert(data.message || 'Nepodarilo sa zaregistrovať');
                }
            } catch (error) {
                console.error('Chyba pri registrácii:', error);
            }
        });
    }
});