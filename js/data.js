const departmentData = {
  copilotAgent: {
    title: "Kyndryl Agentic Hub • Copilot Studio",
    summary: "Interpretação e Tomada de Decisão Autônoma",
    owner: "Orquestrador IA Agêntica",
    color: "#FF462D",
    actions: [
      {
        name: "1. Análise das Bases de Dados",
        status: "ACTIVE",
        desc: "Identifica e avalia funcionários, atributos, elegibilidades, políticas, diretrizes e status de agendamentos ao invés de aplicar regras estáticas.",
        lastRun: "Tempo Real",
        channel: "Cérebro Copilot"
      },
      {
        name: "2. Priorização Autônoma de Pendências",
        status: "ACTIVE",
        desc: "Foram identificados 4 colaboradores requerem atuação: 1 em atraso e 3 próximos do prazo final.",
        lastRun: "Agora",
        channel: "Algoritmo de Priorização"
      },
      {
        name: "3. Instruções para o Power Automate",
        status: "ACTIVE",
        desc: "Geração de payloads estruturados para as interações com cada colaborador (prazos, clínicas sugeridas, pedidos de exame, orientações).",
        lastRun: "Live",
        channel: "Orquestração"
      }
    ]
  },
  database: {
    title: "Base de Dados de Funcionários (Ilustrativa)",
    summary: "Dataverse / SharePoint List / Integrações",
    owner: "Camada de Dados RH",
    color: "#29707A",
    actions: [
      {
        name: "ERP/Base de RH - Registros de Funcionários",
        status: "ACTIVE",
        desc: "Atributos: matrícula, nome, email, data de nascimento e contratação, gênero, gestor, afastamento/férias, ocupação, periculosidade, enquadramentos PcD, endereço, etc.",
        lastRun: "Sincronizado",
        channel: "Dataverse Connector"
      },
          {
        name: "Repositório de Políticas",
        status: "ACTIVE",
        desc: "Regras de RH para exames periódicos, elegilibilidade, periodicidade, clínicas certificadas, políticas do plano de saúde e reembolso, apontamento da ausência, etc.",
        lastRun: "2m atrás",
        channel: "Query Read"
      },
      {
        name: "Análise de Status Ocupacional",
        status: "ACTIVE",
        desc: "Leitura, normalização e análise executadas pelo agente sem cargas ou manipulação manual de dados e planilhas.",
        lastRun: "2m atrás",
        channel: "Query Read"
      },
      {
        name: "Identificação de Agendamentos Existentes (Matrícula #142980)",
        status: "ACTIVE",
        desc: "Colaborador #142980 está no período de exames periódicos e já agendado. Decisão do agente: Não interagir com o colaborador.",
        lastRun: "Ignorado c/ Sucesso",
        channel: "Filtro Inteligente"
      }
    ]
  },
  externalBases: {
    title: "Bases Externas",
    summary: "Ministério da Saúde, Ministério do Trabalho, Agências Reguladoras",
    owner: "Orquestrado por: Instituições governamentais, agências reguladoras, autarquias, sindicatos",
    color: "#3B82F6",
    actions: [
      {
        name: "Validação de Periodicidade Legal (NR-7)",
        status: "ACTIVE",
        desc: "Conformidade automática com a periodicidade de exames clínicos por gênero, faixa etária e grau de risco.",
        lastRun: "Conectado",
        channel: "API Governamental"
      },
      {
        name: "Análise de Riscos Ocupacionais",
        status: "ACTIVE",
        desc: "Verificação dos exames complementares obrigatórios para trabalho com característica ou periculosidade adicional (NR-1, NR-15, NR-16, NR-20, NR-32, NR-33, NR-35).",
        lastRun: "Atualizado",
        channel: "Base Normativa"
      },
      {
        name: "Monitoramento de Portarias e Atualizações",
        status: "ACTIVE",
        desc: "Integração contínua para aplicar alterações regulatórias sem necessidade de reconfiguração manual de fluxos.",
        lastRun: "Live Feed",
        channel: "Data Stream"
      }
    ]
  },
  clinics: {
    title: "Orquestrado por Saúde Ocupacional e Plano de Saúde Complementar",
    summary: "Sugestão Inteligente de Clínicas",
    owner: "Saúde Ocupacional",
    color: "#B687AC",
    actions: [
      {
        name: "Clínica Demo Paulista (São Paulo - SP)",
        status: "ACTIVE",
        desc: "Sugerida “preferencialmente” para colaboradores que residem em um raio de até 5km da clínica (Exemplo: colaborador #142971).",
        lastRun: "Live",
        channel: "Geo Match"
      },
      {
        name: "Clínica Demo Centro (Rio de Janeiro - RJ)",
        status: "ACTIVE",
        desc: "Sugerida “preferencialmente” para colaboradores que residem em um raio de até 5km da clínica (sem mencionar pendência crítica).",
        lastRun: "Live",
        channel: "Geo Match"
      },
      {
        name: "Validação de Horários Disponíveis",
        status: "INACTIVE",
        desc: "Integração futura para sugestão de datas e horas para agendamento de acordo com disponibilidade da clínica e calendário do Exchange do colaborador.",
        lastRun: "Evolução Futura",
        channel: "API de Terceiros e MS365."
      }
    ]
  },
  hitlResearch: {
    title: "Human in the Loop • Pesquisa das Bases",
    summary: "Revisão humana antes da classificação dos casos",
    owner: "Equipe de Saúde Ocupacional",
    color: "#0F766E",
    actions: [
      {
        name: "Validar evidências encontradas",
        status: "ACTIVE",
        desc: "A pessoa revisora confirma se os registros, datas de exame e fontes normativas consultadas estão completos.",
        lastRun: "Aguardando",
        channel: "Painel de Aprovação"
      },
      {
        name: "Liberar classificação para o agente",
        status: "ACTIVE",
        desc: "Após a confirmação, o Motor de Contexto pode priorizar os casos e preparar a próxima etapa do fluxo.",
        lastRun: "Após revisão",
        channel: "Gate HITL"
      }
    ]
  },
  triage: {
    title: "Motor de Contexto e Classificação",
    summary: "Casos Reais Identificados na Base de Demonstração",
    owner: "Módulo de Inteligência",
    color: "#4AC5BB",
    actions: [
      {
        name: "Caso A: Colaborador @132451",
        status: "INACTIVE",
        desc: "Exame válido por mais de 60 dias. Decisão do agente: Nenhuma ação ou contato necessário.",
        lastRun: "Dispensado",
        channel: "Bypass Automático"
      },
      {
        name: "Caso B: Colaborador @202832 - <strong>(Trabalho em periculosidade: NR-15/Ruído).</strong>",        
        status: "ACTIVE",
        desc: "Vencimento em 15/09/2026 sem agendamento prévio. Decisão: Enviar lembrete com link da Clínica Demo Paulista e adicionar exame de audiometria.",
        lastRun: "Fila de Envio",
        channel: "Alerta Proativo"
      },
      {
        name: "Caso C: Colaborador @101330 — Exame Vencido",
        status: "ACTIVE",
        desc: "Pendente desde 01/08/2026. Decisão: Comunicação prioritária de regularização urgente na Clínica Demo Centro.",
        lastRun: "Urgente",
        channel: "Alerta Crítico"
      }
    ]
  },
  promptEngine: {
    title: "Gerador de Mensagens Personalizadas",
    summary: "Geração de Linguagem Natural (LLM)",
    owner: "Copilot Generative AI",
    color: "#F4D25A",
    actions: [
      {
        name: "Template Lembrete: Colaborador @202832",
        status: "ACTIVE",
        desc: "'Olá, Ana. Identificamos que seu exame periódico deverá ser renovado até 15/09/2026. Clínica sugerida: Clínica Demo Paulista.'",
        lastRun: "Gerado",
        channel: "Mensagem Amigável - Microsoft Teams"
      },
      {
        name: "Template Regularização Urgente: Colaborador @101330",
        status: "ACTIVE",
        desc: "'Olá, João. Identificamos que seu exame encontra-se pendente desde 01/08/2026. Pedimos agendamento imediato.'",
        lastRun: "Gerado",
        channel: "Mensagem Formal - Outlook 365"
      },
      {
        name: "Validação Anti-Alucinação e Tom Corporativo",
        status: "ACTIVE",
        desc: "Garante que nenhuma data incorreta seja informada e respeita o contexto de cada colaborador.",
        lastRun: "Validado",
        channel: "Guardrails"
      }
    ]
  },
  hitlMessage: {
    title: "Human in the Loop • Aprovação de Mensagens",
    summary: "Revisão humana antes do contato com o colaborador",
    owner: "Equipe de Saúde Ocupacional",
    color: "#0F766E",
    actions: [
      {
        name: "Revisar texto personalizado",
        status: "ACTIVE",
        desc: "A pessoa revisora verifica clareza, tom corporativo, destinatário, prazo e clínica sugerida antes do envio.",
        lastRun: "Aguardando",
        channel: "Painel de Aprovação"
      },
      {
        name: "Aprovar ou devolver para ajuste",
        status: "ACTIVE",
        desc: "A mensagem aprovada segue para os canais configurados; uma devolução retorna ao Gerador de Mensagens para correção.",
        lastRun: "Após revisão",
        channel: "Gate HITL"
      }
    ]
  },
  dispatch: {
    title: "Power Automate • Comunicação/Engajamento",
    summary: "Execução Proativa nos Canais Corporativos",
    owner: "Camada de Automação",
    color: "#FF462D",
    actions: [
      {
        name: "Interação via Microsoft Teams",
        status: "ACTIVE",
        desc: "Envio de cartão interativo direto no chat privado do colaborador com botão de agendamento. Aceita interação conversacional.",
        lastRun: "Pronto",
        channel: "MS Teams Bot"
      },
      {
        name: "Notificação por Email",
        status: "ACTIVE",
        desc: "Envio de e-mail institucional formatado com cópia para registro de Saúde Ocupacional.",
        lastRun: "Pronto",
        channel: "Outlook 365"
      },
      {
        name: "Escalonamento para o Gestor (#110325)",
        status: "INACTIVE",
      desc: "Notificar gestores quando o exame permanecer atrasado após 15 dias do <strong>terceiro aviso</strong>.",
        lastRun: "Programado",
        channel: "Trigger Automático"
      }
    ]
  },
  compliance: {
    title: "Compliance, PCMSO & Rastreabilidade",
    summary: "Registro de Auditoria e Governança",
    owner: "Recursos Humanos",
    color: "#187E3F",
    actions: [
      {
        name: "Registro de Envio na Base (Log de Auditoria)",
        status: "ACTIVE",
        desc: "Data, horário e canal da notificação são gravados automaticamente na linha do colaborador para comprovação.",
        lastRun: "Gravando",
        channel: "Dataverse, ERP"
      },
      {
        name: "Status de Saúde Ocupacional",
        status: "ACTIVE",
        desc: "Dashboard em tempo real para a equipe de Saúde Ocupacional acompanhar o índice de conformidade da empresa.",
        lastRun: "Atualizado",
        channel: "Power BI Feed"
      },
      {
        name: "Tratamento de Privacidade & LGPD",
        status: "ACTIVE",
        desc: "Controle do acesso, consumo, tratamento e compartilhamento de informações aplicando RBAC, guardrails de segurança e privacidade, proteção de dados e políticas de RH.",
        lastRun: "Conforme",
        channel: "Security Policy"
      }
    ]
  }
};

// Aliases para garantir retrocompatibilidade em qualquer script
const modulesData = departmentData;
window.departmentData = departmentData;
window.modulesData = departmentData;