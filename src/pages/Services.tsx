import { useState } from 'react';
import { Link } from '../lib/router';
import { useCms, photoById, photosByIds, publishedServices, service as findService, publishedGalleries } from '../lib/store';
import { useHead } from '../lib/head';
import { breadcrumbLd, orgLd, resolveSeo, serviceLd } from '../lib/seo';
import { SmartImage, Reveal, SectionHead, Breadcrumbs, Lightbox } from '../components/ui';
import { WaButton } from '../components/Layout';
import { track } from '../lib/analytics';
import NotFound from './NotFound';

export function ServicesIndex() {
  const d = useCms();
  const services = publishedServices(d);

  useHead(
    {
      title: `Tipos de ensaio fotográfico em Belo Horizonte | ${d.settings.brand}`,
      description:
        'Ensaio feminino, casal, gestante, família, corporativo e casamento. Veja o que está incluso, a duração e o investimento de cada experiência.',
      path: '/ensaios',
      ogImage: photoById(d, services[0]?.coverPhotoId)?.sources.lg,
      jsonLd: [
        orgLd(d),
        breadcrumbLd(d, [
          { name: 'Início', path: '/' },
          { name: 'Ensaios', path: '/ensaios' },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: services.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: s.title,
            url: `${d.settings.siteUrl}/ensaios/${s.slug}`,
          })),
        },
      ],
    },
    d
  );

  return (
    <>
      <div className="wrap pt-32 md:pt-40">
        <Breadcrumbs trail={[{ name: 'Início', path: '/' }, { name: 'Ensaios', path: '/ensaios' }]} />
        <SectionHead
          as="h1"
          eyebrow="Experiências"
          title="Escolha o ensaio certo para o seu momento"
          text="Todos incluem direção de pose, consultoria de looks, tratamento autoral e galeria privada online."
        />
      </div>

      <section className="wrap py-16">
        <div className="space-y-20">
          {services.map((s, i) => (
            <Reveal key={s.id}>
              <article className={`grid items-center gap-8 lg:grid-cols-12 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <div className="lg:col-span-6">
                  <Link to={`/ensaios/${s.slug}`} className="group block">
                    <SmartImage photo={photoById(d, s.coverPhotoId)} sizes="(max-width: 1024px) 100vw, 50vw" ratio={4 / 3} />
                  </Link>
                </div>
                <div className="lg:col-span-5 lg:col-start-8">
                  <p className="eyebrow">{s.duration}</p>
                  <h2 className="display mt-3 text-[clamp(1.6rem,1.3rem+1.6vw,2.4rem)]">
                    <Link to={`/ensaios/${s.slug}`} className="hover:text-[var(--color-bronze)]">
                      {s.title}
                    </Link>
                  </h2>
                  <p className="lede mt-4">{s.excerpt}</p>
                  <ul className="mt-5 space-y-2 text-[14px] text-[var(--color-ink-soft)]">
                    {s.includes.slice(0, 4).map((it) => (
                      <li key={it} className="flex gap-3">
                        <span aria-hidden="true" className="text-[var(--color-bronze)]">
                          —
                        </span>
                        {it}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-[13px] uppercase tracking-[.14em] text-[var(--color-mute)]">
                    A partir de <span className="text-[var(--color-ink)]">{s.priceFrom}</span>
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to={`/ensaios/${s.slug}`} className="btn btn-outline btn-sm">
                      Ver detalhes
                    </Link>
                    <WaButton className="btn-sm" variant="dark" message={s.ctaMessage} location={`services-index:${s.slug}`} event="quote_request">
                      {s.ctaLabel}
                    </WaButton>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

export function ServicePage({ slug }: { slug: string }) {
  const d = useCms();
  const s = findService(d, slug);
  const [lb, setLb] = useState<number | null>(null);
  const photos = photosByIds(d, s?.photoIds || []);
  const others = publishedServices(d).filter((x) => x.id !== s?.id).slice(0, 3);
  const relatedGallery = publishedGalleries(d).find((g) => g.categoryId === photos[0]?.categoryId);

  const seo = s ? resolveSeo(s.seo, { title: `${s.title} | ${d.settings.brand}`, description: s.excerpt }) : null;

  useHead(
    {
      title: seo?.title || 'Ensaio não encontrado',
      description: seo?.description || '',
      path: `/ensaios/${slug}`,
      index: s?.published ? seo?.index : false,
      follow: seo?.follow,
      canonical: seo?.canonical,
      ogTitle: seo?.ogTitle,
      ogDescription: seo?.ogDescription,
      ogImage: photoById(d, s?.seo.ogImageId || s?.coverPhotoId || '')?.sources.lg,
      jsonLd: s
        ? [
            breadcrumbLd(d, [
              { name: 'Início', path: '/' },
              { name: 'Ensaios', path: '/ensaios' },
              { name: s.title, path: `/ensaios/${s.slug}` },
            ]),
            serviceLd(d, s),
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: `Quanto custa o ${s.title.toLowerCase()}?`,
                  acceptedAnswer: { '@type': 'Answer', text: `O investimento começa em ${s.priceFrom}, com ${s.duration}.` },
                },
                {
                  '@type': 'Question',
                  name: 'Em quanto tempo recebo as fotos?',
                  acceptedAnswer: { '@type': 'Answer', text: 'A prévia é enviada em até 48 horas e a galeria completa em até 10 dias.' },
                },
              ],
            },
          ]
        : [],
    },
    d
  );

  if (!s || !s.published) return <NotFound />;

  return (
    <>
      <article>
        <header className="wrap pt-32 md:pt-40">
          <Breadcrumbs
            trail={[
              { name: 'Início', path: '/' },
              { name: 'Ensaios', path: '/ensaios' },
              { name: s.title, path: `/ensaios/${s.slug}` },
            ]}
          />
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="eyebrow">{s.duration}</p>
              <h1 className="display mt-4 text-[clamp(2.1rem,1.6rem+2.8vw,3.8rem)]">{s.seo.h1 || s.title}</h1>
              <p className="lede mt-6">{s.excerpt}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <WaButton variant="dark" message={s.ctaMessage} location={`service:${s.slug}`} event="quote_request">
                  {s.ctaLabel}
                </WaButton>
                <Link to="/portfolio" className="btn btn-outline">
                  Ver portfólio
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <SmartImage photo={photoById(d, s.coverPhotoId)} priority sizes="(max-width: 1024px) 100vw, 40vw" ratio={4 / 5} />
            </div>
          </div>
        </header>

        <section className="wrap py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="display text-2xl">Como é o ensaio</h2>
              <div className="mt-5 space-y-4">
                {s.body.split('\n\n').map((p) => (
                  <p key={p.slice(0, 20)} className="lede">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="card p-7">
                <h2 className="eyebrow">O que está incluso</h2>
                <ul className="mt-5 space-y-3 text-[14.5px]">
                  {s.includes.map((it) => (
                    <li key={it} className="flex gap-3 border-b border-[var(--color-line)] pb-3 last:border-0">
                      <span aria-hidden="true" className="text-[var(--color-bronze)]">
                        ✓
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[13px] uppercase tracking-[.14em] text-[var(--color-mute)]">Investimento</p>
                <p className="display text-3xl">{s.priceFrom}</p>
                <WaButton
                  className="mt-5 w-full"
                  variant="bronze"
                  message={s.ctaMessage}
                  location={`service-sidebar:${s.slug}`}
                  event="quote_request"
                >
                  {s.ctaLabel}
                </WaButton>
                <p className="mt-3 text-center text-[12.5px] text-[var(--color-mute)]">{d.settings.whatsapp.display}</p>
              </div>
            </aside>
          </div>
        </section>

        {photos.length > 0 && (
          <section className="wrap pb-20">
            <h2 className="display text-2xl">Fotografias deste tipo de ensaio</h2>
            <div className="mt-8 cols cols-3">
              {photos.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 50}>
                  <button
                    onClick={() => {
                      setLb(i);
                      track('view_service', { service: s.slug, photo: p.id });
                    }}
                    className="block w-full"
                    aria-label={`Ampliar: ${p.alt}`}
                  >
                    <SmartImage photo={p} sizes="(max-width: 640px) 100vw, 33vw" ratio={p.width / p.height} />
                  </button>
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </article>

      {lb !== null && <Lightbox photos={photos} index={lb} onClose={() => setLb(null)} onIndex={setLb} />}

      <section className="border-t border-[var(--color-line)] bg-[var(--color-sand)] py-16">
        <div className="wrap">
          <h2 className="display text-2xl">Outras experiências</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {others.map((o) => (
              <Link key={o.id} to={`/ensaios/${o.slug}`} className="group block">
                <SmartImage photo={photoById(d, o.coverPhotoId)} sizes="33vw" ratio={3 / 2} />
                <h3 className="display mt-3 text-base transition-colors group-hover:text-[var(--color-bronze)]">{o.title}</h3>
                <p className="text-[13px] text-[var(--color-mute)]">A partir de {o.priceFrom}</p>
              </Link>
            ))}
          </div>
          {relatedGallery && (
            <p className="mt-10 text-[14px]">
              Veja também a galeria{' '}
              <Link to={`/portfolio/${relatedGallery.slug}`} className="ulink text-[var(--color-bronze)]">
                {relatedGallery.title}
              </Link>
              .
            </p>
          )}
        </div>
      </section>
    </>
  );
}
