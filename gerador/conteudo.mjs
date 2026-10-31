// Conteúdo dos posts. Texto entre *asteriscos* sai destacado em amarelo (capa/CTA) ou azul (slides claros).

const HASHTAGS_PRODUTO =
  "#oficinamecanica #mecanicoautomotivo #gestaodeoficina #oficinadebairro #autocenter #mecanica #donodeoficina";
const HASHTAGS_DICAS =
  "#dicasdemecanica #gestaodeoficina #empreendedorismo #pequenonegocio #mecanicoautomotivo #oficinamecanica";

export const posts = [
  // ───────── SEMANA 1 ─────────
  {
    slug: "01-2026-11-02-seg-reel-ja-ta-pronto",
    kind: "reel",
    cover: { kicker: "Reel", title: "Cliente ligando pela *5ª vez* pra saber do carro?" },
    script: [
      "(0–3 s) Mecânico embaixo do carro, celular tocando. Texto na tela: \"Pela 5ª vez hoje…\"",
      "(3–7 s) Atende: \"Ainda não, senhor…\". Texto: \"Cliente ligando pra saber do carro?\"",
      "(7–15 s) Gravação de tela: cliente digita a placa e vê o status do serviço. Texto: \"Com o BoxMonitor ele acompanha sozinho, pela placa.\"",
      "(15–20 s) Mecânico volta ao trabalho, tranquilo. Texto: \"Menos telefone. Mais serviço.\"",
    ],
    caption: `Quantas vezes por dia o telefone toca com a mesma pergunta? 📞

No BoxMonitor, seu cliente digita a placa e vê em que etapa o carro está. Quando o status muda, ele recebe aviso no WhatsApp.

Você trabalha. Ele fica tranquilo.

👉 Cadastre sua oficina pelo link da bio.

${HASHTAGS_PRODUTO}`,
  },
  {
    slug: "02-2026-11-04-qua-carrossel-5-sinais",
    kind: "carousel",
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

  // ───────── SEMANA 2 ─────────
  {
    slug: "04-2026-11-09-seg-reel-orcamento",
    kind: "reel",
    cover: { kicker: "Reel", title: "“Eu *não autorizei* isso!”" },
    script: [
      "(0–4 s) Cliente bravo no balcão (encenado). Texto na tela: \"'Eu não autorizei isso!'\"",
      "(4–8 s) Texto: \"Já passou por isso?\"",
      "(8–16 s) Gravação de tela: orçamento enviado e cliente aprovando pelo celular. Texto: \"No BoxMonitor, o cliente aprova o orçamento pelo celular. Fica registrado.\"",
      "(16–20 s) Texto: \"Aprovou, tá aprovado.\"",
    ],
    caption: `Orçamento aprovado por telefone vira dor de cabeça na hora de pagar. 💸

No BoxMonitor, o cliente recebe o orçamento, aprova pelo celular e fica tudo registrado no serviço.

Sem "eu não falei isso". Sem prejuízo.

👉 Link na bio.

${HASHTAGS_PRODUTO}`,
  },
  {
    slug: "05-2026-11-11-qua-carrossel-valor-da-hora",
    kind: "carousel",
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
    slug: "06-2026-11-13-sex-reel-aviso-whatsapp",
    kind: "reel",
    cover: { kicker: "Reel", title: "Seu cliente sabendo *como está o carro*, sem ligar" },
    script: [
      "(0–3 s) Close num celular na mesa. Texto na tela: \"Seu cliente, no trabalho…\"",
      "(3–8 s) Notificação do WhatsApp chega, com a mensagem de status do BoxMonitor na tela.",
      "(8–12 s) Cliente sorri e mostra o celular. Texto: \"…sabendo exatamente como está o carro dele.\"",
      "(12–15 s) Texto: \"Atendimento de concessionária. Preço de oficina de bairro.\"",
    ],
    caption: `Cliente informado é cliente que confia, e cliente que confia volta. 🤝

No BoxMonitor, cada mudança de status manda aviso automático pro cliente.

👉 Link na bio.

${HASHTAGS_PRODUTO}`,
  },

  // ───────── SEMANA 3 ─────────
  {
    slug: "07-2026-11-16-seg-reel-quando-voltar",
    kind: "reel",
    cover: { kicker: "Reel", title: "Trocou o óleo… e *nunca mais voltou*" },
    script: [
      "(0–4 s) Texto na tela: \"Trocou o óleo… e nunca mais voltou.\"",
      "(4–8 s) Texto: \"Não é falta de qualidade. É falta de lembrar.\"",
      "(8–16 s) Gravação de tela: painel do veículo do cliente mostrando a próxima manutenção por km. Texto: \"No BoxMonitor, o cliente vê no painel quando vence a próxima manutenção.\"",
      "(16–20 s) Texto: \"Ele sabe quando voltar. E sabe pra onde.\"",
    ],
    caption: `O cliente mais barato de conquistar é o que já passou pela sua oficina. 🔁

Cadastre seus serviços com a periodicidade em km (troca de óleo, filtro, correia…) e o cliente acompanha no painel do veículo quando vence a próxima.

👉 Link na bio.

${HASHTAGS_PRODUTO}`,
  },
  {
    slug: "08-2026-11-18-qua-carrossel-checklist-recepcao",
    kind: "carousel",
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

  // ───────── SEMANA 4 ─────────
  {
    slug: "10-2026-11-23-seg-reel-adeus-caderno",
    kind: "reel",
    cover: { kicker: "Reel", title: "Marcando horário com a *mão suja de graxa*?" },
    script: [
      "(0–4 s) Caderno de agenda rabiscado, com rasuras. Texto na tela: \"Sua agenda hoje:\"",
      "(4–8 s) Mecânico atendendo o WhatsApp no meio do serviço. Texto: \"Marcando horário com a mão suja de graxa?\"",
      "(8–16 s) Gravação de tela: cliente abre o link de agendamento da oficina e escolhe o horário. Texto: \"Com o BoxMonitor, o cliente agenda sozinho pelo seu link.\"",
      "(16–20 s) Caderno fechando. Texto: \"Aposenta o caderno.\"",
    ],
    caption: `Cada mensagem pra marcar horário é uma pausa no serviço. 📅

No BoxMonitor sua oficina tem um link de agendamento. Coloca na bio, no status do WhatsApp, na fachada, e o cliente marca sozinho.

👉 Link na bio.

${HASHTAGS_PRODUTO}`,
  },
  {
    slug: "11-2026-11-25-qua-carrossel-estoque-minimo",
    kind: "carousel",
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
];
