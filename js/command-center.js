/* ==========================================================================
   COMMAND CENTER - FLUXO SEQUENCIAL & PAN/ZOOM COMPACTO
   ========================================================================== */

let scale = 0.9;
let panX = 0;
let panY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

const viewport = document.getElementById('viewport');
const canvasWorld = document.getElementById('canvasWorld');
const svgConnections = document.getElementById('svgConnections');

// --- Definição das Etapas em Sequência Temporal ---
const flowStages = [
  // ETAPA 1 (0.0s - 1.4s): Core envia parâmetros para as 3 fontes
  { stage: 0, from: 'node-core', to: 'node-corporate-db' },
  { stage: 0, from: 'node-core', to: 'node-external-ms' },
  { stage: 0, from: 'node-core', to: 'node-clinics' },

  // ETAPA 2 (1.4s - 2.8s): As três fontes convergem para o Motor de Contexto
  { stage: 1, from: 'node-corporate-db', to: 'node-context-engine' },
  { stage: 1, from: 'node-external-ms',  to: 'node-context-engine' },
  { stage: 1, from: 'node-clinics',      to: 'node-context-engine' },

  // ETAPA 3 (2.8s - 4.2s): Motor de Contexto aciona o Gerador de Mensagens
  { stage: 2, from: 'node-context-engine', to: 'node-msg-gen' },

  // ETAPA 4 (4.2s - 5.6s): Mensagens seguem para Compliance e Disparo
  { stage: 3, from: 'node-msg-gen', to: 'node-compliance' },
  { stage: 3, from: 'node-msg-gen', to: 'node-dispatch' }
];

const TOTAL_CYCLE_DURATION = 5.6; // Ciclo contínuo total
const STAGE_DURATION = 1.4;       // 1.4s por estágio

/* ==========================================================================
   CÁLCULO E RENDERIZAÇÃO DAS LINHAS SVG
   ========================================================================== */
function drawConnections() {
  if (!svgConnections || !canvasWorld) return;

  svgConnections.innerHTML = '';
  const worldRect = canvasWorld.getBoundingClientRect();

  flowStages.forEach(item => {
    const fromEl = document.getElementById(item.from);
    const toEl = document.getElementById(item.to);

    if (!fromEl || !toEl) return;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    // Posições no espaço desescalonado do canvasWorld
    const startX = (fromRect.left + fromRect.width / 2 - worldRect.left) / scale;
    const startY = (fromRect.bottom - worldRect.top) / scale;

    const endX = (toRect.left + toRect.width / 2 - worldRect.left) / scale;
    const endY = (toRect.top - worldRect.top) / scale;

    // Curvatura vertical suavizada
    const distY = endY - startY;
    const controlOffsetY = Math.min(Math.max(distY * 0.45, 25), 65);
    const pathData = `M ${startX} ${startY} C ${startX} ${startY + controlOffsetY}, ${endX} ${endY - controlOffsetY}, ${endX} ${endY}`;

    // Linha estática
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('class', 'connection-line');
    path.setAttribute('fill', 'none');
    svgConnections.appendChild(path);

    // Bolinha de fluxo sequencial
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '3.5');
    circle.setAttribute('class', 'flow-dot');

    // Intervalo normalizado da etapa (0.0 até 1.0)
    const stageStartNorm = (item.stage * STAGE_DURATION) / TOTAL_CYCLE_DURATION;
    const stageEndNorm = ((item.stage + 1) * STAGE_DURATION) / TOTAL_CYCLE_DURATION;

    // Animação de movimento
    const animMotion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    animMotion.setAttribute('path', pathData);
    animMotion.setAttribute('dur', `${TOTAL_CYCLE_DURATION}s`);
    animMotion.setAttribute('repeatCount', 'indefinite');
    animMotion.setAttribute('keyTimes', `0; ${stageStartNorm}; ${stageEndNorm}; 1`);
    animMotion.setAttribute('values', '0; 0; 1; 1');
    animMotion.setAttribute('keyPoints', '0; 0; 1; 1');
    animMotion.setAttribute('calcMode', 'linear');

    // Animação de opacidade (visível apenas na sua etapa)
    const animOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animOpacity.setAttribute('attributeName', 'opacity');
    animOpacity.setAttribute('dur', `${TOTAL_CYCLE_DURATION}s`);
    animOpacity.setAttribute('repeatCount', 'indefinite');
    animOpacity.setAttribute('keyTimes', `0; ${Math.max(0, stageStartNorm - 0.005)}; ${stageStartNorm}; ${stageEndNorm}; ${Math.min(1, stageEndNorm + 0.005)}; 1`);
    animOpacity.setAttribute('values', '0; 0; 1; 1; 0; 0');

    circle.appendChild(animMotion);
    circle.appendChild(animOpacity);
    svgConnections.appendChild(circle);
  });
}

/* ==========================================================================
   PAN, ZOOM & CENTRALIZAÇÃO
   ========================================================================== */
function updateTransform() {
  if (canvasWorld) {
    canvasWorld.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  }
}

function zoomIn() {
  scale = Math.min(scale + 0.1, 1.6);
  updateTransform();
}

function zoomOut() {
  scale = Math.max(scale - 0.1, 0.5);
  updateTransform();
}

function fitView() {
  if (!viewport || !canvasWorld) return;
  const vpWidth = viewport.clientWidth;
  const vpHeight = viewport.clientHeight;
  const worldWidth = 1400;
  const worldHeight = 1080;

  scale = Math.min(vpWidth / worldWidth, vpHeight / worldHeight) * 0.94;
  panX = (vpWidth - worldWidth * scale) / 2;
  panY = (vpHeight - worldHeight * scale) / 2;

  updateTransform();
}

// --- Eventos de Navegação ---
if (viewport) {
  viewport.addEventListener('mousedown', (e) => {
    if (e.target.closest('.card') || e.target.closest('.canvas-controls')) return;
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    viewport.classList.add('grabbing');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    viewport.classList.remove('grabbing');
  });

  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.05 : 0.95;
    const newScale = Math.min(Math.max(scale * zoomFactor, 0.5), 1.6);

    const mouseX = e.clientX - viewport.getBoundingClientRect().left;
    const mouseY = e.clientY - viewport.getBoundingClientRect().top;

    panX = mouseX - (mouseX - panX) * (newScale / scale);
    panY = mouseY - (mouseY - panY) * (newScale / scale);
    scale = newScale;

    updateTransform();
  }, { passive: false });
}

window.addEventListener('DOMContentLoaded', () => {
  fitView();
  setTimeout(drawConnections, 60);
});

window.addEventListener('resize', () => {
  drawConnections();
});

/* ==========================================================================
   SIDEBAR RETRÁTIL
   ========================================================================== */
function toggleSidebar() {
  document.body.classList.toggle('sidebar-open');
}

window.addEventListener('DOMContentLoaded', () => {
  // Initialize sidebar as collapsed
  document.getElementById('globalSidebar').classList.add('collapsed');
});