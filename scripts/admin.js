document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const API_BASE = window.location.hostname.includes("127")
  ? "http://localhost:3000"
  : "https://proyecto-express-backend-cabraleharley.onrender.com";

const API_PELIS = `${API_BASE}/1.5.2/api/peliculas`;
  const token = localStorage.getItem("token");

  // === LOGOUT ===
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("rol");
      window.location.href = "../index.html";
    });
  }

  // === AÑADIR PELÍCULA ===
  document.getElementById("formAdd").addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const res = await fetch(API_PELIS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
      });
      alert(res.ok ? "Película añadida " : "Error al añadir");
    } catch (err) {
      console.error("Error añadir:", err);
      alert("Error en la petición");
    }
  });

  // === ACTUALIZAR PELÍCULA ===
  document.getElementById("formUpdate").addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const res = await fetch(`${API_PELIS}/${encodeURIComponent(data.titulo)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
      });
      alert(res.ok ? "Película actualizada" : "Error al actualizar");
    } catch (err) {
      console.error("Error actualizar:", err);
      alert("Error en la petición");
    }
  });

  // === ELIMINAR PELÍCULA ===
  document.getElementById("formDelete").addEventListener("submit", async e => {
    e.preventDefault();
    const titulo = e.target.titulo.value;
    try {
      const res = await fetch(`${API_PELIS}/${encodeURIComponent(titulo)}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      });
      alert(res.ok ? "Película eliminada" : "Error al eliminar");
    } catch (err) {
      console.error("Error eliminar:", err);
      alert("Error en la petición");
    }
  });

  // === BUSCAR PELÍCULA ===
  document.getElementById("formSearch").addEventListener("submit", async e => {
    e.preventDefault();
    const titulo = e.target.titulo.value;
    try {
      const res = await fetch(`${API_PELIS}/${encodeURIComponent(titulo)}`, {
        headers: { "Authorization": "Bearer " + token }
      });
      const data = await res.json();

      const contenedor = document.getElementById("resultadoBusqueda");
      if (data && data.titulo) {
        contenedor.innerHTML = `
        <div class="pelicula-card">
        <img src="${data.poster}" alt="${data.titulo}">
        <div>
          <p>${(data.rating ?? 0).toFixed(1)} ⭐</p>
          <p>👀 ${(data.likes?.length || 0) + (data.dislikes?.length || 0)}</p>
        </div>
        <h3 class="titulo">${data.titulo}</h3>
        <button class="btn-vermas" data-titulo="${data.titulo}">Ver más</button>
        </div>
        
        `;

      contenedor.querySelector(".btn-vermas").addEventListener("click", (e) => {
        const titulo = e.target.dataset.titulo;
        window.location.href = `detallePeliAdmin.html?titulo=${encodeURIComponent(titulo)}`;
      });
      } else {
        contenedor.innerHTML = "<p>No se encontró la película.</p>";
      }
    } catch (err) {
      console.error("Error buscar:", err);
      alert("Error en la búsqueda");
    }
  });
});