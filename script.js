const CLIENTE = "lola";
let fotos = [];
let seleccionadas = [];
let currentId = null;
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyTgubEcPnkc92MYs-sRXj220lvqtlY69I1L_BL5E_c4GxY-FOba0Yc0WBoTvt2U0X-/exec";

fetch('./config.json?t=' + Date.now())
  .then(r => r.json())
  .then(data => {
    document.getElementById("titulo").textContent = data.titulo;
    document.getElementById("descripcion").textContent = data.descripcion;

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

    fotos = data.fotos;
    cargarSeleccion();
  });

function renderizar() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = fotos.map(f => `
    <div class="thumb" onclick="abrirLightbox('${f.full}', '${f.id}')">
      <img src="${f.thumbnail}" alt="${f.filename}" loading="lazy">
      ${seleccionadas.includes(f.id) ? '<div class="selected">❤️</div>' : ''}
    </div>
  `).join('');
}

function abrirLightbox(url, id) {
  currentId = id;
  document.getElementById("lightbox-img").src = url;
  document.getElementById("lightbox").classList.add("active");
  const btn = document.getElementById("heart-btn");
  const isSelected = seleccionadas.includes(id);
  btn.textContent = isSelected ? "❤️" : "♡";
  btn.className = "heart-btn" + (isSelected ? " filled" : "");
}

document.querySelector(".close").onclick = () => {
  document.getElementById("lightbox").classList.remove("active");
};

document.getElementById("heart-btn").onclick = (e) => {
  e.stopPropagation();
  const i = seleccionadas.indexOf(currentId);
  if (i > -1) seleccionadas.splice(i, 1);
  else seleccionadas.push(currentId);
  guardarSeleccion();
  renderizar();
  e.target.textContent = seleccionadas.includes(currentId) ? "❤️" : "♡";
  e.target.classList.toggle("filled");
};

function guardarSeleccion() {
  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cliente: CLIENTE, seleccionadas })
  });
}

function cargarSeleccion() {
  fetch(`${SCRIPT_URL}?cliente=${CLIENTE}&t=${Date.now()}`)
    .then(r => r.json())
    .then(d => { seleccionadas = d.seleccionadas || []; renderizar(); })
    .catch(() => renderizar());
}
