// ============================================================
// CONFIGURAÇÃO DO PLAYER
// ============================================================

const DELAY_BETWEEN_STEPS = 10000; // 10 segundos entre cada ação

// ============================================================
// DADOS DOS ESTÁGIOS COM ROTEIRO MULTI-TURNO
// ============================================================

const JOURNEY_STAGES = [
  {
    id: 'stage-1',
    number: 1,
    badge: 'Monitoramento',
    title: 'Observar e Sugerir',
    colorVar: '--kyn-teal',
    explanation: 'Funciona como um monitor, analisa fluxos de dados e sinaliza anomalias ou oportunidades, mas não toma nenhuma ação.',
    description: 'O agente consulta a base de dados e identifica prazos pendentes',
    steps: [
      { type: 'log', text: '📊 Consultando base de exames periódicos...', delay: 800 },
      { type: 'agent-thinking', text: 'Analisando os registros de todos os colaboradores cadastrados.', delay: 2000 },
      { type: 'log', text: '📅 Cruzando datas de vencimento com a data atual...', delay: 800 },
      { type: 'agent', text: 'Identifiquei 4 funcionários com pendências:\n• 1 com exame vencido\n• 3 com vencimento nos próximos 30 dias', delay: 2500 },
      { type: 'log', text: '✅ Relatório encaminhado ao time de RH', delay: 800 }
    ]
  },
  {
    id: 'stage-2',
    number: 2,
    badge: 'Raciocínio',
    title: 'Planejar e Propor',
    colorVar: '--kyn-amber',
    explanation: 'Identifica o objetivo, gera uma estratégia em etapas para atingi-lo e apresenta o plano para revisão humana.',
    description: 'O agente cruza dados e monta propostas de ação contextualizadas',
    steps: [
      { type: 'log', text: '🌍 Cruzando localização, histórico clínico e rede de clínicas parceiras...', delay: 1000 },
      { type: 'agent-thinking', text: 'Analisando o perfil de cada colaborador e as melhores opções disponíveis.', delay: 2000 },
      { type: 'agent', text: 'Para Ana Silva (SP):\nSugiro a Clínica Paulista — mais próxima, com horário disponível esta semana.', delay: 2500 },
      { type: 'agent', text: 'Para João Silva (RJ):\nSugiro a Clínica Centro com prioridade: exame vencido há 12 dias.', delay: 2500 },
      { type: 'log', text: '📋 Proposta de ação completa gerada com 2 recomendações', delay: 800 }
    ]
  },
  {
    id: 'stage-3',
    number: 3,
    badge: 'Human-in-the-Loop',
    title: 'Agir com Confirmação',
    colorVar: '--kyn-purple',
    explanation: 'Executa as ações de preparação, mas aguarda a confirmação para seguir com a execução.',
    description: 'O agente aguarda confirmação do RH antes de executar a ação',
    steps: [
      { type: 'log', text: '✏️ Mensagem personalizada preparada para os colaboradores selecionados.', delay: 800 },
      { type: 'agent-thinking', text: 'Aguardando aprovação do time de RH para prosseguir com o envio.', delay: 1500 },
      { type: 'agent', text: 'Desejo que eu envie a mensagem via Teams para os colaboradores agora? [Confirmar / Cancelar]', delay: 2000 },
      { type: 'human', text: '👤 RH Confirmar ✅', delay: 1500 },
      { type: 'log', text: '⚙️ Aprovação recebida. Iniciando disparo...', delay: 800 },
      { type: 'agent', text: 'Mensagens enviadas com sucesso para 2 colaboradores via Microsoft Teams.', delay: 2000 }
    ]
  },
  {
    id: 'stage-4',
    number: 4,
    badge: 'Autonomia Total',
    title: 'Agir de Forma Autônoma',
    colorVar: '--kyn-red',
    explanation: 'Executa as tarefas de forma independente, dentro dos seus limites definidos.',
    description: 'O agente executa o ciclo completo sem intervenção manual',
    steps: [
      { type: 'log', text: '⏰ Rotina diária iniciada automaticamente às 08:00', delay: 1000 },
      { type: 'log', text: '🔍 Varredura completa da base: 47 colaboradores analisados', delay: 1000 },
      { type: 'log', text: '📬 3 lembretes enviados automaticamente via Teams/E-mail', delay: 1000 },
      { type: 'log', text: '🎯 1 caso com agendamento dispensado (exame já realizado, atualizado via integração)', delay: 1000 },
      { type: 'agent-thinking', text: 'Processando resultados e compilando relatório final.', delay: 1500 },
      { type: 'agent', text: 'Rotina diária executada com sucesso:\n• 3 lembretes enviados\n• 1 caso dispensado\n• Logs gravados na base\nNenhuma intervenção manual foi necessária.', delay: 2500 },
      { type: 'log', text: '📑 Logs de auditoria gravados para conformidade com a NR-7', delay: 800 }
    ]
  }
];

