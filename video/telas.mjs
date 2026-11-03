// Telas do BoxMonitor recriadas em HTML para os Reels (dados fictícios, com selo "demonstração").
// Um beat de Reel pode ter `tela: { tipo, ...props }` ou uma lista delas (a tela muda durante a fala).
// Textos e rótulos seguem o app (types/workshop.ts, rastreio, estoque); placa, cliente e oficina são inventados.
//
// Cada tela devolve { html, escura?, alvo? }: `alvo` é o seletor onde o dedo toca quando a tela aparece.
// Números com data-contar="valor" (e data-de, data-fmt, data-sufixo) são animados contando até o valor.

const DEMO = { placa: "BRA2E19", carro: "VW Gol 1.6 2015", cliente: "João", oficina: "Auto Center Demo", data: "11/11" };

// Rótulos iguais aos de SERVICE_STATUS_LABEL no app.
const ETAPAS = [
  ["received", "Veículo recebido"],
  ["diagnosis", "Em diagnóstico"],
  ["awaiting_approval", "Aguardando sua aprovação"],
  ["quote_approved", "Orçamento aprovado"],
  ["quote_declined", "Orçamento recusado"],
  ["awaiting_parts", "Aguardando peças"],
  ["in_service", "Em serviço"],
  ["quality_check", "Em teste final"],
  ["ready", "Pronto para retirada"],
  ["delivered", "Entregue"],
];

const brl = (value) => `R$ ${value.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
const contar = (valor, { de = 0, fmt = "brl", sufixo = "" } = {}) =>
  `data-contar="${valor}" data-de="${de}" data-fmt="${fmt}" data-sufixo="${sufixo}"`;

// Pastilha de freio gasta: chapa de aço com o material de atrito quase no fim (2 mm) e o contorno da nova.
const pastilha = (comMedida) => `
<svg class="pastilha" viewBox="0 0 570 220" aria-hidden="true">
  <path d="M40 130 h440 a20 20 0 0 1 20 20 v20 a20 20 0 0 1 -20 20 h-440 a20 20 0 0 1 -20 -20 v-20 a20 20 0 0 1 20 -20z" fill="#8b949e"/>
  <circle cx="70" cy="160" r="12" fill="#3b4148"/><circle cx="450" cy="160" r="12" fill="#3b4148"/>
  <path d="M70 52 h380 l10 78 h-400z" fill="none" stroke="#ffc72c" stroke-width="4" stroke-dasharray="14 10"/>
  <path d="M62 116 h396 l2 14 h-400z" fill="#6b4a2b"/>
  ${comMedida ? `
  <g class="medida">
    <line x1="500" y1="116" x2="500" y2="130" stroke="#ffc72c" stroke-width="4"/>
    <line x1="488" y1="116" x2="512" y2="116" stroke="#ffc72c" stroke-width="4"/>
    <line x1="488" y1="130" x2="512" y2="130" stroke="#ffc72c" stroke-width="4"/>
    <text x="566" y="104" text-anchor="end" font-family="Barlow Condensed" font-weight="800" font-size="44" fill="#ffc72c">2 mm</text>
  </g>` : ""}
</svg>`;

const topo = (titulo, subtitulo, extra = "") => `
<div class="t-topo">
  <div><p class="t-sub">${subtitulo}</p><p class="t-titulo">${titulo}</p></div>${extra}
</div>`;

const ORCAMENTO_PADRAO = [["Pastilhas dianteiras", 260], ["Mão de obra", 120]];

const telas = {
  // Câmera do celular enquadrando a pastilha; o dedo toca no obturador e a tela pisca.
  foto: ({ medida = false }) => ({
    escura: true,
    alvo: medida ? undefined : ".t-obturador",
    html: `
<div class="t-camera">
  <span class="canto c1"></span><span class="canto c2"></span><span class="canto c3"></span><span class="canto c4"></span>
  ${pastilha(medida)}
  <p class="t-legenda-foto">pastilha dianteira</p>
