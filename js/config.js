/* ==========================================================================
   CONFIGURAÇÃO — EDITE AQUI
   Links, textos, categorias, serviços e fotos ficam todos neste bloco.
   Para usar suas fotos: coloque o arquivo em assets/img/ e escreva o caminho
   no campo "img", ex.:  img: "assets/img/gestantes.jpg"
   Campo vazio ("") = aparece o espaço "Foto demonstrativa".
   ========================================================================== */
const CONFIG = {
  links: {
    orcamento: "https://tabelavibes.vercel.app/",
    instagram: "https://www.instagram.com/vib3s.ft/",
    whatsapp: "https://wa.me/message/HUWCQTH4WIEKF1",
    whatsappNumero: "",               // OPCIONAL: só números com DDI+DDD, ex.: "5561999999999". Com ele, o formulário abre o WhatsApp já com a mensagem pronta
    instagramMarketing: ""            // preencha quando existir
  },
  contato: { email: "", localizacao: "" },   // preencha para aparecerem no site
  marca: {
    nome: "Vibe Fotos — Camila Geovana",
    fotografa: "Camila Geovana",
    frase: "CAPTURO SUA VIBE. ETERNIZO SUA HISTÓRIA."
  },
  fotos: {
    capa: "assets/img/capa.jpg", // foto do topo Para trocar: coloque o arquivo em assets/img/ e escreva o caminho
    capaVideo: "",     // OPCIONAL: vídeo de fundo do topo, ex.: "capa.mp4" (sem som, em loop; ideal 10–20s, até 8 MB)
    retrato: "assets/img/retrato.jpg", // seu retrato Para trocar: coloque o arquivo em assets/img/
    agendamento: "assets/img/agendamento.jpg"    // fundo da seção "Aguarda a sua vibe"
  },
  hero: {
    linha1: "CAPTURO SUA",
    linha2: "VIBE.",
    texto: "Fotografia com emoção, verdade e sofisticação. Cada ensaio é pensado para traduzir quem você é — e transformar instantes em memórias que duram.",
    botao1: "CONHEÇA MEU TRABALHO",
    botao2: "FAÇA SEU ORÇAMENTO"
  },
  sobre: {
    titulo: "Muito prazer, sou Camila Geovana!",
    paragrafos: [
      "Sou fotógrafa e criadora de conteúdo, e minha paixão é registrar experiências de forma natural e sofisticada. Acredito que uma boa fotografia não é só técnica: é sensibilidade para perceber o momento certo e fazer cada pessoa se reconhecer na imagem.",
      "Trabalho com ensaios femininos e pessoais, casais e famílias, aniversários, eventos e produção de conteúdo para marcas e redes sociais. Em cada trabalho, o objetivo é o mesmo: capturar a sua vibe e eternizar a sua história.",
      "Além da fotografia, atuo também com marketing digital, por meio da Vibe Marketing, ajudando negócios a serem vistos com estratégia, identidade e imagem profissional."
    ],
    botao: "CONHEÇA MEU INSTAGRAM"
  },
  portfolio: {
    titulo: "Cada categoria, uma emoção. Escolha a sua vibe.",
    botao: "MONTE SEU ORÇAMENTO"
  },
  /* proporção: portrait | landscape | square | tall   ·   foco (opcional): ponto de enquadramento da foto, ex.: "50% 30%" */
  categorias: [
    { id:"gestantes", nome:"Gestantes", desc:"A espera mais bonita da vida, registrada com delicadeza e emoção.", ratio:"tall", img:"assets/img/gestantes.jpg", foco:"50% 30%" },
    { id:"bebes", nome:"Bebês e crianças", desc:"Sorrisos, descobertas e pequenos detalhes que passam rápido demais.", ratio:"tall", img:"assets/img/bebes.jpg", foco:"50% 55%" },
    { id:"aniversarios", nome:"Aniversários", desc:"Cada comemoração com todo o brilho, as cores e a alegria do dia.", ratio:"portrait", img:"assets/img/aniversarios.jpg", foco:"50% 30%" },
    { id:"eventos", nome:"Eventos", desc:"Cobertura sensível que conta a história inteira, do primeiro ao último instante.", ratio:"landscape", img:"assets/img/eventos.jpg", foco:"50% 40%" },
    { id:"femininos", nome:"Ensaios femininos", desc:"Autoestima, presença e personalidade em imagens que valorizam você.", ratio:"tall", img:"assets/img/femininos.jpg", foco:"50% 25%" },
    { id:"casais", nome:"Casais", desc:"Conexão, cumplicidade e cenas naturais para guardar o seu amor.", ratio:"portrait", img:"assets/img/casais.jpg", foco:"60% 45%" },
    { id:"familia", nome:"Família", desc:"Gerações juntas, afeto verdadeiro e memórias para a vida toda.", ratio:"portrait", img:"assets/img/familia.jpg", foco:"50% 65%" },
    { id:"profissionais", nome:"Ensaios profissionais", desc:"Imagem que transmite confiança e fortalece a sua marca pessoal.", ratio:"square", img:"assets/img/profissionais.jpg", foco:"50% 40%" },
    { id:"personalizada", nome:"Fotografia personalizada", desc:"Uma ideia só sua? Criamos juntas um ensaio sob medida.", ratio:"portrait", img:"assets/img/personalizada.jpg", foco:"50% 40%" }
  ],
  agendamento: {
    titulo: "VAMOS CRIAR A SUA VIBE?",
    texto: "Escolha o seu ensaio, monte o orçamento do seu jeito e finalize o atendimento pelo WhatsApp. Seus momentos especiais merecem ser eternizados com cuidado.",
    botao: "QUERO AGENDAR MINHA VIBE"
  },
  marketing: {
    titulo: "SUA EMPRESA NÃO PRECISA APENAS EXISTIR. ELA PRECISA SER VISTA.",
    texto: "Estratégia, imagem e presença digital em um só lugar. Da fotografia ao site, ajudo o seu negócio a se posicionar com profissionalismo e atrair as pessoas certas.",
    botao: "FALAR NO WHATSAPP",
    botaoHome: "CONHEÇA A VIBE MARKETING",
    tituloServicos: "O que posso fazer pela sua marca",
    textoProjetos: "Espaços preparados para os projetos realizados. Em breve, novos trabalhos por aqui.",
    espacosVazios: 6
  },
  servicos: [
    { icone:"globe", titulo:"Criação de sites profissionais", desc:"Sites rápidos, bonitos e pensados para transformar visitas em clientes.", campos:[{ r:"Você já tem um site?", o:["Não tenho", "Tenho e quero refazer", "Tenho e quero melhorar"] }, { r:"Que tipo de site você precisa?", o:["Institucional", "Loja virtual", "Portfólio", "Página de vendas", "Ainda não sei"] }] },
    { icone:"share", titulo:"Gestão de redes sociais", desc:"Planejamento, conteúdo e identidade para sua marca aparecer com consistência.", campos:[{ r:"Quais redes quer gerenciar?", o:["Instagram", "TikTok", "Facebook", "Várias redes"] }, { r:"Quantas postagens por semana?", o:["2 a 3", "4 a 5", "Todos os dias", "Ainda não sei"] }] },
    { icone:"target", titulo:"Tráfego pago", desc:"Anúncios estratégicos para levar o seu negócio a quem quer comprar.", campos:[{ r:"Onde quer anunciar?", o:["Instagram e Facebook", "Google", "Os dois", "Ainda não sei"] }, { r:"Quanto pretende investir por mês em anúncios?", o:["Até R$ 500", "R$ 500 a R$ 1.500", "Acima de R$ 1.500", "Ainda não sei"] }] },
    { icone:"camera", titulo:"Fotografia comercial", desc:"Imagens profissionais que elevam a percepção de valor da sua empresa.", campos:[{ r:"Para que serão as fotos?", o:["Redes sociais", "Site", "Catálogo", "Tudo isso"] }, { r:"Onde seria a sessão?", o:["No meu espaço comercial", "Em estúdio ou externa", "Ainda não sei"] }] },
    { icone:"box", titulo:"Fotografia de produtos", desc:"Fotos que destacam detalhes e despertam desejo de compra.", campos:[{ r:"Que tipo de produto?" }, { r:"Quantos produtos, aproximadamente?", o:["Até 10", "De 10 a 30", "Mais de 30"] }] },
    { icone:"video", titulo:"Produção de vídeos e anúncios", desc:"Vídeos curtos e anúncios criativos para prender atenção e gerar resultado.", campos:[{ r:"Que tipo de vídeo?", o:["Reels / TikTok", "Anúncio", "Institucional", "Vários tipos"] }, { r:"Quantos vídeos por mês?", o:["1 a 4", "5 a 10", "Mais de 10", "Ainda não sei"] }] },
    { icone:"trend", titulo:"Estratégias de marketing digital", desc:"Um plano claro para unir imagem, conteúdo e vendas.", campos:[{ r:"Qual é o seu principal objetivo?", o:["Vender mais", "Ganhar seguidores", "Fortalecer a marca", "Organizar a presença digital"] }, { r:"Você já faz marketing hoje?", o:["Não", "Faço sozinho(a)", "Tenho equipe ou agência"] }] },
    { icone:"palette", titulo:"Identidade visual e branding", desc:"Logotipo, cores e estilo para a sua marca ser reconhecida e lembrada.", campos:[{ r:"Qual é a sua situação?", o:["Ainda não tenho marca", "Tenho e quero renovar"] }, { r:"O que você precisa?", o:["Logotipo", "Cores e fontes", "Identidade completa", "Ainda não sei"] }] },
    { icone:"sparkles", titulo:"Criação de conteúdo e edição", desc:"Reels, stories e posts com edição profissional e a cara do seu negócio.", campos:[{ r:"O que você precisa?", o:["Reels", "Stories", "Posts e carrosséis", "Tudo isso"] }, { r:"Você já tem fotos e vídeos gravados?", o:["Sim", "Não", "Alguns"] }] }
  ],
  /* projetos de marketing: { titulo:"Nome", categoria:"Tipo", img:"arquivo.jpg" } */
  projetos: [],
  contatoTitulo: "Vamos conversar?",
  contatoTexto: "Escolha o canal que for mais confortável. Respondo com todo o carinho."
};
