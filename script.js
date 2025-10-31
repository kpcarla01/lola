const CLIENTE = "lola";
let fotos = [];
let seleccionadas = [];
let currentId = null;
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbylN-biy3sKTYgoaKsTqI5ftwD-dufEdVD9rOKGOZyLMO2ONswR5Wx7dgpBPESx6bas/exec";

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
    cargarSeleccion();
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

    if (seleccionadas.includes(f.id)) {
      const heart = document.createElement("div");
      heart.className = "selected";
      heart.textContent = "❤️";
      thumb.appendChild(heart);
    }

    thumb.appendChild(img);
    gallery.appendChild(thumb);

    thumb.addEventListener("click", () => {
      abrirLightbox(f.full, f.id);
    });
  });
}

function abrirLightbox(url, id) {
  currentId = id;
  const lightbox = document.getElementById("lightbox");
  const container = document.getElementById("lightbox-img-container");
  const heartBtn = document.getElementById("heart-btn");

  // LIMPIAR
  container.innerHTML = "";
  lightbox.style.backgroundImage = "none";

  // FONDO CON THUMB
  const thumbUrl = fotos.find(f => f.id === id)?.thumbnail || "";
  lightbox.style.backgroundImage = `url('${thumbUrl}')`;
  lightbox.style.backgroundSize = "contain";
  lightbox.style.backgroundPosition = "center";
  lightbox.style.backgroundRepeat = "no-repeat";

  lightbox.classList.add("active");

  // CREAR IMAGEN
  const img = new Image();
  img.src = url;
  img.style.opacity = "0";
  img.style.transition = "opacity 0.3s ease";

  img.onload = () => {
    lightbox.style.backgroundImage = "none";
    img.style.opacity = "1";
    img.classList.add("loaded");
    container.appendChild(img);
  };

  img.onerror = () => {
    container.innerHTML = "<p style='color:white;'>Error</p>";
  };

  // CORAZÓN
  const isSelected = seleccionadas.includes(id);
  heartBtn.textContent = isSelected ? "❤️" : "♡";
  heartBtn.className = "heart-btn" + (isSelected ? " filled" : "");
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

// CORAZÓN EN LIGHTBOX
document.getElementById("heart-btn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  const i = seleccionadas.indexOf(currentId);
  if (i > -1) {
    seleccionadas.splice(i, 1);
  } else {
    seleccionadas.push(currentId);
  }
  guardarSeleccion();
  renderizar();
  e.target.textContent = seleccionadas.includes(currentId) ? "❤️" : "♡";
  e.target.classList.toggle("filled");
});

// GUARDAR SELECCIÓN
function guardarSeleccion() {
  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cliente: CLIENTE, seleccionadas })
  }).catch(() => {});
}

// CARGAR SELECCIÓN
function cargarSeleccion() {
  fetch(`${SCRIPT_URL}?cliente=${CLIENTE}&t=${Date.now()}`)
    .then(r => r.json())
    .then(d => {
      seleccionadas = d.seleccionadas || [];
      renderizar();
    })
    .catch(() => renderizar());
}
