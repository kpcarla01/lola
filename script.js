// === script.js - VERSIÓN FINAL SIN ERRORES ===

const CLIENTE = "lola";
let fotos = [];
let seleccionadas = [];
let currentId = null;
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyTgubEcPnkc92MYs-sRXj220lvqtlY69I1L_BL5E_c4GxY-FOba0Yc0WBoTvt2U0X-/exec"; // ¡REEMPLAZA CON TU URL!

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
      console.log("ABRIENDO:", f.full);
      abrirLightbox(f.full, f.id);
    });
  });
}

// ABRIR LIGHTBOX
function abrirLightbox(url, id) {
  currentId = id;
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const heartBtn = document.getElementById("heart-btn");

  if (!lightbox || !lightboxImg || !heartBtn) return;

  lightbox.classList.add("active");
  lightboxImg.src = url;

  const isSelected = seleccionadas.includes(id);
  heartBtn.textContent = isSelected ? "❤️" : "♡";
  heartBtn.className = "heart-btn" + (isSelected ? " filled" : "");
}

// CERRAR LIGHTBOX
document.querySelector(".close")?.addEventListener("click", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  lightbox.classList.remove("active");
  setTimeout(() => {
    lightboxImg.src = "";
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