</div>
<div class="t-obturador"><span></span></div>
<div class="t-flash"></div>`,
  }),

  // Página de rastreio do cliente, com as 10 etapas do serviço.
  etapas: ({ etapa, contador = false }) => {
    const ativas = [etapa].flat();
    const primeira = ETAPAS.findIndex(([key]) => ativas.includes(key));
    const ultima = ETAPAS.findLastIndex(([key]) => ativas.includes(key));
    const linhas = ETAPAS.map(([key, label], index) => {
      let estado = "futuro";
      if (ativas.includes(key)) estado = "atual";
      // O cliente aprova ou recusa: depois disso, o caminho não usado fica riscado.
      else if (index < primeira) estado = key === "quote_declined" ? "pulado" : "feito";
      return `<li class="${estado}"><span class="bolinha"></span>${label}</li>`;
    }).join("");
    const badge = contador
      ? `<span class="t-contador" ${contar(ultima + 1, { de: Math.max(primeira, 0), fmt: "int", sufixo: "/10" })}>${ultima + 1}/10</span>`
      : "";
    return { html: `${topo("Acompanhe seu veículo", `${DEMO.placa} · ${DEMO.carro}`, badge)}<ol class="t-etapas">${linhas}</ol>` };
  },

  // Lado da oficina: nova atualização em "Em diagnóstico", com ou sem a foto anexada.
  diagnostico: ({ foto = false }) => ({
    alvo: foto ? ".t-salvar" : ".t-anexar",
    html: `
${topo(`Nova atualização · ${DEMO.placa}`, `${DEMO.carro} · ${DEMO.cliente}`)}
<p class="t-rotulo">Etapa</p>
<div class="t-select">Em diagnóstico<span>▾</span></div>
<p class="t-rotulo">Fotos do diagnóstico</p>
${foto
  ? `<div class="t-anexo"><div class="t-miniatura">${pastilha(false)}</div><div><p class="t-forte">pastilha-dianteira.jpg</p><p class="t-ok">✓ Foto anexada</p></div></div>`
  : `<div class="t-anexar">+ Anexar foto</div>`}
<div class="t-botao t-salvar">Salvar atualização</div>`,
  }),

  // Rastreio do cliente: fotos do diagnóstico e o orçamento para aprovar.
  // passo: "aguardando" | "toque" (dedo em Aprovar) | "confirmar" (tela de confirmação) | "aprovado"
  orcamento: ({ foto = true, itens = ORCAMENTO_PADRAO, passo = "aguardando" }) => {
    const total = itens.reduce((sum, [, valor]) => sum + valor, 0);
    const lista = `<ul class="t-itens">${itens.map(([nome, valor]) => `<li><span>${nome}</span><b>${brl(valor)}</b></li>`).join("")}
<li class="total"><span>Total</span><b ${passo === "aguardando" ? contar(total) : ""}>${brl(total)}</b></li></ul>`;
    const fotos = foto ? `<div class="t-foto">${pastilha(true)}<p>Fotos do diagnóstico</p></div>` : "";
    if (passo === "confirmar") {
      return {
        alvo: ".t-confirmar .aprovar",
        html: `
${topo(`Orçamento · ${DEMO.placa}`, DEMO.carro)}
<div class="t-confirmar">
  <p class="t-forte">Aprovar o orçamento de ${brl(total)}?</p>
  <p>A oficina vai começar o serviço.</p>
  <div class="t-botao aprovar">Confirmar aprovação</div>
  <div class="t-botao contorno">Voltar</div>
