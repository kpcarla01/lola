const CLIENTE = "lola"; // Cambia por cliente
let fotos = [];
let seleccionadas = [];
let currentId = null;
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyuh3QiQkwpTKwWg4zuUTD9k-gBbrUXxinb_Ekv4F4jbVUQzfQei76PlS5VUl_UxIbD/exec"; // Ej: "https://script.google.com/macros/s/AKfyc.../exec"

// Cargar configuración
fetch(`./config.json`)
  .then(r => r.json())
  .then(data => {
    document.getElementById("titulo").textContent = data.titulo;
    document.getElementById("descripcion").textContent = data.descripcion;
    if (data.password) {
      const pass = prompt("Contraseña:");
      if (pass !== data.password) location.href = "/";
    }
    fotos = data.fotos;
    cargarSeleccion();
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
  // Actualizar lightbox
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
