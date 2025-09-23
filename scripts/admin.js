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

document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:3000/api/peliculas";
    const token = localStorage.getItem("token");

    // Mostrar/Ocultar sección de gestión
    const gestionarBtn = document.getElementById("gestionarPeliculasBtn");
    const gestionDiv = document.getElementById("gestionPeliculas");

    gestionarBtn.addEventListener("click", () => {
        gestionDiv.style.display = gestionDiv.style.display === "none" ? "block" : "none";
    });



    // Añadir Película
    document.getElementById("formAgregar").addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = {
            titulo: document.getElementById("tituloAdd").value,
            director: document.getElementById("directorAdd").value,
            descripcion: document.getElementById("descripcionAdd").value,
            categoriaId: document.getElementById("categoriaAdd").value,
            fechaPublicacion: document.getElementById("fechaAdd").value,
            poster: document.getElementById("posterAdd").value
        };
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify(data)
        });
        alert(res.ok ? "Película añadida" : "Error al añadir");
    });

    // Buscar Película
    document.getElementById("formBuscar").addEventListener("submit", async (e) => {
        e.preventDefault();
        const titulo = document.getElementById("tituloBuscar").value;
        const res = await fetch(`${API_URL}/${encodeURIComponent(titulo)}`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const result = await res.json();
        document.getElementById("resultadoBuscar").textContent = JSON.stringify(result, null, 2);
        const peliculaJson=JSON.stringify(result, null, 2);
        const contenedor_pelicula_obtenida = document.getElementById("contenedor_pelicula_obtenida")
        contenedor_pelicula_obtenida.innerHTML += `
        <div class="contenedor_pelicula_obtenida">
        <h1>${peliculaJson.titulo}</h1>
        <img src="${result.poster}" alt="Imagen ejemplo">
        </div>
    `;

    });

// Actualizar Película
document.getElementById("formActualizar").addEventListener("submit", async (e) => {
    e.preventDefault();
    const titulo = document.getElementById("tituloUpdate").value;
    const data = {
        director: document.getElementById("nuevoDirector").value,
        fechaPublicacion: document.getElementById("nuevaFecha").value,
        genero: document.getElementById("nuevoGenero").value
    };
    const res = await fetch(`${API_URL}/${encodeURIComponent(titulo)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify(data)
    });
    alert(res.ok ? "Película actualizada ✅" : "Error al actualizar ❌");
});

// Eliminar Película
document.getElementById("formEliminar").addEventListener("submit", async (e) => {
    e.preventDefault();
    const titulo = document.getElementById("tituloDelete").value;
    const res = await fetch(`${API_URL}/${encodeURIComponent(titulo)}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });
    alert(res.ok ? "Película eliminada ✅" : "Error al eliminar ❌");
});
});