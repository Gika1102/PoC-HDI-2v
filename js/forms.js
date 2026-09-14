// URL do endpoint. Depois de publicar o Worker, cole aqui a URL dele.
const SUBMIT_ENDPOINT = "https://SEU-WORKER.workers.dev/submit";

const form = document.getElementById("fairForm");
const steps = [...document.querySelectorAll(".step")];
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const statusEl = document.getElementById("status");
const progressBar = document.getElementById("progressBar");
const stepLabel = document.getElementById("stepLabel");

let currentStep = Number(localStorage.getItem("fair_form_step") || 1);
let draft = JSON.parse(localStorage.getItem("fair_form_draft") || "{}");

function fillDraft() {
  for (const [key, value] of Object.entries(draft)) {
    const field = form.elements[key];
    if (!field) continue;
    if (field instanceof RadioNodeList) {
      [...field].forEach(r => { r.checked = r.value === value; });
    } else {
      field.value = value;
    }
  }
}

function saveDraft() {
  const data = Object.fromEntries(new FormData(form).entries());
  localStorage.setItem("fair_form_draft", JSON.stringify(data));
  localStorage.setItem("fair_form_step", String(currentStep));
}

function showStep(step) {
  currentStep = Math.max(1, Math.min(steps.length, step));
  steps.forEach((el, i) => el.classList.toggle("active", i + 1 === currentStep));
  backBtn.hidden = currentStep === 1;
  nextBtn.hidden = currentStep === steps.length;
  submitBtn.hidden = currentStep !== steps.length;
  progressBar.style.width = `${(currentStep / steps.length) * 100}%`;
  stepLabel.textContent = `Etapa ${currentStep} de ${steps.length}`;
  saveDraft();
}

function validateCurrentStep() {
  const current = steps[currentStep - 1];
  const requiredFields = [...current.querySelectorAll("[required]")];
  for (const field of requiredFields) {
    if (field.type === "radio") {
      const group = form.querySelectorAll(`input[name="${field.name}"]`);
      if (![...group].some(r => r.checked)) {
        field.focus();
        return false;
      }
    } else if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }
  return true;
}

nextBtn.addEventListener("click", () => {
  statusEl.textContent = "";
  statusEl.className = "status";
  if (!validateCurrentStep()) return;
  showStep(currentStep + 1);
});

backBtn.addEventListener("click", () => {
  statusEl.textContent = "";
  showStep(currentStep - 1);
});

form.addEventListener("input", saveDraft);
form.addEventListener("change", saveDraft);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateCurrentStep()) return;

  const data = Object.fromEntries(new FormData(form).entries());
  const response = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    ...data
  };

  // Backup local: a resposta não some se o Wi-Fi da feira resolver virar protagonista.
  const pending = JSON.parse(localStorage.getItem("fair_form_pending") || "[]");
  pending.push(response);
  localStorage.setItem("fair_form_pending", JSON.stringify(pending));

  submitBtn.disabled = true;
  nextBtn.disabled = true;
  backBtn.disabled = true;
  statusEl.className = "status";
  statusEl.textContent = "Enviando...";

  try {
    if (SUBMIT_ENDPOINT.includes("SEU-WORKER")) {
      throw new Error("Endpoint ainda não configurado.");
    }

    const res = await fetch(SUBMIT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Remove do backup local somente depois que o servidor confirmar.
    const updated = JSON.parse(localStorage.getItem("fair_form_pending") || "[]");
    localStorage.setItem(
      "fair_form_pending",
      JSON.stringify(updated.filter(item => item.id !== response.id))
    );

    localStorage.removeItem("fair_form_draft");
    localStorage.removeItem("fair_form_step");
    form.reset();

    statusEl.className = "status success";
    statusEl.textContent = "Resposta enviada com sucesso! ✅";
    currentStep = 1;
    showStep(1);
  } catch (error) {
    console.error(error);
    statusEl.className = "status error";
    statusEl.textContent = "Não foi possível enviar agora. A resposta ficou salva neste celular e poderá ser reenviada depois.";
  } finally {
    submitBtn.disabled = false;
    nextBtn.disabled = false;
    backBtn.disabled = false;
  }
});

fillDraft();
showStep(currentStep);
