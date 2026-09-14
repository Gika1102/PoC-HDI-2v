# HDI PoC — Saúde Ocupacional

Uma demonstração estática de um agente fictício para acompanhamento de exames ocupacionais. O portal funciona no GitHub Pages; o formulário de feedback envia respostas para um Cloudflare Worker, que grava cada envio como um arquivo JSON independente no GitHub.

## Como funciona

- O chat usa regras determinísticas em JavaScript.
- O botão de pessoa no chat troca o perfil demonstrado: Funcionário, Gerente, RH ou TI.
- As respostas e perguntas sugeridas mudam conforme o perfil escolhido.
- Todos os dados são fictícios e ficam em `js/fake-agent-data.js`.
- `backend/employees.xlsx` é a referência editável da massa de demonstração; ao alterá-la, replique os dados no arquivo JavaScript estático.
- `forms/feedback.html` é o formulário mobile-first; sua lógica e seus estilos ficam, respectivamente, em `js/form.js` e `css/form.css`.

## Abrir localmente

Abra `command-center.html` no navegador. O chat funciona sem iniciar nenhum processo local.

## Publicar gratuitamente

1. Suba o repositório no GitHub.
2. Em **Settings → Pages**, escolha **Deploy from a branch** e selecione a branch `main` e a pasta `/ (root)`.
3. Abra `https://<organizacao-ou-usuario>.github.io/<repositorio>/command-center.html`.

Cada push para a branch configurada atualiza a demonstração publicada. O formulário não grava arquivos diretamente no GitHub Pages: `js/form.js` envia para `POST /submit` do Worker, e o Worker usa a API do GitHub para criar `responses/<uuid>.json`.

## Configurar o Cloudflare Worker

1. Publique `backend/worker.js` como um Cloudflare Worker.
2. Configure as variáveis do Worker: `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH` e `ALLOWED_ORIGIN` (a origem exata do GitHub Pages, por exemplo `https://usuario.github.io`).
3. Configure `GITHUB_TOKEN` como Secret, com permissão mínima de leitura e escrita em Contents no repositório. Nunca coloque esse token no frontend.
4. Substitua `SUBMIT_ENDPOINT` em `js/form.js` pela URL pública do Worker seguida de `/submit`.

As respostas ficam em `responses/`, com um arquivo por envio. O diretório pode ser criado automaticamente na primeira resposta pela API do GitHub.
