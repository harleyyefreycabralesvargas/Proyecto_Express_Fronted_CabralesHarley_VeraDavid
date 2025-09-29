const form = document.getElementById("registerForm");
const mensaje = document.getElementById("mensaje");
const API_BASE = window.location.hostname.includes("localhost")
        ? "http://localhost:3000"
        : "https://proyecto-express-backend-cabraleharley.onrender.com";
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nombre: document.getElementById("nombre").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  try {
    const res = await fetch(`${API_BASE}/1.5.2/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      mensaje.textContent = "Usuario registrado con éxito";
      mensaje.style.color = "green";
      form.reset();
    } else {
      mensaje.textContent = "Error: " + (result.error || "No se pudo registrar");
      mensaje.style.color = "red";
    }
  } catch (error) {
    mensaje.textContent = "Error de conexión con el servidor";
    mensaje.style.color = "red";
  }
});