// Kontrola prihlásenia a presmerovania
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname;

    // Ak je token a aktuálna stránka je index.html, presmeruj na dashboard
    if (token && currentPage.endsWith('index.html')) {
        window.location.href = 'dashboard.html';
    }

    // Ak nie je token a stránka je dashboard, vráť používateľa na index.html
    if (!token && currentPage.endsWith('dashboard.html')) {
        window.location.href = 'index.html';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const formTitle = document.getElementById('formTitle');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const container = document.getElementById('container');
    const formContainer = document.querySelector('.form-container');
    

    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hide');
        signupForm.classList.add('show');
        container.classList.add('expanded');
        formContainer.classList.add('expanded');
        formTitle.textContent = 'Vytvor si účet';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('hide');
        signupForm.classList.remove('show');
        container.classList.remove('expanded');
        formContainer.classList.remove('expanded');
        formTitle.textContent = 'Vitaj späť';
    });
});

// Overenie JWT tokenu pri načítaní dashboardu
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
    } else {
        try {
            const response = await fetch('https://monty-88po.onrender.com/api/auth/dashboard', {
                headers: {
                    Authorization: token
                }
            });
            const data = await response.json();
            if (response.ok) {
                document.querySelector('.dashboard h1').innerText = data.message;
            } else {
                localStorage.removeItem('token');
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Chyba pri načítaní dashboardu:', error);
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        }
    }
});

// Funkcia na odhlásenie
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token'); // Vymaže JWT token
        window.location.href = 'index.html'; // Presmerovanie na hlavnú stránku
    });
}

//LOGIN A SIGNUP tlačídlá plus funkcionalita

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