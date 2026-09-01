// ─── Modelo de dados do site ─────────────────────────────────────────────────

export interface PortfolioImage {
  id: number;
  src: string;
  category: string;
  alt: string;
}

export interface ServiceCategory {
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

export interface PersonalizationItem {
  name: string;
  image: string;
}

export interface SiteData {
  // Contato
  whatsapp: string;
  whatsappDisplay: string;
  whatsappMsg: string;
  email: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  // Hero
  heroImage: string;
  heroTagline: string;
  heroTitle: string;
  heroAccent: string;
  heroSubtitle: string;
  // Sobre
  aboutImage: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutRole: string;
  aboutText1: string;
  aboutText2: string;
  aboutText3: string;
  aboutQuote: string;
  aboutQuoteAccent: string;
  // Marketing
  marketingImage: string;
  marketingTitle: string;
  marketingSubtitle: string;
  marketingText1: string;
  marketingText2: string;
  // Personalização
  personalizacaoImage: string;
  personalizacaoTitle: string;
  personalizacaoSubtitle: string;
  // Contato seção
  contatoTitle: string;
  contatoText: string;
  contatoQuote: string;
  // Portfólio
  portfolioImages: PortfolioImage[];
  // Vitrine de serviços
  serviceCategories: ServiceCategory[];
  // Produtos de personalização
  personalizationItems: PersonalizationItem[];
}

export const defaultData: SiteData = {
  whatsapp: '5531991860038',
  whatsappDisplay: '(31) 99186-0038',
  whatsappMsg: 'Olá! Vim pelo site da Vibe Fotos e gostaria de mais informações.',
  email: 'contato@vibefotos.com',
  instagram: 'https://instagram.com',
  youtube: 'https://youtube.com',
  tiktok: 'https://tiktok.com',
  heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
  heroTagline: 'Fotografia • Identidade • Estratégia • Movimento',
  heroTitle: 'EU CAPTURO',
  heroAccent: 'A SUA VIBE.',
  heroSubtitle: 'Mais do que registrar momentos, transformamos pessoas, histórias e ideias em experiências visuais com personalidade.',
  aboutImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
  aboutTitle: 'Quem está por trás da Vibe?',
  aboutSubtitle: 'Prazer, eu sou a Giovana.',
  aboutRole: 'Fotógrafa, criativa e especialista em transformar atenção em conexão.',
  aboutText1: 'A Vibe Fotos nasceu da minha paixão por capturar vibes, contar histórias e transformar ideias em experiências que geram conexão.',
  aboutText2: 'Além da fotografia, atuo com marketing digital, estratégias de engajamento, criação de sites, tráfego pago, produção de conteúdo e desenvolvimento de estratégias para gerar novas oportunidades para pessoas e marcas.',
  aboutText3: 'Para mim, uma boa imagem não termina no clique. Ela pode despertar uma emoção, fortalecer uma identidade, apresentar uma marca e fazer alguém parar para olhar.',
  aboutQuote: 'Na fotografia, capturo a sua vibe.',
  aboutQuoteAccent: 'No marketing, faço essa vibe chegar às pessoas certas.',
  marketingImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
  marketingTitle: 'Sua imagem também vende.',
  marketingSubtitle: 'Não basta aparecer. É preciso ser lembrado.',
  marketingText1: 'A Vibe Fotos une criatividade e estratégia para ajudar pessoas, profissionais e empresas a construírem uma presença visual mais forte.',
  marketingText2: 'Da fotografia à produção de vídeos, do conteúdo às campanhas de tráfego pago, cada projeto pode ser pensado para atrair atenção, gerar engajamento e criar novas oportunidades.',
  personalizacaoImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  personalizacaoTitle: 'Sua Vibe. Do Seu Jeito.',
  personalizacaoSubtitle: 'Transforme uma fotografia, uma ideia ou uma identidade em algo exclusivamente seu.',
  contatoTitle: 'Qual é a sua Vibe?',
  contatoText: 'Quer fazer um ensaio, criar conteúdo para sua marca, produzir um vídeo, desenvolver uma estratégia, personalizar um projeto ou simplesmente conversar sobre uma ideia?',
  contatoQuote: 'Me chama. A próxima vibe pode ser a sua.',
  portfolioImages: [
    { id: 1, src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80', category: 'retrato', alt: 'Retrato feminino com luz natural' },
    { id: 2, src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', category: 'evento', alt: 'Momento especial de evento' },
    { id: 3, src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', category: 'casamento', alt: 'Casamento elegante' },
    { id: 4, src: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&q=80', category: 'retrato', alt: 'Retrato artístico' },
    { id: 5, src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80', category: 'moda', alt: 'Editorial de moda' },
    { id: 6, src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80', category: 'corporativo', alt: 'Evento corporativo sofisticado' },
    { id: 7, src: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80', category: 'lifestyle', alt: 'Estilo de vida' },
    { id: 8, src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80', category: 'moda', alt: 'Look fashion' },
  ],
  serviceCategories: [
    { title: 'FOTOGRAFIA', subtitle: 'Momentos que merecem ser sentidos novamente.', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80', href: '#portfolio' },
    { title: 'MARKETING', subtitle: 'Sua imagem chegando às pessoas certas.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', href: '#marketing' },
    { title: 'PERSONALIZAÇÃO', subtitle: 'Sua identidade transformada em algo único.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', href: '#personalizacao' },
    { title: 'INVESTIMENTOS', subtitle: 'Conhecimento para ampliar novas possibilidades.', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80', href: '#investimentos' },
  ],
  personalizationItems: [
    { name: 'Camisetas Personalizadas', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' },
    { name: 'Canecas Exclusivas', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80' },
    { name: 'Quadros Artísticos', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80' },
    { name: 'Presentes Únicos', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80' },
    { name: 'Banners Profissionais', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80' },
    { name: 'Acessórios', image: 'https://images.unsplash.com/photo-1508270588233-4b2c9a4b3e8e?w=600&q=80' },
  ],
};

// ─── Armazenamento local (cache / fallback) ──────────────────────────────────

export const STORAGE_KEY = 'vibefotos_data';

export function loadData(): SiteData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultData, ...JSON.parse(raw) };
  } catch {
    /* ignora dados corrompidos */
  }
  return defaultData;
}

export function saveData(data: SiteData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* storage cheio — tenta mesmo assim no servidor */
  }
}
