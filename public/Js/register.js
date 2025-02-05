document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("Rusername").value;
    const email = document.getElementById("Remail").value;
    const password = document.getElementById("Rpassword").value;


    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Registration successful!");
            clear();
        } else {
            alert(result.error);
            clear();
        }
    } catch (err) {
        console.error("Error registering:", err);
        clear();
    }
});


function clear() {
    document.getElementById("Rusername").value = "";
    document.getElementById("Remail").value = "";
    document.getElementById("Rpassword").value = "";
}