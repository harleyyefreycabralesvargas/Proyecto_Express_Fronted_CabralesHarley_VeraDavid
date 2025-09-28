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
    const modal = document.getElementById("crudModal");
    const closeBtn = document.querySelector(".close");
    const modalBody = document.getElementById("modalBody");
  
    const API_PELIS = "http://localhost:3000/v8/api/peliculas";
    const API_CAT = "http://localhost:3000/v8/api/categorias";
    const token = localStorage.getItem("token");
  
    // Toggle de menús
    document.querySelectorAll(".menu-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const options = btn.nextElementSibling;
        options.style.display = options.style.display === "block" ? "none" : "block";
      });
    });
  
    // Abrir modal con formulario según acción
    document.querySelectorAll(".menu-options button").forEach(item => {
      item.addEventListener("click", () => {
        const action = item.dataset.action;
        let formHtml = "";
  
        /* ===== FORMULARIOS PELÍCULAS ===== */
        if (action === "add-pelicula") {
          formHtml = `
            <h3>Añadir Película</h3>
            <form id="formAddPeli">
              <input type="text" name="titulo" placeholder="Título" required><br>
              <input type="text" name="director" placeholder="Director"><br>
              <textarea name="descripcion" placeholder="Descripción"></textarea><br>
              <input type="text" name="categoria" placeholder="Categoría" required><br>
              <input type="date" name="fechaPublicacion" required><br>
              <input type="text" name="poster" placeholder="Poster (URL)"><br>
              <button type="submit">Guardar</button>
            </form>
          `;
        } else if (action === "update-pelicula") {
          formHtml = `
            <h3>Actualizar Película</h3>
            <form id="formUpdatePeli">
              <input type="text" name="titulo" placeholder="Título a actualizar" required><br>
              <input type="text" name="descripcion" placeholder="Nueva descripción"><br>
              <input type="number" name="categoria" placeholder="Nuevo ID Categoría"><br>
              <input type="date" name="fechaPublicacion"><br>
              <input type="text" name="poster" placeholder="Nuevo Poster (URL)"><br>
              <button type="submit">Actualizar</button>
            </form>
          `;
        } else if (action === "delete-pelicula") {
          formHtml = `
            <h3>Eliminar Película</h3>
            <form id="formDeletePeli">
              <input type="text" name="titulo" placeholder="Título a eliminar" required><br>
              <button type="submit">Eliminar</button>
            </form>
          `;
        } else if (action === "search-pelicula") {
          formHtml = `
            <h3>Buscar Película</h3>
            <form id="formSearchPeli">
              <input type="text" name="titulo" placeholder="Título a buscar" required><br>
              <button type="submit">Buscar</button>
            </form>
            <div id="resultadoPeli"></div>
          `;
        }
  
        /* ===== FORMULARIOS CATEGORÍAS ===== */
        else if (action === "add-categoria") {
          formHtml = `
            <h3>Añadir Categoría</h3>
            <form id="formAddCat">
              <input type="text" name="nombre" placeholder="Nombre" required><br>
              <textarea name="descripcion" placeholder="Descripción" required></textarea><br>
              <button type="submit">Guardar</button>
            </form>
          `;
        } else if (action === "update-categoria") {
          formHtml = `
            <h3>Actualizar Categoría</h3>
            <form id="formUpdateCat">
              <input type="number" name="categoria" placeholder="ID existente" required><br>
              <input type="text" name="nombre" placeholder="Nuevo nombre"><br>
              <textarea name="descripcion" placeholder="Nueva descripción"></textarea><br>
              <button type="submit">Actualizar</button>
            </form>
          `;
        } else if (action === "delete-categoria") {
          formHtml = `
            <h3>Eliminar Categoría</h3>
            <form id="formDeleteCat">
              <input type="number" name="categoria" placeholder="ID a eliminar" required><br>
              <button type="submit">Eliminar</button>
            </form>
          `;
        } else if (action === "search-categoria") {
          formHtml = `
            <h3>Buscar Categoría</h3>
            <form id="formSearchCat">
              <input type="number" name="categoria" placeholder="ID a buscar" required><br>
              <button type="submit">Buscar</button>
            </form>
            <div id="resultadoCat"></div>
          `;
        }
  
        modalBody.innerHTML = formHtml;
        modal.style.display = "flex";
        item.parentElement.style.display = "none"; // cerrar menú
        attachFormHandlers(action); // conectar el fetch
      });
    });
  
    // Cerrar modal
    closeBtn.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });
  
    // ===== Conectar formularios con el backend =====
    function attachFormHandlers(action) {
      // === PELÍCULAS ===
      if (action === "add-pelicula") {
        document.getElementById("formAddPeli").addEventListener("submit", async e => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(e.target));
          const res = await fetch(API_PELIS, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify(data)
          });
          alert(res.ok ? "Película añadida " : "Error ");
        });
      }
      if (action === "update-pelicula") {
        document.getElementById("formUpdatePeli").addEventListener("submit", async e => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(e.target));
          const res = await fetch(`${API_PELIS}/${encodeURIComponent(data.titulo)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify(data)
          });
          alert(res.ok ? "Película actualizada " : "Error ");
        });
      }
      if (action === "delete-pelicula") {
        document.getElementById("formDeletePeli").addEventListener("submit", async e => {
          e.preventDefault();
          const titulo = e.target.titulo.value;
          const res = await fetch(`${API_PELIS}/${encodeURIComponent(titulo)}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
          });
          alert(res.ok ? "Película eliminada " : "Error ");
        });
      }
      if (action === "search-pelicula") {
        document.getElementById("formSearchPeli").addEventListener("submit", async e => {
          e.preventDefault();
          const titulo = e.target.titulo.value;
          const res = await fetch(`${API_PELIS}/${encodeURIComponent(titulo)}`, {
            headers: { "Authorization": "Bearer " + token }
          });
          const data = await res.json();
          const contenedor_buscar_peli=document.getElementById("resultadoPeli");
          contenedor_buscar_peli.innerHTML=`
          <div class="contenedor_pelicula_obtenida">
        <h1>Titulo: ${data.titulo}</h1>
        <img src=${data.poster} alt="Imagen ejemplo">
        <h3>Director: ${data.director}</h3>
        <p>Descripcion: ${data.descripcion}</p>
        </div>
          `
        });
      }
  
      // === CATEGORÍAS ===
      if (action === "add-categoria") {
        document.getElementById("formAddCat").addEventListener("submit", async e => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(e.target));
          const res = await fetch(API_CAT, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify(data)
          });
          alert(res.ok ? "Categoría añadida " : "Error ");
        });
      }
      if (action === "update-categoria") {
        document.getElementById("formUpdateCat").addEventListener("submit", async e => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(e.target));
          const res = await fetch(`${API_CAT}/${data.categoria}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify(data)
          });
          alert(res.ok ? "Categoría actualizada " : "Error ");
        });
      }
      if (action === "delete-categoria") {
        document.getElementById("formDeleteCat").addEventListener("submit", async e => {
          e.preventDefault();
          const id = e.target.categoria.value;
          const res = await fetch(`${API_CAT}/${id}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
          });
          alert(res.ok ? "Categoría eliminada " : "Error ");
        });
      }
      if (action === "search-categoria") {
        document.getElementById("formSearchCat").addEventListener("submit", async e => {
          e.preventDefault();
          const id = e.target.categoria.value;
          const res = await fetch(`${API_CAT}/${id}`, {
            headers: { "Authorization": "Bearer " + token }
          });
          const data = await res.json();
          document.getElementById("resultadoCat").textContent = JSON.stringify(data, null, 2);
        });
      }
    }
  });