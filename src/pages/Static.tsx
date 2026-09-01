import { Link } from '../lib/router';
import { useCms, photoById, publishedServices, page as findPage, waLink } from '../lib/store';
import { useHead } from '../lib/head';
import { breadcrumbLd, orgLd, resolveSeo } from '../lib/seo';
import { SmartImage, Reveal, Breadcrumbs, SectionHead } from '../components/ui';
import { WaButton } from '../components/Layout';
import { track } from '../lib/analytics';
import NotFound from './NotFound';

/* --------------------------------- SOBRE --------------------------------- */

export function About() {
  const d = useCms();
  const h = d.settings.home;
  useHead(
    {
      title: `Sobre a Giovana, fotógrafa em Belo Horizonte | ${d.settings.brand}`,
      description:
        'Conheça a Giovana: fotógrafa autoral, criativa e especialista em transformar atenção em conexão. Mais de 400 ensaios em Belo Horizonte.',
      path: '/sobre',
      type: 'profile',
      ogImage: photoById(d, h.aboutPhotoId)?.sources.lg,
      jsonLd: [
        orgLd(d),
        breadcrumbLd(d, [
          { name: 'Início', path: '/' },
          { name: 'Sobre', path: '/sobre' },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Giovana',
          jobTitle: 'Fotógrafa',
          worksFor: { '@type': 'Organization', name: d.settings.brand },
          knowsAbout: ['Fotografia', 'Marketing digital', 'Produção de conteúdo'],
          address: { '@type': 'PostalAddress', addressLocality: 'Belo Horizonte', addressCountry: 'BR' },
        },
      ],
    },
    d
  );

  return (
    <>
      <div className="wrap pt-32 md:pt-40">
        <Breadcrumbs trail={[{ name: 'Início', path: '/' }, { name: 'Sobre', path: '/sobre' }]} />
      </div>

      <section className="wrap grid items-start gap-12 pb-20 lg:grid-cols-12">
        <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
          <SmartImage photo={photoById(d, h.aboutPhotoId)} priority sizes="(max-width: 1024px) 100vw, 42vw" ratio={4 / 5} />
        </Reveal>
        <Reveal delay={80} className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow">Quem está por trás da vibe</p>
          <h1 className="display mt-4 text-[clamp(2.1rem,1.6rem+2.6vw,3.6rem)]">{h.aboutTitle}</h1>
          <p className="mt-5 text-[17px] italic text-[var(--color-bronze)]">
            Fotógrafa, criativa e especialista em transformar atenção em conexão.
          </p>
          <div className="mt-7 space-y-5">
            {h.aboutText.split('\n\n').map((p) => (
              <p key={p.slice(0, 24)} className="lede">
                {p}
              </p>
            ))}
          </div>

          <blockquote className="mt-10 border-l-2 border-[var(--color-bronze)] pl-6">
            <p className="display text-[clamp(1.3rem,1.1rem+1vw,1.8rem)] leading-snug">
              Imagem. Estratégia. Movimento. Vibe.
            </p>
            <cite className="mt-2 block text-[13px] not-italic text-[var(--color-mute)]">Essa é a Vibe Fotos.</cite>
          </blockquote>

          <div className="mt-10 grid gap-6 border-t border-[var(--color-line)] pt-8 sm:grid-cols-3">
            {[
              ['8 anos', 'de estrada'],
              ['+400', 'ensaios'],
              ['BH e região', 'atendimento'],
            ].map(([a, b]) => (
              <div key={b}>
                <p className="display text-2xl">{a}</p>
                <p className="text-[12.5px] text-[var(--color-mute)]">{b}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <WaButton variant="dark" location="about" event="quote_request">
              Vamos criar algo juntos
            </WaButton>
            <Link to="/portfolio" className="btn btn-outline">
              Ver portfólio
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-[var(--color-line)] bg-[var(--color-sand)] py-16">
        <div className="wrap">
          <h2 className="display text-2xl">O que eu fotografo</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publishedServices(d).map((s) => (
              <Link key={s.id} to={`/ensaios/${s.slug}`} className="group block">
                <SmartImage photo={photoById(d, s.coverPhotoId)} sizes="33vw" ratio={3 / 2} />
                <h3 className="display mt-3 text-base transition-colors group-hover:text-[var(--color-bronze)]">{s.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------- CONTATO -------------------------------- */

export function Contact() {
  const d = useCms();
  const socials = [
    ['Instagram', d.settings.social.instagram],
    ['TikTok', d.settings.social.tiktok],
    ['YouTube', d.settings.social.youtube],
    ['Pinterest', d.settings.social.pinterest],
  ].filter(([, v]) => v) as [string, string][];

  useHead(
    {
      title: `Contato — agende seu ensaio | ${d.settings.brand}`,
      description: `Fale com a Giovana pelo WhatsApp ${d.settings.whatsapp.display} e agende seu ensaio fotográfico em Belo Horizonte.`,
      path: '/contato',
      jsonLd: [
        orgLd(d),
        breadcrumbLd(d, [
          { name: 'Início', path: '/' },
          { name: 'Contato', path: '/contato' },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contato Vibe Fotos',
          url: `${d.settings.siteUrl}/contato`,
        },
      ],
    },
    d
  );

  return (
    <>
      <section className="wrap pb-16 pt-32 md:pt-40">
        <Breadcrumbs trail={[{ name: 'Início', path: '/' }, { name: 'Contato', path: '/contato' }]} />
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">Contato</p>
            <h1 className="display mt-4 text-[clamp(2.3rem,1.7rem+3vw,4.2rem)]">Qual é a sua vibe?</h1>
            <p className="lede mt-6 max-w-xl">
              Quer fazer um ensaio, criar conteúdo para sua marca, produzir um vídeo, personalizar um projeto ou
              simplesmente conversar sobre uma ideia? Me chama — a próxima vibe pode ser a sua.
            </p>

            <a
              href={waLink(d)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('whatsapp_click', { location: 'contact-hero' })}
              className="display mt-10 block text-[clamp(2rem,1.4rem+3vw,3.4rem)] hover:text-[var(--color-bronze)]"
            >
              {d.settings.whatsapp.display}
            </a>

            <div className="mt-8 flex flex-wrap gap-3">
              <WaButton variant="dark" location="contact" event="quote_request">
                Falar com a Giovana
              </WaButton>
              <a href={`mailto:${d.settings.contact.email}`} className="btn btn-outline" onClick={() => track('form_submit', { via: 'email' })}>
                Enviar e-mail
              </a>
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="card p-7">
              <h2 className="eyebrow">Informações</h2>
              <dl className="mt-5 space-y-4 text-[14.5px]">
                <div>
                  <dt className="text-[var(--color-mute)]">WhatsApp</dt>
                  <dd>{d.settings.whatsapp.display}</dd>
                </div>
                <div>
                  <dt className="text-[var(--color-mute)]">E-mail</dt>
                  <dd className="break-all">{d.settings.contact.email}</dd>
                </div>
                <div>
                  <dt className="text-[var(--color-mute)]">Atendimento</dt>
                  <dd>{d.settings.contact.city}</dd>
                </div>
                <div>
                  <dt className="text-[var(--color-mute)]">Horário</dt>
                  <dd>{d.settings.contact.hours}</dd>
                </div>
              </dl>
              {socials.length > 0 && (
                <>
                  <h2 className="eyebrow mt-7">Redes</h2>
                  <ul className="mt-4 space-y-2 text-[14.5px]">
                    {socials.map(([label, url]) => (
                      <li key={label}>
                        <a href={url} target="_blank" rel="noopener noreferrer me" className="ulink">
                          {label} ↗
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-[var(--color-line)] bg-[var(--color-sand)] py-16">
        <div className="wrap">
          <SectionHead eyebrow="Atalhos" title="Já sabe o que quer?" />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {publishedServices(d).map((s) => (
              <WaButton
                key={s.id}
                variant="outline"
                className="btn-sm justify-between"
                message={s.ctaMessage}
                location={`contact-shortcut:${s.slug}`}
                event="quote_request"
              >
                {s.title}
              </WaButton>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------ CMS PAGE DOC ------------------------------ */

export function CmsPage({ slug }: { slug: string }) {
  const d = useCms();
  const p = findPage(d, slug);
  const seo = p ? resolveSeo(p.seo, { title: `${p.title} | ${d.settings.brand}`, description: p.intro.slice(0, 158) }) : null;

  useHead(
    {
      title: seo?.title || 'Página não encontrada',
      description: seo?.description || '',
      path: `/${slug}`,
      index: p?.published ? seo?.index : false,
      follow: seo?.follow,
      canonical: seo?.canonical,
      ogTitle: seo?.ogTitle,
      ogDescription: seo?.ogDescription,
      ogImage: photoById(d, p?.seo.ogImageId || '')?.sources.lg,
      jsonLd: p
        ? [
            breadcrumbLd(d, [
              { name: 'Início', path: '/' },
              { name: p.title, path: `/${p.slug}` },
            ]),
          ]
        : [],
    },
    d
  );

  if (!p || !p.published) return <NotFound />;

  return (
    <>
      <article className="wrap pb-16 pt-32 md:pt-40">
        <Breadcrumbs trail={[{ name: 'Início', path: '/' }, { name: p.title, path: `/${p.slug}` }]} />
        <header className="max-w-3xl">
          <p className="eyebrow">{p.title}</p>
          <h1 className="display mt-4 text-[clamp(2.1rem,1.6rem+2.8vw,3.8rem)]">{p.seo.h1 || p.title}</h1>
          <p className="lede mt-6">{p.intro}</p>
        </header>

        <div className="mt-16 space-y-16">
          {p.blocks.map((b, i) => (
            <Reveal key={`${b.heading}-${i}`}>
              <section className="grid gap-8 border-t border-[var(--color-line)] pt-10 lg:grid-cols-12">
                <h2 className="display text-[clamp(1.4rem,1.2rem+1vw,2rem)] lg:col-span-4">{b.heading}</h2>
                <div className="lg:col-span-7 lg:col-start-6">
                  {b.text && <p className="lede">{b.text}</p>}
                  {b.items.length > 0 && (
                    <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                      {b.items.map((it) => (
                        <li key={it} className="flex gap-3 text-[14.5px] text-[var(--color-ink-soft)]">
                          <span aria-hidden="true" className="text-[var(--color-bronze)]">
                            —
                          </span>
                          {it}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </article>

      <section className="border-t border-[var(--color-line)] bg-[var(--color-ink)] py-16 text-center text-[var(--color-ivory)]">
        <div className="wrap">
          <h2 className="display text-[clamp(1.8rem,1.4rem+2vw,2.8rem)]">Sua próxima ideia pode começar aqui</h2>
          <div className="mt-8">
            <WaButton variant="bronze" location={`page:${p.slug}`} event="quote_request">
              {d.settings.whatsapp.label}
            </WaButton>
          </div>
        </div>
      </section>
    </>
  );
}
