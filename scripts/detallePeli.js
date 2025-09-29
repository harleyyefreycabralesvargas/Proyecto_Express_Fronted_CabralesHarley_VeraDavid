document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const titulo = params.get("titulo");

    const API_BASE = window.location.hostname.includes("localhost")
        ? "http://localhost:3000"
        : "https://proyecto-express-backend-cabraleharley.onrender.com";

    const API_PELIS = `${API_BASE}/1.5.2/api/peliculas`;
    const API_RESEÑAS = `${API_BASE}/1.5.2/api/resenas`;
    const token = localStorage.getItem("token");

    const infoDiv = document.getElementById("infoPelicula");
    const reseñasContainer = document.getElementById("reseñasContainer");
    const contenedorForm = document.getElementById("detalle-form");

    // ================= FUNCIONES ================= //

    // Mostrar info de la película
    async function cargarPelicula() {
        const res = await fetch(`${API_PELIS}/${encodeURIComponent(titulo)}`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const pelicula = await res.json();

        const infoDiv = document.getElementById("infoPelicula");
        infoDiv.innerHTML = `
        <div id="acciones">
        <img src="${pelicula.poster}">
        <div id="calificaciones">
        <h2>${(pelicula.rating ?? 0).toFixed(1)} ⭐</h2>
        <h2>👀 ${(pelicula.likes?.length || 0) + (pelicula.dislikes?.length || 0)}</h2>
        </div>
        <p id="contadorLikes"></p>
        </div>

        <div id="contenidoPeli">
        <h1 class="secciones">Titulo: </h1>
        <h1>${pelicula.titulo}</h1>
        <p class="secciones">Descripcion: </p>
        <p>${pelicula.descripcion}</p>
        <p class="secciones">Categoria: </p>
        <p>${pelicula.categoria}</p>
        <p class="secciones">Director: </p>
        <p>${pelicula.director}</p>
        <p class="secciones">Estreno: </p>
        <p>${pelicula.fechaPublicacion}</p>
        </div>
`;

        // 👉 Aquí actualizas el contador
        const contadorLikes = document.getElementById("contadorLikes");
        contadorLikes.innerHTML = `
        <button id="btnLike"><img src ="../imagenes/like.webp"><h2>${pelicula.likes?.length || 0}</h2></button>
        <button id="btnDislike"><img src ="../imagenes/dislike.webp"><h2>${pelicula.dislikes?.length || 0}</h2></button>`;

        // 👉 Y aquí enganchas los botones
        document.getElementById("btnLike").addEventListener("click", async () => {
            const res = await fetch(`${API_PELIS}/${encodeURIComponent(titulo)}/like`, {
                method: "POST",
                headers: { "Authorization": "Bearer " + token }
            });
            if (res.ok) {
                cargarPelicula(); // recargar para actualizar contador
            }
        });

        document.getElementById("btnDislike").addEventListener("click", async () => {
            const res = await fetch(`${API_PELIS}/${encodeURIComponent(titulo)}/dislike`, {
                method: "POST",
                headers: { "Authorization": "Bearer " + token }
            });
            if (res.ok) {
                cargarPelicula(); // recargar para actualizar contador
            }
        });
    }

    // Listar reseñas
    async function cargarReseñas() {
        reseñasContainer.innerHTML = "Cargando...";
        const res = await fetch(`${API_RESEÑAS}/${encodeURIComponent(titulo)}`, {
            headers: { Authorization: "Bearer " + token },
        });
        const data = await res.json();

        if (!data.length) {
            reseñasContainer.innerHTML = "<p>No hay reseñas aún.</p>";
            return;
        }

        reseñasContainer.innerHTML = "";
        data.forEach((r) => {
            const div = document.createElement("div");
            div.classList.add("reseña-card");
            div.innerHTML = `
          <h2>${r.usuario}</h2>
          <h2>${r.calificacion}/10 ⭐</h2>
          <p>${r.texto}</p>
          <small>📅 ${r.fecha}</small>
        `;
            reseñasContainer.appendChild(div);
        });
    }

    // Mostrar formulario edición
    function mostrarFormularioEdicion(reseña) {
        contenedorForm.innerHTML = `
        <h3>Editar reseña</h3>
        <form id="formEditarReseña">
          <textarea id="textoReseña" required>${reseña.texto}</textarea>
          <label for="calificacion">Calificación (1-10):</label>
          <select id="calificacion" required>
            ${[...Array(10)].map((_, i) => {
            const val = i + 1;
            return `<option value="${val}" ${reseña.calificacion === val ? "selected" : ""}>${val} ⭐</option>`;
        }).join("")}
          </select>
          <button type="submit">Guardar cambios</button>
        </form>
      `;

        document.getElementById("formEditarReseña").addEventListener("submit", async (e) => {
            e.preventDefault();
            const texto = document.getElementById("textoReseña").value;
            const calificacion = Number(document.getElementById("calificacion").value);
            console.log("Enviando actualización:", {
                id: reseña._id,
                texto: texto,
                calificacion: calificacion,
            });
            const resPut = await fetch(`${API_RESEÑAS}/${reseña._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({ texto, calificacion }),
            });

            if (resPut.ok) {
                alert("Reseña actualizada");
                location.reload();
            } else {
                alert("Error al editar reseña");
            }
        });
    }

    // Revisar si el usuario ya tiene reseña
    async function cargarMiReseña() {
        const res = await fetch(`${API_RESEÑAS}/mias/${encodeURIComponent(titulo)}`, {
            headers: { Authorization: "Bearer " + token },
        });

        if (res.ok) {
            const reseña = await res.json();
            contenedorForm.innerHTML = `
          <h3>Tu reseña</h3>
          <strong>Calificación:</strong> 
          <p class="calificacion">${reseña.calificacion}⭐</p>
          <p><strong>Comentario:</strong> ${reseña.texto}</p>
          <button id="editarReseña">✏️ Editar</button>
          <button id="eliminarReseña">🗑️ Eliminar</button>
        `;

            document.getElementById("editarReseña").addEventListener("click", () => {
                mostrarFormularioEdicion(reseña);
            });

            document.getElementById("eliminarReseña").addEventListener("click", async () => {
                if (confirm("¿Seguro que quieres eliminar tu reseña?")) {
                    const resDel = await fetch(`${API_RESEÑAS}/${reseña._id}`, {
                        method: "DELETE",
                        headers: { Authorization: "Bearer " + token },
                    });
                    if (resDel.ok) {
                        alert("Reseña eliminada");
                        location.reload();
                    }
                }
            });
        } else {
            contenedorForm.innerHTML = `
          <h3>Escribir reseña</h3>
          <form id="formReseña">
            <textarea id="textoReseña" placeholder="Escribe tu reseña aquí..." required></textarea>
            <label for="calificacion">Calificación (1-10):</label>
            <select id="calificacion" required>
              ${[...Array(10)].map((_, i) => `<option value="${i + 1}">${i + 1} ⭐</option>`).join("")}
            </select>
            <button type="submit">Enviar reseña</button>
          </form>
        `;

            document.getElementById("formReseña").addEventListener("submit", async (e) => {
                e.preventDefault();
                const texto = document.getElementById("textoReseña").value;
                const calificacion = Number(document.getElementById("calificacion").value);

                const resPost = await fetch(API_RESEÑAS, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    body: JSON.stringify({ titulo, texto, calificacion }),
                });

                if (resPost.ok) {
                    alert("Reseña enviada ");
                    location.reload();
                } else {
                    alert("Error al enviar reseña");
                }
            });
        }
    }

    // ================= INICIO ================= //

    await cargarPelicula();
    await cargarReseñas();
    await cargarMiReseña();

    // Botón volver
    document.getElementById("btnVolver").addEventListener("click", () => {
        window.location.href = "user.html";
    });
});

