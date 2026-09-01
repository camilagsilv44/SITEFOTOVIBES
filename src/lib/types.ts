export type Seo = {
  title: string;
  description: string;
  canonical: string;
  index: boolean;
  follow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImageId: string;
  h1: string;
};

export type ImgSources = { sm: string; md: string; lg: string };

export type Photo = {
  id: string;
  alt: string;
  caption: string;
  categoryId: string;
  sources: ImgSources;
  width: number;
  height: number;
  lqip: string;
  bytes: number;
  featured: boolean;
  createdAt: string;
};

export type Category = { id: string; name: string; slug: string };

export type Gallery = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverPhotoId: string;
  photoIds: string[];
  categoryId: string;
  date: string;
  featured: boolean;
  published: boolean;
  seo: Seo;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverPhotoId: string;
  photoIds: string[];
  priceFrom: string;
  duration: string;
  includes: string[];
  ctaLabel: string;
  ctaMessage: string;
  order: number;
  published: boolean;
  seo: Seo;
};

export type Testimonial = {
  id: string;
  name: string;
  sessionType: string;
  quote: string;
  rating: number;
  photoId: string;
  avatarUrl: string;
  order: number;
  published: boolean;
};

export type PageBlock = { heading: string; text: string; items: string[] };

export type PageDoc = {
  id: string;
  title: string;
  slug: string;
  intro: string;
  blocks: PageBlock[];
  published: boolean;
  seo: Seo;
};

export type Redirect = { id: string; from: string; to: string; code: 301; createdAt: string };

export type Settings = {
  brand: string;
  tagline: string;
  valueProp: string;
  siteUrl: string;
  whatsapp: { number: string; display: string; label: string; message: string };
  contact: { email: string; city: string; hours: string };
  social: { instagram: string; tiktok: string; youtube: string; pinterest: string };
  home: {
    heroPhotoId: string;
    heroKicker: string;
    heroTitle: string;
    heroSubtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    aboutTitle: string;
    aboutText: string;
    aboutPhotoId: string;
    finalCtaTitle: string;
    finalCtaText: string;
    differentials: { title: string; text: string }[];
    steps: { title: string; text: string }[];
  };
  analytics: { ga4: string; gtm: string; pixel: string; gscToken: string };
};

export type CmsData = {
  version: number;
  settings: Settings;
  categories: Category[];
  photos: Photo[];
  galleries: Gallery[];
  services: Service[];
  testimonials: Testimonial[];
  pages: PageDoc[];
  redirects: Redirect[];
};

export const emptySeo = (): Seo => ({
  title: '',
  description: '',
  canonical: '',
  index: true,
  follow: true,
  ogTitle: '',
  ogDescription: '',
  ogImageId: '',
  h1: '',
});

export const slugify = (v: string) =>
  v
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 70);

export const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`;
