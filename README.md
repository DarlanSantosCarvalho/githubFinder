# GitHub Explorer

Aplicação client-side que consome a API pública do GitHub para buscar e exibir perfis de usuários, seus repositórios e detalhes de cada repositório.

## Funcionalidades planejadas

- Busca de usuários do GitHub por nome de usuário
- Perfil com avatar, bio, localização e estatísticas
- Listagem de repositórios com ordenação por estrelas, forks, data e nome
- Tela de detalhes do repositório com link para o GitHub
- Roteamento client-side via hash (`#/`, `#/user/:username`, `#/user/:username/repo/:repo`)
- Layout responsivo

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Vanilla JS (ES Modules) | Lógica da aplicação |
| Axios (CDN) | Requisições HTTP |
| Bootstrap Icons (CDN) | Ícones |
| Google Fonts | Tipografia |
| GitHub REST API v3 | Dados |

## Como executar localmente

Por usar ES Modules, o projeto precisa ser servido via servidor HTTP.

```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .
```

Ou use a extensão **Live Server** no VS Code.

## Estrutura do projeto

```
github-explorer/
├── index.html
├── README.md
└── src/
    ├── css/
    │   └── main.css
    └── js/
        ├── app.js
        ├── router.js
        ├── api.js
        ├── utils.js
        └── pages/
            ├── home.js
            ├── user.js
            └── repo.js
```
