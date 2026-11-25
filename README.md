# Vibe Fotos — Camila Geovana

Site de fotografia e marketing digital. HTML, CSS e JavaScript puros, sem build e sem dependências.

## Estrutura

```
index.html        página principal
css/style.css     estilos
js/config.js      textos, links, categorias, serviços e fotos (edite aqui)
js/main.js        funcionamento do site
assets/img/       fotos
assets/fonts/     fontes (woff2)
```

## Editar conteúdo

Abra `js/config.js`: links (WhatsApp, Instagram, orçamento), textos, categorias e serviços ficam todos lá.
Para trocar uma foto, coloque o arquivo em `assets/img/` e atualize o caminho, ex.: `img: "assets/img/gestantes.jpg"`.

## Rodar localmente

Abra o `index.html` no navegador, ou rode `python3 -m http.server` e acesse http://localhost:8000.

## Publicar no GitHub Pages

1. No repositório: **Settings → Pages**
2. Em **Source**, escolha **Deploy from a branch**
3. Branch **main**, pasta **/ (root)** → **Save**
4. Em ~1 minuto o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`
