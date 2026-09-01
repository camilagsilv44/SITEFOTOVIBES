import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Photo } from '../lib/types';
import { resolveSrc, resolveSync } from '../lib/images';
import { Link } from '../lib/router';

/* ------------------------------ SmartImage ------------------------------ */

type SmartImageProps = {
  photo?: Photo;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  ratio?: number | 'auto';
  zoom?: boolean;
  alt?: string;
};

/**
 * Responsive, CLS-free image.
 * Renders LQIP placeholder → fades in the right-sized WebP from srcset.
 */
export function SmartImage({
  photo,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  className = '',
  imgClassName = '',
  ratio,
  zoom = true,
  alt,
}: SmartImageProps) {
  const [srcs, setSrcs] = useState(() =>
    photo ? { sm: resolveSync(photo.sources.sm), md: resolveSync(photo.sources.md), lg: resolveSync(photo.sources.lg) } : null
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!photo) return;
    Promise.all([resolveSrc(photo.sources.sm), resolveSrc(photo.sources.md), resolveSrc(photo.sources.lg)]).then(
      ([sm, md, lg]) => alive && setSrcs({ sm, md, lg })
    );
    return () => {
      alive = false;
    };
  }, [photo?.id]);

  const ar = ratio === 'auto' ? undefined : ratio || (photo ? photo.width / photo.height : 3 / 4);

  if (!photo) {
    return (
      <div className={`frame ${className}`} style={{ aspectRatio: ar }} aria-hidden="true">
        <div className="absolute inset-0 bg-[var(--color-sand)]" />
      </div>
    );
  }

  const lq = photo.lqip?.startsWith('data:') ? `url(${photo.lqip})` : undefined;

  return (
    <div className={`frame ${className}`} style={{ aspectRatio: ar }}>
      {lq ? (
        <div className="lqip" style={{ backgroundImage: lq, opacity: loaded ? 0 : 1, transition: 'opacity .5s' }} />
      ) : (
        <div className="absolute inset-0" style={{ background: photo.lqip || '#EDE7DE', opacity: loaded ? 0 : 1, transition: 'opacity .5s' }} />
      )}
      {srcs?.md && (
        <img
          src={srcs.md}
          srcSet={[srcs.sm && `${srcs.sm} 480w`, srcs.md && `${srcs.md} 1080w`, srcs.lg && `${srcs.lg} 1920w`]
            .filter(Boolean)
            .join(', ')}
          sizes={sizes}
          width={photo.width}
          height={photo.height}
          alt={alt ?? photo.alt}
          loading={priority ? 'eager' : 'lazy'}
          // @ts-expect-error fetchpriority is valid HTML
          fetchpriority={priority ? 'high' : undefined}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setLoaded(true)}
          className={`fade-img ${loaded ? 'loaded' : ''} ${zoom ? 'zoomable' : ''} ${imgClassName}`}
          style={{ position: 'absolute', inset: 0 }}
        />
      )}
    </div>
  );
}

/* -------------------------------- Reveal -------------------------------- */

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in');
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ------------------------------ Section head ----------------------------- */

export function SectionHead({
  eyebrow,
  title,
  text,
  as = 'h2',
  align = 'left',
  action,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  as?: 'h1' | 'h2';
  align?: 'left' | 'center';
  action?: ReactNode;
}) {
  const H = as;
  return (
    <div className={`flex flex-col gap-5 md:flex-row md:items-end ${align === 'center' ? 'text-center' : ''} ${action ? 'md:justify-between' : ''}`}>
      <div className={align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <H className="display text-[clamp(2rem,1.4rem+2.6vw,3.6rem)]">{title}</H>
        {text && <p className="lede mt-5">{text}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ------------------------------ Breadcrumbs ------------------------------ */

export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-[12.5px] text-[var(--color-mute)]">
      <ol className="flex flex-wrap items-center gap-2">
        {trail.map((t, i) => (
          <li key={t.path} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === trail.length - 1 ? (
              <span aria-current="page" className="text-[var(--color-ink-soft)]">
                {t.name}
              </span>
            ) : (
              <Link to={t.path} className="ulink hover:text-[var(--color-ink)]">
                {t.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* -------------------------------- Lightbox ------------------------------- */

export function Lightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const photo = photos[index];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % photos.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + photos.length) % photos.length);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [index, photos.length, onClose, onIndex]);

  if (!photo) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      className="fixed inset-0 z-[80] flex flex-col bg-[#0d0b0a]/97 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4 text-white/70 text-xs tracking-[.18em] uppercase">
        <span>
          {index + 1} / {photos.length}
        </span>
        <button onClick={onClose} aria-label="Fechar" className="p-2 hover:text-white">
          ✕
        </button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-3 pb-6" onClick={(e) => e.stopPropagation()}>
        <button
          aria-label="Anterior"
          className="absolute left-2 z-10 h-12 w-12 rounded-full text-white/70 hover:bg-white/10 hover:text-white md:left-6"
          onClick={() => onIndex((index - 1 + photos.length) % photos.length)}
        >
          ‹
        </button>
        <figure className="max-h-full max-w-5xl">
          <SmartImage
            photo={photo}
            priority
            zoom={false}
            sizes="90vw"
            className="max-h-[76vh] !bg-transparent"
            imgClassName="!object-contain"
            ratio={photo.width / photo.height}
          />
          <figcaption className="mt-4 text-center text-sm text-white/60">{photo.caption || photo.alt}</figcaption>
        </figure>
        <button
          aria-label="Próxima"
          className="absolute right-2 z-10 h-12 w-12 rounded-full text-white/70 hover:bg-white/10 hover:text-white md:right-6"
          onClick={() => onIndex((index + 1) % photos.length)}
        >
          ›
        </button>
      </div>
    </div>
  );
}

/* --------------------------------- Stars -------------------------------- */

export function Stars({ n }: { n: number }) {
  return (
    <span aria-label={`${n} de 5 estrelas`} className="text-[var(--color-bronze)] text-sm tracking-[.2em]">
      {'★'.repeat(n)}
      <span className="text-[var(--color-line)]">{'★'.repeat(5 - n)}</span>
    </span>
  );
}
