const Regisform = document.getElementById('registerForm');
const Loginform = document.getElementById('loginForm');

regisform.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
    username: document.getElementById('Rusername').value,
    email: document.getElementById('Remail').value,
    password: document.getElementById('Rpassword').value,
    };

    regisform.reset();

    const response = await fetch('/api/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });


});

Loginform.addEventListener('submit', async (event) => {
    event.preventDefault();

    const loginData = {
        username: document.getElementById('Lusername').value,
        password: document.getElementById('Lpassword').value
    }

    Loginform.reset();

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
    });

    const result = await response.json();

    if (response.ok){
        window.location.href = result.redirect;
    }else {

        alert(result.error || 'Invalid username or password.');
    }
    
});