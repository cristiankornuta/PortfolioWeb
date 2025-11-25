/* =========================================================
   ANIMACIÓN DEL CANVAS
   ========================================================= */

const canvas = document.getElementById("dataCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const POINTS_COUNT = 50;
  const MAX_DISTANCE = 150;
  const points = [];

  function randomColor() {
    const r = Math.floor(Math.random() * 200 + 55);
    const g = Math.floor(Math.random() * 200 + 55);
    const b = Math.floor(Math.random() * 200 + 55);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function randomSpeed() {
    return (Math.random() - 0.5) * 0.5;
  }

  for (let i = 0; i < POINTS_COUNT; i++) {
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: randomSpeed(),
      vy: randomSpeed(),
      radius: Math.random() * 3 + 2,
      color: randomColor(),
      changeTimer: Math.random() * 100
    });
  }

  function drawLines() {
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DISTANCE) {
          const alpha = 1 - dist / MAX_DISTANCE;
          ctx.strokeStyle = `rgba(50, 150, 250, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function drawPoints() {
    points.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      p.changeTimer--;
      if (p.changeTimer <= 0) {
        p.color = randomColor();
        p.radius = Math.random() * 3 + 2;
        p.changeTimer = Math.random() * 200 + 50;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLines();
    drawPoints();
    requestAnimationFrame(animate);
  }

  animate();
}

/* =========================================================
   CÁLCULO AUTOMÁTICO DE PERÍODOS
   ========================================================= */

function calcularPeriodos() {
  const elementos = document.querySelectorAll('.periodo');
  const anioActual = new Date().getFullYear();

  elementos.forEach(e => {
    const inicio = parseInt(e.dataset.start);
    const fin = e.dataset.end === "actual" ? anioActual : parseInt(e.dataset.end);
    const total = fin - inicio + 1;

    e.textContent = ` • (${total} año${total > 1 ? 's' : ''})`;
  });
}
calcularPeriodos();

/* =========================================================
   CONTADORES DE TEMÁTICAS
   ========================================================= */

function actualizarContadoresTematicas() {
  const conteo = {};

  items.forEach(item => {
    const visiblePorArea = (selectedArea === "all" || item.dataset.area === selectedArea);

    if (visiblePorArea) {
      const tags = item.dataset.tags.split(" ");
      tags.forEach(t => {
        if (!conteo[t]) conteo[t] = 0;
        conteo[t]++;
      });
    }
  });

  tagBtns.forEach(btn => {
    const tag = btn.dataset.tag;

    if (tag === "all") {
      btn.textContent = "Todas";
    } else {
      const count = conteo[tag] || 0;

      const nombreOriginal =
        btn.textContent.split(" (")[0]; // Evita duplicar números

      btn.textContent = `${nombreOriginal} (${count})`;
    }
  });

/* Ejecuta los contadores al inicio */
actualizarContadoresTematicas();

/* =========================================================
   FILTROS FORMACION
   ========================================================= */

    let selectedArea = "all";
    let selectedTag = "all";

    const areaBtns = document.querySelectorAll(".filter-btn");
    const tagBtns = document.querySelectorAll(".tag-filter-btn");
    const items = document.querySelectorAll(".timeline-item");

    function updateTagCounts() {
      const tagCounts = {};

      items.forEach(item => {
        const visibleArea = selectedArea === "all" || item.dataset.area === selectedArea;
        if (visibleArea) {
          const tags = item.dataset.tags.split(" ");
          tags.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1);
        }
      });

      tagBtns.forEach(btn => {
        const tag = btn.dataset.tag;
        btn.innerText = tag === "all" ? "Todas" : `${tag} (${tagCounts[tag] || 0})`;
      });
    }

    function applyFilters() {
      items.forEach(item => {
        const areaMatch = selectedArea === "all" || item.dataset.area === selectedArea;

        // CORRECCIÓN IMPORTANTE AQUÍ
        const tagList = item.dataset.tags.split(" ");
        const tagMatch = selectedTag === "all" || tagList.includes(selectedTag);

        item.style.display = areaMatch && tagMatch ? "block" : "none";
      });

      updateTagCounts();
    }


    areaBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        areaBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedArea = btn.dataset.filter;
        applyFilters();
      });
    });

    tagBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tagBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedTag = btn.dataset.tag;
        applyFilters();
      });
    });

    updateTagCounts();
}

/* =========================================================
    FILTRO POR TEMÁTICAS 
    ========================================================= */

// Selección de botones de filtro por área y elementos timeline
const botones = document.querySelectorAll('.filter-btn');
const items = document.querySelectorAll('.timeline-item');

let selectedArea = "all";  // Inicialmente "Todas" para mostrar todos los items

// Filtrado por área
botones.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remover la clase 'active' de todos los botones
    botones.forEach(b => b.classList.remove('active'));
    
    // Agregar la clase 'active' al botón seleccionado
    btn.classList.add('active');

    // Establecer el área seleccionada
    selectedArea = btn.dataset.filter;
    
    // Aplicar el filtro
    aplicarFiltros();
  });
});

// Función de aplicación de filtros
function aplicarFiltros() {
  items.forEach(item => {
    // Comprobamos si el área seleccionada coincide con el 'data-area' del item
    const areaMatch = (selectedArea === "all" || item.dataset.area === selectedArea);

    // Mostrar u ocultar el item según el área seleccionada
    item.style.display = areaMatch ? "block" : "none";
  });
}