// ============================================================
// STATE MACHINE DO PLAYER
// ============================================================

let playerState = {
  currentStageIndex: 0,
  currentStepIndex: 0,
  isPlaying: true,
  pendingTimeoutId: null,
  totalSteps: 0
};

// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initPlayer();
});

function initPlayer() {
  calculateTotalSteps();
  renderTimeline();
  attachEventListeners();

  // Inicia a reprodução automaticamente
  setTimeout(() => {
    playerState.isPlaying = true;
    playStep();
  }, 500);
}

function calculateTotalSteps() {
  playerState.totalSteps = JOURNEY_STAGES
    .reduce((acc, stage) => acc + stage.steps.length, 0);
}

// ============================================================
// TIMELINE (4 SEGMENTOS CLICÁVEIS)
// ============================================================

function renderTimeline() {
  const timelineContainer = document.getElementById('journeyTimeline');
  if (!timelineContainer) return;

  timelineContainer.innerHTML = '';

  JOURNEY_STAGES.forEach((stage, idx) => {
    const segment = document.createElement('button');
    segment.className = 'journey-timeline-segment';
    segment.id = `timeline-${idx}`;
    segment.setAttribute('data-index', idx);
    segment.style.borderColor = `var(${stage.colorVar})`;

    if (idx === playerState.currentStageIndex) {
      segment.classList.add('active');
    } else if (idx < playerState.currentStageIndex) {
      segment.classList.add('completed');
    }

    const numberSpan = document.createElement('span');
    numberSpan.className = 'segment-number';
    numberSpan.textContent = `${stage.number}`;

    const titleSpan = document.createElement('span');
    titleSpan.className = 'segment-title';
    titleSpan.textContent = stage.title;

    const explanationSpan = document.createElement('span');
    explanationSpan.className = 'segment-explanation';
    explanationSpan.textContent = stage.explanation;

    segment.appendChild(numberSpan);
    segment.appendChild(titleSpan);
    segment.appendChild(explanationSpan);

    segment.addEventListener('click', () => {
      goToStage(idx);
    });

    timelineContainer.appendChild(segment);
  });
}

// ============================================================
// PLAYBACK LOGIC
// ============================================================

function playStep() {
  if (playerState.pendingTimeoutId) {
    clearTimeout(playerState.pendingTimeoutId);
  }

  const stage = JOURNEY_STAGES[playerState.currentStageIndex];
  if (!stage) return;

  const step = stage.steps[playerState.currentStepIndex];
  if (!step) {
    advanceToNextStage();
    return;
  }

  // Renderiza o step baseado no tipo
  if (step.type === 'log') {
    addLogEntry(step.text);
  } else if (step.type === 'agent-thinking') {
    addAgentThinking(step.text);
  } else if (step.type === 'agent') {
    addAgentMessage(step.text);
  } else if (step.type === 'human') {
    addHumanAction(step.text);
  }

  updateControls();

  // Mostra indicador de transição entre passos
  showTransitionIndicator();

  // Agenda o próximo step se estiver em reprodução
  // Usa delay constante de 25 segundos entre cada ação
  if (playerState.isPlaying) {
    playerState.pendingTimeoutId = setTimeout(() => {
      playerState.currentStepIndex++;
      playStep();
    }, DELAY_BETWEEN_STEPS);
  }
}

function advanceToNextStage() {
  playerState.currentStepIndex = 0;
  playerState.currentStageIndex++;

  if (playerState.currentStageIndex >= JOURNEY_STAGES.length) {
    // Fim da jornada
    playerState.isPlaying = false;
    updateControls();
    addLogEntry('🏁 Jornada concluída. Clique em Reiniciar para ver novamente.');
    return;
  }

  renderTimeline();
  renderScreenHeader();

  if (playerState.isPlaying) {
    playStep();
  }
}

// ============================================================
// EXIBIÇÃO TIPO TV - SÓ MOSTRA OS ÚLTIMOS 3 PASSOS
// ============================================================

const MAX_VISIBLE_STEPS = 3;

// ============================================================
// INDICADOR DE TRANSIÇÃO ENTRE PASSOS
// ============================================================

