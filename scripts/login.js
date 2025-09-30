document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const mensaje = document.getElementById("mensaje");
    const API_BASE = window.location.hostname.includes("127")
        ? "http://localhost:3000"
        : "https://proyecto-express-backend-cabraleharley.onrender.com";
        console.log(API_BASE)
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
      };
  
      try {
        const res = await fetch(`${API_BASE}/1.5.2/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
  
        const result = await res.json();
  
        if (res.ok) {
          // Guardamos el token y los datos del usuario en localStorage
          localStorage.setItem("token", result.token);
          localStorage.setItem("rol", result.usuario.rol);
  
          // Redirigir según el rol
          if (result.usuario.rol === "admin") {
            window.location.href = "./pages/admin.html";
          } else {
            window.location.href = "./pages/user.html";
          }
        } else {
          mensaje.textContent = "Error: " + (result.error || "Credenciales inválidas");
          mensaje.style.color = "red";
        }
      } catch (error) {
        mensaje.textContent = "Error de conexión con el servidor";
        mensaje.style.color = "red";
      }
    });
  });