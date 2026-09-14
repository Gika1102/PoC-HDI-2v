# Guia do Journey Player Interativo

## 🎬 O que foi implementado

A página de **Jornada & Autonomia** foi transformada de uma simples lista de 4 cards estáticos em um **player interativo tipo "vídeo"**, onde você assiste passo a passo o que o agente faz em cada estágio de autonomia.

### 3 Arquivos Modificados/Criados

#### 1. `js/journey-player.js` (NOVO)
Controlador completo do player com:
- **Dados dos 4 estágios** com roteiro multi-turno (5-7 passos por estágio)
- **State machine** que gerencia reprodução, pausa, avanço
- **Funções de renderização** para timeline, log de eventos, mensagens do agente, ações humanas
- **Controles** de play/pause/anterior/próximo/reiniciar

#### 2. `agent-journey.html` (MODIFICADO)
- Substituiu os 4 cards estáticos por nova estrutura do player:
  - Timeline interativa (4 segmentos clicáveis no topo)
  - Tela central mostrando a simulação em tempo real
  - Controles na base (play/pause/próximo/etc)
  - Indicador de progresso (passo X de Y)
- Manteve a seção `.journey-intro` de introdução

#### 3. `css/journey.css` (MODIFICADO)
- Removeu estilos dos `.stage-card` antigos
- Adicionou estilos completos para:
  - `.journey-timeline` com segmentos interativos
  - `.journey-screen` (moldura de visualização)
  - `.journey-log` e `.journey-log-entry` (console de eventos)
  - `.journey-agent-message` (bolhas de chat do agente)
  - `.journey-human-action` (ações de confirmação do RH)
  - `.journey-controls` (barra de controle)
  - `.journey-progress` (barra de progresso)

---

## ⚙️ Como Funciona

### Estado e Reprodução

1. **Ao carregar a página**:
   - O player carrega os dados de todos os 4 estágios
   - Timeline é desenhada com os 4 segmentos
   - Reprodução inicia automaticamente no Nível 1
   - Primeiro passo começa a aparecer na tela

2. **Durante a reprodução** (autoplay):
   - Cada "passo" (step) aparece na tela conforme o delay configurado
   - Tipos de passos:
     - **`log`**: Linha cinzenta com ícone (ex: "📊 Consultando base...")
     - **`agent-thinking`**: Bolinha animada de "pensamento" (~1s), depois desaparece
     - **`agent`**: Bolha branca com a mensagem do agente (tipo chat)
     - **`human`**: Chip verde à direita (simulando confirmação de RH)
   - Após o último passo do estágio, avança automaticamente para o próximo

3. **Interação do usuário**:
   - **Pause/Play** (botão vermelho): Pausa a reprodução e permite retomar
   - **Anterior/Próximo** (⏮️/⏭️): Pula para o estágio anterior/próximo
   - **Clicar na timeline**: Salta diretamente para aquele estágio
   - **Reiniciar** (↺): Volta ao Nível 1 e recomça
   - **Fim (Nível 4)**: Ao terminar, para de reproduzir e mostra mensagem de conclusão

---

## 📊 Estrutura dos Dados (Exemplo)

Cada estágio em `JOURNEY_STAGES` tem esta estrutura:

```javascript
{
  number: 1,
  title: 'Observar & Sugerir',
  description: 'O agente consulta a base de dados...',
  steps: [
    { type: 'log', text: '📊 Consultando base...', delay: 800 },
    { type: 'agent-thinking', text: 'Analisando registros...', delay: 2000 },
    { type: 'agent', text: 'Identifiquei 4 funcionários...', delay: 2500 },
    // ... mais steps
  ]
}
```

**Tipos de steps**:
- `log` — evento de sistema (cor: cinzento)
- `agent-thinking` — agente pensando (animação de pontos)
- `agent` — resposta/mensagem do agente (cor: branca)
- `human` — ação humana/confirmação (cor: verde)

**Delay** — tempo em milissegundos até o próximo passo aparecer

---

## 🎨 Cores por Estágio

A timeline usa as cores do design system Kyndryl:

| Nível | Título | Cor | Variável |
|-------|--------|-----|----------|
| 1 | Observar & Sugerir | Teal | `--kyn-teal` (#29707A) |
| 2 | Planejar & Propor | Amber | `--kyn-amber` (#F4D25A) |
| 3 | Agir com Confirmação | Roxo | `--kyn-purple` (#B687AC) |
| 4 | Agir de Forma Autônoma | Vermelho | `--kyn-red` (#FF462D) |

---

## 🖥️ Testando Localmente

### 1. Iniciar um servidor HTTP:
```bash
cd HDI_PoC-main
python -m http.server 8080
```

### 2. Abrir no navegador:
```
http://localhost:8080/agent-journey.html
```

### 3. Testar:
- ▶️ **Play**: Inicia a reprodução automática
- ⏸️ **Pause**: Pausa e mantém o que está visível
- ⏮️ / ⏭️ **Anterior/Próximo**: Pula para outro estágio
- **Clicar na timeline**: Vai diretamente para aquele nível
- ↺ **Reiniciar**: Volta ao começo

---

## 🚀 Melhorias Futuras

Se quiser expandir o player, considere:

1. **Adicionar mais detalhes aos steps**: Incluir informações de "ferramentas chamadas" ou "dados consultados"
2. **Logs com colores por tipo**: Diferenciar erros, avisos, sucessos com ícones/cores
3. **Expandir estágios**: Adicionar novos passos ou cenários alternativos
4. **Modo "story" com múltiplos cenários**: Permitir escolher entre diferentes fluxos (ex: "Cenário de sucesso" vs "Cenário com erro")
5. **Integração com backend**: Conectar a dados reais da empresa (número real de colaboradores, datas verdadeiras)
6. **Velocidade ajustável**: Slider para controlar a velocidade de reprodução
7. **Salvar progresso**: Lembrar qual foi o último estágio visto

---

## 📝 Notas Técnicas

- **Sem dependências externas**: Tudo é vanilla JavaScript/CSS
- **Sem build step**: Funciona direto no navegador, sem webpack/parcel
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Acessibilidade**: Botões com `title` (tooltips), labels semânticas
- **Performance**: Animações suaves com CSS transitions e requestAnimationFrame (implícito nas delays)

---

## 🐛 Troubleshooting

**P: A página não carrega o JavaScript**
R: Verifique se `js/journey-player.js` está no caminho correto e se há erros no console (F12).

**P: Os passos não aparecem na ordem certa**
R: Verifique os valores de `delay` em cada step — pode ser necessário aumentar se sua máquina for lenta.

**P: As cores não aparecem corretamente**
R: Confirme que `css/variables.css` foi carregado e contém as variáveis `--kyn-teal`, `--kyn-amber`, etc.

**P: O timeline não é interativo ao clicar**
R: Verifique que o JavaScript foi carregado. Abra o console (F12 → Aba Console) e procure por erros.

---

Pronto para usar! 🎉