function showTransitionIndicator() {
  const log = document.getElementById('journeyLog');
  if (!log) return;

  // Remove indicador antigo se existir
  const oldIndicator = document.getElementById('transitionIndicator');
  if (oldIndicator) {
    oldIndicator.remove();
  }

  // Cria o indicador de transição (apenas pontinhos)
  const indicator = document.createElement('div');
  indicator.id = 'transitionIndicator';
  indicator.className = 'journey-typing-indicator';
  indicator.style.opacity = '0';
  indicator.style.transform = 'translateY(10px)';

  // Cria os 3 pontinhos
  indicator.innerHTML = '<span></span><span></span><span></span>';

  log.appendChild(indicator);

  // Animação de entrada
  setTimeout(() => {
    indicator.style.transition = 'all 0.4s ease-out';
    indicator.style.opacity = '1';
    indicator.style.transform = 'translateY(0)';
  }, 50);

  // Remove indicador quando passar para próximo step
  setTimeout(() => {
    if (indicator.parentElement) {
      indicator.style.transition = 'all 0.3s ease-out';
      indicator.style.opacity = '0';
      indicator.style.transform = 'translateY(-10px)';

      setTimeout(() => {
        if (indicator.parentElement) {
          indicator.remove();
        }
      }, 300);
    }
  }, DELAY_BETWEEN_STEPS - 300);
}