</div>`,
      };
    }
    const chip = passo === "aprovado"
      ? `<span class="t-chip verde">Orçamento aprovado</span>`
      : `<span class="t-chip">Aguardando sua aprovação</span>`;
    const rodape = passo === "aprovado"
      ? `<div class="t-aprovado">✓ Orçamento aprovado</div>`
      : `<div class="t-botoes"><div class="t-botao contorno">Recusar</div><div class="t-botao aprovar">Aprovar orçamento</div></div>`;
    return {
      alvo: passo === "toque" ? ".t-botoes .aprovar" : undefined,
      html: `${topo(`Orçamento · ${DEMO.placa}`, DEMO.carro)}${chip}${fotos}${lista}${rodape}`,
    };
  },

  // Lado da oficina: a resposta do cliente fica registrada no serviço.
  registro: ({ itens = ORCAMENTO_PADRAO }) => {
    const total = itens.reduce((sum, [, valor]) => sum + valor, 0);
    return {
      html: `
${topo(`Serviço · ${DEMO.placa}`, `${DEMO.carro} · ${DEMO.cliente}`)}
<div class="t-registro">
  <span class="t-chip verde">Aprovado pelo cliente</span>
  <p class="t-forte">Orçamento de ${brl(total)}</p>
  <p class="t-periodo">Enviado em ${DEMO.data} às 14:05</p>
  <p class="t-periodo">Respondido em ${DEMO.data} às 14:32</p>
</div>`,
    };
  },

  // Notificação chegando no celular do cliente (tela de bloqueio).
  notificacao: ({ titulo, texto }) => ({
    escura: true,
    html: `
<p class="t-hora">14:32</p>
<p class="t-dia">quarta-feira, ${DEMO.data}</p>
<div class="t-notificacao">
  <div class="t-app"><img src="assets/logo.png" alt="" /><span>BOXMONITOR</span><em>agora</em></div>
  <p class="t-forte">${titulo}</p>
  <p>${texto}</p>
</div>`,
  }),

  // Catálogo de serviços da oficina, com a periodicidade e o aviso antes de vencer.
  catalogo: ({ destaque = "" }) => ({
    alvo: destaque ? ".marcado" : undefined,
    html: `
${topo("Catálogo de serviços", DEMO.oficina)}
<ul class="t-catalogo">
  <li class="${destaque ? "destaque" : ""}"><div><p class="t-forte">Troca de óleo e filtro</p>
    <p class="t-periodo ${destaque === "periodo" ? "marcado" : ""}">A cada 6 meses</p>
    <p class="t-periodo ${destaque === "aviso" ? "marcado" : ""}">Avisar 15 dias antes</p></div><b>${brl(180)}</b></li>
  <li><div><p class="t-forte">Fluido de freio</p><p class="t-periodo">A cada 24 meses</p></div><b>${brl(120)}</b></li>
  <li><div><p class="t-forte">Alinhamento e balanceamento</p><p class="t-periodo">A cada 10.000 km</p></div><b>${brl(90)}</b></li>
</ul>`,
  }),

  // Nova ordem de serviço: o serviço escolhido no catálogo já traz o preço.
  os: ({ itens = 0 }) => {
    const servicos = [["Troca de óleo", 140], ["Filtro de óleo", 40], ["Pastilhas dianteiras", 260]].slice(0, itens);
    const total = servicos.reduce((sum, [, valor]) => sum + valor, 0);
    const anterior = servicos.slice(0, -1).reduce((sum, [, valor]) => sum + valor, 0);
    return {
      alvo: itens ? "li.novo" : ".t-select",
      html: `
${topo("Nova ordem de serviço", DEMO.oficina)}
<p class="t-rotulo">Veículo</p>
<div class="t-select">${DEMO.placa} · ${DEMO.carro}</div>
<p class="t-rotulo">Serviço do catálogo</p>
<ul class="t-itens">${servicos.map(([nome, valor], index) => `<li class="${index === itens - 1 ? "novo" : ""}"><span>✓ ${nome}</span><b>${brl(valor)}</b></li>`).join("")}
${servicos.length < 3 ? `<li class="vazio"><span>+ Adicionar serviço</span></li>` : ""}
<li class="total"><span>Total</span><b ${contar(total, { de: anterior })}>${brl(total)}</b></li></ul>`,
    };
  },

  // Histórico do veículo: cada passagem com data, km, o que foi feito e a nota fiscal.
  historico: ({ aberto = false }) => ({
    alvo: aberto ? "li.aberto" : undefined,
    html: `
