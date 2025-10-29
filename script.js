
const CLIENTE = "lola";
let fotos = [];
let seleccionadas = [];
let currentId = null;
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzGFMdytceulHbv7t0Fl4ON6jUrSnxKwzBcDdE4NPwo2AzWkeM7z0H0wUkxqYLxcTsc/exec";

// === CARGAR CONFIG (SIN CACHÉ) ===
fetch('./config.json?t=' + Date.now())
  .then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then(data => {
    console.log("CONFIG CARGADO:", data);

    // TÍTULO Y DESCRIPCIÓN
    const tituloEl = document.getElementById("titulo");
    const descEl = document.getElementById("descripcion");
    tituloEl.textContent = data.titulo || "Galería";
    descEl.textContent = data.descripcion || "";

    // PORTADA
    const hero = document.querySelector(".hero");
    const portadaImg = document.getElementById("portada-img");

    if (data.portada && data.portada.includes("1jsw0LHJRXoixD_K2IfofdP0sdm-nPbqm")) {
      console.log("CARGANDO PORTADA:", data.portada);
      portadaImg.src = data.portada;
      hero.style.display = "block";

      portadaImg.onload = () => console.log("PORTADA CARGADA");
      portadaImg.onerror = () => {
        console.error("ERROR PORTADA");
        portadaImg.src = "https://via.placeholder.com/1200x800?text=Portada+No+Cargada";
      };
    } else {
      console.warn("SIN PORTADA");
      hero.style.display = "block";
      portadaImg.style.display = "none";
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
  })
  .catch(err => {
    console.error("ERROR CONFIG:", err);
    document.body.innerHTML = `<h1 style="color:red">Error: ${err.message}</h1>`;
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

// === GUARDAR Y CARGAR ===
function guardarSeleccion() {
  fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cliente: CLIENTE, seleccionadas })
  }).catch(console.error);
}

function cargarSeleccion() {
  fetch(`${SCRIPT_URL}?cliente=${CLIENTE}&t=${Date.now()}`)
    .then(r => r.json())
    .then(data => {
      seleccionadas = data.seleccionadas || [];
      renderizar();
    })
    .catch(() => renderizar());
}
