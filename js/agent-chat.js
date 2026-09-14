let activeProfile = "funcionario";
let chatGeneration = 0;

function normalise(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function formatDate(value) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function scopedEmployees() {
  const { employees, profileContext } = window.fakeAgentData;
  if (activeProfile === "funcionario") return employees.filter(item => item.id === profileContext.funcionario);
  if (activeProfile === "gerente") return employees.filter(item => item.managerId === profileContext.gerente);
  return employees;
}

function employeeLine(employee) {
  return `• ${employee.name} — ${employee.department}: ${employee.status} (${formatDate(employee.nextExam)}; ${employee.scheduled ? "agendado" : "sem agendamento"}).`;
}

function summary(employees, title) {
  const count = status => employees.filter(item => item.status === status).length;
  return `${title}: ${employees.length} colaborador(es).\n• ${count("Vencido")} exame(s) vencido(s)\n• ${count("Próximo")} próximo(s) do vencimento\n• ${count("Em dia")} em dia`;
}

function localResponse(message) {
  const text = normalise(message);
  const { employees, clinics } = window.fakeAgentData;
  const scoped = scopedEmployees();
  const asksAboutPeople = /(equipe|time|subordinad|colega|colaborador|funcionario)/.test(text);
  const asksForTechnicalOnlyData = /(status tecn|monitoramento tecn|dados tecn|indicad|anonimiz|alerta tecn|base tecn|ti)/.test(text);

  if (activeProfile !== "ti" && asksForTechnicalOnlyData) {
    if (activeProfile === "funcionario") return "Seu perfil de Funcionário não tem nível de acesso para indicadores técnicos do perfil TI.";
    if (activeProfile === "gerente") return "Seu perfil de Gerente não tem nível de acesso para indicadores técnicos do perfil TI.";
    if (activeProfile === "rh") return "Seu perfil de RH não tem nível de acesso para indicadores técnicos do perfil TI.";
  }

  if (activeProfile === "ti") {
    const overdue = employees.filter(item => item.status === "Vencido").length;
    const upcoming = employees.filter(item => item.status === "Próximo").length;
    if (asksAboutPeople) return "Seu perfil de TI não tem nível de acesso para consultar informações de equipes ou colaboradores.";
    if (/(vencido|atrasado|pendente)/.test(text)) return `Monitoramento técnico: ${overdue} registro(s) na fila crítica. Dados anonimizados.`;
    if (/(proximo|30 dia|alerta)/.test(text)) return `Monitoramento técnico: ${upcoming} registro(s) na fila de alertas preventivos. Dados anonimizados.`;
    return `Status técnico da PoC:\n• Fonte: dados fictícios embarcados no site\n• Registros processados: ${employees.length}\n• Integrações externas: nenhuma\n• Dados pessoais: ocultos para o perfil TI`;
  }

  if (/(ajuda|o que voce|opcoes)/.test(text)) return "Posso mostrar resumo, exames vencidos, próximos exames, situação pessoal/equipe e clínicas sugeridas dentro do seu acesso.";
  const byName = employees.find(item => normalise(item.name) && text.includes(normalise(item.name)));
  if (byName) {
    if (!scoped.some(item => item.id === byName.id)) {
      if (activeProfile === "funcionario") return "Seu perfil de Funcionário permite consultar apenas os seus próprios dados.";
      if (activeProfile === "gerente") return "Seu perfil de Gerente permite consultar apenas os dados da sua própria equipe.";
      if (activeProfile === "rh") return "Seu perfil de RH tem acesso aos dados de pessoas da organização, mas não aos indicadores técnicos do perfil TI.";
      return "Não posso mostrar dados individuais fora do escopo do perfil selecionado.";
    }
    return `Situação encontrada:\n${employeeLine(byName)}`;
  }
  if (activeProfile === "funcionario" && asksAboutPeople) return "Seu perfil de Funcionário permite consultar apenas os seus próprios dados, sem acesso a equipes ou colegas.";
  if (activeProfile === "gerente" && /(equipe|time|subordinado|time|colaboradores)/.test(text) && !/(meu|minha|resumo da minha equipe)/.test(text)) return "Seu perfil de Gerente só tem nível de acesso para a sua própria equipe.";
  if (activeProfile === "rh" && asksForTechnicalOnlyData) return "Seu perfil de RH não tem nível de acesso para indicadores técnicos do perfil TI.";
  if (/(clinica|onde|local)/.test(text)) {
    if (activeProfile === "funcionario") {
      const clinic = clinics.find(item => item.id === scoped[0].clinicId);
      return `Sua clínica sugerida é ${clinic.name} — ${clinic.address}, ${clinic.city}. Contato: ${clinic.contact}.`;
    }
    return `Clínicas sugeridas na sua visão:\n${clinics.map(item => `• ${item.name} — ${item.city}`).join("\n")}`;
  }
  if (activeProfile === "funcionario" && /(meu|minha|pessoal)/.test(text)) return `Sua situação:\n${employeeLine(scoped[0])}`;
  if (activeProfile === "gerente" && /(equipe|time|subordinado)/.test(text)) return `${summary(scoped, "Resumo da sua equipe")}\n\n${scoped.map(employeeLine).join("\n")}`;
  if (/(vencido|atrasado|pendente)/.test(text)) {
    const items = scoped.filter(item => item.status === "Vencido");
    return `Exames vencidos no seu escopo: ${items.length}.${items.length ? `\n${items.map(employeeLine).join("\n")}` : ""}`;
  }
  if (/(proximo|30 dia|alerta)/.test(text)) {
    const items = scoped.filter(item => item.status === "Próximo");
    return `Próximos exames no seu escopo: ${items.length}.${items.length ? `\n${items.map(employeeLine).join("\n")}` : ""}`;
  }
  if (/(resumo|situacao|status|geral)/.test(text)) {
    const title = activeProfile === "rh" ? "Resumo geral de RH" : activeProfile === "gerente" ? "Resumo da sua equipe" : "Sua situação";
    return summary(scoped, title);
  }
  return "Não reconheci essa consulta. Pergunte sobre resumo, vencidos, próximos exames, equipe, situação pessoal ou clínicas.";
}

function openAgentChat() { if (typeof closeDrawer === "function") closeDrawer(); document.getElementById("agentChatOverlay").classList.add("active"); document.getElementById("agentChat").classList.add("open"); setTimeout(() => document.getElementById("agentChatInput").focus(), 300); }
function closeAgentChat() { document.getElementById("agentChatOverlay").classList.remove("active"); document.getElementById("agentChat").classList.remove("open"); document.getElementById("agentProfileMenu").classList.remove("open"); }
function toggleProfileMenu() { const menu = document.getElementById("agentProfileMenu"); menu.classList.toggle("open"); menu.setAttribute("aria-hidden", String(!menu.classList.contains("open"))); }

function addAgentMessage(text, sender = "agent") {
  const container = document.getElementById("agentChatMessages");
  const wrapper = document.createElement("div");
  wrapper.className = `agent-message ${sender}`;
  wrapper.innerHTML = `<div class="message-avatar">${sender === "user" ? "●" : "✦"}</div><div class="message-content"><div class="message-author">${sender === "user" ? "Você" : "Agente fake"}</div><div class="message-bubble"></div></div>`;
  wrapper.querySelector(".message-bubble").textContent = text;
  container.appendChild(wrapper); container.scrollTop = container.scrollHeight;
}

function clearAgentChatHistory() {
  const container = document.getElementById("agentChatMessages");
  if (container) container.replaceChildren();
}

function suggestedQuestions() { if (activeProfile === "ti") return ["Status técnico da base", "Quantos alertas preventivos existem?", "Quantos casos críticos existem?"]; if (activeProfile === "gerente") return ["Resumo da minha equipe", "Quem está com exame vencido?", "Quem precisa fazer exame nos próximos 30 dias?"]; if (activeProfile === "rh") return ["Faça um resumo da situação dos exames", "Quem está com exame vencido?", "Quais são as clínicas sugeridas?"]; return ["Qual é a minha situação?", "Qual é minha clínica sugerida?", "Preciso fazer exame nos próximos 30 dias?"]; }

function setProfile(profile) {
  const profileChanged = activeProfile !== profile;
  activeProfile = profile;
  if (profileChanged) {
    chatGeneration += 1;
    clearAgentChatHistory();
  }
  const names = { funcionario: "Funcionário", gerente: "Gerente", rh: "RH", ti: "TI" };
  document.getElementById("agentProfileStatus").lastChild.textContent = ` Online • Perfil: ${names[profile]}`;
  document.querySelectorAll("[data-profile]").forEach(button => button.classList.toggle("active", button.dataset.profile === profile));
  const suggestions = document.getElementById("agentChatSuggestions"); suggestions.replaceChildren();
  suggestedQuestions().forEach(question => { const button = document.createElement("button"); button.textContent = question; button.addEventListener("click", () => sendSuggestedQuestion(question)); suggestions.appendChild(button); });
  document.getElementById("agentProfileMenu").classList.remove("open");
}

function sendSuggestedQuestion(question) { document.getElementById("agentChatInput").value = question; sendAgentMessage(); }
function handleAgentInput(event) { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendAgentMessage(); } }
function sendAgentMessage() { const input = document.getElementById("agentChatInput"); const message = input.value.trim(); if (!message) return; const generation = chatGeneration; addAgentMessage(message, "user"); input.value = ""; window.setTimeout(() => { if (generation === chatGeneration) addAgentMessage(localResponse(message)); }, 220); }

window.addEventListener("keydown", event => { if (event.key === "Escape") closeAgentChat(); });
window.addEventListener("DOMContentLoaded", () => { document.getElementById("agentSendButton").addEventListener("click", sendAgentMessage); document.querySelectorAll("[data-profile]").forEach(button => button.addEventListener("click", () => setProfile(button.dataset.profile))); setProfile(activeProfile); });
window.sendAgentMessage = sendAgentMessage; window.sendSuggestedQuestion = sendSuggestedQuestion; window.handleAgentInput = handleAgentInput; window.openAgentChat = openAgentChat; window.closeAgentChat = closeAgentChat; window.toggleProfileMenu = toggleProfileMenu;
