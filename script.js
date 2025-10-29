const CLIENTE = "lola"; // Cambia por cliente
let fotos = [];
let seleccionadas = [];
let currentId = null;
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzGFMdytceulHbv7t0Fl4ON6jUrSnxKwzBcDdE4NPwo2AzWkeM7z0H0wUkxqYLxcTsc/exec"; // Ej: "https://script.google.com/macros/s/AKfyc.../exec"

// Cargar configuración
fetch('./config.json')
  .then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
    return r.json();
  })
  .then(data => {
    console.log("Config cargado:", data);

    // Título y descripción
    document.getElementById("titulo").textContent = data.titulo;
    document.getElementById("descripcion").textContent = data.descripcion;

// Portada
if (data.portada) {
  document.getElementById("portada-img").src = data.portada;
} else {
  document.querySelector(".hero").style.display = "none";
}

    // Password
    if (data.password) {
      const pass = prompt("Contraseña:");
      if (pass !== data.password) location.href = "/";
    }

    fotos = data.fotos;
    cargarSeleccion();
  })
  .catch(err => {
    console.error("Error cargando config.json:", err);
    document.body.innerHTML = `<h1 style="text-align:center; color:red;">Error: ${err.message}</h1>`;
  });

// Renderizar galería
function renderizar() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = fotos.map(foto => `
    <div class="thumb" onclick="abrirLightbox('${foto.full}', '${foto.id}')">
      <img src="${foto.thumbnail}" alt="${foto.filename}">
      ${seleccionadas.includes(foto.id) ? '<div class="selected">❤️</div>' : ''}
    </div>
  `).join('');
}

// Lightbox
function abrirLightbox(url, id) {
  currentId = id;
  document.getElementById("lightbox-img").src = url;
  document.getElementById("lightbox").classList.remove("hidden");
  document.getElementById("lightbox").classList.add("active");
  
  const heart = document.getElementById("heart-btn");
  const isSelected = seleccionadas.includes(id);
  heart.textContent = isSelected ? "❤️" : "♡";
  heart.className = "heart-btn" + (isSelected ? " filled" : "");
}

document.querySelector(".close").onclick = () => {
  document.getElementById("lightbox").classList.remove("active");
};

document.getElementById("lightbox").onclick = (e) => {
  if (e.target === document.getElementById("lightbox")) {
    document.getElementById("lightbox").classList.remove("active");
  }
};

document.getElementById("heart-btn").onclick = (e) => {
  e.stopPropagation();
  toggleCorazon(currentId);
};

// Toggle corazón
function toggleCorazon(id) {
  const index = seleccionadas.indexOf(id);
  if (index > -1) {
    seleccionadas.splice(index, 1);
  } else {
    seleccionadas.push(id);
  }
  guardarSeleccion();
  renderizar();
  const heart = document.getElementById("heart-btn");
  const isSelected = seleccionadas.includes(id);
  heart.textContent = isSelected ? "❤️" : "♡";
  heart.className = "heart-btn" + (isSelected ? " filled" : "");
}

// Guardar en Google Sheets
function guardarSeleccion() {
  fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cliente: CLIENTE, seleccionadas })
  }).catch(console.error);
}

function cargarSeleccion() {
  fetch(`${SCRIPT_URL}?cliente=${CLIENTE}`)
    .then(r => r.json())
    .then(data => {
      seleccionadas = data.seleccionadas || [];
      renderizar();
    })
    .catch(console.error);
}
