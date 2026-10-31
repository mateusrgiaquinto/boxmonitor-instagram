// Conteúdo dos posts. Texto entre *asteriscos* sai destacado em amarelo (capa/CTA) ou azul (slides claros).

const HASHTAGS_PRODUTO =
  "#oficinamecanica #mecanicoautomotivo #gestaodeoficina #oficinadebairro #autocenter #mecanica #donodeoficina";
const HASHTAGS_DICAS =
  "#dicasdemecanica #gestaodeoficina #empreendedorismo #pequenonegocio #mecanicoautomotivo #oficinamecanica";

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
    slug: "04-2026-11-09-seg-carrossel-orcamento",
    kind: "carousel",
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

  // ───────── SEMANA 3 ─────────
  {
    slug: "07-2026-11-16-seg-carrossel-quando-voltar",
    kind: "carousel",
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
    slug: "10-2026-11-23-seg-carrossel-adeus-caderno",
    kind: "carousel",
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
