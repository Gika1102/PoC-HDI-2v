/* ==========================================================================
   DRAWER LATERAL - REPARO TOTAL DE CLIQUES & COMPATIBILIDADE
   ========================================================================== */

function handleCardClick(departmentKey) {
  const drawer = document.getElementById('sideDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const titleEl = document.getElementById('drawerTitle');
  const summaryEl = document.getElementById('drawerSummary');
  const ownerEl = document.getElementById('drawerOwner');
  const dotEl = document.getElementById('drawerDot');
  const actionsContainer = document.getElementById('drawerActionsList');

  if (!drawer || !overlay) {
    console.error('Elementos do Drawer (#sideDrawer ou #drawerOverlay) não encontrados.');
    return;
  }

  // Busca dados de forma resiliente
  const source = window.departmentData || window.modulesData || (typeof departmentData !== 'undefined' ? departmentData : {});
  const data = source[departmentKey] || {
    title: "Módulo Selecionado",
    summary: "Informações e status operacional",
    owner: "Kyndryl Agentic Framework",
    color: "#FF462D",
    actions: [{ name: "Ação em Andamento", status: "ACTIVE", desc: "Monitoramento ativo.", channel: "Live", lastRun: "Agora" }]
  };

  if (titleEl) titleEl.textContent = data.title;
  if (summaryEl) summaryEl.textContent = data.summary;
  if (ownerEl) ownerEl.textContent = `Orquestrado por: ${data.owner}`;
  if (dotEl) dotEl.style.backgroundColor = data.color || '#FF462D';

  if (actionsContainer) {
    actionsContainer.innerHTML = '';
    if (data.actions && data.actions.length > 0) {
      data.actions.forEach(action => {
        const item = document.createElement('div');
        item.style.cssText = 'background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 16px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);';

        const isActive = action.status === 'ACTIVE';
        const badgeBg = isActive ? '#ECFDF5' : '#F1F5F9';
        const badgeColor = isActive ? '#059669' : '#64748B';

        item.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-weight: 700; font-size: 13px; color: #0F172A;">${action.name}</span>
            <span style="font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 6px; background: ${badgeBg}; color: ${badgeColor};">
              ${action.status}
            </span>
          </div>
          <p style="font-size: 11.5px; color: #475569; line-height: 1.45; margin: 0 0 8px 0;">
            ${action.desc}
          </p>
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 6px; margin-top: 6px;">
            <span>Canal: <strong style="color: #64748B;">${action.channel || 'Sistema'}</strong></span>
            <span>Execução: <strong style="color: #64748B;">${action.lastRun || 'Live'}</strong></span>
          </div>
        `;
        actionsContainer.appendChild(item);
      });
    }
  }

  // Exibe o Drawer forçando estilos caso a classe CSS falhe
  drawer.classList.add('open');
  overlay.classList.add('open');
  drawer.style.right = '0px';
  overlay.style.visibility = 'visible';
  overlay.style.opacity = '1';
}

function closeDrawer() {
  const drawer = document.getElementById('sideDrawer');
  const overlay = document.getElementById('drawerOverlay');

  if (drawer) {
    drawer.classList.remove('open');
    drawer.style.right = '-420px';
  }
  if (overlay) {
    overlay.classList.remove('open');
    overlay.style.visibility = 'hidden';
    overlay.style.opacity = '0';
  }
}

// Mapeamento automático direto no DOM para não depender exclusivamente dos onclicks no HTML
document.addEventListener('DOMContentLoaded', () => {
  const cardMap = {
    'node-core': 'copilotAgent',
    'node-corporate-db': 'database',
    'node-external-ms': 'externalBases',
    'node-clinics': 'clinics',
    'node-hitl-research': 'hitlResearch',
    'node-context-engine': 'triage',
    'node-msg-gen': 'promptEngine',
    'node-hitl-message': 'hitlMessage',
    'node-compliance': 'compliance',
    'node-dispatch': 'dispatch'
  };

  Object.entries(cardMap).forEach(([elementId, dataKey]) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        handleCardClick(dataKey);
      });
    }
  });

  // Fechamento pelo overlay ou botão X
  const overlay = document.getElementById('drawerOverlay');
  if (overlay) overlay.addEventListener('click', closeDrawer);

  const closeBtn = document.querySelector('.btn-close');
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
});

// Expondo globalmente
window.handleCardClick = handleCardClick;
window.closeDrawer = closeDrawer;
