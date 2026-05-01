const tabs  = document.querySelectorAll(".tab");
const forms = document.querySelectorAll(".form");
const alert = document.getElementById("alert");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        forms.forEach(f => f.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");
        hideAlert();
    });
});

function showAlert(message, type) {
    alert.textContent = message;
    alert.className = `alert ${type}`;
}

function hideAlert() {
    alert.className = "alert hidden";
}

document.getElementById("login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector(".btn");
    const data = {
        email:    e.target.email.value,
        password: e.target.password.value,
    };

    btn.disabled = true;
    btn.textContent = "Logging in...";

    try {
        const res  = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const json = await res.json();

        if (res.ok) {
            localStorage.setItem("token", json.token);
            showAlert(`Welcome back, ${json.user.username}!`, "success");
            e.target.reset();
        } else {
            showAlert(json.message, "error");
        }
    } catch {
        showAlert("Could not connect to the server.", "error");
    } finally {
        btn.disabled = false;
        btn.textContent = "Login";
    }
});

document.getElementById("register").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector(".btn");
    const data = {
        username: e.target.username.value,
        email:    e.target.email.value,
        password: e.target.password.value,
    };

    btn.disabled = true;
    btn.textContent = "Creating account...";

    try {
        const res  = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const json = await res.json();

        if (res.ok) {
            localStorage.setItem("token", json.token);
            showAlert("Account created successfully!", "success");
            e.target.reset();
        } else {
            showAlert(json.message, "error");
        }
    } catch {
        showAlert("Could not connect to the server.", "error");
    } finally {
        btn.disabled = false;
        btn.textContent = "Create Account";
    }
});
