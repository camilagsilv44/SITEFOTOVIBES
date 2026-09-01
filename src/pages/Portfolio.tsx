import { useMemo, useState } from 'react';
import { Link, navigate } from '../lib/router';
import { useCms, photoById, photosByIds, publishedGalleries, categoryById, gallery as findGallery } from '../lib/store';
import { useHead } from '../lib/head';
import { breadcrumbLd, galleryLd, resolveSeo, orgLd } from '../lib/seo';
import { SmartImage, Reveal, SectionHead, Breadcrumbs, Lightbox } from '../components/ui';
import { WaButton } from '../components/Layout';
import { track } from '../lib/analytics';
import NotFound from './NotFound';

const PER_PAGE = 9;

export function PortfolioIndex({ page = 1 }: { page?: number }) {
  const d = useCms();
  const [cat, setCat] = useState('all');
  const all = publishedGalleries(d);
  const filtered = cat === 'all' ? all : all.filter((g) => g.categoryId === cat);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const items = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const usedCats = useMemo(
    () => d.categories.filter((c) => all.some((g) => g.categoryId === c.id)),
    [d.categories, all]
  );

  const path = current > 1 ? `/portfolio/pagina/${current}` : '/portfolio';
  useHead(
    {
      title:
        current > 1
          ? `Portfólio de fotografia — página ${current} | ${d.settings.brand}`
          : `Portfólio de fotografia em Belo Horizonte | ${d.settings.brand}`,
      description:
        'Galerias completas de ensaios feminino, casal, gestante, família, casamento e corporativo fotografados pela Vibe Fotos em Belo Horizonte.',
      path,
      ogImage: photoById(d, all[0]?.coverPhotoId)?.sources.lg,
      jsonLd: [
        orgLd(d),
        breadcrumbLd(d, [
          { name: 'Início', path: '/' },
          { name: 'Portfólio', path: '/portfolio' },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Portfólio Vibe Fotos',
          hasPart: all.slice(0, 10).map((g) => ({
            '@type': 'ImageGallery',
            name: g.title,
            url: `${d.settings.siteUrl}/portfolio/${g.slug}`,
          })),
        },
      ],
    },
    d
  );

  return (
    <>
      <div className="wrap pt-32 md:pt-40">
        <Breadcrumbs trail={[{ name: 'Início', path: '/' }, { name: 'Portfólio', path: '/portfolio' }]} />
        <SectionHead
          as="h1"
          eyebrow="Portfólio"
          title="Histórias que eu já capturei"
          text="Cada fotografia carrega uma história, uma personalidade e uma vibe diferente. Escolha uma categoria e entre nas galerias."
        />

        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
          <button className="chip" data-active={cat === 'all'} onClick={() => setCat('all')}>
            Todas <span className="text-[var(--color-mute)]">({all.length})</span>
          </button>
          {usedCats.map((c) => (
            <button key={c.id} className="chip" data-active={cat === c.id} onClick={() => setCat(c.id)}>
              {c.name}{' '}
              <span className={cat === c.id ? 'opacity-60' : 'text-[var(--color-mute)]'}>
                ({all.filter((g) => g.categoryId === c.id).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      <section className="wrap pb-24 pt-12">
        <div className="cols cols-3">
          {items.map((g, i) => {
            const cover = photoById(d, g.coverPhotoId);
            const c = categoryById(d, g.categoryId);
            return (
              <Reveal key={g.id} delay={(i % 3) * 60}>
                <article>
                  <Link
                    to={`/portfolio/${g.slug}`}
                    className="group block"
                    onClick={() => track('view_item_list', { item: g.slug, list: 'portfolio_index' })}
                  >
                    <SmartImage
                      photo={cover}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      ratio={cover ? cover.width / cover.height : 3 / 4}
                    />
                    <div className="mt-4">
                      <p className="eyebrow">{c?.name}</p>
                      <h2 className="display mt-2 text-lg transition-colors group-hover:text-[var(--color-bronze)]">{g.title}</h2>
                      <p className="mt-1 text-[13px] text-[var(--color-mute)]">{g.photoIds.length} fotografias</p>
                    </div>
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>

        {totalPages > 1 && (
          <nav aria-label="Paginação" className="mt-16 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                to={n === 1 ? '/portfolio' : `/portfolio/pagina/${n}`}
                aria-current={n === current ? 'page' : undefined}
                className="chip"
                data-active={n === current}
              >
                {n}
              </Link>
            ))}
          </nav>
        )}

        <div className="mt-20 border-t border-[var(--color-line)] pt-14 text-center">
          <h2 className="display text-[clamp(1.6rem,1.2rem+1.8vw,2.4rem)]">Gostou do que viu?</h2>
          <p className="lede mx-auto mt-4 max-w-lg">
            Me manda uma mensagem contando a sua ideia. Eu te respondo com disponibilidade, locações e investimento.
          </p>
          <div className="mt-8">
            <WaButton variant="dark" location="portfolio-index" event="quote_request" />
          </div>
        </div>
      </section>
    </>
  );
}

export function GalleryPage({ slug }: { slug: string }) {
  const d = useCms();
  const g = findGallery(d, slug);
  const [lb, setLb] = useState<number | null>(null);

  const photos = photosByIds(d, g?.photoIds || []);
  const cat = g ? categoryById(d, g.categoryId) : undefined;
  const related = publishedGalleries(d)
    .filter((x) => x.id !== g?.id && x.categoryId === g?.categoryId)
    .slice(0, 3);

  const fallbackTitle = g ? `${g.title} | ${d.settings.brand}` : '';
  const s = g ? resolveSeo(g.seo, { title: fallbackTitle, description: g.description.slice(0, 158) }) : null;

  useHead(
    {
      title: s?.title || 'Galeria não encontrada',
      description: s?.description || '',
      path: `/portfolio/${slug}`,
      index: g?.published ? s?.index : false,
      follow: s?.follow,
      canonical: s?.canonical,
      ogTitle: s?.ogTitle,
      ogDescription: s?.ogDescription,
      ogImage: photoById(d, g?.seo.ogImageId || g?.coverPhotoId || '')?.sources.lg,
      type: 'article',
      jsonLd: g
        ? [
            breadcrumbLd(d, [
              { name: 'Início', path: '/' },
              { name: 'Portfólio', path: '/portfolio' },
              { name: g.title, path: `/portfolio/${g.slug}` },
            ]),
            galleryLd(d, g.title, g.description, `/portfolio/${g.slug}`, g.photoIds),
          ]
        : [],
    },
    d
  );

  if (!g || !g.published) return <NotFound />;

  return (
    <>
      <article>
        <header className="wrap pt-32 md:pt-40">
          <Breadcrumbs
            trail={[
              { name: 'Início', path: '/' },
              { name: 'Portfólio', path: '/portfolio' },
              { name: g.title, path: `/portfolio/${g.slug}` },
            ]}
          />
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow">{cat?.name}</p>
              <h1 className="display mt-4 text-[clamp(2rem,1.5rem+2.8vw,3.8rem)]">{g.seo.h1 || g.title}</h1>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="lede">{g.description}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--color-line)] pt-5 text-[13px]">
                <div>
                  <dt className="text-[var(--color-mute)]">Data</dt>
                  <dd>{new Date(g.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</dd>
                </div>
                <div>
                  <dt className="text-[var(--color-mute)]">Fotografias</dt>
                  <dd>{photos.length}</dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        <section className="wrap py-14">
          <div className="cols cols-3">
            {photos.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 50}>
                <button
                  className="group block w-full text-left"
                  onClick={() => {
                    setLb(i);
                    track('view_gallery', { gallery: g.slug, photo: p.id });
                  }}
                  aria-label={`Ampliar fotografia: ${p.alt}`}
                >
                  <SmartImage
                    photo={p}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    ratio={p.width / p.height}
                    priority={i === 0}
                  />
                  {p.caption && <p className="mt-2 text-[12.5px] text-[var(--color-mute)]">{p.caption}</p>}
                </button>
              </Reveal>
            ))}
          </div>
        </section>
      </article>

      {lb !== null && <Lightbox photos={photos} index={lb} onClose={() => setLb(null)} onIndex={setLb} />}

      <section className="border-t border-[var(--color-line)] bg-[var(--color-sand)] py-16">
        <div className="wrap text-center">
          <h2 className="display text-[clamp(1.7rem,1.3rem+2vw,2.6rem)]">Quer um ensaio assim?</h2>
          <p className="lede mx-auto mt-4 max-w-lg">
            Me chame no WhatsApp e vamos montar a sua sessão — locação, looks e direção pensados para você.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <WaButton
              variant="dark"
              location={`gallery:${g.slug}`}
              event="quote_request"
              message={`Oi Giovana! Vi a galeria "${g.title}" no site e quero um ensaio parecido.`}
            />
            <button className="btn btn-outline" onClick={() => navigate('/ensaios')}>
              Ver tipos de ensaio
            </button>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="wrap py-20">
          <h2 className="display text-2xl">Outras galerias de {cat?.name.toLowerCase()}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.id} to={`/portfolio/${r.slug}`} className="group block">
                <SmartImage photo={photoById(d, r.coverPhotoId)} sizes="33vw" ratio={4 / 5} />
                <h3 className="display mt-3 text-base transition-colors group-hover:text-[var(--color-bronze)]">{r.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