${topo(`Histórico · ${DEMO.placa}`, DEMO.carro)}
<ul class="t-historico">
  <li class="${aberto ? "aberto" : ""}"><p class="t-data">12/03/2026 · 84.300 km</p><p class="t-forte">Troca de pastilhas dianteiras</p>
    ${aberto ? `<p class="t-detalhe">Pastilhas dianteiras e retífica dos discos</p><span class="t-arquivo">Nota fiscal.pdf</span>` : ""}</li>
  <li><p class="t-data">20/11/2025 · 78.900 km</p><p class="t-forte">Troca de óleo e filtro</p></li>
  <li><p class="t-data">04/06/2025 · 72.150 km</p><p class="t-forte">Alinhamento e balanceamento</p></li>
</ul>`,
  }),

  // Estoque com "Estoque mínimo" por peça; quem chega no mínimo ganha o selo "Estoque baixo".
  estoque: ({ editando = false, alerta = false }) => {
    const pecas = [
      ["Óleo 5W30 (litro)", 18, 6],
      ["Filtro de óleo", alerta ? 2 : 5, 4],
      ["Pastilha dianteira Gol", 6, 2],
      ["Palheta 20\"", 8, 4],
    ];
    const linhas = pecas.map(([nome, qtd, minimo], index) => {
      const baixo = alerta && qtd <= minimo;
      const marcado = editando && index === 1;
      const quantidade = baixo ? `<b ${contar(qtd, { de: 5, fmt: "int", sufixo: " un" })}>${qtd} un</b>` : `<b>${qtd} un</b>`;
      return `<li class="${baixo ? "baixo" : ""}"><div><p class="t-forte">${nome}</p><p class="t-periodo ${marcado ? "marcado" : ""}">Estoque mínimo: ${minimo}</p></div>
