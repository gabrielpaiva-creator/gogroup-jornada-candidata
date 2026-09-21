# Manual da Pessoa Candidata — Gogroup

Landing page de employer branding construída a partir de quatro documentos-fonte:

- **Conteúdo do processo seletivo:** `[GOGROUP] Manual da Pessoa Candidata - R&S.pptx.pdf`
- **Direção visual inicial:** `Design system - Gogroup.pdf` (paleta, tipografia, raios de borda, botões)
- **Mantras/valores em detalhe + arte oficial de cada um:** `Deck de cultura.pdf`
- **Identidade de marca (logotipo, grafia, cores oficiais):** `Brandbook Gogroup.pdf`

Nenhum dado corporativo, depoimento, mantra ou link foi inventado — todo o texto vem
diretamente dos PDFs fornecidos (extraídos com `pdftotext` para texto e `pdf-to-img` +
`sharp` para imagens/recortes).

## Correções de marca (via Brandbook)

O Brandbook define que a grafia correta em texto corrido é **"Gogroup"** (G maiúsculo,
"ogroup" minúsculo) — nunca "GoGroup". Isso foi corrigido em todo o site. O logotipo
oficial (elemento gráfico) é grafado **"gogroup"** todo em minúsculas, em uma única cor
sólida — por isso a wordmark do navbar/rodapé foi simplificada para essa forma, sem o
tratamento bicolor usado antes. O Brandbook também não documenta os logotipos das marcas
individuais do portfólio (Gocase, Apice, Barbours, Kokeshi, By Samia, Rituária, Aua
Natural, Lescent, Yenzah) — apenas a marca-mãe Gogroup — então os cards dessas marcas em
`#universo` continuam usando wordmarks tipográficos (ver "Assets pendentes").

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

Nenhum dos quatro PDFs fornecidos contém os logotipos vetoriais das marcas do
ecossistema (Gocase, AZ, Apice, Barbours, Kokeshi, By Samia, Rituária, Aua Natural,
Lescent, Yenzah) — o Brandbook documenta apenas a marca-mãe Gogroup. Para não inventar
identidades visuais, os cards de marca em `#universo` e os chips em `#links` continuam
usando **wordmarks tipográficos** (nome da marca em texto estilizado) como placeholder
claramente identificável.

**Onde trocar:** em `index.html`, dentro de `.brand-card-name` (seção `#universo`) —
basta substituir o `<span>` por um `<img>`/`<svg>` do logo oficial de cada marca
quando os arquivos vetoriais estiverem disponíveis. Se você tiver esses logos em outro
arquivo (ex.: um brandbook por marca, ou um .zip de assets), envie que eu integro.

## Imagens extraídas dos PDFs (`assets/img/`)

Como os PDFs não têm um "exportar imagem" direto, as fotos e ilustrações foram obtidas
renderizando as páginas relevantes em alta resolução (`pdf-to-img`) e recortando a
região exata da foto/arte com `sharp`, sem inventar nem gerar nada nas imagens:

- `andre.webp`, `isabella.webp`, `lucas.webp`, `ravenna.webp` — fotos reais dos 4
  depoimentos do Manual, recortadas das próprias páginas de depoimento.
- `letlou.webp`, `gio.webp` — fotos dos 2 depoimentos adicionais encontrados no Deck de
  Cultura (Let Lou e Gio Sabrina), incorporados como slides 5 e 6 do carousel.
- `ponta-firme.webp`, `mente-aberta.webp`, `time-campeao.webp`,
  `transparencia-maxima.webp`, `amor-pelo-cliente.webp` — a arte oficial de cada mantra,
  usada como imagem de topo dos cards em `#valores` (mesmas cores e ilustrações que o
  time de marca criou para cada valor no Deck de Cultura).

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
