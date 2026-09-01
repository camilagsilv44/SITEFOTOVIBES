import { useMemo, useState } from 'react';
import { Link } from '../lib/router';
import { useCms, photoById, publishedGalleries, publishedServices, publishedTestimonials, featuredPhotos } from '../lib/store';
import { useHead } from '../lib/head';
import { orgLd, reviewsLd, breadcrumbLd } from '../lib/seo';
import { SmartImage, Reveal, SectionHead, Stars, Lightbox } from '../components/ui';
import { WaButton } from '../components/Layout';
import { track } from '../lib/analytics';

export default function Home() {
  const d = useCms();
  const h = d.settings.home;
  const hero = photoById(d, h.heroPhotoId) || d.photos[0];
  const galleries = publishedGalleries(d).filter((g) => g.featured).slice(0, 4);
  const services = publishedServices(d).slice(0, 6);
  const testimonials = publishedTestimonials(d);
  const strip = useMemo(() => featuredPhotos(d).slice(0, 10), [d]);
  const [lb, setLb] = useState<number | null>(null);

  useHead(
    {
      title: `${d.settings.brand} | ${d.settings.tagline} — Fotografia autoral em BH`,
      description: d.settings.valueProp.slice(0, 158),
      path: '/',
      ogImage: hero?.sources.lg,
      jsonLd: [
        orgLd(d),
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: d.settings.brand,
          url: d.settings.siteUrl,
          inLanguage: 'pt-BR',
        },
        breadcrumbLd(d, [{ name: 'Início', path: '/' }]),
        reviewsLd(d),
      ].filter(Boolean) as Record<string, unknown>[],
    },
    d
  );

  return (
    <>
      {/* ------------------------------- HERO ------------------------------- */}
      <section className="relative min-h-[92svh] w-full overflow-hidden bg-[var(--color-ink)]">
        <SmartImage
          photo={hero}
          priority
          sizes="100vw"
          zoom={false}
          ratio="auto"
          className="absolute inset-0 h-full w-full"
          imgClassName="!h-full !w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70" />
        <div className="wrap relative flex min-h-[92svh] flex-col justify-end pb-16 pt-32 md:pb-24">
          <div className="max-w-3xl">
            <p className="eyebrow !text-[var(--color-bronze-soft)] animate-[fadeUp_.9s_ease_both]">{h.heroKicker}</p>
            <h1
              className="display mt-5 text-[clamp(2.6rem,1.6rem+6vw,6rem)] text-white"
              style={{ animation: 'fadeUp .9s cubic-bezier(.22,.7,.24,1) .08s both' }}
            >
              {h.heroTitle}
            </h1>
            <p
              className="mt-6 max-w-xl text-[clamp(1rem,.95rem+.3vw,1.15rem)] leading-relaxed text-white/85"
              style={{ animation: 'fadeUp .9s cubic-bezier(.22,.7,.24,1) .18s both' }}
            >
              {h.heroSubtitle}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row" style={{ animation: 'fadeUp .9s cubic-bezier(.22,.7,.24,1) .28s both' }}>
              <WaButton variant="bronze" location="hero" event="quote_request">
                {h.ctaPrimary}
              </WaButton>
              <Link to="/portfolio" className="btn btn-light">
                {h.ctaSecondary}
              </Link>
            </div>
            <p className="mt-8 text-[12.5px] tracking-[.16em] uppercase text-white/60">
              +400 ensaios realizados · Resposta em até 1 hora · {d.settings.contact.city}
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------- FEATURED STRIP -------------------------- */}
      <section aria-label="Fotografias em destaque" className="overflow-hidden border-b border-[var(--color-line)] bg-[var(--color-paper)] py-6">
        <div className="marquee">
          {[...strip, ...strip].map((p, i) => (
            <button
              key={`${p.id}-${i}`}
              onClick={() => setLb(i % strip.length)}
              className="group h-24 w-36 shrink-0 md:h-32 md:w-48"
              aria-label={`Ampliar: ${p.alt}`}
            >
              <SmartImage photo={p} sizes="200px" ratio={3 / 2} className="h-full w-full" />
            </button>
          ))}
        </div>
      </section>
      {lb !== null && <Lightbox photos={strip} index={lb} onClose={() => setLb(null)} onIndex={setLb} />}

      {/* ----------------------------- VALUE PROP ---------------------------- */}
      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">A experiência</p>
            <h2 className="display mt-4 text-[clamp(1.9rem,1.4rem+2.2vw,3rem)]">
              Fotografia que parece <em className="italic text-[var(--color-bronze)]">você</em>.
            </h2>
          </Reveal>
          <Reveal delay={80} className="lg:col-span-6 lg:col-start-7">
            <p className="lede">{d.settings.valueProp}</p>
            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-[var(--color-line)] pt-8">
              {[
                ['+400', 'ensaios realizados'],
                ['48h', 'para a prévia'],
                ['5,0', 'avaliação média'],
              ].map(([n, l]) => (
                <div key={l}>
                  <p className="display text-3xl">{n}</p>
                  <p className="mt-1 text-[12.5px] leading-snug text-[var(--color-mute)]">{l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------- PORTFOLIO ----------------------------- */}
      <section className="section bg-[var(--color-paper)]">
        <div className="wrap">
          <Reveal>
            <SectionHead
              eyebrow="Portfólio em destaque"
              title="Histórias que eu já capturei"
              text="Cada ensaio carrega uma personalidade diferente. Estas são algumas das galerias que mais representam o meu olhar."
              action={
                <Link to="/portfolio" className="btn btn-outline btn-sm">
                  Ver portfólio completo
                </Link>
              }
            />
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {galleries.map((g, i) => {
              const cover = photoById(d, g.coverPhotoId);
              const big = i % 3 === 0;
              return (
                <Reveal key={g.id} delay={i * 70} className={big ? 'md:col-span-2' : ''}>
                  <Link
                    to={`/portfolio/${g.slug}`}
                    onClick={() => track('view_item_list', { item: g.slug, list: 'home_portfolio' })}
                    className="group block"
                  >
                    <SmartImage
                      photo={cover}
                      sizes={big ? '(max-width: 768px) 100vw, 80vw' : '(max-width: 768px) 100vw, 45vw'}
                      ratio={big ? 16 / 9 : 4 / 5}
                      className="w-full"
                    />
                    <div className="mt-4 flex items-start justify-between gap-6">
                      <div>
                        <h3 className="display text-xl transition-colors group-hover:text-[var(--color-bronze)]">{g.title}</h3>
                        <p className="mt-1 text-[13px] text-[var(--color-mute)]">
                          {g.photoIds.length} fotos ·{' '}
                          {new Date(g.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <span aria-hidden="true" className="mt-1 text-[var(--color-bronze)] transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------ SERVICES ----------------------------- */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <SectionHead
              eyebrow="Tipos de ensaio"
              title="Escolha a sua experiência"
              text="Cada formato tem sua própria condução, duração e entrega. Todos incluem direção de pose e tratamento autoral."
              action={
                <Link to="/ensaios" className="btn btn-outline btn-sm">
                  Todos os ensaios
                </Link>
              }
            />
          </Reveal>

          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 70}>
                <Link
                  to={`/ensaios/${s.slug}`}
                  onClick={() => track('view_item_list', { item: s.slug, list: 'home_services' })}
                  className="group block"
                >
                  <SmartImage
                    photo={photoById(d, s.coverPhotoId)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    ratio={3 / 4}
                  />
                  <div className="mt-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="display text-xl transition-colors group-hover:text-[var(--color-bronze)]">{s.title}</h3>
                      <span className="shrink-0 text-[12px] uppercase tracking-[.14em] text-[var(--color-bronze)]">{s.priceFrom}</span>
                    </div>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">{s.excerpt}</p>
                    <p className="mt-3 text-[12px] uppercase tracking-[.14em] text-[var(--color-mute)]">{s.duration}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- DIFFERENTIALS -------------------------- */}
      <section className="section bg-[var(--color-ink)] text-[var(--color-ivory)]">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow !text-[var(--color-bronze-soft)]">Por que escolher a Vibe Fotos</p>
            <h2 className="display mt-4 max-w-3xl text-[clamp(1.9rem,1.4rem+2.4vw,3.2rem)]">
              O que muda quando alguém dirige o ensaio para você
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {h.differentials.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 70}>
                <div className="border-t border-white/15 pt-6">
                  <span className="text-[12px] tracking-[.2em] text-[var(--color-bronze-soft)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="display mt-3 text-xl">{f.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-white/65">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <div className="mt-14">
              <WaButton variant="bronze" location="differentials" event="quote_request">
                {d.settings.whatsapp.label}
              </WaButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------- STEPS ------------------------------- */}
      <section className="section bg-[var(--color-paper)]">
        <div className="wrap">
          <Reveal>
            <SectionHead eyebrow="Como funciona" title="Do primeiro oi à galeria pronta" />
          </Reveal>
          <ol className="mt-14 grid gap-8 md:grid-cols-3 lg:grid-cols-5">
            {h.steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 60}>
                <li className="list-none border-t border-[var(--color-line)] pt-5">
                  <span className="display text-[2.6rem] leading-none text-[var(--color-line)]">{i + 1}</span>
                  <h3 className="mt-3 text-[15px] font-medium">{s.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{s.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------- TESTIMONIALS --------------------------- */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <SectionHead eyebrow="Depoimentos" title="Quem já viveu a experiência" align="center" />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={(i % 2) * 80}>
                <figure className="card flex h-full flex-col gap-5 p-7">
                  <Stars n={t.rating} />
                  <blockquote className="font-[var(--font-display)] text-[17px] leading-relaxed text-[var(--color-ink)]">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 pt-2">
                    <div className="h-11 w-11 overflow-hidden rounded-full">
                      <SmartImage photo={photoById(d, t.photoId)} sizes="44px" ratio={1} zoom={false} />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium">{t.name}</p>
                      <p className="text-[12.5px] text-[var(--color-mute)]">{t.sessionType}</p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- ABOUT ------------------------------ */}
      <section className="section bg-[var(--color-sand)]">
        <div className="wrap grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SmartImage photo={photoById(d, h.aboutPhotoId)} sizes="(max-width: 1024px) 100vw, 40vw" ratio={4 / 5} />
          </Reveal>
          <Reveal delay={90} className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow">Quem está por trás da vibe</p>
            <h2 className="display mt-4 text-[clamp(1.9rem,1.4rem+2.2vw,3rem)]">{h.aboutTitle}</h2>
            <div className="mt-6 space-y-4">
              {h.aboutText.split('\n\n').map((p) => (
                <p key={p.slice(0, 24)} className="lede">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/sobre" className="btn btn-outline">
                Conhecer minha história
              </Link>
              <WaButton variant="dark" location="home-about" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ FINAL CTA ---------------------------- */}
      <section className="section bg-[var(--color-ink)] text-center text-[var(--color-ivory)]">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow !text-[var(--color-bronze-soft)]">Vamos criar juntos</p>
            <h2 className="display mx-auto mt-5 max-w-3xl text-[clamp(2.1rem,1.5rem+3.4vw,4.2rem)]">{h.finalCtaTitle}</h2>
            <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-white/70">{h.finalCtaText}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <WaButton variant="bronze" location="final-cta" event="quote_request">
                {h.ctaPrimary}
              </WaButton>
              <Link to="/contato" className="btn btn-light">
                Ver formas de contato
              </Link>
            </div>
            <p className="mt-8 text-[13px] tracking-[.14em] text-white/45">{d.settings.whatsapp.display}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
