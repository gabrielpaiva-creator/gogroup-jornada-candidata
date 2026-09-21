# Manual da Pessoa Candidata — GoGroup

Landing page de employer branding construída a partir de dois documentos-fonte:

- **Conteúdo:** `[GOGROUP] Manual da Pessoa Candidata - R&S.pptx.pdf`
- **Visual:** `Design system - Gogroup.pdf` (paleta, tipografia, raios de borda, botões, doodles)

Nenhum dado corporativo, depoimento, etapa de processo ou link foi inventado — todo o
texto vem diretamente dos PDFs fornecidos (extraídos com `pdftotext`).

## Stack

HTML + CSS + JavaScript puro (sem build step, sem dependências além das fontes do
Google Fonts). Não havia projeto/stack existente no diretório de trabalho, então foi
escolhida a opção mais leve e performática para uma landing page essencialmente
estática: menos JS para carregar, sem etapa de build, fácil de hospedar em qualquer
lugar (Netlify, Vercel estático, S3, etc.).

```
index.html          → estrutura semântica de todas as seções
assets/styles.css    → design tokens + todos os estilos (mobile-first)
assets/script.js     → navbar, drawer mobile, stepper, carousel, scroll-reveal
assets/favicon.svg   → ícone provisório (ver "Assets pendentes" abaixo)
server.js            → servidor estático simples (Node, sem dependências) para dev local
.claude/launch.json  → configuração de preview local
```

## Rodando localmente

```bash
node server.js
```

Depois abra `http://localhost:5173`.

## Assets pendentes

Os PDFs de origem não permitiram extração confiável de logos vetoriais das marcas do
ecossistema (Gocase, AZ, Apice, Barbours, Kokeshi, By Samia, Rituária, Aua Natural,
Lescent, Yenzah). Para não inventar identidades visuais, os cards de marca em
`#universo` e os chips em `#links` usam **wordmarks tipográficos** (nome da marca em
texto estilizado) como placeholder claramente identificável.

**Onde trocar:** em `index.html`, dentro de `.brand-card-name` (seção `#universo`) —
basta substituir o `<span>` por um `<img>`/`<svg>` do logo oficial de cada marca
quando os arquivos vetoriais estiverem disponíveis. O mesmo vale para o favicon
(`assets/favicon.svg`), hoje um ícone de foguete genérico no lugar do logo oficial do
GoGroup.

## Números de crescimento (seção "Nossa trajetória")

Os valores de 2024 (realizado) e Visão 2025 (projeção) foram extraídos do gráfico do
manual e a matemática de cada linha foi conferida (ex.: 225M → 500M = +122%) antes de
serem usados, para garantir fidelidade aos dados originais. Nenhum número foi
arredondado além do que já vinha no material.

## Notas de acessibilidade

- Stepper da jornada segue o padrão ARIA de `tablist`/`tab`/`tabpanel`, navegável por
  setas do teclado.
- Carousel de depoimentos é navegável por botões, teclado (setas) e swipe, com região
  `aria-live` informando o slide atual.
- Todas as animações respeitam `prefers-reduced-motion: reduce`.
- Skip link, foco visível (`:focus-visible`), hierarquia de headings e `alt`/`aria-label`
  em elementos decorativos/interativos.
