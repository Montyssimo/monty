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