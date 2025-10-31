const CLIENTE = "lola";
let fotos = [];
let seleccionadas = [];
let currentId = null;
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyTgubEcPnkc92MYs-sRXj220lvqtlY69I1L_BL5E_c4GxY-FOba0Yc0WBoTvt2U0X-/exec";

// === CARGAR CONFIG CON DEBUG ===
fetch('./config.json?t=' + Date.now())
  .then(r => {
    if (!r.ok) throw new Error("No se pudo cargar config.json");
    return r.json();
  })
  .then(data => {
    console.log("CONFIG CARGADO:", data);

    // TÍTULO Y DESCRIPCIÓN
    const tituloEl = document.getElementById("titulo");
    const descEl = document.getElementById("descripcion");
    if (tituloEl) tituloEl.textContent = data.titulo || "Galería";
    if (descEl) descEl.textContent = data.descripcion || "";

    // PORTADA
    const hero = document.querySelector(".hero");
    const portadaImg = document.getElementById("portada-img");
    if (data.portada && portadaImg && hero) {
      portadaImg.src = data.portada;
      hero.style.display = "block";
      console.log("PORTADA CARGADA:", data.portada);
    } else {
      console.warn("SIN PORTADA O FALTA ELEMENTO");
      if (hero) hero.style.display = "none";
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
    console.error("ERROR CARGANDO CONFIG:", err);
    alert("Error: No se pudo cargar la galería. Revisa la consola (F12).");
  });

// === RENDERIZAR GALERÍA ===
function renderizar() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;
  gallery.innerHTML = fotos.map(f => `
    <div class="thumb" onclick="abrirLightbox('${f.full}', '${f.id}')">
      <img src="${f.thumbnail}" alt="${f.filename}" loading="lazy">
      ${seleccionadas.includes(f.id) ? '<div class="selected">❤️</div>' : ''}
    </div>
  `).join('');
}

// === LIGHTBOX ===
function abrirLightbox(url, id) {
  currentId = id;
  const img = document.getElementById("lightbox-img");
  const lightbox = document.getElementById("lightbox");
  const btn = document.getElementById("heart-btn");
  if (img && lightbox && btn) {
    img.src = url;
    lightbox.classList.add("active");
    const isSelected = seleccionadas.includes(id);
    btn.textContent = isSelected ? "❤️" : "♡";
    btn.className = "heart-btn" + (isSelected ? " filled" : "");
  }
}

document.querySelector(".close")?.addEventListener("click", () => {
  document.getElementById("lightbox")?.classList.remove("active");
});

document.getElementById("heart-btn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  const i = seleccionadas.indexOf(currentId);
  if (i > -1) seleccionadas.splice(i, 1);
  else seleccionadas.push(currentId);
  guardarSeleccion();
  renderizar();
  e.target.textContent = seleccionadas.includes(currentId) ? "❤️" : "♡";
  e.target.classList.toggle("filled");
});

// === GUARDAR Y CARGAR SELECCIÓN ===
function guardarSeleccion() {
  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cliente: CLIENTE, seleccionadas })
  }).catch(() => {});
}

function cargarSeleccion() {
  fetch(`${SCRIPT_URL}?cliente=${CLIENTE}&t=${Date.now()}`)
    .then(r => r.json())
    .then(d => {
      seleccionadas = d.seleccionadas || [];
      renderizar();
    })
    .catch(() => renderizar());
}