function scrollToLatestStep(element, container) {
  const log = document.getElementById('journeyLog');
  if (!log) return;

  // Anima entrada do novo elemento
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';

  setTimeout(() => {
    element.style.transition = 'all 0.5s ease-out';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, 50);

  // Remove elementos antigos com animação de saída
  setTimeout(() => {
    const allChildren = Array.from(log.children);
    if (allChildren.length > MAX_VISIBLE_STEPS) {
      const oldElement = allChildren[0];
      oldElement.style.transition = 'all 0.4s ease-out';
      oldElement.style.opacity = '0';
      oldElement.style.transform = 'translateY(-30px)';

      setTimeout(() => {
        if (oldElement.parentElement) {
          oldElement.remove();
        }
      }, 400);
    }
  }, 100);
}

// ============================================================
// ADICIONAR ELEMENTOS À TELA
// ============================================================

function addLogEntry(text) {
  const log = document.getElementById('journeyLog');
  if (!log) return;

  const entry = document.createElement('div');
  entry.className = 'journey-log-entry';
  entry.textContent = text;

  // Fade-in animation
  entry.style.animation = 'fadeInSlide 0.5s ease-out';

  log.appendChild(entry);
  scrollToLatestStep(entry, log);
}

function addAgentThinking(text) {
  const log = document.getElementById('journeyLog');
  if (!log) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'journey-agent-message journey-thinking-wrapper';
  wrapper.id = 'agentThinking';

  const avatar = document.createElement('div');
  avatar.className = 'journey-message-avatar';
  avatar.textContent = '✦';

  const content = document.createElement('div');
  content.className = 'journey-message-content';

  const author = document.createElement('div');
  author.className = 'journey-message-author';
  author.textContent = 'AI Agent';

  const thinking = document.createElement('div');
  thinking.className = 'journey-thinking-indicator';
  thinking.innerHTML = '<span></span><span></span><span></span>';

  content.appendChild(author);
  content.appendChild(thinking);

  wrapper.appendChild(avatar);
  wrapper.appendChild(content);

  log.appendChild(wrapper);
  scrollToLatestStep(wrapper, log);

  // Remove thinking após ~1s e mostra a mensagem
  setTimeout(() => {
    if (wrapper.parentElement) {
      wrapper.remove();
    }
  }, 1000);
}

function addAgentMessage(text) {
  const log = document.getElementById('journeyLog');
  if (!log) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'journey-agent-message';

  const avatar = document.createElement('div');
  avatar.className = 'journey-message-avatar';
  avatar.textContent = '✦';

  const content = document.createElement('div');
  content.className = 'journey-message-content';

  const author = document.createElement('div');
  author.className = 'journey-message-author';
  author.textContent = 'AI Agent';

  const bubble = document.createElement('div');
  bubble.className = 'journey-message-bubble';
  bubble.textContent = text;

  content.appendChild(author);
  content.appendChild(bubble);

  wrapper.appendChild(avatar);
  wrapper.appendChild(content);

  wrapper.style.animation = 'fadeInSlide 0.5s ease-out';

  log.appendChild(wrapper);
  scrollToLatestStep(wrapper, log);
}

function addHumanAction(text) {
  const log = document.getElementById('journeyLog');
  if (!log) return;

  const action = document.createElement('div');
  action.className = 'journey-human-action';
  action.textContent = text;

  action.style.animation = 'fadeInSlide 0.5s ease-out';

  log.appendChild(action);
  scrollToLatestStep(action, log);
}

// ============================================================
// ATUALIZAR HEADER DO ESTÁGIO
// ============================================================

function renderScreenHeader() {
  const stage = JOURNEY_STAGES[playerState.currentStageIndex];
  if (!stage) return;

  const headerTitle = document.getElementById('journeyScreenTitle');
  const headerDesc = document.getElementById('journeyScreenDesc');

  if (headerTitle) {
    headerTitle.textContent = stage.title;
  }

  if (headerDesc) {
    headerDesc.textContent = stage.description;
  }
}

// ============================================================
// CONTROLES
// ============================================================

function attachEventListeners() {
  document.getElementById('journeyPlayBtn')?.addEventListener('click', togglePlay);
  document.getElementById('journeyPrevBtn')?.addEventListener('click', previousStage);
  document.getElementById('journeyNextBtn')?.addEventListener('click', nextStage);
  document.getElementById('journeyRestartBtn')?.addEventListener('click', restart);
}

function togglePlay() {
  const btn = document.getElementById('journeyPlayBtn');
  if (!btn) return;

  playerState.isPlaying = !playerState.isPlaying;

  if (playerState.isPlaying) {
    btn.textContent = '⏸️';
    btn.title = 'Pausar';
    playStep();
  } else {
    btn.textContent = '▶️';
    btn.title = 'Reproduzir';
    if (playerState.pendingTimeoutId) {
      clearTimeout(playerState.pendingTimeoutId);
      playerState.pendingTimeoutId = null;
    }
  }
}

function previousStage() {
  if (playerState.currentStageIndex > 0) {
    playerState.currentStageIndex--;
    playerState.currentStepIndex = 0;
    clearLog();
    renderTimeline();
    renderScreenHeader();
    playerState.isPlaying = true;
    updatePlayButton();
    playStep();
  }
}

function nextStage() {
  if (playerState.currentStageIndex < JOURNEY_STAGES.length - 1) {
    playerState.currentStageIndex++;
    playerState.currentStepIndex = 0;
    clearLog();
    renderTimeline();
    renderScreenHeader();
    playerState.isPlaying = true;
    updatePlayButton();
    playStep();
  }
}

function goToStage(index) {
  if (index >= 0 && index < JOURNEY_STAGES.length) {
    playerState.currentStageIndex = index;
    playerState.currentStepIndex = 0;
    clearLog();
    renderTimeline();
    renderScreenHeader();
    playerState.isPlaying = true;
    updatePlayButton();
    playStep();
  }
}

function restart() {
  playerState.currentStageIndex = 0;
  playerState.currentStepIndex = 0;
  clearLog();
  renderTimeline();
  renderScreenHeader();
  playerState.isPlaying = true;
  updatePlayButton();
  playStep();
}

function clearLog() {
  const log = document.getElementById('journeyLog');
  if (log) {
    log.innerHTML = '';
  }
}

// ============================================================
// ATUALIZAR INTERFACE
// ============================================================

function updateControls() {
  updatePlayButton();
  updateProgressBar();
  updateStepLabel();
}

function updatePlayButton() {
  const btn = document.getElementById('journeyPlayBtn');
  if (btn) {
    btn.textContent = playerState.isPlaying ? '⏸️' : '▶️';
    btn.title = playerState.isPlaying ? 'Pausar' : 'Reproduzir';
  }
}

function updateProgressBar() {
  const stage = JOURNEY_STAGES[playerState.currentStageIndex];
  if (!stage) return;

  const progress = (playerState.currentStepIndex / stage.steps.length) * 100;
  const bar = document.querySelector('.journey-progress-bar');
  if (bar) {
    bar.style.width = `${Math.min(progress, 100)}%`;
  }
}

function updateStepLabel() {
  const stage = JOURNEY_STAGES[playerState.currentStageIndex];
  if (!stage) return;

  const totalStepsInStage = stage.steps.length;
  const label = document.getElementById('journeyStepLabel');

  if (label) {
    const displayStep = Math.min(playerState.currentStepIndex + 1, totalStepsInStage);
    label.textContent = `Passo ${displayStep} de ${totalStepsInStage} · Nível ${stage.number}`;
  }
}
