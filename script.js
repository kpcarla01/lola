// === script.js - VERSIÓN FINAL SIN ERRORES ===

const CLIENTE = "lola";
let fotos = [];
let seleccionadas = [];
let currentId = null;
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyTgubEcPnkc92MYs-sRXj220lvqtlY69I1L_BL5E_c4GxY-FOba0Yc0WBoTvt2U0X-/exec"; // ¡REEMPLAZA CON TU URL!

fetch('./config.json?t=' + Date.now())
  .then(r => r.json())
  .then(data => {
    document.getElementById("titulo").textContent = data.titulo || "Galería";
    document.getElementById("descripcion").textContent = data.descripcion || "";

    const hero = document.querySelector(".hero");
    const portadaImg = document.getElementById("portada-img");
    if (data.portada) {
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
  });

function renderizar() {
  const gallery = document.getElementById("gallery");
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
      console.log("ABRIENDO FULL:", f.full); // DEBUG
      abrirLightbox(f.full, f.id);
    });
  });
}

function abrirLightbox(url, id) {
  currentId = id;
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const heartBtn = document.getElementById("heart-btn");

  lightbox.classList.add("active");
  lightboxImg.src = url;

  const isSelected = seleccionadas.includes(id);
  heartBtn.textContent = isSelected ? "❤️" : "♡";
  heartBtn.className = "heart-btn" + (isSelected ? " filled" : "");
}

document.querySelector(".close").addEventListener("click", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  lightbox.classList.remove("active");
  setTimeout(() => { lightboxImg.src = ""; }, 300);
});

document.getElementById("heart-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  const i = seleccionadas.indexOf(currentId);
  if (i > -1) seleccionadas.splice(i, 1);
  else seleccionadas.push(currentId);
  guardarSeleccion();
  renderizar();
  e.target.textContent = seleccionadas.includes(currentId) ? "❤️" : "♡";
  e.target.classList.toggle("filled");
});

function guardarSeleccion() {
  fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cliente: CLIENTE, seleccionadas }) });
}

function cargarSeleccion() {
  fetch(`${SCRIPT_URL}?cliente=${CLIENTE}&t=${Date.now()}`)
    .then(r => r.json())
    .then(d => { seleccionadas = d.seleccionadas || []; renderizar(); })
    .catch(() => renderizar());
}
