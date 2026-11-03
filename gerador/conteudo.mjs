// Conteúdo dos posts. Texto entre *asteriscos* sai destacado em amarelo (capa/CTA) ou azul (slides claros).

const HASHTAGS_PRODUTO =
  "#oficinamecanica #mecanicoautomotivo #gestaodeoficina #oficinadebairro #autocenter #mecanica #donodeoficina";
const HASHTAGS_DICAS =
  "#dicasdemecanica #gestaodeoficina #empreendedorismo #pequenonegocio #mecanicoautomotivo #oficinamecanica";
const HASHTAGS_REEL = "#oficinamecanica #mecanicoautomotivo #gestaodeoficina";
// Reels de sábado falam com o dono do carro, não com a oficina.
const HASHTAGS_CLIENTE = "#manutencaoautomotiva #donodecarro #dicasdecarro";
const CHAMADA_CLIENTE = "👉 Pergunta pra sua oficina se ela usa o BoxMonitor. Link na bio.";

// Reels saem às 12h de segunda a quinta e no sábado; o carrossel do mesmo dia passa para as 15h.
const DEPOIS_DO_REEL = "15:00:00-03:00";

// Reels: o vídeo sai de `npm run video -- <slug>` (HyperFrames + voz ElevenLabs) em videos/<slug>.mp4 e só é publicado se existir.
// Cada beat: `say` é a fala (vira áudio e legenda, números por extenso para a voz), `card` é o texto grande na tela e
// `tela` (opcional) é a tela do BoxMonitor recriada em video/telas.mjs; uma lista de telas muda durante a fala.
const ORCAMENTO_FREIO = [["Discos e pastilhas dianteiras", 800], ["Mão de obra", 180]];
const ORCAMENTO_800 = [["Discos e pastilhas dianteiras", 640], ["Mão de obra", 160]];

