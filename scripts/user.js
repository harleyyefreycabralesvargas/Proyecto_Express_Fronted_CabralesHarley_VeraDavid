document.addEventListener("DOMContentLoaded", () => {
  // === CONFIG ===
  const API_PELIS = "http://localhost:3000/v8/api/peliculas";
  const token = localStorage.getItem("token");

  // === LOGOUT ===
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("rol");
      window.location.href = "../index.html";
    });
  }

  // === CONTENEDORES ===
  const contenedor = document.getElementById("peliculasContainer");
  const categoriasContainer = document.getElementById("categoriasContainer");

  // === RENDER DE PELÍCULAS ===
  function renderPeliculas(peliculas, target = contenedor) {
    categoriasContainer.style.display = "none";  // oculto categorías
    contenedor.style.display = "grid";
    target.innerHTML = "";
    if (!peliculas.length) {
      target.innerHTML = "<p>No se encontraron películas.</p>";
      return;
    }

    peliculas.forEach(p => {
      const div = document.createElement("div");
      div.classList.add("pelicula-card");
      div.innerHTML = `
        <img src="${p.poster}" alt="${p.titulo}">
        <div>
          <p>${(p.rating ?? 0).toFixed(1)} ⭐</p>
          <p>👀 ${(p.likes?.length || 0) + (p.dislikes?.length || 0)}</p>
        </div>
        <h3 class="titulo">${p.titulo}</h3>
        <button class="btn-vermas" data-titulo="${p.titulo}">Ver más</button>
      `;

      div.querySelector(".btn-vermas").addEventListener("click", (e) => {
        const titulo = e.target.dataset.titulo;
        window.location.href = `detallePeli.html?titulo=${encodeURIComponent(titulo)}`;
      });

      target.appendChild(div);
    });
  }

  // === FUNCIONES FETCH ===
  async function fetchPeliculas(endpoint) {
    const res = await fetch(`${API_PELIS}/extra/${endpoint}`, {
      headers: { "Authorization": "Bearer " + token }
    });
    return res.json();
  }

  // === BOTONES FILTROS ===
  document.getElementById("btnRandom")?.addEventListener("click", async () => {
    renderPeliculas(await fetchPeliculas("random"));
  });

  document.getElementById("btnTopRated")?.addEventListener("click", async () => {
    renderPeliculas(await fetchPeliculas("top-rated"));
  });

  document.getElementById("btnMostViewed")?.addEventListener("click", async () => {
    renderPeliculas(await fetchPeliculas("most-viewed"));
  });

  // === VER POR CATEGORÍAS ===
  document.getElementById("btnCategorias")?.addEventListener("click", async () => {
    peliculasContainer.style.display = "none";   // oculto grid
    categoriasContainer.style.display = "block"; // muestro categorías
    categoriasContainer.innerHTML = "";

    const porCategoria = await fetchPeliculas("random");
    if (!porCategoria.length) {
      categoriasContainer.innerHTML = "<p>No se encontraron películas.</p>";
      return;
    }

    porCategoria.forEach(p => {
      let seccion = document.getElementById(`cat-${p.categoria}`);
      if (!seccion) {
        seccion = document.createElement("div");
        seccion.id = `cat-${p.categoria}`;
        seccion.classList.add("categoria-section");
        seccion.innerHTML = `
        <h2 class="categoria-titulo">${p.categoria}</h2>
        <div class="pelis-row"></div>
      `;
        categoriasContainer.appendChild(seccion);
      }

      const card = document.createElement("div");
      card.classList.add("peliculas-card");
      card.innerHTML = `
      <img src="${p.poster}" alt="${p.titulo}">
        <div>
          <p>${(p.rating ?? 0).toFixed(1)} ⭐</p>
          <p>👀 ${(p.likes?.length || 0) + (p.dislikes?.length || 0)}</p>
        </div>
        <h3 class="titulo">${p.titulo}</h3>
        <button class="btn-vermas" data-titulo="${p.titulo}">Ver más</button>
    `;
      card.querySelector(".btn-vermas").addEventListener("click", (e) => {
        const titulo = e.target.dataset.titulo;
        window.location.href = `detallePeli.html?titulo=${encodeURIComponent(titulo)}`;
      });

      seccion.querySelector(".pelis-row").appendChild(card);
    });
  });

  // === CARRUSEL CON ESCALADO ===
  const carruselTrack = document.getElementById("carruselTrack");

  let peliculasCarrusel = [];
  let currentIndex = 0;
  let autoSlideInterval = null;
  const VISIBLE = 5;

  async function cargarCarrusel() {
    try {
      let data = await fetchPeliculas("random");
      if (!Array.isArray(data)) data = [data];

      if (data.length < VISIBLE) {
        const clone = [];
        while (clone.length < VISIBLE) {
          clone.push(...data);
        }
        data = clone.slice(0, VISIBLE);
      }

      peliculasCarrusel = data;
      renderCarruselItems();
      currentIndex = 0;
      updateCarrusel();
      iniciarAutoSlide();
    } catch (err) {
      console.error("Error cargarCarrusel:", err);
    }
  }

  function renderCarruselItems() {
    carruselTrack.innerHTML = peliculasCarrusel.map((p, i) => `
      <div class="carrusel-item" data-index="${i}">
        <img src="${p.poster}" alt="${p.titulo}">
        <p style="color:#fff; font-size:12px; margin-top:6px;">${p.titulo}</p>
      </div>
    `).join("");
  }

  function wrapIndex(i) {
    const n = peliculasCarrusel.length;
    return ((i % n) + n) % n;
  }

  function updateCarrusel() {
    const items = document.querySelectorAll(".carrusel-item");
    if (!items.length) return;

    const visibles = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--visible')
    ) || 5;

    items.forEach(el => el.className = "carrusel-item hidden");

    let half = Math.floor(visibles / 2);

    for (let offset = -half; offset <= half; offset++) {
      const idx = wrapIndex(currentIndex + offset);
      const el = items[idx];
      if (!el) continue;

      if (offset === 0) {
        el.classList.add("center");
      } else if (Math.abs(offset) === 1) {
        el.classList.add("near");
      } else if (Math.abs(offset) === 2 && visibles >= 5) {
        el.classList.add("far");
      }

      el.classList.remove("hidden");
    }

    const firstItem = items[0];
    const gap = parseFloat(getComputedStyle(carruselTrack).gap) || 0;
    const itemW = firstItem.offsetWidth;
    const step = itemW + gap;

    const translateX = -((currentIndex - half) * step);
    carruselTrack.style.transform = `translateX(${translateX}px)`;
  }

  function nextSlide() {
    currentIndex = wrapIndex(currentIndex + 1);
    updateCarrusel();
  }

  function iniciarAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 3000);
  }

  cargarCarrusel();

  // === REDIRECCIÓN AL DETALLE ===
  window.verDetalle = (titulo) => {
    window.location.href = `detallePeli.html?titulo=${encodeURIComponent(titulo)}`;
  };
});