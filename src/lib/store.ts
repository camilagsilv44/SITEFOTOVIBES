import { useSyncExternalStore } from 'react';
import type { CmsData, Gallery, Photo, Service, PageDoc, Redirect } from './types';
import { uid } from './types';
import { SEED } from './seed';

const KEY = 'vibe-cms';

function load(): CmsData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(SEED);
    const parsed = JSON.parse(raw) as CmsData;
    if (parsed.version !== SEED.version) return structuredClone(SEED);
    // shallow-merge settings so new fields from updates appear
    return {
      ...structuredClone(SEED),
      ...parsed,
      settings: {
        ...SEED.settings,
        ...parsed.settings,
        home: { ...SEED.settings.home, ...(parsed.settings?.home || {}) },
        whatsapp: { ...SEED.settings.whatsapp, ...(parsed.settings?.whatsapp || {}) },
        contact: { ...SEED.settings.contact, ...(parsed.settings?.contact || {}) },
        social: { ...SEED.settings.social, ...(parsed.settings?.social || {}) },
        analytics: { ...SEED.settings.analytics, ...(parsed.settings?.analytics || {}) },
      },
    };
  } catch {
    return structuredClone(SEED);
  }
}

let state: CmsData = load();
const subs = new Set<() => void>();
let timer: number | undefined;

function persist() {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* quota — binaries live in IndexedDB so this is unlikely */
    }
  }, 180);
}

export function setData(fn: (d: CmsData) => CmsData | void) {
  const draft = structuredClone(state);
  const out = fn(draft);
  state = (out as CmsData) || draft;
  persist();
  subs.forEach((s) => s());
}

export function resetData() {
  state = structuredClone(SEED);
  localStorage.removeItem(KEY);
  subs.forEach((s) => s());
}

export function exportData() {
  return JSON.stringify(state, null, 2);
}

export function importData(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as CmsData;
    if (!parsed.settings || !parsed.photos) return false;
    state = parsed;
    persist();
    subs.forEach((s) => s());
    return true;
  } catch {
    return false;
  }
}

const subscribe = (cb: () => void) => {
  subs.add(cb);
  return () => subs.delete(cb);
};

export const getSnapshot = () => state;
export function useCms(): CmsData {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/* ------------------------------- selectors ------------------------------- */

export const photoById = (d: CmsData, id: string): Photo | undefined => d.photos.find((p) => p.id === id);
export const photosByIds = (d: CmsData, ids: string[]) =>
  ids.map((i) => d.photos.find((p) => p.id === i)).filter(Boolean) as Photo[];
export const categoryById = (d: CmsData, id: string) => d.categories.find((c) => c.id === id);
export const publishedGalleries = (d: CmsData) =>
  d.galleries.filter((g) => g.published).sort((a, b) => (a.date < b.date ? 1 : -1));
export const publishedServices = (d: CmsData) => d.services.filter((s) => s.published).sort((a, b) => a.order - b.order);
export const publishedTestimonials = (d: CmsData) =>
  d.testimonials.filter((t) => t.published).sort((a, b) => a.order - b.order);
export const gallery = (d: CmsData, slug: string) => d.galleries.find((g) => g.slug === slug);
export const service = (d: CmsData, slug: string) => d.services.find((s) => s.slug === slug);
export const page = (d: CmsData, slug: string) => d.pages.find((p) => p.slug === slug);
export const featuredPhotos = (d: CmsData) => d.photos.filter((p) => p.featured);

/** WhatsApp deep link with pre-filled message. */
export function waLink(d: CmsData, message?: string) {
  const msg = encodeURIComponent(message || d.settings.whatsapp.message);
  return `https://wa.me/${d.settings.whatsapp.number.replace(/\D/g, '')}?text=${msg}`;
}

/* --------------------------- slug + redirect logic --------------------------- */

export function registerRedirect(from: string, to: string) {
  if (!from || from === to) return;
  setData((d) => {
    d.redirects = d.redirects.filter((r) => r.from !== from);
    // repoint older redirects that pointed at the old URL
    d.redirects.forEach((r) => {
      if (r.to === from) r.to = to;
    });
    d.redirects.unshift({ id: uid('rd'), from, to, code: 301, createdAt: new Date().toISOString() });
  });
}

export const resolveRedirect = (d: CmsData, path: string): Redirect | undefined =>
  d.redirects.find((r) => r.from === path);

/* ------------------------------ url builders ------------------------------ */

export const urlOf = {
  gallery: (g: Pick<Gallery, 'slug'>) => `/portfolio/${g.slug}`,
  service: (s: Pick<Service, 'slug'>) => `/ensaios/${s.slug}`,
  page: (p: Pick<PageDoc, 'slug'>) => `/${p.slug}`,
};

/* -------------------------------- sitemap -------------------------------- */

export function buildSitemap(d: CmsData): string {
  const base = d.settings.siteUrl.replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);
  const rows: { loc: string; pri: string; freq: string; last?: string }[] = [
    { loc: '/', pri: '1.0', freq: 'weekly' },
    { loc: '/portfolio', pri: '0.9', freq: 'weekly' },
    { loc: '/ensaios', pri: '0.9', freq: 'monthly' },
    { loc: '/sobre', pri: '0.6', freq: 'yearly' },
    { loc: '/contato', pri: '0.7', freq: 'yearly' },
  ];
  d.services.filter((s) => s.published && s.seo.index).forEach((s) => rows.push({ loc: urlOf.service(s), pri: '0.8', freq: 'monthly' }));
  d.galleries
    .filter((g) => g.published && g.seo.index)
    .forEach((g) => rows.push({ loc: urlOf.gallery(g), pri: '0.7', freq: 'monthly', last: g.date }));
  d.pages.filter((p) => p.published && p.seo.index).forEach((p) => rows.push({ loc: urlOf.page(p), pri: '0.6', freq: 'monthly' }));

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows
  .map(
    (r) =>
      `  <url><loc>${base}${r.loc}</loc><lastmod>${r.last || today}</lastmod><changefreq>${r.freq}</changefreq><priority>${r.pri}</priority></url>`
  )
  .join('\n')}
</urlset>`;
}

export function buildRobots(d: CmsData): string {
  const base = d.settings.siteUrl.replace(/\/$/, '');
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\n\nSitemap: ${base}/sitemap.xml\n`;
}
