import { useState, useEffect, useRef, createContext, useContext } from 'react';
import {
  Menu, X, Camera, TrendingUp, BookOpen, Mail, Phone, MessageCircle,
  ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Star, Sparkles,
  Zap, Heart, Gift, Shirt, Coffee, Settings, LogOut, Upload, Trash2,
  Plus, Save, Eye, EyeOff, Lock, Image, Type, Link, Palette, Check,
  Cloud, Copy, Database
} from 'lucide-react';
import {
  type SiteData, type PortfolioImage, type ServiceCategory, type PersonalizationItem,
  defaultData, loadData, saveData,
} from './lib/siteData';
import {
  getCfg, setCfg, fetchRemote, pushRemote, testConnection, SETUP_SQL,
  type BackendCfg, type SyncState,
} from './lib/backend';

// ─── (dados padrão e storage importados de lib/siteData) ────────────────────

// ─── AUTH (login do painel) ──────────────────────────────────────────────────

const AUTH_KEY = 'vibefotos_auth';
const PASS_KEY = 'vibefotos_pass';
const DEFAULT_PASSWORD = 'vibe2025';

function getPassword(): string {
  return localStorage.getItem(PASS_KEY) || DEFAULT_PASSWORD;
}

function isAuthed(): boolean {
  const val = sessionStorage.getItem(AUTH_KEY);
  return val === 'true';
}

// ─── CONTEXT ──────────────────────────────────────────────────────────────────

const SiteCtx = createContext<{
  data: SiteData;
  setData: (d: SiteData) => void;
}>({ data: defaultData, setData: () => {} });

const useSite = () => useContext(SiteCtx);

// ─── HOOKS ────────────────────────────────────────────────────────────────────

function useScrollAnim() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, vis };
}

