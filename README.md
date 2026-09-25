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
tratamento bicolor usado antes.

## Logos das marcas do portfólio (`assets/img/brands/`)

O Brandbook só documenta a marca-mãe Gogroup, não as marcas individuais do portfólio.
Em vez de usar wordmarks tipográficos genéricos, os logos reais de 8 das 10 marcas foram
obtidos diretamente dos sites oficiais de cada uma (o logotipo `<img>`/`<svg>` do
cabeçalho de cada site, na maior resolução disponível — no caso da Gocase, o próprio SVG
vetorial inline do site):

- Com logo real: Gocase, Apice Cosméticos, Barbour's Beauty, Kokeshi, By Samia,
  Rituária, Auá Natural, Lescent.
- Sem logo: **AZ** (o site azbuy.com.br não respondeu em nenhuma tentativa de acesso —
  provavelmente fora do ar ou bloqueado) e **Yenzah** (não tem site próprio, só
  Instagram). Esses dois continuam com wordmark tipográfico em `.brand-card-name`.

**Onde trocar:** basta substituir o arquivo correspondente em `assets/img/brands/` (ou
adicionar um novo `<img class="brand-card-logo">` para AZ/Yenzah em `index.html`,
seção `#universo`) quando/se você tiver os arquivos oficiais.

## Stack

HTML + CSS + JavaScript puro (sem build step, sem dependências além das fontes do
Google Fonts). Não havia projeto/stack existente no diretório de trabalho, então foi
escolhida a opção mais leve e performática para uma landing page essencialmente
estática: menos JS para carregar, sem etapa de build, fácil de hospedar em qualquer
lugar (Netlify, Vercel estático, S3, etc.).

```
index.html          → estrutura semântica de todas as seções
assets/styles.css    → design tokens + todos os estilos (mobile-first)
assets/script.js     → navbar, drawer mobile, stepper, carousel, scroll-reveal, manifesto,
                       test drive, quiz de mantras, painel do piloto
assets/favicon.svg   → ícone provisório (ver "Assets pendentes" abaixo)
server.js            → servidor estático simples (Node, sem dependências) para dev local
.claude/launch.json  → configuração de preview local
```

## Rodando localmente

```bash
node server.js
```

Depois abra `http://localhost:5173`.

## Deploy no GoDeploy (devgogroup.com)

O endpoint de upload do GoDeploy corrompe arquivos binários enviados via
multipart: ele decodifica o conteúdo como UTF-8 no servidor, então qualquer
byte fora do ASCII vira o caractere de substituição `U+FFFD`, destruindo
PNG/WEBP/JPG (SVG, HTML, CSS e JS sobrevivem porque já são texto UTF-8/ASCII
válido).

Workaround: `scripts/build-deploy-html.js` gera uma cópia de `index.html` com
todas as imagens de `assets/img/` embutidas como data URI base64 (texto puro,
imune ao bug) em `.scratch/deploy/index.html` — o `index.html` do repositório
não é alterado.

```bash
node scripts/build-deploy-html.js
```

Ao atualizar o app no GoDeploy, suba `.scratch/deploy/index.html` como
`index.html`, junto de `assets/favicon.svg`, `assets/script.js` e
`assets/styles.css` (sem `assets/img/*` — já foram embutidas no HTML).

## Experiência imersiva (interações baseadas no Deck de Cultura)

Camada interativa com tema de corrida ("Uma empresa de Motoristas", "Victory is in your
veins") e o visual do Deck de Cultura: color blocking com a paleta do Brandbook (azul
protagonista, ciano, verde-limão), Poppins 800, wordmark "gogroup" gigante sangrando como
elemento decorativo e formas sempre arredondadas. Todo texto das interações vem literalmente
do Deck; só as instruções de uso (enunciados, feedbacks) foram escritas para a página.

- **Manifesto (`#manifesto`)**: "Em que acreditamos?". As frases "Não estamos aqui para..."
  acendem palavra por palavra conforme o scroll (seção sticky), e o foguete sobe junto.
- **Test drive (`#test-drive`)**: jogo "Motorista ou Passageiro?". São 10 atitudes sorteadas
  do quadro Motorista x Passageiro, respondidas por botões, pelas setas do teclado ou
  arrastando o card. O capacete avança na pista a cada acerto.
- **Qual mantra acelera você? (`#seu-mantra`)**: quiz de 5 voltas. Cada volta tem uma frase
  do "Alto padrão" de cada mantra, embaralhadas. O resultado mostra o mantra dominante (arte,
  tag, definição, ranking) e liga com a Entrevista Cultural. Nome, arte e cor são lidos do
  próprio carousel de valores, então as imagens também funcionam no build do GoDeploy.
  Nada é enviado a lugar nenhum.
- **Pista da jornada**: o stepper do processo seletivo ganhou uma pista com checkpoints
  01–05, o capacete andando até a etapa selecionada e o botão "Próxima etapa".
- **Painel do piloto**: HUD flutuante com 4 conquistas (test drive, 5 valores, quiz e 5 etapas). Ao completar tudo: confete e CTA para as vagas. O progresso fica só no
  `localStorage` do navegador de quem visita (chave `gogroup-painel-piloto-v1`), e a página
  funciona normalmente se o storage estiver bloqueado.

Tudo respeita `prefers-reduced-motion` (manifesto sem scrub, sem confete).

## Nossos valores é um carousel (igual aos depoimentos)

Cada mantra aparece em um slide "completo" — arte oficial + tag + definição + traços +
comparativo "Alto padrão vs. Não alinhado com a nossa cultura" — e a pessoa navega entre
os 5 com os mesmos controles (setas, dots, swipe, teclado) do carousel de depoimentos.
O JS do carousel foi generalizado (`initCarousel` em `assets/script.js`) para os dois
usarem o mesmo componente via atributos `data-carousel`/`data-track`/`data-prev`/etc.

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
  usada como imagem de topo dos slides em `#valores` (mesmas cores e ilustrações que o
  time de marca criou para cada valor no Deck de Cultura).

## Doodles/stickers decorativos (`assets/img/stickers/`)

Recortados do sticker sheet do Brandbook (chroma-key removendo o fundo azul sólido,
com `sharp`, para ficarem transparentes) e espalhados pela página para deixá-la menos
"branca"/institucional, como pedido: o foguete e o planeta do hero, o capacete de
corrida e a bandeira quadriculada perto de "Nossos valores", o troféu e o foguete em
"Sua jornada", o globo em "O que é o Gogroup" e em "Escritórios", o diamante em
"Prepare-se". `f1car.jpg` é o carro de Fórmula 1 do Deck de Cultura (slide "Uma empresa
de Motoristas"), usado como fundo com fade na seção de CTA final — a cor de fundo da
própria ilustração já é quase igual ao azul da seção, então a transição fica suave sem
precisar de recorte. `mind.png` ilustra o quiz de mantras. Sobraram alguns stickers extraídos mas não usados ainda
(`box-heart.png`, `lightbulb.png`, `badge.png`) — disponíveis para novas seções se quiser
mais desse tratamento em algum lugar específico.

## Notas de acessibilidade

- Stepper da jornada segue o padrão ARIA de `tablist`/`tab`/`tabpanel`, navegável por
  setas do teclado.
- Carousel de depoimentos é navegável por botões, teclado (setas) e swipe, com região
  `aria-live` informando o slide atual.
- Todas as animações respeitam `prefers-reduced-motion: reduce`.
- Skip link, foco visível (`:focus-visible`), hierarquia de headings e `alt`/`aria-label`
  em elementos decorativos/interativos.
