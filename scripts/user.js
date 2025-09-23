document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", () => {
        // Borrar datos guardados
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        // Redirigir al login
        window.location.href = "../index.html";
    });
});