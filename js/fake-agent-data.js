/* Dados 100% fictícios usados pela demonstração estática. */
window.fakeAgentData = {
  employees: [
    { id: "E001", name: "Ana Silva", department: "Tecnologia", managerId: "E004", location: "São Paulo - SP", lastExam: "2025-09-15", nextExam: "2026-09-15", status: "Próximo", scheduled: false, clinicId: "C001" },
    { id: "E002", name: "Bruno Costa", department: "Tecnologia", managerId: "E004", location: "São Paulo - SP", lastExam: "2025-10-01", nextExam: "2026-08-28", status: "Vencido", scheduled: false, clinicId: "C001" },
    { id: "E003", name: "Carla Mendes", department: "Tecnologia", managerId: "E004", location: "Campinas - SP", lastExam: "2026-03-10", nextExam: "2027-03-10", status: "Em dia", scheduled: true, clinicId: "C003" },
    { id: "E004", name: "Carlos Souza", department: "Tecnologia", managerId: "", location: "São Paulo - SP", lastExam: "2026-01-20", nextExam: "2027-01-20", status: "Em dia", scheduled: true, clinicId: "C001" },
    { id: "E005", name: "Marina Alves", department: "Operações", managerId: "", location: "Rio de Janeiro - RJ", lastExam: "2025-08-01", nextExam: "2026-08-01", status: "Vencido", scheduled: false, clinicId: "C002" },
    { id: "E006", name: "Pedro Santos", department: "Operações", managerId: "E005", location: "Rio de Janeiro - RJ", lastExam: "2025-09-30", nextExam: "2026-09-30", status: "Próximo", scheduled: true, clinicId: "C002" },
    { id: "E007", name: "João Lima", department: "Operações", managerId: "E005", location: "Rio de Janeiro - RJ", lastExam: "2025-08-01", nextExam: "2026-08-01", status: "Vencido", scheduled: false, clinicId: "C002" },
    { id: "E008", name: "Luiza Rocha", department: "Recursos Humanos", managerId: "", location: "Belo Horizonte - MG", lastExam: "2026-04-01", nextExam: "2027-04-01", status: "Em dia", scheduled: true, clinicId: "C004" }
  ],
  clinics: [
    { id: "C001", name: "Clínica Demo Paulista", city: "São Paulo - SP", address: "Av. Paulista, 1000", contact: "(11) 4000-1001" },
    { id: "C002", name: "Clínica Demo Centro", city: "Rio de Janeiro - RJ", address: "Rua do Centro, 200", contact: "(21) 4000-1002" },
    { id: "C003", name: "Clínica Demo Campinas", city: "Campinas - SP", address: "Rua das Flores, 300", contact: "(19) 4000-1003" },
    { id: "C004", name: "Clínica Demo Minas", city: "Belo Horizonte - MG", address: "Av. Afonso Pena, 400", contact: "(31) 4000-1004" }
  ],
  profileContext: { funcionario: "E001", gerente: "E004", rh: "E008", ti: null }
};
