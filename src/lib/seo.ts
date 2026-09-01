import type { CmsData, Seo } from './types';
import { photoById } from './store';

type JsonLd = Record<string, unknown>;

export type HeadInput = {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  follow?: boolean;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  type?: 'website' | 'article' | 'profile';
  jsonLd?: JsonLd[];
};

const MANAGED = 'data-seo';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute(MANAGED, '1');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function applyHead(input: HeadInput, d: CmsData) {
  const base = d.settings.siteUrl.replace(/\/$/, '');
  const canonical = input.canonical || `${base}${input.path === '/' ? '/' : input.path}`;
  const robots = `${input.index === false ? 'noindex' : 'index'},${input.follow === false ? 'nofollow' : 'follow'}${
    input.index === false ? '' : ',max-image-preview:large,max-snippet:-1'
  }`;

  document.title = input.title;
  document.documentElement.lang = 'pt-BR';
  upsertMeta('name', 'description', input.description);
  upsertMeta('name', 'robots', robots);
  upsertMeta('property', 'og:title', input.ogTitle || input.title);
  upsertMeta('property', 'og:description', input.ogDescription || input.description);
  upsertMeta('property', 'og:url', canonical);
  upsertMeta('property', 'og:type', input.type || 'website');
  upsertMeta('property', 'og:site_name', d.settings.brand);
  upsertMeta('property', 'og:locale', 'pt_BR');
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', input.ogTitle || input.title);
  upsertMeta('name', 'twitter:description', input.ogDescription || input.description);
  if (input.ogImage) {
    upsertMeta('property', 'og:image', input.ogImage);
    upsertMeta('name', 'twitter:image', input.ogImage);
  }

  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = canonical;

  document.head.querySelectorAll('script[data-jsonld]').forEach((s) => s.remove());
  (input.jsonLd || []).forEach((obj) => {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-jsonld', '1');
    s.text = JSON.stringify(obj);
    document.head.appendChild(s);
  });
}

/* ------------------------------- JSON-LD ------------------------------- */

export function orgLd(d: CmsData): JsonLd {
  const base = d.settings.siteUrl.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${base}/#business`,
    name: d.settings.brand,
    slogan: d.settings.tagline,
    description: d.settings.valueProp,
    url: base,
    telephone: `+${d.settings.whatsapp.number}`,
    email: d.settings.contact.email,
    priceRange: '$$',
    areaServed: d.settings.contact.city,
    address: { '@type': 'PostalAddress', addressLocality: 'Belo Horizonte', addressRegion: 'MG', addressCountry: 'BR' },
    sameAs: [d.settings.social.instagram, d.settings.social.tiktok, d.settings.social.youtube].filter(Boolean),
    knowsAbout: ['Fotografia', 'Ensaio fotográfico', 'Fotografia corporativa', 'Marketing digital'],
  };
}

export function breadcrumbLd(d: CmsData, trail: { name: string; path: string }[]): JsonLd {
  const base = d.settings.siteUrl.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${base}${t.path}`,
    })),
  };
}

export function galleryLd(d: CmsData, title: string, description: string, path: string, photoIds: string[]): JsonLd {
  const base = d.settings.siteUrl.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: title,
    description,
    url: `${base}${path}`,
    image: photoIds
      .map((id) => photoById(d, id))
      .filter(Boolean)
      .slice(0, 12)
      .map((p) => ({
        '@type': 'ImageObject',
        contentUrl: p!.sources.lg.startsWith('idb:') ? `${base}${path}` : p!.sources.lg,
        caption: p!.alt,
        width: p!.width,
        height: p!.height,
      })),
  };
}

export function serviceLd(d: CmsData, s: { title: string; excerpt: string; priceFrom: string; slug: string }): JsonLd {
  const base = d.settings.siteUrl.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.title,
    description: s.excerpt,
    serviceType: 'Fotografia',
    provider: { '@id': `${base}/#business` },
    areaServed: d.settings.contact.city,
    url: `${base}/ensaios/${s.slug}`,
    ...(s.priceFrom && /\d/.test(s.priceFrom)
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'BRL',
            price: s.priceFrom.replace(/[^\d,]/g, '').replace(',', '.'),
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };
}

export function reviewsLd(d: CmsData): JsonLd | null {
  const t = d.testimonials.filter((x) => x.published);
  if (!t.length) return null;
  const base = d.settings.siteUrl.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${base}/#business`,
    name: d.settings.brand,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (t.reduce((a, b) => a + b.rating, 0) / t.length).toFixed(1),
      reviewCount: t.length,
      bestRating: 5,
    },
    review: t.slice(0, 6).map((x) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: x.name },
      reviewRating: { '@type': 'Rating', ratingValue: x.rating, bestRating: 5 },
      reviewBody: x.quote,
    })),
  };
}

/** Merge entity SEO overrides with computed defaults. */
export function resolveSeo(seo: Seo, fallback: { title: string; description: string }) {
  return {
    title: seo.title || fallback.title,
    description: seo.description || fallback.description,
    index: seo.index,
    follow: seo.follow,
    canonical: seo.canonical || undefined,
    ogTitle: seo.ogTitle || undefined,
    ogDescription: seo.ogDescription || undefined,
  };
}

export const clamp = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
