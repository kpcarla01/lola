const CLIENTE = "lola";
let fotos = [];
let seleccionadas = [];
let currentId = null;
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzGFMdytceulHbv7t0Fl4ON6jUrSnxKwzBcDdE4NPwo2AzWkeM7z0H0wUkxqYLxcTsc/exec";

// === CARGAR CONFIG ===
fetch('./config.json?t=' + Date.now())
  .then(r => r.json())
  .then(data => {
    console.log("Config:", data);

    // TÍTULO Y DESCRIPCIÓN
    document.getElementById("titulo").textContent = data.titulo || "Galería";
    document.getElementById("descripcion").textContent = data.descripcion || "";

    // PORTADA DESDE JSON
    const hero = document.querySelector(".hero");
    const portadaImg = document.getElementById("portada-img");

    if (data.portada) {
      portadaImg.src = data.portada; // Usa la URL del JSON (thumbnail?sz=w1200)
      hero.style.display = "block";
      console.log("PORTADA CARGADA:", data.portada);
      portadaImg.onerror = () => {
        console.error("ERROR CARGANDO PORTADA");
        hero.style.display = "none";
      };
    } else {
      console.warn("SIN PORTADA EN JSON");
      hero.style.display = "none";
    }

    // PASSWORD
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

// === RENDERIZAR GALERÍA ===
function renderizar() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = fotos.map(foto => `
    <div class="thumb" onclick="abrirLightbox('${foto.full}', '${foto.id}')">
      <img src="${foto.thumbnail}" alt="${foto.filename}">
      ${seleccionadas.includes(foto.id) ? '<div class="selected">❤️</div>' : ''}
    </div>
  `).join('');
}

// === LIGHTBOX ===
function abrirLightbox(url, id) {
  currentId = id;
  document.getElementById("lightbox-img").src = url;
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("hidden");
  lightbox.classList.add("active");

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

// === CORAZÓN ===
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

// === GUARDAR SELECCIÓN ===
function guardarSeleccion() {
  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cliente: CLIENTE, seleccionadas })
  }).catch(() => {});
}

// === CARGAR SELECCIÓN ===
function cargarSeleccion() {
  fetch(`${SCRIPT_URL}?cliente=${CLIENTE}&t=${Date.now()}`)
    .then(r => r.json())
    .then(d => {
      seleccionadas = d.seleccionadas || [];
      renderizar();
    })
    .catch(() => renderizar());
}
