# Frontend Proyecto Películas

Este es el **frontend** de la aplicación de gestión y visualización de películas.  
Fue desarrollado con **HTML, CSS y JavaScript Vanilla**, y se conecta al backend mediante **fetch API** con autenticación JWT.

---

## Tecnologías utilizadas
- **HTML5** → estructura de las vistas.  
- **CSS3** → estilos personalizados y diseño responsive.  
- **JavaScript (ES6+)** → lógica del cliente y comunicación con el backend.  
- **LocalStorage** → almacenamiento del token JWT y rol de usuario.  
- **Fetch API** → peticiones HTTP al backend.  






## Funcionalidades principales

### Autenticación
- Login y registro de usuarios.  
- El token JWT se guarda en **localStorage** y se envía en cada petición al backend.  
- Si el token expira o es inválido, se redirige al login.  

### Películas
- Ver películas en un **carrusel animado** con escalado:  
  - 5 visibles → centro grande, laterales medianos y extremos pequeños.  
  - Desplazamiento automático de derecha a izquierda.  
- Filtros:  
  - **Categorizadas** 
  - **Aleatorias (Random)**  
  - **Mejor valoradas (Top Rated)**  
  - **Más vistas (Most Viewed)**  
- Buscador de películas por título con **regex** 

### Detalle de Película
- Información detallada: título, descripción, director, póster.  
- Sistema de **reseñas**:  
  - Cada usuario solo puede dejar una reseña por película.  
  - Posibilidad de editar o eliminar la reseña propia.  
- Cálculo dinámico del **promedio de calificaciones**.  
- Likes / dislikes con conteo en tiempo real.  

### Panel de Administración
- CRUD completo de películas (solo usuarios admin):  
  - **Añadir**  
  - **Actualizar**  
  - **Eliminar**  
  - **Buscar**  
- El diseño es **responsive**:  
  - En pantallas grandes se muestran las 4 secciones lado a lado.  
  - En móviles se muestra una por fila (ocupan todo el ancho).  

---

## Variables importantes en el frontend

- localStorage.token → guarda el JWT del usuario.  
- localStorage.rol → guarda el rol (user o admin).  
- API_PELIS → URL base para películas.  
- API_RESEÑAS → URL base para reseñas.  

---

## Cómo ejecutar

1. Clonar el repositorio:  
   ```bash 
   git clone https://github.com/harleyyefreycabralesvargas/Proyecto_Express_Fronted_CabralesHarley_VeraDavid
Abrir index.html en el navegador (se recomienda usar Live Server de VSCode).

Asegurarse de que el backend esté corriendo en http://localhost:3000.