<div class="t-qtd">${quantidade}${baixo ? `<span class="t-chip vermelho">Estoque baixo</span>` : ""}</div></li>`;
    }).join("");
    return { alvo: editando ? ".marcado" : undefined, html: `${topo("Estoque", DEMO.oficina)}<ul class="t-estoque">${linhas}</ul>` };
  },

  // Lista curta de recursos, para fechar um Reel com vários itens.
  lista: ({ itens }) => ({
    html: `${topo("No BoxMonitor", DEMO.oficina)}<ul class="t-lista">${itens.map((item) => `<li><span>✓</span>${item}</li>`).join("")}</ul>`,
  }),
};

export const renderTela = (tela) => {
  const montar = telas[tela.tipo];
  if (!montar) throw new Error(`Tela desconhecida: ${tela.tipo}`);
  return montar(tela);
};

export const TELA_CSS = `
.palco { position:absolute; left:130px; top:520px; width:680px; height:640px; opacity:0; }
.flutua { position:absolute; inset:0; }
.painel { position:absolute; inset:0; border-radius:36px; overflow:hidden;
  background:#eceff1; color:#1a1d21; box-shadow:0 30px 80px rgba(0,10,40,.45); font-family:"Barlow"; }
.selo { position:absolute; right:22px; bottom:14px; z-index:5; font-family:"Barlow Condensed"; font-weight:700; font-size:24px;
  letter-spacing:3px; text-transform:uppercase; color:#4a5568; background:rgba(255,255,255,.9); padding:4px 12px; border-radius:6px; }
.estado { position:absolute; inset:0; padding:30px 38px 62px; display:flex; flex-direction:column; gap:14px; background:#eceff1; opacity:0; }
/* Telas de celular (câmera, tela de bloqueio): fundo escuro. Cada estado tem fundo próprio para cobrir o anterior. */
.estado.escura { background:linear-gradient(160deg,#1d2a4a,#0b1226); color:#fff; }
.dedo { position:absolute; left:0; top:0; width:84px; height:84px; margin:-42px 0 0 -42px; border-radius:50%; z-index:10; opacity:0;
  background:rgba(255,255,255,.92); border:5px solid #ffc72c; box-shadow:0 10px 30px rgba(0,0,0,.35); }
.onda { position:absolute; left:0; top:0; width:84px; height:84px; margin:-42px 0 0 -42px; border-radius:50%; z-index:9; opacity:0;
  border:6px solid #ffc72c; }
.t-topo { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; }
.t-sub { font-size:26px; font-weight:600; color:#4a5568; }
.t-titulo { font-family:"Barlow Condensed"; font-weight:800; font-size:46px; text-transform:uppercase; line-height:1; color:#003399; }
.t-contador { font-family:"Barlow Condensed"; font-weight:800; font-size:40px; background:#ffc72c; color:#001f66; padding:4px 16px; border-radius:10px; }
.t-etapas { list-style:none; display:flex; flex-direction:column; gap:2px; }
.t-etapas li { display:flex; align-items:center; gap:16px; font-size:28px; font-weight:600; padding:3px 14px; border-radius:10px; color:#5f6b76; }
.t-etapas .bolinha { width:22px; height:22px; border-radius:50%; border:3px solid #9aa4ae; flex:none; }
.t-etapas li.feito { color:#1a1d21; }
.t-etapas li.feito .bolinha { background:#003399; border-color:#003399; }
.t-etapas li.pulado { color:#9aa4ae; text-decoration:line-through; }
.t-etapas li.atual { background:#003399; color:#fff; font-weight:700; }
.t-etapas li.atual .bolinha { background:#ffc72c; border-color:#ffc72c; }
.t-rotulo { font-size:24px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#4a5568; margin-bottom:-8px; }
.t-select { background:#fff; border:2px solid #cfd6dd; border-radius:12px; padding:14px 18px; font-size:30px; font-weight:600; display:flex; justify-content:space-between; }
.t-anexar { border:3px dashed #9aa4ae; border-radius:12px; padding:30px; text-align:center; font-size:28px; font-weight:700; color:#4a5568; }
.t-anexo { display:flex; gap:18px; align-items:center; background:#fff; border-radius:12px; padding:14px; }
.t-miniatura { width:150px; height:96px; border-radius:10px; background:#1d2a4a; display:flex; align-items:center; justify-content:center; padding:6px; flex:none; }
.t-miniatura .pastilha { width:100%; height:100%; }
.t-forte { font-size:28px; font-weight:700; }
.t-ok { font-size:24px; font-weight:700; color:#1e6b2c; }
.t-botao { position:relative; background:#003399; color:#fff; text-align:center; font-family:"Barlow Condensed"; font-weight:800;
  font-size:34px; text-transform:uppercase; padding:16px; border-radius:14px; }
.t-botao.contorno { background:#fff; color:#003399; border:3px solid #003399; }
.t-botoes { display:grid; grid-template-columns:1fr 1.7fr; gap:14px; margin-top:auto; }
.t-chip { align-self:flex-start; font-size:24px; font-weight:700; padding:6px 14px; border-radius:999px; background:#fff3cd; color:#6b4f00; }
.t-chip.verde { background:#d8f0dc; color:#1e6b2c; }
.t-chip.vermelho { background:#fde2e1; color:#a8201a; }
.t-foto { background:#1d2a4a; border-radius:14px; height:128px; flex:none; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.t-foto .pastilha { height:88px; }
.t-foto p { color:#fff; font-size:24px; font-weight:600; }
.t-itens { list-style:none; display:flex; flex-direction:column; gap:6px; }
.t-itens li { display:flex; justify-content:space-between; font-size:28px; font-weight:600; background:#fff; padding:7px 16px; border-radius:10px; }
.t-itens li.total { background:none; font-size:32px; font-weight:800; border-top:2px solid #cfd6dd; border-radius:0; }
.t-itens li.vazio { background:none; border:2px dashed #9aa4ae; color:#4a5568; }
.t-itens li.novo { box-shadow:inset 0 0 0 3px #ffc72c; }
.t-aprovado { margin-top:auto; background:#1e6b2c; color:#fff; font-size:30px; font-weight:700; padding:18px; border-radius:14px; text-align:center; }
.t-confirmar { margin:auto 0; background:#fff; border-radius:20px; padding:30px; display:flex; flex-direction:column; gap:16px; font-size:26px; box-shadow:0 10px 30px rgba(0,0,0,.12); }
.t-registro { background:#fff; border-radius:16px; padding:24px; display:flex; flex-direction:column; gap:10px; }
.t-hora { font-family:"Barlow Condensed"; font-weight:700; font-size:120px; text-align:center; line-height:1; margin-top:30px; }
.t-dia { text-align:center; font-size:26px; font-weight:600; opacity:.85; }
.t-notificacao { margin-top:40px; background:#fff; color:#1a1d21; border-radius:24px; padding:22px 26px; display:flex; flex-direction:column; gap:6px; font-size:26px; }
.t-app { display:flex; align-items:center; gap:10px; font-size:22px; font-weight:700; letter-spacing:2px; color:#4a5568; }
.t-app img { width:36px; height:36px; border-radius:8px; background:#fff; }
.t-app em { margin-left:auto; font-style:normal; font-weight:600; letter-spacing:0; }
.t-catalogo, .t-estoque, .t-historico { list-style:none; display:flex; flex-direction:column; gap:10px; }
.t-catalogo li, .t-estoque li { display:flex; justify-content:space-between; align-items:center; background:#fff; padding:14px 18px; border-radius:12px; border:3px solid transparent; }
.t-catalogo li b, .t-estoque li b { font-size:28px; }
.t-periodo { font-size:24px; font-weight:600; color:#4a5568; }
.t-catalogo li.destaque { border-color:#ffc72c; }
.t-periodo.marcado { color:#001f66; background:#ffc72c; padding:0 8px; border-radius:6px; display:inline-block; }
.t-estoque li.baixo { border-color:#a8201a; background:#fff5f5; }
.t-qtd { display:flex; flex-direction:column; align-items:flex-end; gap:4px; }
.t-historico li { background:#fff; padding:14px 18px; border-radius:12px; display:flex; flex-direction:column; gap:4px; border:3px solid transparent; }
.t-historico li.aberto { border-color:#ffc72c; }
.t-data { font-size:24px; font-weight:700; color:#003399; }
.t-detalhe { font-size:24px; color:#4a5568; font-weight:600; }
.t-arquivo { align-self:flex-start; font-size:22px; font-weight:700; color:#003399; border:2px solid #003399; border-radius:8px; padding:4px 12px; margin-top:4px; }
.t-lista { list-style:none; display:flex; flex-direction:column; gap:22px; margin:auto 0; }
.t-lista li { display:flex; align-items:center; gap:22px; background:#fff; border-radius:16px; padding:26px 28px; font-size:38px; font-weight:700; }
.t-lista li span { width:56px; height:56px; border-radius:50%; background:#ffc72c; color:#001f66; display:flex; align-items:center; justify-content:center; font-weight:800; flex:none; }
.t-camera { position:relative; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.t-camera .pastilha { width:560px; }
.t-legenda-foto { font-size:24px; font-weight:600; opacity:.85; }
.canto { position:absolute; width:60px; height:60px; border:6px solid #fff; }
.c1 { left:0; top:0; border-right:0; border-bottom:0; } .c2 { right:0; top:0; border-left:0; border-bottom:0; }
.c3 { left:0; bottom:0; border-right:0; border-top:0; } .c4 { right:0; bottom:0; border-left:0; border-top:0; }
.t-obturador { align-self:center; width:90px; height:90px; border-radius:50%; border:6px solid #fff; display:flex; align-items:center; justify-content:center; flex:none; }
.t-obturador span { width:66px; height:66px; border-radius:50%; background:#fff; }
.t-flash { position:absolute; inset:0; background:#fff; opacity:0; }
`;