export const posts = [
  // ───────── SEMANA 1 ─────────
  {
    slug: "01-2026-11-02-seg-carrossel-ja-ta-pronto",
    kind: "carousel",
    slides: [
      { type: "cover", kicker: "Atendimento", title: "Cliente ligando pela *5ª vez* pra saber do carro?", body: "Isso tem solução." },
      { type: "item", number: "1", title: "Cada ligação *para o serviço*", body: "Larga a ferramenta, limpa a mão, atende, volta. Várias vezes por dia." },
      { type: "item", number: "2", title: "O cliente não liga *por chatice*", body: "Ele liga porque não sabe o que está acontecendo com o carro dele." },
      { type: "item", number: "3", title: "Informação *antes da pergunta*", body: "Cliente que recebe atualização não precisa ligar." },
      {
        type: "list",
        title: "Como funciona no *BoxMonitor*",
        list: ["1. Você atualiza o status do serviço", "2. O cliente recebe aviso no WhatsApp", "3. Ele acompanha tudo pela placa"],
      },
      { type: "cta", title: "Menos telefone. *Mais serviço.*", body: "Cadastre sua oficina no BoxMonitor." },
    ],
    caption: `Quantas vezes por dia o telefone toca com a mesma pergunta? 📞

No BoxMonitor, seu cliente digita a placa e vê em que etapa o carro está. Quando o status muda, ele recebe aviso no WhatsApp.

Você trabalha. Ele fica tranquilo.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_PRODUTO}`,
  },
  {
    slug: "02-2026-11-04-qua-reel-foto-do-problema",
    kind: "reel",
    cover: { kicker: "Reel", title: "Para de explicar *pastilha por telefone*" },
    beats: [
      { say: "[exasperated] Para de explicar pastilha por telefone.", card: "Para de explicar *por telefone*" },
      { say: "[firmly] Manda uma foto.", card: "Manda *1 foto*", tela: { tipo: "foto" } },
      { say: "[sighs] Cliente não entende “tá no limite”, cara.", card: "“Tá no limite”? *Ele não entende*", tela: { tipo: "foto" } },
      { say: "Ele entende a foto da pastilha com... dois milímetros.", card: "Pastilha com *2 mm*", tela: { tipo: "foto", medida: true } },
      { say: "[confident] No BoxMonitor, você põe o carro em diagnóstico", card: "Carro em *diagnóstico*", tela: { tipo: "diagnostico" } },
      { say: "e anexa a foto ali mesmo, na etapa.", card: "Foto *na etapa*", tela: { tipo: "diagnostico", foto: true } },
      { say: "Aí o orçamento chega no celular do cliente", card: "Orçamento *no celular*", tela: { tipo: "orcamento" } },
      { say: "junto com a foto do problema.", card: "Orçamento *+ foto*", tela: { tipo: "orcamento" } },
      {
        say: "[pleased] Ele vê, entende... e aprova pelo celular.",
        card: "Aprova *pelo celular*",
        tela: [{ tipo: "orcamento", passo: "toque" }, { tipo: "orcamento", passo: "confirmar" }, { tipo: "orcamento", passo: "aprovado" }],
      },
      { say: "[chuckles] Ninguém discute com uma foto, sabe?", card: "Ninguém discute *com foto*" },
      { say: "[playfully] Manda pro mecânico que ainda explica por telefone.", card: "Manda pro *mecânico*" },
    ],
    caption: `Cliente não entende "tá no limite". Ele entende a foto da pastilha com 2 mm. Manda pro mecânico que ainda explica tudo por telefone.

No BoxMonitor você coloca o carro em diagnóstico e anexa a foto ali mesmo. O cliente vê a foto e o orçamento pelo celular e aprova de lá, antes do serviço começar.

Menos explicação no telefone, menos discussão na hora de pagar.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
  {
    slug: "02-2026-11-04-qua-carrossel-5-sinais",
    kind: "carousel",
    publishTime: DEPOIS_DO_REEL,
    slides: [
      { type: "cover", kicker: "Gestão de oficina", title: "5 sinais de que sua oficina está *perdendo cliente*", body: "(e você nem percebe)" },
      { type: "item", number: "1", title: "O cliente não sabe quando voltar", body: "Fez a troca de óleo e ninguém avisou quando é a próxima. Ele volta… pra oficina que lembrar primeiro." },
      { type: "item", number: "2", title: "O orçamento foi aprovado *“de boca”*", body: "Na hora de pagar, vira discussão. E cliente que discute não volta." },
      { type: "item", number: "3", title: "O cliente fica *sem notícia*", body: "Sem atualização, ele acha que o carro está parado. Mesmo quando não está." },
      { type: "item", number: "4", title: "A agenda está *num caderno*", body: "Encaixe errado = cliente esperando = cliente que não volta." },
      { type: "item", number: "5", title: "Falta peça *na hora do serviço*", body: "O carro fica parado no elevador por algo que dava pra prever." },
      { type: "cta", title: "Reconheceu *algum*?", body: "O BoxMonitor resolve os 5 num só lugar." },
    ],
    caption: `Cliente perdido quase nunca reclama, ele só não volta. 😶

Qual desses sinais acontece mais na sua oficina? Comenta o número 👇

📌 Salva pra revisar com a equipe.

${HASHTAGS_DICAS}`,
  },
  {
    slug: "02-2026-11-05-qui-reel-cliente-de-70-anos",
    kind: "reel",
    cover: { kicker: "Reel", title: "Cliente de *70 anos* usa celular" },
    beats: [
      { say: "[knowingly] Seu cliente de 70 anos usa celular.", card: "Cliente de *70 anos*" },
      { say: "[seriously] E você perde ele mesmo assim.", card: "E você *perde ele*" },
      { say: "[chuckles] Ele manda áudio de 3 minutos, cara.", card: "Áudio de *3 minutos*" },
      { say: "O que ele não usa é app pra baixar.", card: "App pra baixar? *Não.*" },
      { say: "[confident] No BoxMonitor, ele não baixa nada.", card: "Não baixa *nada*", tela: { tipo: "placa" } },
      { say: "Digita a placa do carro", card: "Digita *a placa*", tela: { tipo: "placa", digitado: true } },
      { say: "e vê a etapa do serviço.", card: "Vê *a etapa*", tela: { tipo: "etapas", etapa: "received" } },
      {
        say: "Recebido, diagnóstico, serviço, pronto.",
        card: "Do recebido *ao pronto*",
        tela: [{ tipo: "etapas", etapa: "diagnosis" }, { tipo: "etapas", etapa: "in_service" }, { tipo: "etapas", etapa: "ready" }],
      },
      { say: "[warmly] Sem te ligar. Sem chamar o neto, sabe?", card: "Sem chamar *o neto*" },
      { say: "[playfully] Manda pro mecânico que acha", card: "Manda pro *mecânico*" },
      { say: "que cliente de 70 anos não usa celular.", card: "70 anos *usa celular*" },
    ],
    caption: `Seu cliente de 70 anos usa celular, sim. Manda pro mecânico que acha que não.

Ele manda áudio de 3 minutos no WhatsApp. O que ele não usa é app complicado pra baixar.

No BoxMonitor o cliente entra no site, digita a placa do carro e vê em que etapa está o serviço. Sem baixar nada, sem te ligar.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
  {
    slug: "03-2026-11-06-sex-post-fixo-o-que-e",
    kind: "single",
    pin: true,
    slides: [
      {
        type: "features",
        kicker: "Prazer,",
        title: "*BoxMonitor*",
        body: "Gestão simples pra oficina de bairro.",
        list: [
          "Cliente acompanha o serviço *pela placa*",
          "Aviso automático *no WhatsApp*",
          "Orçamento aprovado *pelo celular*",
          "Agenda com *link de agendamento*",
          "Estoque e *catálogo de serviços*",
        ],
      },
    ],
    caption: `Prazer, BoxMonitor. 🔧

Feito pra oficina de bairro e oficina média que quer se organizar sem complicação.

✔️ Seu cliente acompanha o serviço pela placa e recebe aviso no WhatsApp
✔️ Orçamento aprovado pelo celular, fica tudo registrado
✔️ Agenda com link pro cliente marcar sozinho
✔️ Controle de estoque e catálogo de serviços
✔️ OS pronta pra imprimir

Sem planilha, sem caderno, sem ligação perdida.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_PRODUTO}`,
  },

  {
    slug: "03-2026-11-07-sab-reel-3-perguntas",
    kind: "reel",
    cover: { kicker: "Reel", title: "*3 perguntas* antes de deixar o carro" },
    beats: [
      { say: "[seriously] Três perguntas", card: "*3 perguntas*" },
      { say: "antes de deixar seu carro na oficina.", card: "Antes de *deixar o carro*" },
      { say: "[mysteriously] A terceira... ninguém faz.", card: "A nº 3 *ninguém faz*" },
      { say: "[curious] Um: vai ter foto do problema?", card: "#1 *Foto do problema?*" },
      { say: "Dois: eu aprovo antes de começar?", card: "#2 *Aprovo antes?*" },
      { say: "[emphatically] Três: como eu acompanho sem ligar?", card: "#3 *Sem ficar ligando?*" },
      { say: "[sighs] Ninguém pergunta, cara. E fica três dias sem notícia.", card: "*3 dias* sem notícia" },
      { say: "[confident] Oficina com BoxMonitor responde as três.", card: "BoxMonitor *responde as 3*", tela: { tipo: "foto", medida: true } },
      {
        say: "A foto vem no orçamento, e você aprova no celular.",
        card: "Foto + *aprova no celular*",
        tela: [{ tipo: "orcamento", passo: "toque" }, { tipo: "orcamento", passo: "aprovado" }],
      },
      {
        say: "[relieved] E digita a placa pra ver a etapa, sabe?",
        card: "Placa *e pronto*",
        tela: [{ tipo: "placa", digitado: true }, { tipo: "etapas", etapa: "in_service" }],
      },
      { say: "[playfully] Manda pra sua oficina as três perguntas.", card: "Manda *as 3 perguntas*" },
    ],
    caption: `3 perguntas antes de deixar seu carro na oficina. A número 3 quase ninguém faz. Manda pra sua oficina e faz as três.

1. Vou receber foto do problema?
2. Eu aprovo o orçamento antes do serviço começar?
3. Como eu acompanho o carro sem ficar ligando?

Na oficina que usa o BoxMonitor, a foto chega junto do orçamento, você aprova pelo celular e acompanha a etapa do serviço digitando a placa. Sem baixar nada.

${CHAMADA_CLIENTE}

${HASHTAGS_CLIENTE}`,
  },

  // ───────── SEMANA 2 ─────────
  {
    slug: "04-2026-11-09-seg-reel-ja-ficou-pronto",
    kind: "reel",
    cover: { kicker: "Reel", title: "*“Já ficou pronto?”* 3 vezes hoje" },
    beats: [
      { say: "[exasperated] “Já ficou pronto?” Três vezes hoje.", card: "*“Já ficou pronto?”* 3x hoje" },
      { say: "[sighs] E aí você larga a chave dez pra atender.", card: "Larga a *chave 10*" },
      { say: "[calmly] Não é pressa, cara.", card: "Não é *pressa*" },
      { say: "[empathetic] Ele só não sabe o que tão fazendo com o Gol dele, sabe?", card: "Ele não sabe *o que rola*" },
      { say: "[confident] No BoxMonitor, cada etapa vira status.", card: "Cada etapa vira *status*", tela: { tipo: "etapas", etapa: "received" } },
      {
        say: "Recebido. Diagnóstico. Orçamento.",
        card: "Recebido. Diagnóstico. *Orçamento.*",
        tela: [{ tipo: "etapas", etapa: "received" }, { tipo: "etapas", etapa: "diagnosis" }, { tipo: "etapas", etapa: "awaiting_approval" }],
      },
      {
        say: "Foto da pastilha do Gol, ele aprova pelo celular.",
        card: "Foto + *aprovação* no celular",
        tela: [{ tipo: "orcamento", passo: "toque" }, { tipo: "orcamento", passo: "aprovado" }],
      },
      {
        say: "Chega por e-mail e notificação.",
        card: "E-mail e *notificação*",
        tela: { tipo: "notificacao", titulo: "Aguardando sua aprovação", texto: "BRA2E19 · Auto Center Demo enviou o orçamento." },
      },
      { say: "[upbeat] Terminou? Marca pronto pra retirar.", card: "*Pronto* pra retirar", tela: { tipo: "etapas", etapa: "ready" } },
      { say: "[warmly] Cadastre sua oficina pelo link da bio.", card: "Cadastre sua *oficina*" },
      { say: "[relieved] E ele para de ligar pra saber se ficou pronto.", card: "Ficou *pronto*." },
    ],
    caption: `Cliente que liga toda hora não tá com pressa. Tá sem notícia. Cadastre sua oficina pelo link da bio.

O BoxMonitor é um sistema para oficina mecânica que avisa o cliente sozinho. Cada etapa vira status: recebido, diagnóstico, orçamento, pronto pra retirar.

Você manda a foto do problema e ele aprova o orçamento pelo celular, antes do serviço começar. O aviso chega por e-mail e notificação.

E do seu lado tem ordem de serviço, estoque e serviços já cadastrados. Menos telefone tocando, mais carro saindo.

#oficinamecanica #mecanicoautomotivo #gestaodeoficina`,
  },
  {
    slug: "04-2026-11-09-seg-carrossel-orcamento",
    kind: "carousel",
    publishTime: DEPOIS_DO_REEL,
    slides: [
      { type: "cover", kicker: "Orçamento", title: "“Eu *não autorizei* isso!”", body: "Como acabar com essa discussão." },
      { type: "item", number: "1", title: "Aprovação *de boca* não vale nada", body: "Na hora de pagar, é a sua palavra contra a do cliente." },
      { type: "item", number: "2", title: "Detalhe *cada item*", body: "Peça, mão de obra e valor separados. O cliente entende o que está pagando." },
      { type: "item", number: "3", title: "Aprovação *antes* de mexer", body: "Apareceu serviço extra? Novo orçamento, nova aprovação." },
      { type: "item", number: "4", title: "Deixe *registrado*", body: "No BoxMonitor, o cliente aprova o orçamento pelo celular e fica tudo salvo no serviço." },
      { type: "cta", title: "Aprovou, *tá aprovado.*", body: "Cadastre sua oficina no BoxMonitor." },
    ],
    caption: `Orçamento aprovado por telefone vira dor de cabeça na hora de pagar. 💸

No BoxMonitor, o cliente recebe o orçamento, aprova pelo celular e fica tudo registrado no serviço.

Sem "eu não falei isso". Sem prejuízo.

👉 Link na bio.

${HASHTAGS_PRODUTO}`,
  },
  {
    slug: "04-2026-11-10-ter-reel-foto-da-nota",
    kind: "reel",
    cover: { kicker: "Reel", title: "Para de digitar *a nota do fornecedor*" },
    beats: [
      { say: "[exasperated] Para de digitar nota de fornecedor.", card: "Para de *digitar a nota*" },
      { say: "[firmly] Tira uma foto.", card: "Tira *1 foto*" },
      { say: "[sighs] Chegou a caixa: quarenta itens, cara.", card: "Chegou: *40 itens*" },
      { say: "E você lá, linha por linha, no fim do dia.", card: "Linha *por linha*" },
      { say: "[frustrated] Errou um número, o estoque não bate.", card: "Errou 1 número? *Não bate*" },
      { say: "[confident] No BoxMonitor, você sobe a lista do jeito que tiver.", card: "Do jeito *que tiver*", tela: { tipo: "importar" } },
      { say: "Planilha, PDF... ou foto da nota.", card: "Até *foto da nota*", tela: { tipo: "importar", passo: "foto" } },
      { say: "Ele mostra o que entendeu, e você confere.", card: "Você *confere antes*", tela: { tipo: "importar", passo: "conferir" } },
      { say: "[satisfied] Aplicou, entrada feita, entendeu?", card: "Entrada *feita*", tela: { tipo: "importar", passo: "aplicado" } },
      { say: "[playfully] Manda pro mecânico que ainda digita nota no fim do dia.", card: "Manda pro *mecânico*" },
    ],
    caption: `Para de digitar a nota do fornecedor no estoque. Tira 1 foto. Manda pro mecânico que ainda digita nota no fim do dia.

Chegou a caixa com 40 itens e lá vai você, linha por linha. Erra um número e o estoque já não bate.

No BoxMonitor você sobe a lista do jeito que tiver: planilha, PDF, texto ou foto. O sistema mostra o que entendeu de cada linha, você confere e aplica a entrada no estoque.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
  {
    slug: "05-2026-11-11-qua-reel-eu-nao-autorizei",
    kind: "reel",
    cover: { kicker: "Reel", title: "*“Eu não autorizei isso”*" },
    beats: [
      { say: "[seriously] Uma frase te faz perder o serviço.", card: "1 frase *te faz perder*" },
      { say: "[angrily] “Eu não autorizei isso.”", card: "*“Eu não autorizei”*" },
      { say: "[sighs] Você já trocou a peça de oitocentos reais.", card: "Peça de *R$ 800* trocada" },
      { say: "E o orçamento foi aprovado... numa ligação de um minuto.", card: "Aprovado *por telefone*" },
      { say: "Na hora de cobrar,", card: "Na hora *de cobrar*" },
      { say: "[frustrated] é a sua palavra contra a dele.", card: "Sua palavra *contra a dele*" },
      { say: "[confident] No BoxMonitor, o orçamento vai pro celular do cliente", card: "Orçamento *no celular dele*", tela: { tipo: "orcamento", itens: ORCAMENTO_FREIO } },
      { say: "com o valor e a foto do problema.", card: "Valor *+ foto*", tela: { tipo: "orcamento", itens: ORCAMENTO_FREIO } },
      {
        say: "Quem aprova é ele, pelo celular.",
        card: "Quem aprova *é ele*",
        tela: [
          { tipo: "orcamento", itens: ORCAMENTO_FREIO, passo: "toque" },
          { tipo: "orcamento", itens: ORCAMENTO_FREIO, passo: "confirmar" },
          { tipo: "orcamento", itens: ORCAMENTO_FREIO, passo: "aprovado" },
        ],
      },
      { say: "[satisfied] E fica registrado, entendeu?", card: "Fica *registrado*", tela: { tipo: "registro", itens: ORCAMENTO_FREIO } },
      { say: "[warmly] Salva esse antes de perder o próximo serviço.", card: "Salva *antes do próximo*" },
    ],
    caption: `"Eu não autorizei isso." Uma frase e a peça de R$ 800 vira prejuízo. Salva esse antes de perder o próximo serviço.

Orçamento aprovado numa ligação de 1 minuto não prova nada na hora de cobrar.

No BoxMonitor o orçamento vai pro celular do cliente, com o valor e a foto do problema. Quem aprova é ele, e a resposta fica registrada no serviço.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
  {
    slug: "05-2026-11-11-qua-carrossel-valor-da-hora",
    kind: "carousel",
    publishTime: DEPOIS_DO_REEL,
    slides: [
      { type: "cover", kicker: "Dinheiro", title: "Quanto vale a *hora* da sua oficina?", body: "(a maioria cobra errado)" },
      { type: "item", number: "1", title: "Some os custos fixos do mês", body: "Aluguel, luz, água, internet, contador, salários." },
      { type: "item", number: "2", title: "Calcule as horas *vendáveis*", body: "Mecânicos × horas produtivas/dia × dias úteis.", note: "Ex.: 2 × 6 h × 22 dias = 264 h" },
      { type: "item", number: "3", title: "Custo por hora", body: "Custos fixos ÷ horas vendáveis.", note: "Ex.: R$ 15.000 ÷ 264 h = R$ 56,82/h" },
      { type: "item", number: "4", title: "Some a *margem*", body: "Esse é o seu mínimo por hora.", note: "Ex.: com 40%, R$ 56,82 × 1,4 = R$ 79,55/h" },
      { type: "item", number: "!", title: "Hora produtiva *não é* hora aberta", body: "Conte só o tempo em que o mecânico está realmente no carro. Café, balcão e telefone não entram." },
      { type: "cta", title: "Refaz a conta com *seus números*", body: "Ficou acima ou abaixo do que você cobra hoje?", button: "Salva este post" },
    ],
    caption: `Cobrar pelo "preço da concorrência" é o jeito mais rápido de trabalhar muito e sobrar pouco. 🧮

Refaz a conta com os seus números e conta aqui: tá cobrando certo?

📌 Salva pra não perder.

${HASHTAGS_DICAS}`,
  },
  {
    slug: "05-2026-11-12-qui-reel-cliente-chato",
    kind: "reel",
    cover: { kicker: "Reel", title: "Cliente que liga 5 vezes *não é chato*" },
    beats: [
      { say: "[exasperated] Para de chamar de chato", card: "Ele *não é chato*" },
      { say: "o cliente que liga 5 vezes.", card: "Ligou *5 vezes*" },
      { say: "[calmly] Ele não é chato, cara. Ele tá no escuro.", card: "Ele tá *no escuro*" },
      { say: "[sighs] Deixou o carro às 8 e ninguém falou nada.", card: "Às 8h. *Nenhuma notícia.*" },
      { say: "[empathetic] Imagina você, 6 horas sem notícia do seu carro.", card: "*6 horas* sem notícia" },
      { say: "[confident] No BoxMonitor, cada etapa que você muda", card: "Cada etapa *que você muda*", tela: { tipo: "atualizar", etapa: "Em diagnóstico" } },
      {
        say: "vira aviso no celular dele.",
        card: "Vira *aviso no celular*",
        tela: { tipo: "notificacao", titulo: "Em diagnóstico", texto: "BRA2E19 · Auto Center Demo" },
      },
      {
        say: "Diagnóstico. Orçamento. Pronto pra retirar.",
        card: "Cada passo, *um aviso*",
        tela: [{ tipo: "etapas", etapa: "diagnosis" }, { tipo: "etapas", etapa: "awaiting_approval" }, { tipo: "etapas", etapa: "ready" }],
      },
      { say: "[relieved] E o telefone para de tocar, sabe?", card: "O telefone *para*" },
      { say: "[playfully] Manda pro mecânico que ainda chama cliente de chato.", card: "Manda pro *mecânico*" },
    ],
    caption: `Cliente que liga 5 vezes não é chato. Ele tá no escuro. Manda pro mecânico que ainda chama cliente de chato.

Deixou o carro às 8 e ninguém deu notícia. Qualquer um ia ligar.

No BoxMonitor, cada etapa que você muda vira aviso no celular do cliente: diagnóstico, orçamento, pronto pra retirar. E o telefone para de tocar.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
  {
    slug: "06-2026-11-13-sex-carrossel-aviso-whatsapp",
    kind: "carousel",
    slides: [
      { type: "cover", kicker: "Atendimento", title: "Atendimento de *concessionária*, preço de oficina de bairro", body: "" },
      { type: "item", number: "1", title: "Cliente *informado* confia", body: "Saber o que está acontecendo tira a ansiedade de deixar o carro na oficina." },
      { type: "item", number: "2", title: "Avise em *cada etapa*", body: "Carro recebido, orçamento enviado, serviço em andamento, carro pronto." },
      { type: "item", number: "3", title: "No canal que ele *já usa*", body: "O cliente vive no WhatsApp. É lá que o aviso tem que chegar." },
      { type: "item", number: "4", title: "Sem você *digitar nada*", body: "No BoxMonitor, mudou o status do serviço, o aviso sai automático." },
      { type: "cta", title: "Cliente que confia *volta.*", body: "Cadastre sua oficina no BoxMonitor." },
    ],
    caption: `Cliente informado é cliente que confia, e cliente que confia volta. 🤝

No BoxMonitor, cada mudança de status manda aviso automático pro cliente.

👉 Link na bio.

${HASHTAGS_PRODUTO}`,
  },

  {
    slug: "06-2026-11-14-sab-reel-orcamento-por-telefone",
    kind: "reel",
    cover: { kicker: "Reel", title: "Nunca aprova *por telefone*" },
    beats: [
      { say: "[firmly] Nunca aprova conserto de oitocentos reais", card: "Conserto de *R$ 800*" },
      { say: "por telefone.", card: "*Por telefone*? Não." },
      { say: "[sighs] Você no trabalho, ouve meia explicação", card: "*Meia* explicação" },
      { say: "e fala “pode fazer”.", card: "“Pode *fazer*”" },
      { say: "[frustrated] Na hora de pagar, nem lembra o que aprovou.", card: "Nem lembra *o que aprovou*" },
      { say: "[confident] Na oficina com BoxMonitor, o orçamento chega no celular.", card: "Orçamento *no seu celular*", tela: { tipo: "orcamento", itens: ORCAMENTO_800 } },
      { say: "Cada item, o valor e a foto.", card: "Item, valor *e foto*", tela: { tipo: "orcamento", itens: ORCAMENTO_800 } },
      {
        say: "[calmly] Você lê com calma e aprova em dois toques.",
        card: "Aprova em *2 toques*",
        tela: [
          { tipo: "orcamento", itens: ORCAMENTO_800, passo: "toque" },
          { tipo: "orcamento", itens: ORCAMENTO_800, passo: "confirmar" },
          { tipo: "orcamento", itens: ORCAMENTO_800, passo: "aprovado" },
        ],
      },
      { say: "[satisfied] E fica registrado, entendeu?", card: "Fica *registrado*", tela: { tipo: "orcamento", itens: ORCAMENTO_800, passo: "aprovado" } },
      { say: "[warmly] Ninguém discute depois.", card: "Ninguém *discute depois*" },
      { say: "[playfully] Manda pra sua oficina. Oitocentos reais, só no celular.", card: "R$ 800? *Só no celular*" },
    ],
    caption: `Nunca aprova um conserto de R$ 800 por telefone. Manda esse pra sua oficina.

O telefone toca no meio do trabalho, você ouve meia explicação e fala "pode fazer". Na hora de pagar, ninguém lembra direito o que foi aprovado.

Na oficina que usa o BoxMonitor, o orçamento chega no seu celular com cada item, o valor e a foto do problema. Você lê com calma, aprova em dois toques e fica registrado.

${CHAMADA_CLIENTE}

${HASHTAGS_CLIENTE}`,
  },

  // ───────── SEMANA 3 ─────────
  {
    slug: "07-2026-11-16-seg-reel-10-etapas",
    kind: "reel",
    cover: { kicker: "Reel", title: "*10 etapas.* Zero ligação." },
    beats: [
      { say: "[excited] Dez etapas que o cliente acompanha", card: "*10 etapas*", tela: { tipo: "etapas", etapa: "received", contador: true } },
      { say: "sem te ligar.", card: "*Zero* ligação", tela: { tipo: "etapas", etapa: "received", contador: true } },
      {
        say: "Veículo recebido. Em diagnóstico.",
        card: "Recebido. *Diagnóstico.*",
        tela: [{ tipo: "etapas", etapa: "received", contador: true }, { tipo: "etapas", etapa: "diagnosis", contador: true }],
      },
      {
        say: "Aguardando aprovação. Aprovado ou recusado.",
        card: "Aprovação. *Aprovado ou recusado.*",
        tela: [
          { tipo: "etapas", etapa: "awaiting_approval", contador: true },
          { tipo: "etapas", etapa: ["quote_approved", "quote_declined"], contador: true },
        ],
      },
      {
        say: "Aguardando peças. Em serviço.",
        card: "Peças. *Em serviço.*",
        tela: [{ tipo: "etapas", etapa: "awaiting_parts", contador: true }, { tipo: "etapas", etapa: "in_service", contador: true }],
      },
      {
        say: "Em teste final. Pronto para retirada.",
        card: "Teste final. *Pronto.*",
        tela: [{ tipo: "etapas", etapa: "quality_check", contador: true }, { tipo: "etapas", etapa: "ready", contador: true }],
      },
      { say: "Entregue.", card: "*Entregue.*", tela: { tipo: "etapas", etapa: "delivered", contador: true } },
      { say: "[confident] Mudou uma das dez etapas no BoxMonitor,", card: "Mudou *a etapa*", tela: { tipo: "etapas", etapa: "ready" } },
      {
        say: "o cliente recebe o aviso no celular.",
        card: "*1 botão* = 1 aviso",
        tela: { tipo: "notificacao", titulo: "Pronto para retirada", texto: "BRA2E19 · Auto Center Demo" },
      },
      { say: "[relieved] Você aperta um botão. Ele não precisa ligar, sabe?", card: "Ele *não precisa ligar*" },
      { say: "[playfully] Manda pra oficina que o cliente não para de ligar.", card: "Manda pra *oficina*" },
    ],
    caption: `10 etapas que o cliente acompanha sem te ligar. Manda pra oficina onde o telefone não para.

Veículo recebido, em diagnóstico, aguardando aprovação, aprovado ou recusado, aguardando peças, em serviço, em teste final, pronto para retirada, entregue.

No BoxMonitor você muda a etapa com um botão e o cliente recebe o aviso no celular. Ele acompanha tudo pela placa.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
  {
    slug: "07-2026-11-16-seg-carrossel-quando-voltar",
    kind: "carousel",
    publishTime: DEPOIS_DO_REEL,
    slides: [
      { type: "cover", kicker: "Fidelização", title: "Trocou o óleo… e *nunca mais voltou*", body: "Não é falta de qualidade. É falta de lembrar." },
      { type: "item", number: "1", title: "O cliente *esquece*", body: "Quase ninguém anota quando é a próxima troca de óleo." },
      { type: "item", number: "2", title: "Quem lembra *primeiro* leva", body: "Ele volta pra oficina que estiver mais perto na hora em que lembrar." },
      {
        type: "list",
        title: "Serviços que *voltam*",
        list: ["Troca de óleo e filtro", "Correia dentada", "Fluido de freio", "Alinhamento e balanceamento"],
      },
      { type: "item", number: "km", title: "Cadastre a *periodicidade*", body: "No BoxMonitor, cada serviço do catálogo tem intervalo em km, e o cliente vê no painel quando vence a próxima." },
      { type: "cta", title: "Ele sabe quando voltar. *E pra onde.*", body: "Cadastre sua oficina no BoxMonitor." },
    ],
    caption: `O cliente mais barato de conquistar é o que já passou pela sua oficina. 🔁

Cadastre seus serviços com a periodicidade em km (troca de óleo, filtro, correia…) e o cliente acompanha no painel do veículo quando vence a próxima.

👉 Link na bio.

${HASHTAGS_PRODUTO}`,
  },
  {
    slug: "07-2026-11-17-ter-reel-aguardando-pecas",
    kind: "reel",
    cover: { kicker: "Reel", title: "*Dia 3* sem notícia" },
    beats: [
      { say: "[seriously] No terceiro dia sem notícia,", card: "*Dia 3* sem notícia" },
      { say: "seu cliente acha que você esqueceu o carro.", card: "Acha que *você esqueceu*" },
      { say: "[sighs] Você não esqueceu, cara. Tá esperando peça.", card: "Tá esperando *peça*" },
      { say: "[frustrated] E ele imaginando o carro largado num canto.", card: "Carro *largado no canto*" },
      {
        say: "[confident] No BoxMonitor, a etapa vira aguardando peças.",
        card: "*Aguardando peças*",
        tela: { tipo: "atualizar", etapa: "Aguardando peças", mensagem: "", toque: false },
      },
      { say: "E você escreve: chega quinta de manhã.", card: "“Chega *quinta*”", tela: { tipo: "atualizar", etapa: "Aguardando peças" } },
      {
        say: "Ele recebe o aviso na hora.",
        card: "Aviso *na hora*",
        tela: { tipo: "notificacao", titulo: "Aguardando peças", texto: "BRA2E19 · Auto Center Demo", hora: "10:14", dia: "terça-feira, 17/11" },
      },
      { say: "[relieved] E entende por que o carro tá parado, sabe?", card: "Parado *por um motivo*", tela: { tipo: "etapas", etapa: "awaiting_parts" } },
      { say: "[playfully] Manda pro mecânico com peça atrasada e cliente sem notícia.", card: "Peça atrasada, *cliente com notícia*" },
    ],
    caption: `No terceiro dia sem notícia, seu cliente acha que você esqueceu o carro dele. Manda pro mecânico com peça atrasada e cliente sem notícia.

Você não esqueceu. A peça atrasou e o fornecedor não responde. Só que o cliente não sabe disso.

No BoxMonitor você muda a etapa pra "Aguardando peças" e escreve uma mensagem, tipo "a peça chega quinta de manhã". O cliente recebe o aviso e vê na placa que o carro está parado por um motivo.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
  {
    slug: "08-2026-11-18-qua-reel-lembrete-troca-de-oleo",
    kind: "reel",
    cover: { kicker: "Reel", title: "Ele não sumiu. *Esqueceu.*" },
    beats: [
      { say: "[curious] Seis meses sem trocar o óleo?", card: "6 meses *sem trocar óleo*?" },
      { say: "[knowingly] Seu cliente não sumiu, cara. Esqueceu.", card: "Ele não sumiu. *Esqueceu.*" },
      { say: "[seriously] E quem lembra ele primeiro... leva o serviço.", card: "Quem lembra *primeiro* leva" },
      { say: "[confident] No BoxMonitor, você cadastra a troca de óleo", card: "Cadastra a *troca de óleo*", tela: { tipo: "catalogo" } },
      { say: "com a periodicidade, tipo a cada seis meses.", card: "A cada *6 meses*", tela: { tipo: "catalogo", destaque: "periodo" } },
      { say: "Aí, tipo quinze dias antes de vencer,", card: "*15 dias* antes", tela: { tipo: "catalogo", destaque: "aviso" } },
      {
        say: "[excited] o BoxMonitor avisa o cliente sozinho.",
        card: "Aviso *automático*",
        tela: { tipo: "notificacao", titulo: "Troca de óleo vence em 15 dias", texto: "BRA2E19 · Auto Center Demo" },
      },
      { say: "Sem mensagem na mão, sem planilha.", card: "Sem *planilha*" },
      { say: "[smiling] Ele lembra de quem? De você, sabe?", card: "Ele lembra *de você*" },
      { say: "[playfully] Salva esse vídeo. Daqui a seis meses você me agradece.", card: "Salva. *Daqui a 6 meses.*" },
    ],
    caption: `Cliente que não voltou pra trocar o óleo não sumiu. Esqueceu. Salva esse, daqui a 6 meses você me agradece.

E quem lembra ele primeiro leva o serviço.

No BoxMonitor você cadastra a troca de óleo com a periodicidade (a cada 6 meses, por exemplo) e escolhe quantos dias antes avisar. Chegou a hora, o cliente recebe o lembrete sozinho. Sem mensagem na mão, sem planilha.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
  {
    slug: "08-2026-11-18-qua-carrossel-checklist-recepcao",
    kind: "carousel",
    publishTime: DEPOIS_DO_REEL,
    slides: [
      { type: "cover", kicker: "Recepção", title: "Checklist: *8 itens* que evitam dor de cabeça", body: "na recepção do veículo" },
      { type: "item", number: "1", title: "Fotos do carro em volta", body: "Riscos e amassados registrados antes de entrar na oficina." },
      { type: "item", number: "2", title: "Km e combustível", body: "Quilometragem e nível do tanque anotados na entrada." },
      { type: "item", number: "3", title: "Objetos de valor", body: "Tem algo no carro? Avise o cliente e registre." },
      { type: "item", number: "4", title: "A reclamação *com as palavras dele*", body: "“Barulho na frente ao frear”, não só “freio”." },
      {
        type: "list",
        title: "E mais *4 itens*",
        list: ["5. Contato confirmado (WhatsApp)", "6. Prazo combinado", "7. Autorização pra teste de rodagem", "8. Aceite do cliente"],
      },
      { type: "cta", title: "Salva e *deixa no balcão*", body: "2 minutos na recepção economizam horas de discussão depois.", button: "Salva este post" },
    ],
    caption: `2 minutos na recepção economizam horas de discussão depois. ⏱️

Qual item a sua oficina nunca pula? E qual você vai começar a fazer? 👇

Marca aquele amigo mecânico que precisa ver isso.

${HASHTAGS_DICAS}`,
  },
  {
    slug: "08-2026-11-19-qui-reel-dez-da-noite",
    kind: "reel",
    cover: { kicker: "Reel", title: "Oficina perde cliente *às 10 da noite*" },
    beats: [
      { say: "[mysteriously] Ninguém te conta", card: "Ninguém *te conta*" },
      { say: "que oficina perde cliente às 10 da noite.", card: "Perde cliente *às 22h*" },
      { say: "É quando ele lembra da revisão.", card: "Ele lembra *da revisão*" },
      { say: "[sighs] Manda mensagem. Você tá dormindo.", card: "Você *tá dormindo*" },
      { say: "[frustrated] Às 8 você responde. Ele já foi pra outra.", card: "Já foi *pra outra*" },
      { say: "[confident] No BoxMonitor, sua oficina tem link de agendamento.", card: "Link de *agendamento*", tela: { tipo: "agenda", passo: "dia" } },
      {
        say: "Ele escolhe o dia. O horário. Confirma.",
        card: "Dia. Horário. *Confirma.*",
        tela: [{ tipo: "agenda", passo: "dia" }, { tipo: "agenda", passo: "horario" }, { tipo: "agenda", passo: "confirmar" }],
      },
      { say: "[excited] Às 10 da noite, às 2 da manhã, tanto faz.", card: "*Qualquer hora*", tela: { tipo: "agenda", passo: "agendado" } },
      {
        say: "Você acorda com “Novo agendamento”, entendeu?",
        card: "Acorda *agendado*",
        tela: { tipo: "notificacao", titulo: "Novo agendamento", texto: "Qui, 19/11 às 08:00 · BRA2E19", hora: "07:02", dia: "quarta-feira, 18/11" },
      },
      { say: "[playfully] Põe o link na bio", card: "Link *na bio*" },
      { say: "e para de perder cliente às 10 da noite.", card: "Chega de perder *às 22h*" },
    ],
    caption: `Ninguém te conta que oficina perde cliente às 10 da noite. Põe o link de agendamento na bio e para de perder.

É a hora que o cliente lembra da revisão. Manda mensagem, você tá dormindo, e de manhã ele já marcou em outra.

No BoxMonitor sua oficina tem um link de agendamento: o cliente escolhe o dia, o horário e confirma. A qualquer hora. Você acorda com o aviso de novo agendamento.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
  {
    // Substitui o Reel de oficina parceira enquanto não houver uma oficina real para gravar.
    slug: "09-2026-11-20-sex-carrossel-mito-ou-verdade",
    kind: "carousel",
    slides: [
      { type: "cover", kicker: "Mito ou verdade", title: "Sistema de oficina: *mito ou verdade?*", body: "4 frases que todo dono de oficina já ouviu" },
      { type: "myth", quote: "“É caro.”", verdict: "Mito", body: "Se evitar um orçamento contestado por mês, já se pagou." },
      { type: "myth", quote: "“É complicado.”", verdict: "Depende", body: "Escolha um que funcione no celular e que você aprenda em minutos." },
      { type: "myth", quote: "“Meu cliente é das antigas, não vai usar.”", verdict: "Mito", body: "Ele só precisa saber digitar a placa do carro." },
      { type: "myth", quote: "“Oficina pequena não precisa.”", verdict: "Mito", body: "É a que mais precisa: cada cliente perdido pesa mais no caixa." },
      { type: "cta", title: "Bora *organizar* a sua?", body: "Cadastre sua oficina no BoxMonitor." },
    ],
    caption: `Todo dono de oficina já ouviu (ou já falou) pelo menos uma dessas. 🤔

Qual você mais escuta por aí? Comenta 👇

👉 Link na bio.

${HASHTAGS_PRODUTO}`,
  },

  {
    slug: "09-2026-11-21-sab-reel-oficina-no-chute",
    kind: "reel",
    cover: { kicker: "Reel", title: "Oficina no chute: *R$ 1.200*" },
    beats: [
      { say: "[seriously] Escolher oficina no chute", card: "Oficina *no chute*" },
      { say: "pode te custar mil e duzentos reais.", card: "Custa *R$ 1.200*" },
      { say: "[sighs] Placa na rua, indicação do cunhado...", card: "Indicação *do cunhado*" },
      { say: "[frustrated] e você só descobre na hora de pagar.", card: "Descobre *na hora de pagar*" },
      { say: "[confident] No BoxMonitor, as oficinas aparecem pela avaliação.", card: "Oficinas *por avaliação*", tela: { tipo: "oficinas" } },
      { say: "De quem deixou o carro lá e retirou.", card: "De quem *deixou o carro*", tela: { tipo: "oficinas", destaque: true } },
      { say: "[impressed] Quatro vírgula oito, trinta e duas avaliações.", card: "*4,8* com 32 avaliações", tela: { tipo: "oficinas", destaque: true } },
      {
        say: "Escolhe o horário livre e agenda ali mesmo.",
        card: "Agenda *ali mesmo*",
        tela: [{ tipo: "agenda", passo: "horario" }, { tipo: "agenda", passo: "confirmar" }, { tipo: "agenda", passo: "agendado" }],
      },
      { say: "[relieved] Sem chute e sem cunhado, sabe?", card: "Sem *chute*" },
      { say: "[playfully] Salva esse antes de escolher a próxima oficina.", card: "*Salva* esse" },
    ],
    caption: `Escolher oficina no chute pode te custar R$ 1.200. Salva esse antes de escolher a próxima.

Placa na rua, indicação do cunhado, e você só descobre como foi na hora de pagar.

No BoxMonitor você vê as oficinas com agenda aberta pela avaliação de quem já deixou o carro lá. Escolhe, vê os horários livres e agenda ali mesmo.

👉 Link na bio.

${HASHTAGS_CLIENTE}`,
  },

  // ───────── SEMANA 4 ─────────
  {
    slug: "10-2026-11-23-seg-reel-os-sem-digitar-preco",
    kind: "reel",
    cover: { kicker: "Reel", title: "OS *sem digitar preço*" },
    beats: [
      { say: "[excited] Olha eu abrindo uma ordem de serviço", card: "OS *sem digitar preço*", tela: { tipo: "os", itens: 0 } },
      { say: "sem digitar um preço.", card: "Sem digitar *1 preço*", tela: { tipo: "os", itens: 0 } },
      { say: "Coloco o carro.", card: "Coloco *o carro*", tela: { tipo: "os", itens: 0 } },
      {
        say: "Escolho três: troca de óleo, filtro, pastilha.",
        card: "Escolho *3*",
        tela: [{ tipo: "os", itens: 1 }, { tipo: "os", itens: 2 }, { tipo: "os", itens: 3 }],
      },
      { say: "[impressed] O preço já vem, porque tá cadastrado.", card: "O preço *já vem*", tela: { tipo: "os", itens: 3 } },
      { say: "[proudly] Pronto. Em segundos.", card: "*Em segundos*", tela: { tipo: "os", itens: 3 } },
      { say: "Você cadastra cada serviço uma vez no BoxMonitor,", card: "Cadastra *1 vez*", tela: { tipo: "catalogo" } },
      { say: "com preço e de quanto em quanto tempo troca.", card: "Preço *e periodicidade*", tela: { tipo: "catalogo", destaque: "periodo" } },
      { say: "[casually] Depois é só clicar, entendeu?", card: "Depois *é só clicar*" },
      { say: "[curious] Comenta aí: quanto tempo leva pra abrir uma ordem?", card: "Quanto tempo *você leva*?" },
    ],
    caption: `Ordem de serviço aberta sem digitar um preço. Quanto tempo você leva pra abrir uma? Comenta aí.

No BoxMonitor você cadastra cada serviço uma vez no catálogo, com preço e periodicidade. Na hora de abrir a OS é só escolher o carro e os serviços: o preço já vem.

Depois é só clicar.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
  {
    slug: "10-2026-11-23-seg-carrossel-adeus-caderno",
    kind: "carousel",
    publishTime: DEPOIS_DO_REEL,
    slides: [
      { type: "cover", kicker: "Agenda", title: "Sua agenda ainda é *um caderno*?", body: "3 problemas que custam cliente." },
      { type: "item", number: "1", title: "Rasura e *encaixe errado*", body: "Dois carros no mesmo horário e cliente esperando no balcão." },
      { type: "item", number: "2", title: "Horário marcado *no meio do serviço*", body: "Mão suja de graxa respondendo WhatsApp." },
      { type: "item", number: "3", title: "Cliente *sem resposta*", body: "Mandou mensagem às 21h, ninguém respondeu, marcou em outra oficina." },
      { type: "item", number: "✓", title: "Link de *agendamento*", body: "No BoxMonitor, sua oficina tem um link: o cliente escolhe o horário sozinho, a qualquer hora." },
      { type: "cta", title: "Aposenta *o caderno.*", body: "Cadastre sua oficina no BoxMonitor." },
    ],
    caption: `Cada mensagem pra marcar horário é uma pausa no serviço. 📅

No BoxMonitor sua oficina tem um link de agendamento. Coloca na bio, no status do WhatsApp, na fachada, e o cliente marca sozinho.

👉 Link na bio.

${HASHTAGS_PRODUTO}`,
  },
  {
    slug: "10-2026-11-24-ter-reel-cinco-estrelas",
    kind: "reel",
    cover: { kicker: "Reel", title: "5 estrelas. *Ninguém viu.*" },
    beats: [
      { say: "[warmly] Seu cliente te deu cinco estrelas.", card: "*5 estrelas*" },
      { say: "[pointedly] Ninguém viu.", card: "*Ninguém viu.*" },
      { say: "[sighs] Ele elogiou no balcão, apertou sua mão e foi embora.", card: "Elogiou *no balcão*" },
      { say: "E quem procura oficina nunca ficou sabendo, cara.", card: "Ninguém *ficou sabendo*" },
      { say: "[confident] No BoxMonitor, carro entregue, o cliente avalia a oficina.", card: "O cliente *avalia*", tela: { tipo: "avaliacao" } },
      {
        say: "Marca as estrelas e escreve, se quiser.",
        card: "Estrelas *+ comentário*",
        tela: [{ tipo: "avaliacao", estrelas: 5 }, { tipo: "avaliacao", estrelas: 5, comentario: true }],
      },
      { say: "[excited] E quem procura oficina pra agendar vê a sua nota.", card: "Quem procura *vê sua nota*", tela: { tipo: "oficinas" } },
      { say: "Lá em cima, em melhor avaliadas.", card: "*Melhor avaliadas*", tela: { tipo: "oficinas", destaque: true } },
      { say: "[proudly] Cinco estrelas trabalhando por você, sabe?", card: "Estrelas *que trabalham*" },
      { say: "[playfully] Manda pro mecânico que ganha cinco estrelas só no balcão.", card: "Manda pro *mecânico*" },
    ],
    caption: `Seu cliente te deu 5 estrelas. Ninguém viu. Manda pro mecânico que ganha 5 estrelas só no balcão.

Ele elogiou, apertou sua mão e foi embora. E quem procura oficina nunca ficou sabendo.

No BoxMonitor, quando o carro é entregue, o cliente avalia a oficina com estrelas e um comentário. Quem procura oficina pra agendar vê a sua nota, e a lista pode ser ordenada pelas melhor avaliadas.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
  {
    slug: "11-2026-11-25-qua-reel-3-motivos",
    kind: "reel",
    cover: { kicker: "Reel", title: "3 motivos. *Não é o preço.*" },
    beats: [
      { say: "[seriously] Três motivos pro seu cliente não voltar.", card: "3 motivos *pra não voltar*" },
      { say: "[mysteriously] O número um... não é o preço.", card: "O nº 1 *não é preço*" },
      { say: "Número três: ele esqueceu da revisão.", card: "#3 *Esqueceu da revisão*" },
      { say: "[sighs] Ninguém lembrou ele.", card: "Ninguém *lembrou*" },
      { say: "Número dois: o orçamento cresceu na hora de pagar.", card: "#2 *Orçamento cresceu*" },
      { say: "Ele se sentiu enganado... mesmo sem ter sido.", card: "Se sentiu *enganado*" },
      { say: "[emphatically] Número um: ele ficou dois dias sem notícia do carro.", card: "#1 *2 dias sem notícia*" },
      { say: "[frustrated] Ligou, ninguém atendeu, sabe?", card: "Ligou. *Ninguém atendeu.*" },
      {
        say: "[confident] O BoxMonitor resolve os três:",
        card: "O BoxMonitor *resolve os 3*",
        tela: { tipo: "lista", itens: ["Lembrete de revisão", "Orçamento aprovado antes", "Aviso a cada etapa"] },
      },
      {
        say: "lembrete, orçamento aprovado antes, aviso a cada etapa.",
        card: "Lembrete. Aprovação. *Aviso.*",
        tela: { tipo: "lista", itens: ["Lembrete de revisão", "Orçamento aprovado antes", "Aviso a cada etapa"] },
      },
      { say: "[curious] Qual desses motivos acontece aí? Comenta o número.", card: "Comenta: *1, 2 ou 3*" },
    ],
    caption: `3 motivos pro cliente não voltar, e o número 1 não é o preço. Qual acontece aí? Comenta o número.

3. Ele esqueceu da revisão e ninguém lembrou.
2. O orçamento cresceu na hora de pagar.
1. Ficou 2 dias sem notícia do carro.

No BoxMonitor: lembrete de revisão, orçamento aprovado pelo cliente antes do serviço e aviso a cada etapa.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
  {
    slug: "11-2026-11-25-qua-carrossel-estoque-minimo",
    kind: "carousel",
    publishTime: DEPOIS_DO_REEL,
    slides: [
      { type: "cover", kicker: "Estoque", title: "As peças que *nunca podem faltar*", body: "na sua oficina" },
      { type: "item", number: "?", title: "Por que estoque mínimo?", body: "Carro parado esperando peça = elevador ocupado sem faturar." },
      { type: "item", number: "A", title: "Giro alto: *tenha sempre*", body: "Óleos mais usados e filtros de óleo, ar, combustível e cabine dos modelos que você mais atende." },
      { type: "item", number: "B", title: "Giro médio", body: "Pastilhas dos carros mais comuns da região, lâmpadas, palhetas, fluido de freio, aditivo." },
      { type: "item", number: "=", title: "Como definir o mínimo", body: "Saída média por semana × prazo de entrega do fornecedor (em semanas) + margem de segurança." },
      { type: "item", number: "90", title: "Revise *todo mês*", body: "O que não girou em 90 dias está prendendo dinheiro na prateleira." },
      { type: "cta", title: "Estoque e serviço *no mesmo lugar*", body: "No BoxMonitor você controla o estoque junto com os serviços.", button: "Salva este post" },
    ],
    caption: `Peça que falta para o serviço. Peça que sobra para o dinheiro. 📦

Qual peça mais falta aí na sua oficina? 👇

📌 Salva pra montar a sua lista.

${HASHTAGS_DICAS}`,
  },
  {
    slug: "11-2026-11-26-qui-reel-um-botao",
    kind: "reel",
    cover: { kicker: "Reel", title: "Sem recepcionista. *1 botão.*" },
    beats: [
      { say: "[confidently] Você não precisa de recepcionista.", card: "Sem *recepcionista*" },
      { say: "Precisa de 1 botão.", card: "Precisa de *1 botão*" },
      { say: "[knowingly] Na oficina pequena você é 3 em 1, né?", card: "Você é *3 em 1*" },
      { say: "Dono, mecânico e atendente.", card: "Dono. Mecânico. *Atendente.*" },
      { say: "[sighs] E aí o cliente fica pra depois.", card: "Cliente *fica pra depois*" },
      { say: "[confident] No BoxMonitor, você atualiza a etapa pelo celular,", card: "Atualiza *pelo celular*", tela: { tipo: "atualizar", etapa: "Em serviço", toque: false } },
      { say: "do lado do carro, com a mão suja mesmo.", card: "Com *a mão suja*", tela: { tipo: "atualizar", etapa: "Pronto para retirada" } },
      {
        say: "Apertou 1 botão, o cliente recebe o aviso.",
        card: "1 botão. *1 aviso.*",
        tela: { tipo: "notificacao", titulo: "Pronto para retirada", texto: "BRA2E19 · Auto Center Demo" },
      },
      { say: "[relieved] Sem parar o serviço, sabe?", card: "Sem *parar o serviço*" },
      { say: "[playfully] Manda pro mecânico que faz tudo sozinho.", card: "Manda pro *mecânico*" },
      { say: "Ele só precisa de 1 botão.", card: "Só precisa de *1 botão*" },
    ],
    caption: `Você não precisa de recepcionista pra avisar o cliente. Precisa de 1 botão. Manda pro mecânico que faz tudo sozinho.

Na oficina pequena você é dono, mecânico e atendente. E o cliente acaba ficando pra depois.

No BoxMonitor você atualiza a etapa pelo celular, do lado do carro. Apertou, o cliente recebe o aviso. Sem parar o serviço.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
  {
    slug: "12-2026-11-27-sex-carrossel-3-passos",
    kind: "carousel",
    slides: [
      { type: "cover", kicker: "Comece hoje", title: "Sua oficina organizada em *3 passos*", body: "" },
      {
        type: "list",
        title: "É só *isso*",
        list: ["1. Cadastre sua oficina", "2. Cadastre seus serviços", "3. Abra o primeiro serviço pela placa"],
        note: "Pronto: o cliente já acompanha.",
      },
      { type: "cta", title: "Comece *agora*", body: "Cadastre sua oficina no BoxMonitor." },
    ],
    caption: `Fechamos o mês mostrando como o BoxMonitor ajuda a oficina de bairro a trabalhar com menos ligação, menos discussão e mais cliente voltando. 🔧

Começar é simples: cadastra a oficina, cadastra os serviços e abre o primeiro atendimento pela placa.

Ficou dúvida? Manda no direct que a gente responde. 📩

👉 Link na bio.

${HASHTAGS_PRODUTO}`,
  },

  {
    slug: "12-2026-11-28-sab-reel-oleo-atrasado",
    kind: "reel",
    cover: { kicker: "Reel", title: "Troca de óleo *6 meses atrasada*" },
    beats: [
      { say: "[knowingly] Seu carro tá seis meses atrasado", card: "*6 meses* atrasado" },
      { say: "na troca de óleo.", card: "Na troca *de óleo*" },
      { say: "[pointedly] E você nem sabe.", card: "E você *nem sabe*" },
      { say: "[chuckles] Você lembra da última troca? Nem eu, cara.", card: "Lembra *da última*?" },
      { say: "[sighs] O adesivo no para-brisa apagou faz tempo.", card: "O adesivo *apagou*" },
      {
        say: "[confident] No BoxMonitor, você registra a última troca, com a nota.",
        card: "Registra *a última troca*",
        tela: [{ tipo: "anterior" }, { tipo: "anterior", anexado: true }],
      },
      { say: "Aí o painel do carro mostra: manutenção atrasada.", card: "Manutenção *atrasada*", tela: { tipo: "painel", atrasada: true } },
      { say: "[relieved] Abre e vê na hora o que tá vencido e o que tá em dia.", card: "Vencido *ou em dia*", tela: { tipo: "painel", atrasada: true, destaque: true } },
      { say: "[warmly] Sem adesivo, sem caderninho no porta-luvas, sabe?", card: "Sem *adesivo*" },
      { say: "[playfully] Manda pra quem tá atrasado na troca de óleo... e nem sabe.", card: "Atrasado *e nem sabe*" },
    ],
    caption: `Seu carro pode estar 6 meses atrasado na troca de óleo, e você nem sabe. Manda pra quem tá atrasado e nem sabe.

O adesivo do para-brisa apagou e ninguém lembra a data.

No BoxMonitor você cria sua conta com o CPF, registra a última troca com a nota fiscal e o painel do carro mostra o que está atrasado, o que vence em breve e o que está em dia.

👉 Link na bio.

${HASHTAGS_CLIENTE}`,
  },

  // ───────── SEMANA 5 ─────────
  {
    slug: "13-2026-11-30-seg-reel-os-no-papel",
    kind: "reel",
    cover: { kicker: "Reel", title: "Para de guardar *OS no papel*" },
    beats: [
      { say: "[exasperated] Para de guardar ordem de serviço no papel.", card: "OS *no papel*?" },
      { say: "Uma mancha de óleo... e já era.", card: "1 mancha *e já era*" },
      { say: "[seriously] E não é só a mancha, cara.", card: "Não é *só a mancha*" },
      { say: "É o cliente que volta oito meses depois", card: "Voltou *8 meses depois*" },
      { say: "perguntando o que você trocou no carro dele.", card: "“O que você *trocou*?”" },
      { say: "[sighs] E você caçando a folha em três gavetas.", card: "Caçando *a folha*" },
      { say: "[confident] No BoxMonitor, cada serviço fica no histórico do carro.", card: "Histórico *do carro*", tela: { tipo: "historico" } },
      { say: "O que foi feito, a data, a quilometragem e a nota.", card: "Serviço, data, *km e nota*", tela: { tipo: "historico", aberto: true } },
      { say: "[relieved] Abre o carro e tá tudo lá.", card: "Tá *tudo lá*", tela: { tipo: "historico", aberto: true } },
      { say: "[playfully] Manda pra quem ainda tem pilha de papel no balcão.", card: "Manda pra *quem tem pilha*" },
    ],
    caption: `Uma mancha de óleo e a OS já era. Manda pra quem ainda tem pilha de papel no balcão.

O problema aparece 8 meses depois, quando o cliente volta perguntando o que você trocou no carro dele.

No BoxMonitor cada serviço fica no histórico do carro: o que foi feito, a data, a quilometragem e a nota. Abre o carro e tá tudo lá.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
  {
    slug: "13-2026-12-01-ter-reel-whatsapp-pessoal",
    kind: "reel",
    cover: { kicker: "Reel", title: "Orçamento *no WhatsApp pessoal*?" },
    beats: [
      { say: "[exasperated] Para de negociar orçamento", card: "Para de *negociar orçamento*" },
      { say: "de novecentos reais no WhatsApp pessoal.", card: "R$ 900 *no WhatsApp pessoal*?" },
      { say: "[sighs] Onze da noite, no meio da foto do seu filho:", card: "No meio *da foto do filho*" },
      { say: "dá pra fazer por setecentos?", card: "“Faz por *700*?”" },
      { say: "[frustrated] Três semanas depois, cadê o combinado?", card: "Cadê *o combinado*?" },
      { say: "[confident] No BoxMonitor, a conversa fica dentro do serviço.", card: "Conversa *no serviço*", tela: { tipo: "conversa" } },
      { say: "Junto do orçamento. Não no seu celular.", card: "*Junto* do orçamento", tela: [{ tipo: "conversa" }, { tipo: "conversa", aprovado: true }] },
      { say: "[relieved] E o seu WhatsApp volta a ser seu, sabe?", card: "Seu WhatsApp *volta a ser seu*" },
      { say: "[playfully] Manda pro mecânico que negocia orçamento às onze da noite.", card: "Manda pro *mecânico*" },
    ],
    caption: `Para de negociar orçamento de R$ 900 no seu WhatsApp pessoal. Manda pro mecânico que negocia às 11 da noite.

Onze da noite, no meio da foto do seu filho, chega "faz por 700?". Três semanas depois, ninguém acha o que foi combinado.

No BoxMonitor cada serviço tem a conversa com o cliente, junto do orçamento: quanto foi, quando foi enviado e quando ele aprovou. O cliente vê tudo ao entrar no rastreio com o CPF.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
  {
    slug: "14-2026-12-02-qua-reel-estoque-minimo",
    kind: "reel",
    cover: { kicker: "Reel", title: "Perdeu 1 tarde *esperando peça*?" },
    beats: [
      { say: "[frustrated] Já perdeu uma tarde esperando peça", card: "Perdeu 1 tarde *esperando peça*?" },
      { say: "que você jurava que tinha?", card: "Jurava *que tinha*" },
      { say: "Carro no elevador há duas horas, cliente esperando,", card: "Carro parado *no elevador*" },
      { say: "[exasperated] e o filtro acabou.", card: "O filtro *acabou*" },
      { say: "[sighs] Ninguém anotou que pegou o último.", card: "Ninguém *anotou*" },
      { say: "[confident] No BoxMonitor, você define o mínimo de cada peça.", card: "Define *o mínimo*", tela: { tipo: "estoque", editando: true } },
      { say: "Chegou no mínimo, ela aparece destacada no estoque.", card: "Estoque baixo *em destaque*", tela: { tipo: "estoque", alerta: true } },
      { say: "Você vê antes de faltar, não depois.", card: "Vê *antes de faltar*", tela: { tipo: "estoque", alerta: true } },
      { say: "[relieved] E compra com calma.", card: "Compra *com calma*" },
      { say: "[warmly] Salva esse e não perde mais uma tarde.", card: "*Salva* esse" },
    ],
    caption: `Carro no elevador, cliente esperando e o filtro que você jurava que tinha acabou. Salva esse e não perde mais uma tarde.

No BoxMonitor você define o estoque mínimo de cada peça. Chegou no mínimo, ela aparece com o selo "Estoque baixo". Você vê antes de faltar e compra com calma.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
  {
    slug: "14-2026-12-03-qui-reel-concessionaria",
    kind: "reel",
    cover: { kicker: "Reel", title: "A concessionária *lembra*. Você não." },
    beats: [
      { say: "[seriously] A concessionária lembra dos 6 meses do seu cliente.", card: "A concessionária *lembra*" },
      { say: "[pointedly] Você não.", card: "*Você não.*" },
      { say: "[warmly] Ela não é melhor que você, cara.", card: "Não é *melhor que você*" },
      { say: "Ela só lembra a data.", card: "Só lembra *a data*" },
      { say: "[confident] No BoxMonitor, seu cliente tem o painel do carro.", card: "Painel *do carro*", tela: { tipo: "painel" } },
      { say: "Vê a próxima troca: 18 de dezembro.", card: "Próxima troca: *18/12*", tela: { tipo: "painel", destaque: true } },
      {
        say: "E 15 dias antes, recebe o lembrete da sua oficina.",
        card: "*15 dias* antes",
        tela: { tipo: "notificacao", titulo: "Troca de óleo e filtro vence em 18 de dezembro", texto: "BRA2E19 · Auto Center Demo", hora: "09:00", dia: "quinta-feira, 03/12" },
      },
      { say: "[proudly] Não da concessionária. Da sua.", card: "Da *sua* oficina" },
      { say: "[warmly] E daqui 6 meses ele volta pra quem lembrou, sabe?", card: "Volta pra *quem lembrou*" },
      { say: "[playfully] Salva esse", card: "*Salva* esse" },
      { say: "e lembra do seu cliente antes da concessionária.", card: "Lembra *antes dela*" },
    ],
    caption: `A concessionária lembra dos 6 meses do seu cliente. Você não. Salva esse e lembra antes dela.

Ela não é melhor que você. Ela só lembra a data.

No BoxMonitor o cliente tem o painel do carro com a próxima troca, e recebe o lembrete da sua oficina antes de vencer. Não da concessionária. Da sua.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_REEL}`,
  },
];
