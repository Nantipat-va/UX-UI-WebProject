const registerButton = document.getElementById("register");
const loginButton = document.getElementById("login");
const container = document.getElementById("container");

registerButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

loginButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});


// login system
document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("Lusername").value;
    const password = document.getElementById("Lpassword").value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        
        if (response.ok) {
            localStorage.setItem('username', result.user.username);
            localStorage.setItem('idUser', result.user.idUser);
            localStorage.setItem('email', result.user.email);
            localStorage.setItem('pass', result.user.password);

            clear();
            window.location.href = "../views/main.html";
        } else {
            alert(result.error);
            clear();
        }
    } catch (err) {
        console.error("Error logging in:", err);
        clear();
    }
});

function clear() {
    document.getElementById("Lusername").value = "";
    document.getElementById("Lpassword").value = "";
}

