import { useEffect, useState, type ReactNode } from 'react';
import { Link, usePath } from '../lib/router';
import { useCms, waLink, publishedServices } from '../lib/store';
import { track } from '../lib/analytics';

export const NAV = [
  { label: 'Início', to: '/' },
  { label: 'Portfólio', to: '/portfolio' },
  { label: 'Ensaios', to: '/ensaios' },
  { label: 'Sobre', to: '/sobre' },
  { label: 'Marketing', to: '/marketing' },
  { label: 'Personalização', to: '/personalizacao' },
  { label: 'Investimentos', to: '/investimentos' },
  { label: 'Contato', to: '/contato' },
];

/* ------------------------------ WhatsApp CTA ----------------------------- */

export function WaButton({
  message,
  children,
  variant = 'dark',
  className = '',
  location = 'page',
  event = 'whatsapp_click',
}: {
  message?: string;
  children?: ReactNode;
  variant?: 'dark' | 'outline' | 'light' | 'bronze';
  className?: string;
  location?: string;
  event?: string;
}) {
  const d = useCms();
  return (
    <a
      href={waLink(d, message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track(event, { location, channel: 'whatsapp' })}
      className={`btn btn-${variant} ${className}`}
    >
      {children || d.settings.whatsapp.label}
    </a>
  );
}

/* --------------------------------- Header -------------------------------- */

export function Header({ overlay = false }: { overlay?: boolean }) {
  const d = useCms();
  const path = usePath();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const solid = scrolled || !overlay || open;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2"
      >
        Pular para o conteúdo
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid ? 'bg-[var(--color-ivory)]/92 backdrop-blur-md border-b border-[var(--color-line)]' : 'border-b border-transparent'
        }`}
      >
        <div className={`wrap flex items-center justify-between transition-all ${scrolled ? 'py-3' : 'py-5'}`}>
          <Link
            to="/"
            aria-label={`${d.settings.brand} — início`}
            className={`display text-[19px] tracking-[.02em] ${solid ? 'text-[var(--color-ink)]' : 'text-white'}`}
          >
            {d.settings.brand}
            <span className="text-[var(--color-bronze)]">.</span>
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                aria-current={path === n.to ? 'page' : undefined}
                className={`ulink text-[13px] tracking-wide transition-colors ${
                  solid ? 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]' : 'text-white/85 hover:text-white'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <WaButton className="btn-sm hidden md:inline-flex" variant={solid ? 'dark' : 'light'} location="header">
              {d.settings.whatsapp.label}
            </WaButton>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
              className={`flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden ${
                solid ? 'text-[var(--color-ink)]' : 'text-white'
              }`}
            >
              <span
                className={`block h-[1.5px] w-6 bg-current transition-transform duration-300 ${open ? 'translate-y-[6.5px] rotate-45' : ''}`}
              />
              <span className={`block h-[1.5px] w-6 bg-current transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
              <span
                className={`block h-[1.5px] w-6 bg-current transition-transform duration-300 ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--color-ivory)] transition-all duration-500 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="wrap flex h-full flex-col justify-center gap-1 pt-16">
          {NAV.map((n, i) => (
            <Link
              key={n.to}
              to={n.to}
              className="display border-b border-[var(--color-line)] py-4 text-[clamp(1.7rem,1.2rem+3vw,2.4rem)] transition-colors hover:text-[var(--color-bronze)]"
              style={{ transitionDelay: `${i * 25}ms` }}
            >
              {n.label}
            </Link>
          ))}
          <div className="mt-8 flex flex-col gap-3">
            <WaButton variant="dark" location="mobile-menu" />
            <a href={`tel:+${d.settings.whatsapp.number}`} className="text-center text-sm text-[var(--color-ink-soft)]">
              {d.settings.whatsapp.display}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* --------------------------------- Footer -------------------------------- */

export function Footer() {
  const d = useCms();
  const services = publishedServices(d).slice(0, 6);
  const socials = [
    ['Instagram', d.settings.social.instagram],
    ['TikTok', d.settings.social.tiktok],
    ['YouTube', d.settings.social.youtube],
    ['Pinterest', d.settings.social.pinterest],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-sand)]">
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div className="lg:col-span-1">
          <p className="display text-2xl">
            {d.settings.brand}
            <span className="text-[var(--color-bronze)]">.</span>
          </p>
          <p className="mt-3 text-[15px] italic text-[var(--color-ink-soft)]">{d.settings.tagline}</p>
          <p className="mt-5 text-[13px] leading-relaxed text-[var(--color-mute)]">
            Fotografia • Marketing • Personalização • Conteúdo • Investimentos
          </p>
        </div>

        <nav aria-label="Rodapé — navegação">
          <h2 className="eyebrow mb-4">Navegação</h2>
          <ul className="space-y-2.5 text-[14px] text-[var(--color-ink-soft)]">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="ulink hover:text-[var(--color-ink)]">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Rodapé — ensaios">
          <h2 className="eyebrow mb-4">Ensaios</h2>
          <ul className="space-y-2.5 text-[14px] text-[var(--color-ink-soft)]">
            {services.map((s) => (
              <li key={s.id}>
                <Link to={`/ensaios/${s.slug}`} className="ulink hover:text-[var(--color-ink)]">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow mb-4">Contato</h2>
          <a
            href={waLink(d)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('whatsapp_click', { location: 'footer' })}
            className="display text-2xl hover:text-[var(--color-bronze)]"
          >
            {d.settings.whatsapp.display}
          </a>
          <p className="mt-3 text-[14px] text-[var(--color-ink-soft)]">{d.settings.contact.email}</p>
          <p className="text-[14px] text-[var(--color-mute)]">{d.settings.contact.city}</p>
          <p className="text-[13px] text-[var(--color-mute)]">{d.settings.contact.hours}</p>
          <ul className="mt-5 flex flex-wrap gap-4 text-[13px]">
            {socials.map(([label, url]) => (
              <li key={label}>
                <a href={url} target="_blank" rel="noopener noreferrer me" className="ulink text-[var(--color-ink-soft)]">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-line)]">
        <div className="wrap flex flex-col items-center justify-between gap-3 py-6 text-[12px] text-[var(--color-mute)] md:flex-row">
          <p>
            © {new Date().getFullYear()} {d.settings.brand}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/contato" className="ulink">
              Solicitar orçamento
            </Link>
            <Link to="/admin" rel="nofollow" className="ulink">
              Painel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------ Floating CTA ----------------------------- */

export function WhatsAppFab() {
  const d = useCms();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 420);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <a
      href={waLink(d)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_click', { location: 'floating' })}
      className="fab"
      aria-label={`Falar com a Giovana no WhatsApp ${d.settings.whatsapp.display}`}
      style={{
        transform: show ? 'translateY(0)' : 'translateY(140%)',
        opacity: show ? 1 : 0,
        transition: 'transform .45s cubic-bezier(.22,.7,.24,1), opacity .3s',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.9-2.9-1.6-4-3.6-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.5.7.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.3-.5-.4z" />
        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
      </svg>
      <span className="hidden sm:inline">Falar no WhatsApp</span>
    </a>
  );
}

export function Shell({ children, overlayHeader = false }: { children: ReactNode; overlayHeader?: boolean }) {
  return (
    <>
      <Header overlay={overlayHeader} />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
