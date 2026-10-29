# Portfólio — Gabriel de Oliveira Custódio

Site estático em HTML, CSS e JavaScript puros (`index.html`, `style.css`, `script.js`).

## Rodar localmente
Abra `index.html` no navegador, ou, na pasta do projeto: `python3 -m http.server 8000` e acesse http://localhost:8000

## O que preencher
- `script.js` (topo, objeto `CONFIG`): `email`, `github`, `linkedin` e, opcionalmente, `formEndpoint` (ex.: Formspree). Sem isso, os contatos aparecem como "a preencher" e o formulário avisa que não envia.
- `index.html`: textos marcados como "Preencher:" (Trajetória, Interesses, Objetivos, tecnologias e os 3 cartões de projeto). Troque os `<span class="slot">` de link por `<a href="...">`.

## Publicar no Vercel (grátis)
1. Crie um repositório no GitHub e envie estes arquivos.
2. Em vercel.com, entre com o GitHub, clique em "Add New → Project" e importe o repositório.
3. Framework Preset: "Other". Deixe Build Command e Output Directory vazios e clique em "Deploy".
