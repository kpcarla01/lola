const CLIENTE = "lola";
let fotos = [];

// CARGAR CONFIG
fetch('./config.json?t=' + Date.now())
  .then(r => r.json())
  .then(data => {
    document.getElementById("titulo").textContent = data.titulo || "Galería";
    document.getElementById("descripcion").textContent = data.descripcion || "";

    const hero = document.querySelector(".hero");
    const portadaImg = document.getElementById("portada-img");
    if (data.portada && portadaImg && hero) {
      portadaImg.src = data.portada;
      hero.style.display = "block";
    }

    if (data.password) {
      const pass = prompt("Contraseña:");
      if (pass !== data.password) {
        alert("Incorrecta");
        location.href = "about:blank";
      }
    }

    fotos = data.fotos || [];
    renderizar();
  })
  .catch(err => {
    console.error("Error config:", err);
    alert("Error cargando galería");
  });

// RENDERIZAR GALERÍA
function renderizar() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;
  gallery.innerHTML = "";

  fotos.forEach(f => {
    const thumb = document.createElement("div");
    thumb.className = "thumb";

    const img = document.createElement("img");
    img.src = f.thumbnail;
    img.alt = f.filename;
    img.loading = "lazy";

    thumb.appendChild(img);
    gallery.appendChild(thumb);

    thumb.addEventListener("click", () => {
      abrirLightbox(f.full);
    });
  });
}

// ABRIR LIGHTBOX – SIN CORAZÓN
function abrirLightbox(url) {
  const lightbox = document.getElementById("lightbox");
  const container = document.getElementById("lightbox-img-container");

  // LIMPIAR
  container.innerHTML = "";
  lightbox.style.backgroundImage = "none";

  // SPINNER
  container.innerHTML = '<div class="spinner">Cargando...</div>';

  lightbox.classList.add("active");

  // IMAGEN GRANDE
  const img = new Image();
  img.src = url;
  img.style.opacity = "0";
  img.style.transition = "opacity 0.5s ease";

  img.onload = () => {
    container.innerHTML = "";
    img.style.opacity = "1";
    img.classList.add("loaded");
    container.appendChild(img);
  };

  img.onerror = () => {
    container.innerHTML = '<p style="color:white;">Error</p>';
  };
}

// CERRAR LIGHTBOX
document.querySelector(".close")?.addEventListener("click", () => {
  const lightbox = document.getElementById("lightbox");
  const container = document.getElementById("lightbox-img-container");
  lightbox.classList.remove("active");
  setTimeout(() => {
    container.innerHTML = "";
    lightbox.style.backgroundImage = "none";
  }, 300);
});
