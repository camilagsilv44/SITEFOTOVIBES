import type { CmsData, Photo, Seo } from './types';

const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=72&w=${w}&h=${h}`;

const lq = '#EDE7DE';

/** Build a seeded photo with responsive sources (CDN width params = production CDN behaviour). */
function p(
  id: string,
  unsplashId: string,
  alt: string,
  categoryId: string,
  portrait = true,
  featured = false,
  caption = ''
): Photo {
  const w = portrait ? 1000 : 1600;
  const h = portrait ? 1500 : 1067;
  const r = h / w;
  return {
    id,
    alt,
    caption,
    categoryId,
    sources: {
      sm: u(unsplashId, 480, Math.round(480 * r)),
      md: u(unsplashId, 1080, Math.round(1080 * r)),
      lg: u(unsplashId, 1920, Math.round(1920 * r)),
    },
    width: w,
    height: h,
    lqip: lq,
    bytes: 0,
    featured,
    createdAt: '2026-01-10T10:00:00.000Z',
  };
}

const seo = (o: Partial<Seo>): Seo => ({
  title: '',
  description: '',
  canonical: '',
  index: true,
  follow: true,
  ogTitle: '',
  ogDescription: '',
  ogImageId: '',
  h1: '',
  ...o,
});

const photos: Photo[] = [
  p('ph_fem1', '1531746020798-e6953c6e8e04', 'Retrato feminino em luz natural com fundo neutro', 'cat_feminino', true, true),
  p('ph_fem2', '1524504388940-b1c1722653e1', 'Ensaio feminino ao ar livre no fim da tarde', 'cat_feminino', true, true),
  p('ph_fem3', '1517841905240-472988babdf9', 'Retrato feminino close com luz suave', 'cat_feminino', true, false),
  p('ph_fem4', '1494790108377-be9c29b29330', 'Retrato sorridente em ensaio feminino urbano', 'cat_feminino', true, false),
  p('ph_fem5', '1529626455594-4ff0802cfb7e', 'Editorial de moda em estúdio com sombras marcadas', 'cat_feminino', true, true),
  p('ph_fem6', '1516726817505-f5ed825624d8', 'Retrato feminino em contraluz dourada', 'cat_feminino', false, false),
  p('ph_cas1', '1522673607200-164d1b6ce486', 'Casal abraçado durante ensaio pré-wedding', 'cat_casal', true, true),
  p('ph_cas2', '1516589178581-6cd7833ae3b2', 'Casal caminhando de mãos dadas na cidade', 'cat_casal', false, false),
  p('ph_cas3', '1494774157365-9e04c6720e47', 'Detalhe das mãos do casal em ensaio ao pôr do sol', 'cat_casal', true, false),
  p('ph_cas4', '1519671482749-fd09be7ccebf', 'Casal rindo durante ensaio espontâneo', 'cat_casal', true, true),
  p('ph_ges1', '1518098268026-4e89f1a2cd8e', 'Ensaio gestante com vestido fluido em luz natural', 'cat_gestante', true, true),
  p('ph_ges2', '1555252333-9f8e92e65df9', 'Detalhe da barriga da gestante em contraluz', 'cat_gestante', true, false),
  p('ph_fam1', '1476234251651-f353703a034d', 'Família reunida em ensaio ao ar livre', 'cat_familia', false, true),
  p('ph_fam2', '1511895426328-dc8714191300', 'Pais e filhos em ensaio de família em casa', 'cat_familia', true, false),
  p('ph_cor1', '1507003211169-0a1dd7228f2d', 'Retrato corporativo masculino em fundo escuro', 'cat_corporativo', true, true),
  p('ph_cor2', '1573496359142-b8d87734a5a2', 'Retrato corporativo feminino para LinkedIn', 'cat_corporativo', true, false),
  p('ph_cor3', '1600880292203-757bb62b4baf', 'Equipe em reunião durante ensaio corporativo', 'cat_corporativo', false, false),
  p('ph_cor4', '1552664730-d307ca884978', 'Bastidores de produção de conteúdo para marca', 'cat_corporativo', false, false),
  p('ph_cwd1', '1519741497674-611481863552', 'Cerimônia de casamento com luz natural', 'cat_casamento', false, true),
  p('ph_cwd2', '1511285560929-80b456fea0bc', 'Noiva em detalhe do vestido antes da cerimônia', 'cat_casamento', true, false),
  p('ph_cwd3', '1465495976277-4387d4b0b4c6', 'Brinde e celebração na festa de casamento', 'cat_casamento', true, false),
  p('ph_prd1', '1523275335684-37898b6baf30', 'Fotografia de produto com fundo minimalista', 'cat_produtos', false, true),
  p('ph_prd2', '1560343090-f0409e92791a', 'Still de produto com sombras suaves', 'cat_produtos', true, false),
  p('ph_life1', '1465226165355-95e5b8bae2b6', 'Ensaio lifestyle em viagem', 'cat_lifestyle', false, false),
  p('ph_giovana', '1573496799652-408c2ac9fe98', 'Giovana, fotógrafa da Vibe Fotos, com sua câmera', 'cat_feminino', true, false),
  p('ph_hero', '1519741497674-611481863552', 'Fotografia autoral da Vibe Fotos em luz natural', 'cat_feminino', false, false),
];

export const SEED: CmsData = {
  version: 1,
  settings: {
    brand: 'Vibe Fotos',
    tagline: 'Eu Capturo a Sua Vibe',
    valueProp:
      'Ensaios autorais com direção de pose do início ao fim. Você não precisa saber posar — eu conduzo, você vive o momento e leva imagens que parecem você de verdade.',
    siteUrl: 'https://vibefotos.com.br',
    whatsapp: {
      number: '5531991860038',
      display: '(31) 99186-0038',
      label: 'Quero meu ensaio',
      message: 'Oi Giovana! Vim pelo site da Vibe Fotos e quero fazer um ensaio. Pode me passar os detalhes?',
    },
    contact: { email: 'contato@vibefotos.com.br', city: 'Belo Horizonte · MG', hours: 'Seg a Sáb, 9h às 19h' },
    social: {
      instagram: 'https://instagram.com/vibefotos',
      tiktok: 'https://tiktok.com/@vibefotos',
      youtube: 'https://youtube.com/@vibefotos',
      pinterest: '',
    },
    home: {
      heroPhotoId: 'ph_fem2',
      heroKicker: 'Fotografia autoral · Belo Horizonte',
      heroTitle: 'Eu Capturo a Sua Vibe',
      heroSubtitle:
        'Ensaios com direção de pose, luz natural e tratamento premium. Mais do que fotos bonitas: imagens que se parecem com você.',
      ctaPrimary: 'Quero meu ensaio',
      ctaSecondary: 'Ver portfólio',
      aboutTitle: 'Prazer, eu sou a Giovana',
      aboutText:
        'Sou fotógrafa há mais de oito anos e já conduzi mais de 400 ensaios. Meu trabalho começa antes do clique: escolho a locação com você, monto referências, dirijo a pose e cuido da luz para que o resultado tenha a sua identidade.\n\nAlém da fotografia, atuo com marketing digital, produção de conteúdo e criação de sites — então entrego imagens pensadas também para o lugar onde elas vão viver: seu Instagram, seu site, sua marca.\n\nNa fotografia, capturo a sua vibe. No marketing, faço essa vibe chegar às pessoas certas.',
      aboutPhotoId: 'ph_giovana',
      finalCtaTitle: 'A próxima vibe pode ser a sua',
      finalCtaText:
        'Me conte a sua ideia pelo WhatsApp. Em poucos minutos eu te envio disponibilidade, locações sugeridas e o investimento certo para o seu ensaio.',
      differentials: [
        { title: 'Direção de pose do começo ao fim', text: 'Você nunca fica sem saber o que fazer. Eu conduzo cada movimento, olhar e respiração — inclusive para quem "não sabe posar".' },
        { title: 'Consultoria de looks e locação', text: 'Antes do ensaio montamos juntos um moodboard, definimos paleta, roupas e o melhor horário de luz.' },
        { title: 'Tratamento que respeita a pele', text: 'Edição fina, cor autoral e nada de plástico. Você continua sendo você — na sua melhor luz.' },
        { title: 'Entrega rápida em galeria privada', text: 'Prévia em até 48h e galeria completa em até 10 dias, com download em alta e versões prontas para redes sociais.' },
        { title: 'Uso comercial descomplicado', text: 'Para marcas e profissionais, entrego direitos de uso claros e arquivos otimizados para site, anúncios e catálogo.' },
        { title: 'Olhar de marketing', text: 'Cada imagem é pensada para performar onde vai ser publicada — feed, capa, banner, campanha ou perfil profissional.' },
      ],
      steps: [
        { title: 'Escolha sua experiência', text: 'Conversamos pelo WhatsApp sobre o tipo de ensaio, referências e objetivo das imagens.' },
        { title: 'Agendamos data e local', text: 'Definimos a locação, o horário de melhor luz e enviamos o guia de preparação com dicas de look.' },
        { title: 'Realizamos o ensaio', text: 'De 1 a 3 horas de sessão com direção de pose, playlist e clima leve. Sem pressa, sem pose travada.' },
        { title: 'Seleção e tratamento', text: 'Faço a curadoria das melhores imagens e o tratamento autoral, cuidando de cor, pele e atmosfera.' },
        { title: 'Entrega das fotografias', text: 'Você recebe uma galeria privada em alta resolução, com versões otimizadas para redes sociais.' },
      ],
    },
    analytics: { ga4: '', gtm: '', pixel: '', gscToken: '' },
  },

  categories: [
    { id: 'cat_feminino', name: 'Feminino', slug: 'feminino' },
    { id: 'cat_casal', name: 'Casal', slug: 'casal' },
    { id: 'cat_gestante', name: 'Gestante', slug: 'gestante' },
    { id: 'cat_familia', name: 'Família', slug: 'familia' },
    { id: 'cat_casamento', name: 'Casamento', slug: 'casamento' },
    { id: 'cat_corporativo', name: 'Corporativo', slug: 'corporativo' },
    { id: 'cat_produtos', name: 'Produtos', slug: 'produtos' },
    { id: 'cat_lifestyle', name: 'Lifestyle', slug: 'lifestyle' },
  ],

  photos,

  galleries: [
    {
      id: 'gal_ana',
      title: 'Ensaio Ana · Luz de fim de tarde',
      slug: 'ensaio-ana',
      description:
        'Um ensaio feminino feito na hora dourada, com direção de pose leve e uma paleta quente. A ideia era registrar a Ana como ela é: solta, espontânea e cheia de presença.',
      coverPhotoId: 'ph_fem2',
      photoIds: ['ph_fem2', 'ph_fem1', 'ph_fem3', 'ph_fem4', 'ph_fem6'],
      categoryId: 'cat_feminino',
      date: '2026-01-18',
      featured: true,
      published: true,
      seo: seo({
        title: 'Ensaio feminino da Ana em luz natural | Vibe Fotos',
        description:
          'Galeria completa do ensaio feminino da Ana, feito na hora dourada em Belo Horizonte, com direção de pose e tratamento autoral da Vibe Fotos.',
        h1: 'Ensaio Ana · Luz de fim de tarde',
      }),
    },
    {
      id: 'gal_marcos',
      title: 'Marina & Rafael · Pré-wedding urbano',
      slug: 'pre-wedding-marina-rafael',
      description:
        'Um pré-wedding no centro da cidade, entre arquitetura e luz de vitrine. Movimento, riso e a naturalidade de quem se conhece de verdade.',
      coverPhotoId: 'ph_cas1',
      photoIds: ['ph_cas1', 'ph_cas4', 'ph_cas2', 'ph_cas3'],
      categoryId: 'cat_casal',
      date: '2026-02-02',
      featured: true,
      published: true,
      seo: seo({
        title: 'Pré-wedding urbano em BH: Marina e Rafael | Vibe Fotos',
        description:
          'Ensaio de casal pré-wedding em Belo Horizonte com clima urbano, luz natural e direção espontânea. Veja a galeria completa.',
        h1: 'Marina & Rafael · Pré-wedding urbano',
      }),
    },
    {
      id: 'gal_espera',
      title: 'À espera da Alice · Gestante',
      slug: 'gestante-alice',
      description:
        'Um ensaio gestante delicado, feito em casa e depois no campo, para eternizar a espera com serenidade e luz suave.',
      coverPhotoId: 'ph_ges1',
      photoIds: ['ph_ges1', 'ph_ges2', 'ph_fam2'],
      categoryId: 'cat_gestante',
      date: '2025-12-08',
      featured: true,
      published: true,
      seo: seo({
        title: 'Ensaio gestante em luz natural | Vibe Fotos',
        description:
          'Ensaio gestante sensível e delicado com luz natural, feito em casa e em locação externa. Galeria completa da Vibe Fotos.',
        h1: 'À espera da Alice',
      }),
    },
    {
      id: 'gal_corp',
      title: 'Retratos corporativos · Estúdio Norte',
      slug: 'retratos-corporativos-estudio-norte',
      description:
        'Sessão de retratos corporativos para uma equipe de 12 pessoas, com padrão visual único para site, LinkedIn e materiais institucionais.',
      coverPhotoId: 'ph_cor1',
      photoIds: ['ph_cor1', 'ph_cor2', 'ph_cor3', 'ph_cor4'],
      categoryId: 'cat_corporativo',
      date: '2026-01-30',
      featured: true,
      published: true,
      seo: seo({
        title: 'Retratos corporativos para equipes em BH | Vibe Fotos',
        description:
          'Fotografia corporativa com padrão visual consistente para LinkedIn, site e materiais institucionais. Veja o case completo.',
        h1: 'Retratos corporativos · Estúdio Norte',
      }),
    },
    {
      id: 'gal_casamento',
      title: 'Casamento Júlia & Pedro',
      slug: 'casamento-julia-pedro',
      description:
        'Cobertura de casamento com olhar documental: os detalhes, os nervos antes da cerimônia e a festa até o último brinde.',
      coverPhotoId: 'ph_cwd1',
      photoIds: ['ph_cwd1', 'ph_cwd2', 'ph_cwd3'],
      categoryId: 'cat_casamento',
      date: '2025-11-22',
      featured: false,
      published: true,
      seo: seo({
        title: 'Casamento em Belo Horizonte: Júlia e Pedro | Vibe Fotos',
        description: 'Cobertura fotográfica de casamento com olhar documental e edição autoral. Veja a galeria.',
        h1: 'Casamento Júlia & Pedro',
      }),
    },
    {
      id: 'gal_produto',
      title: 'Still de produto · Marca Aurora',
      slug: 'still-produto-aurora',
      description:
        'Fotografia de produto para e-commerce e campanhas de tráfego pago, com fundo minimalista e luz controlada.',
      coverPhotoId: 'ph_prd1',
      photoIds: ['ph_prd1', 'ph_prd2'],
      categoryId: 'cat_produtos',
      date: '2026-02-12',
      featured: false,
      published: true,
      seo: seo({
        title: 'Fotografia de produto para e-commerce | Vibe Fotos',
        description: 'Still de produto com luz controlada, pensado para e-commerce, catálogo e anúncios.',
        h1: 'Still de produto · Marca Aurora',
      }),
    },
  ],

  services: [
    {
      id: 'srv_fem',
      title: 'Ensaio Feminino',
      slug: 'feminino',
      excerpt: 'Um ensaio para você se ver como as pessoas que te amam te veem.',
      body:
        'O ensaio feminino da Vibe Fotos é feito para quem quer se redescobrir diante da câmera. Começamos com uma conversa sobre referências, escolhemos looks e locação juntas e, no dia, eu conduzo cada pose para que você se sinta livre.\n\nTrabalho com luz natural sempre que possível, buscando uma estética quente e atemporal. O resultado são imagens que envelhecem bem — nada de moda passageira.',
      coverPhotoId: 'ph_fem5',
      photoIds: ['ph_fem5', 'ph_fem1', 'ph_fem3', 'ph_fem4'],
      priceFrom: 'R$ 690',
      duration: '2 horas · 2 looks',
      includes: ['Consultoria de looks e locação', 'Direção de pose completa', '35 fotos tratadas em alta', 'Galeria privada online', 'Versões para stories e feed'],
      ctaLabel: 'Quero meu ensaio feminino',
      ctaMessage: 'Oi Giovana! Quero fazer um ensaio feminino com a Vibe Fotos. Pode me contar como funciona?',
      order: 1,
      published: true,
      seo: seo({
        title: 'Ensaio fotográfico feminino em Belo Horizonte | Vibe Fotos',
        description:
          'Ensaio feminino com direção de pose, consultoria de looks e tratamento autoral em BH. A partir de R$ 690. Agende pelo WhatsApp.',
        h1: 'Ensaio Feminino',
      }),
    },
    {
      id: 'srv_casal',
      title: 'Ensaio de Casal & Pré-Wedding',
      slug: 'casal',
      excerpt: 'A cumplicidade de vocês dois, sem pose forçada.',
      body:
        'Ensaios de casal são sobre movimento e verdade. Eu proponho situações — caminhar, conversar, dançar — e fotografo o que acontece entre uma pose e outra. É onde mora a melhor imagem.\n\nIdeal para pré-wedding, aniversário de namoro, bodas ou simplesmente para registrar essa fase.',
      coverPhotoId: 'ph_cas1',
      photoIds: ['ph_cas1', 'ph_cas4', 'ph_cas3', 'ph_cas2'],
      priceFrom: 'R$ 890',
      duration: '2 horas · 2 locações',
      includes: ['Planejamento de roteiro e locações', 'Direção para casais tímidos', '45 fotos tratadas em alta', 'Galeria privada online', 'Mini reels do ensaio'],
      ctaLabel: 'Quero um ensaio de casal',
      ctaMessage: 'Oi Giovana! Eu e meu amor queremos um ensaio de casal com a Vibe Fotos. Pode nos passar os detalhes?',
      order: 2,
      published: true,
      seo: seo({
        title: 'Ensaio de casal e pré-wedding em BH | Vibe Fotos',
        description:
          'Ensaio de casal e pré-wedding com direção espontânea em Belo Horizonte. A partir de R$ 890, com galeria privada e mini reels.',
        h1: 'Ensaio de Casal & Pré-Wedding',
      }),
    },
    {
      id: 'srv_gestante',
      title: 'Ensaio Gestante',
      slug: 'gestante',
      excerpt: 'A espera merece ser lembrada com delicadeza.',
      body:
        'Fotografo gestantes entre a 28ª e a 34ª semana, quando a barriga já está bonita e o corpo ainda está confortável. O ensaio pode ser em casa, em estúdio ou em locação externa.\n\nTenho acervo de vestidos fluidos para empréstimo e conduzo o ritmo respeitando totalmente o seu conforto.',
      coverPhotoId: 'ph_ges1',
      photoIds: ['ph_ges1', 'ph_ges2'],
      priceFrom: 'R$ 790',
      duration: '1h30 · 2 looks',
      includes: ['Acervo de vestidos para empréstimo', 'Ensaio em casa, estúdio ou externa', '35 fotos tratadas em alta', 'Participação do parceiro(a) e filhos', 'Galeria privada online'],
      ctaLabel: 'Quero meu ensaio gestante',
      ctaMessage: 'Oi Giovana! Estou grávida e quero fazer um ensaio gestante com a Vibe Fotos.',
      order: 3,
      published: true,
      seo: seo({
        title: 'Ensaio gestante em Belo Horizonte | Vibe Fotos',
        description:
          'Ensaio gestante delicado com acervo de vestidos, em casa, estúdio ou locação externa. A partir de R$ 790 em BH.',
        h1: 'Ensaio Gestante',
      }),
    },
    {
      id: 'srv_familia',
      title: 'Ensaio de Família',
      slug: 'familia',
      excerpt: 'O retrato que vai ficar na parede por décadas.',
      body:
        'Ensaios de família com crianças pedem paciência e jogo. Eu brinco, proponho e fotografo o que é real — inclusive a bagunça.\n\nPode ser em casa, em um parque ou no sítio da família. O importante é que todo mundo se reconheça nas imagens.',
      coverPhotoId: 'ph_fam1',
      photoIds: ['ph_fam1', 'ph_fam2'],
      priceFrom: 'R$ 850',
      duration: '1h30 · até 6 pessoas',
      includes: ['Ensaio em casa ou externa', 'Dinâmicas com crianças', '40 fotos tratadas em alta', 'Retrato de família em alta para impressão', 'Galeria privada online'],
      ctaLabel: 'Quero um ensaio de família',
      ctaMessage: 'Oi Giovana! Queremos fazer um ensaio de família com a Vibe Fotos.',
      order: 4,
      published: true,
      seo: seo({
        title: 'Ensaio de família em Belo Horizonte | Vibe Fotos',
        description: 'Ensaio de família espontâneo, em casa ou ao ar livre, com dinâmicas para crianças. A partir de R$ 850.',
        h1: 'Ensaio de Família',
      }),
    },
    {
      id: 'srv_corp',
      title: 'Fotografia Corporativa & Marcas',
      slug: 'corporativo',
      excerpt: 'Imagem profissional consistente para time, marca e campanhas.',
      body:
        'Retratos corporativos, fotografia de produto, bastidores e produção de conteúdo para redes sociais. Trabalho com padrão visual definido para que todas as imagens da sua empresa conversem entre si.\n\nEntrego arquivos otimizados para site, LinkedIn, catálogo e anúncios — com direitos de uso claros.',
      coverPhotoId: 'ph_cor1',
      photoIds: ['ph_cor1', 'ph_cor2', 'ph_cor3', 'ph_cor4', 'ph_prd1'],
      priceFrom: 'R$ 1.200',
      duration: 'meio período · equipe ou marca',
      includes: ['Retratos padronizados para o time', 'Fotografia de produto e ambiente', 'Conteúdo para redes sociais', 'Arquivos otimizados para web', 'Licença de uso comercial'],
      ctaLabel: 'Quero fotos para minha marca',
      ctaMessage: 'Oi Giovana! Quero contratar fotografia corporativa / para minha marca com a Vibe Fotos.',
      order: 5,
      published: true,
      seo: seo({
        title: 'Fotografia corporativa e para marcas em BH | Vibe Fotos',
        description:
          'Retratos corporativos, fotografia de produto e produção de conteúdo com padrão visual consistente. A partir de R$ 1.200.',
        h1: 'Fotografia Corporativa & Marcas',
      }),
    },
    {
      id: 'srv_casamento',
      title: 'Casamentos',
      slug: 'casamento',
      excerpt: 'Cobertura documental do primeiro detalhe ao último brinde.',
      body:
        'Cobertura de casamentos com olhar documental e sensibilidade para os detalhes. Acompanho o making of, a cerimônia e a festa, com segunda câmera quando necessário.\n\nEntrego uma galeria completa em alta resolução e um recorte especial para publicação nas redes.',
      coverPhotoId: 'ph_cwd1',
      photoIds: ['ph_cwd1', 'ph_cwd2', 'ph_cwd3'],
      priceFrom: 'Sob consulta',
      duration: 'até 10 horas de cobertura',
      includes: ['Making of, cerimônia e festa', 'Segunda câmera opcional', 'Mais de 400 fotos tratadas', 'Galeria privada com download', 'Prévia em 48h'],
      ctaLabel: 'Quero orçamento de casamento',
      ctaMessage: 'Oi Giovana! Vamos casar e queremos um orçamento de cobertura fotográfica.',
      order: 6,
      published: true,
      seo: seo({
        title: 'Fotografia de casamento em Belo Horizonte | Vibe Fotos',
        description: 'Cobertura de casamento com olhar documental, prévia em 48h e galeria completa em alta resolução.',
        h1: 'Fotografia de Casamento',
      }),
    },
  ],

  testimonials: [
    {
      id: 'tes1',
      name: 'Ana Beatriz',
      sessionType: 'Ensaio feminino',
      quote:
        'Eu tinha pavor de câmera. A Giovana conduziu tudo com tanta leveza que em 10 minutos eu esqueci que estava sendo fotografada. Chorei quando vi as fotos.',
      rating: 5,
      photoId: 'ph_fem1',
      avatarUrl: '',
      order: 1,
      published: true,
    },
    {
      id: 'tes2',
      name: 'Marina & Rafael',
      sessionType: 'Pré-wedding',
      quote:
        'Ela captou exatamente o nosso jeito: bagunceiro e risonho. Não tem uma foto travada na galeria inteira. Valeu cada centavo.',
      rating: 5,
      photoId: 'ph_cas4',
      avatarUrl: '',
      order: 2,
      published: true,
    },
    {
      id: 'tes3',
      name: 'Luiza Prado',
      sessionType: 'Ensaio gestante',
      quote:
        'Me senti confortável do início ao fim, mesmo com 32 semanas. As fotos ficaram delicadas e ainda recebemos a prévia no mesmo dia.',
      rating: 5,
      photoId: 'ph_ges1',
      avatarUrl: '',
      order: 3,
      published: true,
    },
    {
      id: 'tes4',
      name: 'Estúdio Norte',
      sessionType: 'Fotografia corporativa',
      quote:
        'Padronizou a imagem de 12 pessoas do time em uma manhã. O site e o LinkedIn da empresa mudaram de patamar.',
      rating: 5,
      photoId: 'ph_cor2',
      avatarUrl: '',
      order: 4,
      published: true,
    },
  ],

  pages: [
    {
      id: 'pg_marketing',
      title: 'Fotografia & Marketing',
      slug: 'marketing',
      intro:
        'Não basta aparecer, é preciso ser lembrado. A Vibe Fotos une imagem e estratégia para que o seu conteúdo trabalhe por você todos os dias.',
      blocks: [
        {
          heading: 'Da imagem à estratégia',
          text: 'Uma boa imagem chama atenção. Uma boa estratégia transforma essa atenção em conexão, oportunidade e crescimento. Por isso cada projeto pode incluir também o plano de uso das fotos.',
          items: ['Produção de conteúdo para redes sociais', 'Reels e vídeos promocionais', 'Campanhas de tráfego pago', 'Criação de sites e landing pages', 'Identidade visual aplicada ao feed'],
        },
        {
          heading: 'Para quem é',
          text: 'Profissionais liberais, pequenas marcas e empresas que precisam de presença visual consistente e material suficiente para publicar o mês inteiro.',
          items: ['Banco de imagens mensal', 'Fotografia de produto para e-commerce', 'Retratos institucionais', 'Bastidores e cultura da empresa'],
        },
      ],
      published: true,
      seo: seo({
        title: 'Fotografia e marketing digital para marcas | Vibe Fotos',
        description:
          'Produção de conteúdo, fotografia para marcas, reels, tráfego pago e criação de sites. Imagem e estratégia no mesmo lugar.',
        h1: 'Sua imagem também vende',
      }),
    },
    {
      id: 'pg_person',
      title: 'Personalização',
      slug: 'personalizacao',
      intro:
        'Uma imagem especial não precisa existir apenas na tela. Transforme suas fotografias, ideias e artes em produtos que representam você, sua história ou sua marca.',
      blocks: [
        {
          heading: 'O que dá para criar',
          text: 'Trabalho com fornecedores parceiros para transformar a sua imagem em produto físico, com acabamento de qualidade.',
          items: ['Quadros e retratos emoldurados', 'Álbuns e fotolivros', 'Canecas e squeezes', 'Camisetas e blusas', 'Banners e materiais promocionais', 'Presentes personalizados'],
        },
      ],
      published: true,
      seo: seo({
        title: 'Produtos personalizados com suas fotos | Vibe Fotos',
        description: 'Quadros, álbuns, canecas, camisetas, banners e presentes personalizados a partir das suas fotografias.',
        h1: 'Sua vibe. Do seu jeito.',
      }),
    },
    {
      id: 'pg_invest',
      title: 'Investimentos',
      slug: 'investimentos',
      intro:
        'Um espaço de conteúdo informativo e educacional sobre organização financeira, planejamento e o funcionamento do mercado.',
      blocks: [
        {
          heading: 'Temas abordados',
          text: 'Conteúdos em construção, publicados aos poucos, sempre com linguagem simples e foco em educação.',
          items: ['Educação e organização financeira', 'Planejamento de objetivos', 'Conceitos do mercado financeiro', 'Tendências e análises', 'Construção de conhecimento sobre dinheiro'],
        },
        {
          heading: 'Aviso importante',
          text: 'Os conteúdos desta página possuem caráter exclusivamente informativo e educacional e não constituem recomendação individual de investimento. Investimentos envolvem riscos e decisões financeiras devem considerar os objetivos e o perfil de cada pessoa.',
          items: [],
        },
      ],
      published: true,
      seo: seo({
        title: 'Educação financeira e investimentos | Vibe Fotos',
        description:
          'Conteúdo informativo e educacional sobre organização financeira, planejamento e mercado. Sem promessas de rentabilidade.',
        h1: 'Invista também no seu futuro',
      }),
    },
  ],

  redirects: [],
};