function Anim({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, vis } = useScrollAnim();
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${className}`}
      style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(36px)', transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── SITE PÚBLICO ─────────────────────────────────────────────────────────────

function Header({ onAdmin }: { onAdmin: () => void }) {
  const { data } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const waUrl = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(data.whatsappMsg)}`;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const nav = [
    { label: 'Início', href: '#inicio' },
    { label: 'Portfólio', href: '#portfolio' },
    { label: 'Quem Sou', href: '#quemsou' },
    { label: 'Marketing', href: '#marketing' },
    { label: 'Personalização', href: '#personalizacao' },
    { label: 'Investimentos', href: '#investimentos' },
    { label: 'Contato', href: '#contato' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'glass py-4' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#inicio" className="font-playfair text-2xl font-semibold tracking-wide text-white hover:text-accent transition-colors">VIBE FOTOS</a>
          <nav className="hidden lg:flex items-center gap-8">
            {nav.map(n => (
              <a key={n.href} href={n.href} className="menu-link text-sm text-white/90 hover:text-white transition-colors">{n.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={onAdmin}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-white/25 text-white/80 hover:text-accent hover:border-accent/60 transition-colors text-[13px] font-medium"
              title="Abrir painel de administração">
              <Settings size={14} /> Painel
            </button>
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-white p-2"><Menu size={28} /></button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="mobile-menu fixed inset-0 z-50">
          <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-6 text-white p-2"><X size={32} /></button>
          <nav className="flex flex-col items-center gap-6">
            {nav.map((n, i) => (
              <a key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
                className="font-playfair text-4xl text-white hover:text-accent transition-colors"
                style={{ animationDelay: `${i * 80}ms` }}>{n.label}</a>
            ))}
          </nav>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="mt-10 btn-primary flex items-center gap-3">
            <MessageCircle size={20} /> Falar no WhatsApp
          </a>
          <button onClick={() => { setMobileOpen(false); onAdmin(); }}
            className="mt-5 flex items-center gap-2 text-white/70 hover:text-accent transition-colors text-base border border-white/20 px-6 py-3 rounded-full font-medium">
            <Settings size={16} /> Painel de administração
          </button>
        </div>
      )}
    </>
  );
}

function Hero() {
  const { data } = useSite();
  const waUrl = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(data.whatsappMsg)}`;
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center parallax" style={{ backgroundImage: `url(${data.heroImage})`, transform: 'scale(1.1)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="animate-fade-in-up">
          <p className="font-cormorant text-xl md:text-2xl text-accent mb-4 tracking-wide">{data.heroTagline}</p>
        </div>
        <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-medium text-white mb-8 leading-tight animate-fade-in-up delay-200">
          {data.heroTitle}<br /><span className="text-accent">{data.heroAccent}</span>
        </h1>
        <p className="font-inter text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 animate-fade-in-up delay-300">{data.heroSubtitle}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-400">
          <a href="#portfolio" className="btn-primary flex items-center gap-3 text-lg"><Camera size={20} /> Ver Meu Trabalho</a>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-3 text-lg"><MessageCircle size={20} /> Falar no WhatsApp</a>
        </div>
      </div>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/70 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

function ServicesOverview() {
  const { data } = useSite();
  return (
    <section className="py-32 bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <Anim className="text-center mb-20">
          <p className="text-accent text-sm tracking-widest uppercase mb-4">O que fazemos</p>
          <h2 className="font-playfair text-4xl md:text-6xl text-white mb-4">Uma Experiência, Muitas Vibes</h2>
          <div className="line-accent mx-auto mt-6" />
        </Anim>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.serviceCategories.map((s, i) => (
            <Anim key={i} delay={i * 100}>
              <a href={s.href} className="service-card block h-[400px] relative group cursor-pointer">
                <img src={s.image} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="overlay" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="font-playfair text-2xl text-white mb-2 group-hover:text-accent transition-colors">{s.title}</h3>
                  <p className="text-sm text-white/70">{s.subtitle}</p>
                  <div className="mt-4 flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm">Explorar</span><ArrowRight size={16} />
                  </div>
                </div>
              </a>
            </Anim>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  const { data } = useSite();
  const [cat, setCat] = useState('all');
  const [selected, setSelected] = useState<PortfolioImage | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const cats = ['all', ...Array.from(new Set(data.portfolioImages.map(i => i.category)))];
  const filtered = cat === 'all' ? data.portfolioImages : data.portfolioImages.filter(i => i.category === cat);
  const visible = isMobile && !showAll ? filtered.slice(0, 6) : filtered;
  const hasMore = isMobile && !showAll && filtered.length > 6;

  return (
    <section id="portfolio" className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <Anim className="text-center mb-12">
          <p className="text-accent text-sm tracking-widest uppercase mb-4">Portfólio</p>
          <h2 className="font-playfair text-4xl md:text-6xl text-white mb-4">Histórias que eu já capturei.</h2>
          <p className="text-white/60 max-w-2xl mx-auto">Cada fotografia carrega uma história, uma personalidade e uma vibe diferente.</p>
        </Anim>
        <Anim className="flex flex-wrap justify-center gap-3 mb-12">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-5 py-2 rounded-full text-sm transition-all capitalize ${cat === c ? 'bg-accent text-primary' : 'bg-secondary text-white/70 hover:text-white'}`}>
              {c === 'all' ? 'Todos' : c}
            </button>
          ))}
        </Anim>
        <div className="masonry">
          {visible.map((img, i) => (
            <Anim key={img.id} className="masonry-item cursor-pointer" delay={i * 50}>
              <div onClick={() => setSelected(img)} className="relative overflow-hidden rounded-lg group">
                <img src={img.src} alt={img.alt} className="w-full object-cover img-hover" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ZoomIcon size={32} className="text-white" />
                  </div>
                </div>
              </div>
            </Anim>
          ))}
        </div>
        {hasMore && (
          <div className="text-center mt-10">
            <button onClick={() => setShowAll(true)} className="btn-primary inline-flex items-center gap-3">
              Ver mais fotos <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
      {selected && (
        <div className="lightbox fixed inset-0 z-50 p-4" onClick={() => setSelected(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-accent transition-colors"><X size={32} /></button>
          <button className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-accent transition-colors"
            onClick={e => { e.stopPropagation(); const idx = filtered.findIndex(i => i.id === selected.id); setSelected(filtered[(idx - 1 + filtered.length) % filtered.length]); }}>
            <ChevronLeft size={48} />
          </button>
          <button className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-accent transition-colors"
            onClick={e => { e.stopPropagation(); const idx = filtered.findIndex(i => i.id === selected.id); setSelected(filtered[(idx + 1) % filtered.length]); }}>
            <ChevronRight size={48} />
          </button>
          <img src={selected.src.replace('w=800', 'w=1400')} alt={selected.alt} className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}

function ZoomIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function About() {
  const { data } = useSite();
  const waUrl = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(data.whatsappMsg)}`;
  return (
    <section id="quemsou" className="py-32 bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Anim className="relative">
            <div className="relative">
              <img src={data.aboutImage} alt={data.aboutSubtitle} className="w-full h-[600px] object-cover rounded-lg" />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 border-2 border-accent rounded-lg -z-10" />
            </div>
          </Anim>
          <Anim delay={200}>
            <p className="text-accent text-sm tracking-widest uppercase mb-4">Sobre mim</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-white mb-2">{data.aboutTitle}</h2>
            <h3 className="font-cormorant text-2xl text-white/80 mb-6">{data.aboutSubtitle}</h3>
            <p className="text-lg text-accent mb-8">{data.aboutRole}</p>
            <div className="space-y-5 text-white/70 mb-8">
              <p>{data.aboutText1}</p>
              <p>{data.aboutText2}</p>
              <p>{data.aboutText3}</p>
            </div>
            <blockquote className="border-l-2 border-accent pl-6 mb-8">
              <p className="font-cormorant text-2xl text-white italic">
                "{data.aboutQuote}<br /><span className="text-accent">{data.aboutQuoteAccent}</span>"
              </p>
            </blockquote>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-3">
              <MessageCircle size={20} /> Vamos Criar Algo Juntos
            </a>
          </Anim>
        </div>
      </div>
    </section>
  );
}

function Marketing() {
  const { data } = useSite();
  const waUrl = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(data.whatsappMsg)}`;
  const services = ['Ensaios fotográficos', 'Fotografia profissional', 'Fotografia para marcas', 'Fotografia de produtos', 'Fotos para redes sociais', 'Produção de vídeos', 'Gravação de conteúdo', 'Vídeos promocionais', 'Reels', 'Conteúdo para Instagram', 'Campanhas', 'Criação de sites', 'Estratégias de engajamento', 'Marketing digital', 'Tráfego pago'];
  return (
    <section id="marketing" className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Anim>
            <p className="text-accent text-sm tracking-widest uppercase mb-4">Marketing & Estratégia</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-white mb-4">{data.marketingTitle}</h2>
            <p className="font-cormorant text-2xl text-white/60 mb-8">{data.marketingSubtitle}</p>
            <div className="space-y-5 text-white/70 mb-8">
              <p>{data.marketingText1}</p>
              <p>{data.marketingText2}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {services.map(s => (
                <div key={s} className="flex items-center gap-2 text-sm text-white/60">
                  <Camera size={13} className="text-accent shrink-0" /><span>{s}</span>
                </div>
              ))}
            </div>
          </Anim>
          <Anim delay={200}>
            <div className="relative">
              <img src={data.marketingImage} alt="Marketing digital" className="w-full h-[500px] object-cover rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="font-cormorant text-3xl text-white italic">"Uma boa imagem chama atenção. Uma boa estratégia transforma essa atenção em conexão, oportunidade e crescimento."</p>
              </div>
            </div>
          </Anim>
        </div>
        <Anim delay={300} className="mt-20 text-center">
          <div className="bg-secondary rounded-2xl p-12 md:p-16">
            <h3 className="font-playfair text-3xl md:text-4xl text-white mb-4">Da imagem à estratégia.</h3>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">Sua próxima ideia pode começar aqui.</p>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-3 text-lg">
              <Zap size={20} /> Quero Movimentar Minha Marca
            </a>
          </div>
        </Anim>
      </div>
    </section>
  );
}

function Personalizacao() {
  const { data } = useSite();
  const waUrl = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(data.whatsappMsg)}`;
  const icons = [Shirt, Coffee, Sparkles, Gift, Zap, Star];
  return (
    <section id="personalizacao" className="py-32 bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <Anim className="text-center mb-16">
          <p className="text-accent text-sm tracking-widest uppercase mb-4">Personalização</p>
          <h2 className="font-playfair text-4xl md:text-6xl text-white mb-4">{data.personalizacaoTitle}</h2>
          <p className="text-white/60 max-w-2xl mx-auto">{data.personalizacaoSubtitle}</p>
        </Anim>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {data.personalizationItems.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Anim key={i} delay={i * 100}>
                <div className="product-card overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover img-hover" loading="lazy" />
                  </div>
                  <div className="p-6 flex items-center gap-3">
                    <Icon size={24} className="text-accent" />
                    <h3 className="font-playfair text-xl text-white">{item.name}</h3>
                  </div>
                </div>
              </Anim>
            );
          })}
        </div>
        <Anim className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0">
            <img src={data.personalizacaoImage} alt="Personalização" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/60" />
          </div>
          <div className="relative p-12 md:p-16">
            <h3 className="font-playfair text-3xl md:text-4xl text-white mb-4">Da fotografia para algo que você pode levar com você.</h3>
            <p className="text-white/70 max-w-xl mb-8">Uma imagem especial não precisa existir apenas na tela.</p>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-3">
              <Gift size={20} /> Quero Personalizar Minha Vibe
            </a>
          </div>
        </Anim>
      </div>
    </section>
  );
}

function Investimentos() {
  const { data } = useSite();
  const waUrl = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(data.whatsappMsg)}`;
  const topics = [
    { title: 'Educação Financeira', desc: 'Conceitos fundamentais para organizar suas finanças.', Icon: BookOpen },
    { title: 'Planejamento', desc: 'Estratégias para planejar objetivos de curto, médio e longo prazo.', Icon: TrendingUp },
    { title: 'Mercado Financeiro', desc: 'Entenda como funcionam os principais investimentos.', Icon: Sparkles },
    { title: 'Mentalidade', desc: 'Hábitos e mentalidade positiva em relação ao dinheiro.', Icon: Heart },
  ];
  return (
    <section id="investimentos" className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <Anim className="text-center mb-16">
          <p className="text-accent text-sm tracking-widest uppercase mb-4">Conhecimento</p>
          <h2 className="font-playfair text-4xl md:text-6xl text-white mb-4">Invista também no seu futuro.</h2>
          <p className="text-white/60 max-w-2xl mx-auto">Informação, conhecimento e novas perspectivas sobre o mundo financeiro.</p>
        </Anim>
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {topics.map((t, i) => (
            <Anim key={i} delay={i * 100}>
              <div className="investment-card">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg"><t.Icon size={28} className="text-accent" /></div>
                  <div><h3 className="font-playfair text-xl text-white mb-2">{t.title}</h3><p className="text-white/60">{t.desc}</p></div>
                </div>
              </div>
            </Anim>
          ))}
        </div>
        <Anim className="text-center">
          <div className="bg-secondary rounded-2xl p-12 border border-white/5">
            <Sparkles size={48} className="text-accent mx-auto mb-6" />
            <h3 className="font-playfair text-2xl text-white mb-4">Novos conteúdos em breve</h3>
            <p className="text-white/60 max-w-xl mx-auto mb-8">Artigos, vídeos e materiais educativos sobre investimentos e educação financeira.</p>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-3">
              <MessageCircle size={20} /> Me pergunte!
            </a>
          </div>
        </Anim>
        <Anim className="mt-10">
          <p className="text-xs text-white/35 text-center border border-white/5 rounded-lg p-4">
            <strong className="text-white/50">Aviso:</strong> Conteúdo exclusivamente informativo e educacional. Não constitui recomendação de investimento. Investimentos envolvem riscos.
          </p>
        </Anim>
      </div>
    </section>
  );
}

function Contato() {
  const { data } = useSite();
  const waUrl = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(data.whatsappMsg)}`;
  return (
    <section id="contato" className="py-32 bg-primary">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Anim>
          <p className="text-accent text-sm tracking-widest uppercase mb-4">Contato</p>
          <h2 className="font-playfair text-4xl md:text-6xl text-white mb-4">{data.contatoTitle}</h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8">{data.contatoText}</p>
          <p className="font-cormorant text-2xl text-white mb-12">{data.contatoQuote}</p>
        </Anim>
        <Anim delay={200} className="mb-10">
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-4 text-xl px-12 py-6">
            <MessageCircle size={28} /> Falar com a Giovana
          </a>
        </Anim>
        <Anim delay={300}>
          <p className="text-white/40 mb-3">Ou entre em contato diretamente:</p>
          <a href={`https://wa.me/${data.whatsapp}`} className="font-playfair text-3xl text-accent hover:text-white transition-colors">{data.whatsappDisplay}</a>
        </Anim>
        <Anim delay={400} className="mt-14 flex flex-wrap justify-center gap-6">
          <a href={data.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-accent transition-colors">
            <IgIcon size={20} /><span>Instagram</span>
          </a>
          <a href={`mailto:${data.email}`} className="flex items-center gap-2 text-white/60 hover:text-accent transition-colors">
            <Mail size={20} /><span>E-mail</span>
          </a>
          <a href={data.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-accent transition-colors">
            <YtIcon size={20} /><span>YouTube</span>
          </a>
          <a href={data.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-accent transition-colors">
            <ExternalLink size={20} /><span>TikTok</span>
          </a>
        </Anim>
      </div>
    </section>
  );
}

function Footer({ onAdmin }: { onAdmin: () => void }) {
  const { data } = useSite();
  const waUrl = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(data.whatsappMsg)}`;
  const nav = ['Início', 'Portfólio', 'Quem Sou', 'Marketing', 'Personalização', 'Investimentos', 'Contato'];
  const hrefs = ['#inicio', '#portfolio', '#quemsou', '#marketing', '#personalizacao', '#investimentos', '#contato'];
  return (
    <footer className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="font-playfair text-2xl text-white mb-4">VIBE FOTOS</h3>
            <p className="font-cormorant text-xl text-accent mb-4">Eu Capturo a Sua Vibe.</p>
            <p className="text-sm text-white/50">Fotografia • Marketing • Personalização • Conteúdo • Investimentos</p>
          </div>
          <div>
            <h4 className="text-sm text-white/40 uppercase tracking-wider mb-4">Navegação</h4>
            <nav className="flex flex-col gap-2">
              {nav.map((n, i) => <a key={n} href={hrefs[i]} className="text-sm text-white/60 hover:text-accent transition-colors">{n}</a>)}
            </nav>
          </div>
          <div>
            <h4 className="text-sm text-white/40 uppercase tracking-wider mb-4">Serviços</h4>
            <div className="flex flex-col gap-2">
              {['Fotografia Profissional', 'Ensaios Fotográficos', 'Marketing Digital', 'Produção de Conteúdo', 'Criação de Sites', 'Personalização'].map(s =>
                <span key={s} className="text-sm text-white/60">{s}</span>)}
            </div>
          </div>
          <div>
            <h4 className="text-sm text-white/40 uppercase tracking-wider mb-4">Contato</h4>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-accent hover:text-white transition-colors mb-3">
              <Phone size={15} /> {data.whatsappDisplay}
            </a>
            <a href={`mailto:${data.email}`} className="flex items-center gap-2 text-sm text-white/60 hover:text-accent transition-colors mb-5">
              <Mail size={15} /> {data.email}
            </a>
            <div className="flex gap-4">
              <a href={data.instagram} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent transition-colors"><IgIcon size={20} /></a>
              <a href={data.youtube} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent transition-colors"><YtIcon size={20} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} Vibe Fotos. Todos os direitos reservados.</p>
          <button onClick={onAdmin}
            className="flex items-center gap-1.5 text-xs text-white/35 hover:text-accent transition-colors"
            title="Abrir painel de administração">
            <Settings size={12} /> Área administrativa
          </button>
          <p className="text-xs text-white/30">Desenvolvido por Giovana</p>
        </div>
      </div>
    </footer>
  );
}

function WaFloat() {
  const { data } = useSite();
  const waUrl = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(data.whatsappMsg)}`;
  return (
    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-float animate-pulse-whatsapp" aria-label="WhatsApp">
      <MessageCircle size={32} className="text-white" />
    </a>
  );
}

// SVG Icons
const IgIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);
const YtIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// ─── PAINEL ADMIN ─────────────────────────────────────────────────────────────

type AdminTab = 'fotos' | 'textos' | 'contato' | 'servicos' | 'personalizacao' | 'nuvem' | 'senha';

function AdminPanel({ onClose, sync, setSync }: { onClose: () => void; sync: SyncState; setSync: (s: SyncState) => void }) {
  const { data, setData } = useSite();
  const [tab, setTab] = useState<AdminTab>('fotos');
  const [saved, setSaved] = useState(false);
  const [local, setLocal] = useState<SiteData>(data);

  const save = async () => {
    setData(local);
    saveData(local);
    setSaved(true);
    if (getCfg().enabled) {
      setSync('syncing');
      const r = await pushRemote(local);
      setSync(r.ok ? 'ok' : 'err');
    }
    setTimeout(() => setSaved(false), 2000);
  };

  const set = (patch: Partial<SiteData>) => setLocal(prev => ({ ...prev, ...patch }));

  const tabs: { id: AdminTab; label: string; icon: typeof Image }[] = [
    { id: 'fotos', label: 'Fotos', icon: Image },
    { id: 'textos', label: 'Textos', icon: Type },
    { id: 'contato', label: 'Contato', icon: Link },
    { id: 'servicos', label: 'Vitrine', icon: Palette },
    { id: 'personalizacao', label: 'Produtos', icon: Gift },
    { id: 'nuvem', label: 'Nuvem', icon: Cloud },
    { id: 'senha', label: 'Senha', icon: Lock },
  ];

  const syncLabel = { local: 'Somente neste navegador', syncing: 'Sincronizando…', ok: 'Nuvem conectada', err: 'Nuvem: erro — salvo só aqui' }[sync];
  const syncCls = {
    local: 'text-white/35 border-white/10',
    syncing: 'text-amber-300 border-amber-300/30',
    ok: 'text-emerald-400 border-emerald-400/30',
    err: 'text-red-400 border-red-400/30',
  }[sync];

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-white/10 bg-[#111] shrink-0">
        <div className="flex items-center gap-3">
          <Settings size={20} className="text-accent" />
          <span className="font-playfair text-lg text-white">Painel Admin</span>
          <span className="text-white/30 text-sm hidden md:block">— Vibe Fotos</span>
          <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs ${syncCls}`}>
            <Cloud size={12} /> {syncLabel}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={save} disabled={sync === 'syncing'}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all disabled:opacity-60 ${saved ? 'bg-green-600 text-white' : 'bg-accent text-[#0a0a0a] hover:opacity-90'}`}>
            {sync === 'syncing' ? <><span className="w-3.5 h-3.5 border-2 border-[#0a0a0a]/40 border-t-[#0a0a0a] rounded-full animate-spin" /> Enviando…</> : saved ? <><Check size={15} /> Salvo!</> : <><Save size={15} /> Salvar</>}
          </button>
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/30 transition-all">
            <Eye size={15} /> Ver site
          </button>
          <button onClick={() => { sessionStorage.removeItem(AUTH_KEY); onClose(); }} className="p-2 text-white/40 hover:text-red-400 transition-colors" title="Sair">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 md:px-8 py-3 border-b border-white/10 bg-[#111] overflow-x-auto shrink-0">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-accent text-[#0a0a0a]' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 md:p-8">
        {tab === 'fotos' && <TabFotos local={local} set={set} />}
        {tab === 'textos' && <TabTextos local={local} set={set} />}
        {tab === 'contato' && <TabContato local={local} set={set} />}
        {tab === 'servicos' && <TabServicos local={local} set={set} />}
        {tab === 'personalizacao' && <TabPersonalizacao local={local} set={set} />}
        {tab === 'nuvem' && <TabNuvem sync={sync} setSync={setSync} />}
        {tab === 'senha' && <TabSenha />}
      </div>

      {/* Bottom save bar */}
      <div className="border-t border-white/10 px-5 md:px-8 py-4 bg-[#111] shrink-0 flex items-center justify-between">
        <p className="text-xs text-white/30">
          {getCfg().enabled
            ? 'Nuvem ligada — ao salvar, as alterações vão para o banco e aparecem para todos.'
            : 'Nuvem desligada — as alterações ficam neste navegador. Ligue em "Nuvem" para todos verem.'}
        </p>
        <button onClick={save}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${saved ? 'bg-green-600 text-white' : 'bg-accent text-[#0a0a0a] hover:opacity-90'}`}>
          {saved ? <><Check size={15} /> Salvo!</> : <><Save size={15} /> Salvar tudo</>}
        </button>
      </div>
    </div>
  );
}

// Componentes de UI do painel
const inp = "w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-accent/60 transition-colors placeholder:text-white/25";
const label = "block text-xs text-white/45 uppercase tracking-wider mb-1.5";
const section = "bg-[#141414] border border-white/[0.07] rounded-xl p-6 mb-5";

function Field({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className={label}>{title}</p>
      {children}
      {hint && <p className="text-[11px] text-white/25 mt-1">{hint}</p>}
    </div>
  );
}

function ImgField({ title, value, onChange }: { title: string; value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { alert('Arquivo muito grande. Use imagens até 8MB.'); return; }
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-4">
      <p className={label}>{title}</p>
      <div className="flex gap-2">
        <input className={`${inp} flex-1`} value={value} onChange={e => onChange(e.target.value)} placeholder="URL da imagem ou faça upload abaixo" />
        <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-4 py-3 bg-accent/10 border border-accent/30 rounded-lg text-accent text-sm hover:bg-accent/20 transition-colors whitespace-nowrap">
          <Upload size={15} /> Upload
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>
      {value && <img src={value} alt="" className="mt-2 h-24 w-auto rounded-lg object-cover border border-white/10" />}
    </div>
  );
}

// ─── ABA FOTOS ───────────────────────────────────────────────────────────────

function TabFotos({ local, set }: { local: SiteData; set: (p: Partial<SiteData>) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const addImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const cats = ['retrato', 'moda', 'evento', 'lifestyle', 'corporativo', 'casamento'];
    let idx = (local.portfolioImages[local.portfolioImages.length - 1]?.id || 0) + 1;
    const news: PortfolioImage[] = [];
    let done = 0;
    files.forEach(file => {
      if (file.size > 8 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = ev => {
        news.push({ id: idx++, src: ev.target?.result as string, category: cats[Math.floor(Math.random() * cats.length)], alt: file.name.replace(/\.[^.]+$/, '') });
        done++;
        if (done === files.length) set({ portfolioImages: [...local.portfolioImages, ...news] });
      };
      reader.readAsDataURL(file);
    });
  };

  const update = (id: number, patch: Partial<PortfolioImage>) =>
    set({ portfolioImages: local.portfolioImages.map(i => i.id === id ? { ...i, ...patch } : i) });
  const remove = (id: number) =>
    set({ portfolioImages: local.portfolioImages.filter(i => i.id !== id) });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-playfair text-2xl text-white">Galeria de fotos</h2>
          <p className="text-white/40 text-sm mt-1">{local.portfolioImages.length} fotos · arraste para reordenar · até 8MB por imagem</p>
        </div>
        <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 btn-primary !py-2.5 !px-5 !text-sm">
          <Plus size={16} /> Adicionar fotos
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={addImages} />
      </div>

      {/* Hero image */}
      <div className={section}>
        <h3 className="text-accent text-xs uppercase tracking-wider font-medium mb-4">Imagem principal (Hero)</h3>
        <ImgField title="Foto do Hero (tela cheia)" value={local.heroImage} onChange={v => set({ heroImage: v })} />
      </div>

      {/* About image */}
      <div className={section}>
        <h3 className="text-accent text-xs uppercase tracking-wider font-medium mb-4">Foto — Seção Quem Sou</h3>
        <ImgField title="Foto da Giovana" value={local.aboutImage} onChange={v => set({ aboutImage: v })} />
      </div>

      {/* Portfolio grid */}
      <div className={section}>
        <h3 className="text-accent text-xs uppercase tracking-wider font-medium mb-4">Fotos do portfólio</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {local.portfolioImages.map(img => (
            <div key={img.id} className="relative group bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/[0.06]">
              <div className="aspect-square">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5 gap-1.5">
                <input value={img.alt} onChange={e => update(img.id, { alt: e.target.value })}
                  className="w-full bg-black/70 border border-white/20 rounded px-2 py-1 text-white text-[11px] focus:outline-none" placeholder="Descrição" />
                <select value={img.category} onChange={e => update(img.id, { category: e.target.value })}
                  className="w-full bg-black/70 border border-white/20 rounded px-2 py-1 text-white text-[11px] focus:outline-none">
                  {['retrato', 'moda', 'evento', 'casamento', 'corporativo', 'lifestyle', 'gestante'].map(c =>
                    <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={() => remove(img.id)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button onClick={() => fileRef.current?.click()}
            className="aspect-square border-2 border-dashed border-white/15 rounded-lg flex flex-col items-center justify-center gap-2 text-white/30 hover:text-accent hover:border-accent/40 transition-colors">
            <Plus size={28} /><span className="text-xs">Adicionar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ABA TEXTOS ───────────────────────────────────────────────────────────────

function TabTextos({ local, set }: { local: SiteData; set: (p: Partial<SiteData>) => void }) {
  return (
    <div>
      <h2 className="font-playfair text-2xl text-white mb-6">Textos do site</h2>

      <div className={section}>
        <h3 className="text-accent text-xs uppercase tracking-wider font-medium mb-4">Hero — Primeira tela</h3>
        <Field title="Frase pequena (tagline)"><input className={inp} value={local.heroTagline} onChange={e => set({ heroTagline: e.target.value })} /></Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field title="Título linha 1"><input className={inp} value={local.heroTitle} onChange={e => set({ heroTitle: e.target.value })} /></Field>
          <Field title="Título linha 2 (destaque em cor)"><input className={inp} value={local.heroAccent} onChange={e => set({ heroAccent: e.target.value })} /></Field>
        </div>
        <Field title="Subtítulo / Proposta de valor"><textarea className={inp} rows={3} value={local.heroSubtitle} onChange={e => set({ heroSubtitle: e.target.value })} /></Field>
      </div>

      <div className={section}>
        <h3 className="text-accent text-xs uppercase tracking-wider font-medium mb-4">Quem Sou</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field title="Título principal"><input className={inp} value={local.aboutTitle} onChange={e => set({ aboutTitle: e.target.value })} /></Field>
          <Field title="Subtítulo (nome)"><input className={inp} value={local.aboutSubtitle} onChange={e => set({ aboutSubtitle: e.target.value })} /></Field>
        </div>
        <Field title="Frase de papel / função"><input className={inp} value={local.aboutRole} onChange={e => set({ aboutRole: e.target.value })} /></Field>
        <Field title="Parágrafo 1"><textarea className={inp} rows={3} value={local.aboutText1} onChange={e => set({ aboutText1: e.target.value })} /></Field>
        <Field title="Parágrafo 2"><textarea className={inp} rows={3} value={local.aboutText2} onChange={e => set({ aboutText2: e.target.value })} /></Field>
        <Field title="Parágrafo 3"><textarea className={inp} rows={3} value={local.aboutText3} onChange={e => set({ aboutText3: e.target.value })} /></Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field title="Citação — linha 1"><input className={inp} value={local.aboutQuote} onChange={e => set({ aboutQuote: e.target.value })} /></Field>
          <Field title="Citação — linha 2 (destaque)"><input className={inp} value={local.aboutQuoteAccent} onChange={e => set({ aboutQuoteAccent: e.target.value })} /></Field>
        </div>
      </div>

      <div className={section}>
        <h3 className="text-accent text-xs uppercase tracking-wider font-medium mb-4">Marketing</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field title="Título"><input className={inp} value={local.marketingTitle} onChange={e => set({ marketingTitle: e.target.value })} /></Field>
          <Field title="Subtítulo em itálico"><input className={inp} value={local.marketingSubtitle} onChange={e => set({ marketingSubtitle: e.target.value })} /></Field>
        </div>
        <Field title="Parágrafo 1"><textarea className={inp} rows={2} value={local.marketingText1} onChange={e => set({ marketingText1: e.target.value })} /></Field>
        <Field title="Parágrafo 2"><textarea className={inp} rows={2} value={local.marketingText2} onChange={e => set({ marketingText2: e.target.value })} /></Field>
      </div>

      <div className={section}>
        <h3 className="text-accent text-xs uppercase tracking-wider font-medium mb-4">Personalização</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field title="Título"><input className={inp} value={local.personalizacaoTitle} onChange={e => set({ personalizacaoTitle: e.target.value })} /></Field>
          <Field title="Subtítulo"><input className={inp} value={local.personalizacaoSubtitle} onChange={e => set({ personalizacaoSubtitle: e.target.value })} /></Field>
        </div>
      </div>

      <div className={section}>
        <h3 className="text-accent text-xs uppercase tracking-wider font-medium mb-4">Contato</h3>
        <Field title="Título"><input className={inp} value={local.contatoTitle} onChange={e => set({ contatoTitle: e.target.value })} /></Field>
        <Field title="Texto de apoio"><textarea className={inp} rows={3} value={local.contatoText} onChange={e => set({ contatoText: e.target.value })} /></Field>
        <Field title="Frase de impacto (citação)"><input className={inp} value={local.contatoQuote} onChange={e => set({ contatoQuote: e.target.value })} /></Field>
      </div>
    </div>
  );
}

// ─── ABA CONTATO ──────────────────────────────────────────────────────────────

function TabContato({ local, set }: { local: SiteData; set: (p: Partial<SiteData>) => void }) {
  return (
    <div>
      <h2 className="font-playfair text-2xl text-white mb-6">Contato & Redes Sociais</h2>

      <div className={section}>
        <h3 className="text-accent text-xs uppercase tracking-wider font-medium mb-4">WhatsApp</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field title="Número (só dígitos, com DDI)">
            <input className={inp} value={local.whatsapp} onChange={e => set({ whatsapp: e.target.value.replace(/\D/g, '') })} placeholder="5531991860038" />
          </Field>
          <Field title="Como aparece no site">
            <input className={inp} value={local.whatsappDisplay} onChange={e => set({ whatsappDisplay: e.target.value })} placeholder="(31) 99186-0038" />
          </Field>
        </div>
        <Field title="Mensagem automática quando clicar no botão">
          <textarea className={inp} rows={3} value={local.whatsappMsg} onChange={e => set({ whatsappMsg: e.target.value })} />
        </Field>
      </div>

      <div className={section}>
        <h3 className="text-accent text-xs uppercase tracking-wider font-medium mb-4">E-mail</h3>
        <Field title="E-mail de contato">
          <input className={inp} value={local.email} onChange={e => set({ email: e.target.value })} />
        </Field>
      </div>

      <div className={section}>
        <h3 className="text-accent text-xs uppercase tracking-wider font-medium mb-4">Redes Sociais</h3>
        <Field title="Instagram (URL completa)">
          <input className={inp} value={local.instagram} onChange={e => set({ instagram: e.target.value })} placeholder="https://instagram.com/vibefotos" />
        </Field>
        <Field title="YouTube (URL completa)">
          <input className={inp} value={local.youtube} onChange={e => set({ youtube: e.target.value })} placeholder="https://youtube.com/@vibefotos" />
        </Field>
        <Field title="TikTok (URL completa)">
          <input className={inp} value={local.tiktok} onChange={e => set({ tiktok: e.target.value })} placeholder="https://tiktok.com/@vibefotos" />
        </Field>
      </div>
    </div>
  );
}

// ─── ABA VITRINE (SERVIÇOS) ───────────────────────────────────────────────────

function TabServicos({ local, set }: { local: SiteData; set: (p: Partial<SiteData>) => void }) {
  const update = (i: number, patch: Partial<ServiceCategory>) =>
    set({ serviceCategories: local.serviceCategories.map((s, j) => j === i ? { ...s, ...patch } : s) });

  return (
    <div>
      <h2 className="font-playfair text-2xl text-white mb-2">Vitrine de serviços</h2>
      <p className="text-white/40 text-sm mb-6">Os 4 cards da seção "Uma Experiência, Muitas Vibes".</p>
      {local.serviceCategories.map((s, i) => (
        <div key={i} className={section}>
          <h3 className="text-accent text-xs uppercase tracking-wider font-medium mb-4">Card {i + 1} — {s.title}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field title="Título do card"><input className={inp} value={s.title} onChange={e => update(i, { title: e.target.value })} /></Field>
            <Field title="Subtítulo"><input className={inp} value={s.subtitle} onChange={e => update(i, { subtitle: e.target.value })} /></Field>
          </div>
          <ImgField title="Imagem de fundo" value={s.image} onChange={v => update(i, { image: v })} />
        </div>
      ))}
    </div>
  );
}

// ─── ABA PERSONALIZAÇÃO ───────────────────────────────────────────────────────

function TabPersonalizacao({ local, set }: { local: SiteData; set: (p: Partial<SiteData>) => void }) {
  const update = (i: number, patch: Partial<PersonalizationItem>) =>
    set({ personalizationItems: local.personalizationItems.map((p, j) => j === i ? { ...p, ...patch } : p) });
  const remove = (i: number) =>
    set({ personalizationItems: local.personalizationItems.filter((_, j) => j !== i) });
  const add = () =>
    set({ personalizationItems: [...local.personalizationItems, { name: 'Novo produto', image: '' }] });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-playfair text-2xl text-white">Produtos de personalização</h2>
          <p className="text-white/40 text-sm mt-1">Cards exibidos na seção Personalização.</p>
        </div>
        <button onClick={add} className="flex items-center gap-2 btn-primary !py-2.5 !px-5 !text-sm"><Plus size={16} /> Adicionar</button>
      </div>

      <div className={section}>
        <h3 className="text-accent text-xs uppercase tracking-wider font-medium mb-4">Imagem de fundo da seção</h3>
        <ImgField title="Banner de fundo" value={local.personalizacaoImage} onChange={v => set({ personalizacaoImage: v })} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {local.personalizationItems.map((item, i) => (
          <div key={i} className="bg-[#141414] border border-white/[0.07] rounded-xl overflow-hidden">
            <div className="relative h-36">
              {item.image
                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-white/20"><Image size={32} /></div>}
              <button onClick={() => remove(i)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <Field title="Nome do produto"><input className={inp} value={item.name} onChange={e => update(i, { name: e.target.value })} /></Field>
              <div>
                <p className={label}>URL da imagem ou upload</p>
                <div className="flex gap-2">
                  <input className={`${inp} flex-1`} value={item.image} onChange={e => update(i, { image: e.target.value })} placeholder="https://..." />
                  <label className="flex items-center justify-center w-10 h-10 bg-accent/10 border border-accent/30 rounded-lg text-accent cursor-pointer hover:bg-accent/20 transition-colors shrink-0">
                    <Upload size={15} />
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      const file = e.target.files?.[0]; if (!file) return;
                      const reader = new FileReader();
                      reader.onload = ev => update(i, { image: ev.target?.result as string });
                      reader.readAsDataURL(file);
                    }} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ABA NUVEM (Supabase — persistência real) ───────────────────────────────

function TabNuvem({ sync, setSync }: { sync: SyncState; setSync: (s: SyncState) => void }) {
  const [cfg, setCfgL] = useState<BackendCfg>(() => getCfg());
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const apply = (next: BackendCfg) => {
    setCfgL(next);
    setCfg(next);
  };

  const test = async () => {
    const withEnabled = { ...cfg, enabled: true };
    apply(withEnabled);
    setTesting(true);
    const r = await testConnection();
    setTesting(false);
    setResult(r);
    if (r.ok) setSync('ok');
    else setSync('local');
  };

  const toggle = (enabled: boolean) => {
    apply({ ...cfg, enabled });
    setResult(null);
    setSync(enabled ? 'local' : 'local');
  };

  const copySql = async () => {
    try {
      await navigator.clipboard.writeText(SETUP_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponível */
    }
  };

  const status = {
    local: { label: 'Nuvem desligada — as alterações ficam só neste navegador.', cls: 'text-white/40 border-white/10' },
    syncing: { label: 'Enviando para a nuvem…', cls: 'text-amber-300 border-amber-300/30' },
    ok: { label: 'Nuvem conectada — suas alterações aparecem para todos os visitantes.', cls: 'text-emerald-400 border-emerald-400/30' },
    err: { label: 'Erro ao sincronizar — verifique URL e chave. Fica salvo neste navegador.', cls: 'text-red-400 border-red-400/30' },
  }[sync];

  return (
    <div className="max-w-3xl">
      <h2 className="font-playfair text-2xl text-white mb-2">Nuvem — dados visíveis para todos</h2>
      <p className="text-white/40 text-sm mb-6">
        Conecte um banco <strong className="text-white/60">Supabase (gratuito)</strong> para que o que você
        salvar no painel apareça no site de <em>qualquer pessoa, em qualquer dispositivo</em>.
      </p>

      <div className={`mb-5 px-4 py-3 rounded-lg border text-sm ${status.cls}`}>
        <span className="inline-flex items-center gap-2"><Cloud size={14} /> {status.label}</span>
      </div>

      <div className={section}>
        <h3 className="text-accent text-xs uppercase tracking-wider font-medium mb-4">1. Identificação do projeto Supabase</h3>
        <Field title="Project URL" hint="Fica em Settings → API, no formato https://xxxx.supabase.co">
          <input className={inp} value={cfg.url} onChange={e => setCfgL({ ...cfg, url: e.target.value })} placeholder="https://meuprojeto.supabase.co" />
        </Field>
        <Field title="Chave anon pública" hint="A mesma página (Settings → API) — começa com eyJ…">
          <input className={inp} value={cfg.key} onChange={e => setCfgL({ ...cfg, key: e.target.value })} placeholder="eyJhbGciOi…" />
        </Field>
        <div className="flex items-center justify-between flex-wrap gap-3 mt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={cfg.enabled} onChange={e => toggle(e.target.checked)} className="w-4 h-4 accent-[#C4AFA0]" />
            <span className="text-sm text-white/70">Usar nuvem (Plano B)</span>
          </label>
          <button onClick={test} disabled={testing} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/15 border border-accent/40 text-accent text-sm hover:bg-accent/25 transition-colors disabled:opacity-50">
            <Database size={15} /> {testing ? 'Testando…' : 'Testar conexão'}
          </button>
        </div>
        {result && (
          <p className={`mt-4 text-sm ${result.ok ? 'text-emerald-400' : 'text-red-400'}`}>
            {result.ok ? '✓ ' : '✗ '}{result.msg}
          </p>
        )}
      </div>

      <div className={section}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-accent text-xs uppercase tracking-wider font-medium">2. Criar a tabela (uma vez só)</h3>
          <button onClick={copySql} className="flex items-center gap-1.5 text-xs text-white/50 hover:text-accent transition-colors">
            {copied ? <><Check size={13} /> Copiado!</> : <><Copy size={13} /> Copiar código</>}
          </button>
        </div>
        <p className="text-white/45 text-sm mb-3">
          No seu projeto Supabase, abra <strong className="text-white/60">SQL Editor</strong>, cole o código abaixo e clique em <strong className="text-white/60">Run</strong>:
        </p>
        <pre className="bg-black/50 border border-white/10 rounded-lg p-4 text-[12px] text-white/70 overflow-x-auto leading-relaxed">{SETUP_SQL}</pre>
      </div>

      <div className="bg-[#141414] border border-white/[0.07] rounded-xl p-5 text-sm text-white/50 space-y-2">
        <p className="text-accent font-medium text-xs uppercase tracking-wider">Passo a passo</p>
        <p>1. Crie uma conta gratuita em <strong className="text-white/70">supabase.com</strong> e crie um novo projeto.</p>
        <p>2. Abra o <strong className="text-white/70">SQL Editor</strong>, cole o código acima e execute (Run).</p>
        <p>3. Em <strong className="text-white/70">Settings → API</strong>, copie o Project URL e a chave anon.</p>
        <p>4. Cole aqui em cima, ative a nuvem e clique em <strong className="text-white/70">Testar conexão</strong>.</p>
        <p>5. Feche o teste e clique em <strong className="text-white/70">Salvar</strong> — a partir daí, todo visitante verá suas alterações.</p>
        <p className="pt-2 text-white/35 text-xs">
          Dica: fotos enviadas por upload ficam guardadas como código (base64) e ocupam espaço.
          Para muitas fotos, prefira enviar a URL de uma imagem hospedada (o painel aceita as duas formas).
        </p>
      </div>
    </div>
  );
}

// ─── ABA SENHA ────────────────────────────────────────────────────────────────

function TabSenha() {
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [conf, setConf] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [showCur, setShowCur] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const change = () => {
    setMsg(null);
    if (cur !== getPassword()) return setMsg({ ok: false, text: 'Senha atual incorreta.' });
    if (next.length < 6) return setMsg({ ok: false, text: 'A nova senha precisa ter pelo menos 6 caracteres.' });
    if (next !== conf) return setMsg({ ok: false, text: 'A confirmação não confere.' });
    localStorage.setItem(PASS_KEY, next);
    setCur(''); setNext(''); setConf('');
    setMsg({ ok: true, text: 'Senha alterada com sucesso!' });
  };

  return (
    <div className="max-w-md">
      <h2 className="font-playfair text-2xl text-white mb-2">Segurança</h2>
      <p className="text-white/40 text-sm mb-6">Senha padrão: <span className="text-accent font-mono">vibe2025</span> — altere aqui para proteger o painel.</p>

      <div className={section}>
        <Field title="Senha atual">
          <div className="relative">
            <input type={showCur ? 'text' : 'password'} className={inp} value={cur} onChange={e => setCur(e.target.value)} placeholder="••••••••" />
            <button type="button" onClick={() => setShowCur(!showCur)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
              {showCur ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>
        <Field title="Nova senha">
          <div className="relative">
            <input type={showNext ? 'text' : 'password'} className={inp} value={next} onChange={e => setNext(e.target.value)} placeholder="Mínimo 6 caracteres" />
            <button type="button" onClick={() => setShowNext(!showNext)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
              {showNext ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>
        <Field title="Confirmar nova senha">
          <input type="password" className={inp} value={conf} onChange={e => setConf(e.target.value)} placeholder="Repita a nova senha" />
        </Field>
        {msg && <p className={`text-sm mb-4 ${msg.ok ? 'text-green-400' : 'text-red-400'}`}>{msg.text}</p>}
        <button onClick={change} className="btn-primary flex items-center gap-2 !py-3 !px-6">
          <Lock size={16} /> Alterar senha
        </button>
      </div>

      <div className="bg-[#141414] border border-accent/20 rounded-xl p-5 text-sm text-white/50 space-y-2">
        <p className="text-accent font-medium text-xs uppercase tracking-wider">Como acessar o painel</p>
        <p>No site, clique em <strong className="text-white/70">"Admin"</strong> no canto superior direito do menu — ou no menu mobile no rodapé do menu.</p>
        <p>A sessão dura enquanto o navegador estiver aberto. Feche e abra para precisar fazer login novamente.</p>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────

function Login({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === getPassword()) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      onOk();
    } else {
      setErr('Senha incorreta. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-playfair text-3xl text-white mb-2">VIBE FOTOS</p>
          <p className="text-accent text-sm tracking-widest">PAINEL ADMINISTRATIVO</p>
        </div>
        <form onSubmit={submit} className="bg-[#141414] border border-white/[0.08] rounded-2xl p-7">
          <Field title="Senha de acesso">
            <div className="relative">
              <input type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} className={inp} placeholder="••••••••" autoFocus />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>
          {err && <p className="text-red-400 text-sm mb-4">{err}</p>}
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            <Lock size={16} /> Entrar no painel
          </button>
          <p className="text-center text-xs text-white/25 mt-4">Senha padrão: <span className="font-mono text-white/40">vibe2025</span></p>
        </form>
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────

export default function App() {
  const [data, setData] = useState<SiteData>(loadData);
  const [adminOpen, setAdminOpen] = useState(false);
  const [needLogin, setNeedLogin] = useState(false);
  const [sync, setSync] = useState<SyncState>('local');

  // Plano B: ao carregar, se a nuvem estiver ligada, busca os dados do banco
  useEffect(() => {
    if (!getCfg().enabled) return;
    (async () => {
      const remote = await fetchRemote();
      if (remote) {
        setData(remote);
        saveData(remote);
        setSync('ok');
      }
    })();
  }, []);

  const openAdmin = () => {
    if (isAuthed()) setAdminOpen(true);
    else setNeedLogin(true);
  };

  return (
    <SiteCtx.Provider value={{ data, setData }}>
      <div className="min-h-screen bg-background">
        <div className="grain-overlay" />
        <Header onAdmin={openAdmin} />
        <main>
          <Hero />
          <ServicesOverview />
          <Portfolio />
          <About />
          <Marketing />
          <Personalizacao />
          <Investimentos />
          <Contato />
        </main>
        <Footer onAdmin={openAdmin} />
        <WaFloat />

        {needLogin && (
          <Login onOk={() => { setNeedLogin(false); setAdminOpen(true); }} />
        )}
        {adminOpen && !needLogin && (
          <AdminPanel onClose={() => setAdminOpen(false)} sync={sync} setSync={setSync} />
        )}
      </div>
    </SiteCtx.Provider>
  );
}
