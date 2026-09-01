import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { CmsData, Photo, Seo } from '../lib/types';
import { slugify } from '../lib/types';
import { photoById, useCms } from '../lib/store';
import { SmartImage } from '../components/ui';
import { processUpload, kb, ALLOWED } from '../lib/images';
import { clamp } from '../lib/seo';

/* ------------------------------- primitives ------------------------------ */

export function Field({
  label,
  value,
  onChange,
  hint,
  placeholder,
  max,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
  max?: number;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="label flex items-center justify-between">
        {label}
        {max && (
          <span className={value.length > max ? 'text-red-600' : 'text-[var(--color-mute)]'}>
            {value.length}/{max}
          </span>
        )}
      </span>
      <input className="field" type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {hint && <span className="mt-1 block text-[11.5px] text-[var(--color-mute)]">{hint}</span>}
    </label>
  );
}

export function Area({
  label,
  value,
  onChange,
  rows = 4,
  hint,
  max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="label flex items-center justify-between">
        {label}
        {max && (
          <span className={value.length > max ? 'text-red-600' : 'text-[var(--color-mute)]'}>
            {value.length}/{max}
          </span>
        )}
      </span>
      <textarea className="field resize-y leading-relaxed" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      {hint && <span className="mt-1 block text-[11.5px] text-[var(--color-mute)]">{hint}</span>}
    </label>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-md border border-[var(--color-line)] bg-white px-3 py-2.5 text-left"
    >
      <span>
        <span className="block text-[13.5px] font-medium">{label}</span>
        {hint && <span className="block text-[11.5px] text-[var(--color-mute)]">{hint}</span>}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-[var(--color-bronze)]' : 'bg-[var(--color-line)]'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`}
        />
      </span>
    </button>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <select className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const on = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', on);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', on);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/45 p-4 py-10" onClick={onClose}>
      <div
        className={`w-full ${wide ? 'max-w-5xl' : 'max-w-2xl'} rounded-xl bg-[var(--color-ivory)] shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-4">
          <h2 className="display text-lg">{title}</h2>
          <button onClick={onClose} className="px-2 text-xl leading-none text-[var(--color-mute)] hover:text-[var(--color-ink)]" aria-label="Fechar">
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Row({ children, cols = 2 }: { children: ReactNode; cols?: number }) {
  return <div className={`grid gap-4 ${cols === 3 ? 'md:grid-cols-3' : cols === 2 ? 'md:grid-cols-2' : ''}`}>{children}</div>;
}

export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'ok' | 'warn' | 'off' }) {
  const map = {
    neutral: 'bg-[var(--color-sand)] text-[var(--color-ink-soft)]',
    ok: 'bg-emerald-50 text-emerald-700',
    warn: 'bg-[#FAEDEA] text-[#A85C4C]',
    off: 'bg-neutral-100 text-neutral-500',
  };
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${map[tone]}`}>{children}</span>;
}

/* ------------------------------ string list ------------------------------ */

export function StringList({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <span className="label">{label}</span>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="field"
              value={it}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="shrink-0 rounded-md border border-[var(--color-line)] px-3 text-[var(--color-mute)] hover:text-red-600"
              aria-label="Remover item"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, ''])} className="btn btn-outline btn-sm mt-2">
        + Adicionar
      </button>
    </div>
  );
}

/* ------------------------------ photo pickers ----------------------------- */

function PhotoGrid({ photos, onPick, selected }: { photos: Photo[]; onPick: (id: string) => void; selected: string[] }) {
  return (
    <div className="grid max-h-[55vh] grid-cols-3 gap-3 overflow-y-auto scrollbar-thin pr-1 sm:grid-cols-4 md:grid-cols-5">
      {photos.map((p) => {
        const idx = selected.indexOf(p.id);
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onPick(p.id)}
            className={`relative overflow-hidden rounded-md border-2 transition-all ${
              idx >= 0 ? 'border-[var(--color-bronze)]' : 'border-transparent hover:border-[var(--color-line)]'
            }`}
          >
            <SmartImage photo={p} sizes="160px" ratio={1} zoom={false} />
            {idx >= 0 && (
              <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-bronze)] text-[11px] text-white">
                {idx + 1}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function PhotoPicker({ label, value, onChange }: { label: string; value: string; onChange: (id: string) => void }) {
  const d = useCms();
  const [open, setOpen] = useState(false);
  const p = photoById(d, value);
  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex items-center gap-3">
        <div className="h-20 w-20 overflow-hidden rounded-md border border-[var(--color-line)]">
          {p ? <SmartImage photo={p} sizes="80px" ratio={1} zoom={false} /> : <div className="h-full w-full bg-[var(--color-sand)]" />}
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(true)}>
            {p ? 'Trocar' : 'Escolher'}
          </button>
          {p && (
            <button type="button" className="text-[12px] text-[var(--color-mute)] hover:text-red-600" onClick={() => onChange('')}>
              Remover
            </button>
          )}
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Escolher fotografia" wide>
        <PhotoGrid
          photos={d.photos}
          selected={value ? [value] : []}
          onPick={(id) => {
            onChange(id);
            setOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}

export function PhotosPicker({ label, value, onChange }: { label: string; value: string[]; onChange: (ids: string[]) => void }) {
  const d = useCms();
  const [open, setOpen] = useState(false);
  const drag = useRef<number | null>(null);

  const move = (from: number, to: number) => {
    const next = [...value];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    onChange(next);
  };

  return (
    <div>
      <span className="label flex items-center justify-between">
        {label}
        <span className="text-[var(--color-mute)]">{value.length} selecionadas · arraste para reordenar</span>
      </span>
      <div className="flex flex-wrap gap-2">
        {value.map((id, i) => {
          const p = photoById(d, id);
          return (
            <div
              key={id}
              draggable
              onDragStart={() => (drag.current = i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (drag.current !== null) move(drag.current, i);
                drag.current = null;
              }}
              className="group relative h-20 w-20 cursor-grab overflow-hidden rounded-md border border-[var(--color-line)]"
              title={p?.alt}
            >
              {p ? <SmartImage photo={p} sizes="80px" ratio={1} zoom={false} /> : null}
              <span className="absolute left-1 top-1 rounded bg-black/60 px-1 text-[10px] text-white">{i + 1}</span>
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x !== id))}
                className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[11px] group-hover:flex"
                aria-label="Remover"
              >
                ✕
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-20 w-20 rounded-md border-2 border-dashed border-[var(--color-line)] text-2xl text-[var(--color-mute)] hover:border-[var(--color-bronze)]"
          aria-label="Adicionar fotografias"
        >
          +
        </button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Selecionar fotografias" wide>
        <PhotoGrid
          photos={d.photos}
          selected={value}
          onPick={(id) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id])}
        />
        <div className="mt-4 flex justify-end">
          <button className="btn btn-dark btn-sm" onClick={() => setOpen(false)}>
            Concluir
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* -------------------------------- uploader -------------------------------- */

export function Uploader({
  categoryId,
  onDone,
  compact,
}: {
  categoryId: string;
  onDone: (photos: Photo[]) => void;
  compact?: boolean;
}) {
  const [busy, setBusy] = useState(0);
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const handle = async (files: FileList | null) => {
    if (!files?.length) return;
    setErrors([]);
    setTotal(files.length);
    setBusy(0);
    const out: Photo[] = [];
    for (let i = 0; i < files.length; i++) {
      const res = await processUpload(files[i], categoryId);
      if (res.ok) out.push(res.photo);
      else setErrors((e) => [...e, `${files[i].name}: ${res.error}`]);
      setBusy(i + 1);
    }
    onDone(out);
    setTotal(0);
    setBusy(0);
    if (input.current) input.current.value = '';
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          handle(e.dataTransfer.files);
        }}
        onClick={() => input.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && input.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed text-center transition-colors ${
          over ? 'border-[var(--color-bronze)] bg-[var(--color-sand)]' : 'border-[var(--color-line)] bg-white'
        } ${compact ? 'p-5' : 'p-10'}`}
      >
        <p className="text-[14px] font-medium">Arraste fotos aqui ou clique para selecionar</p>
        <p className="mt-1 text-[12px] text-[var(--color-mute)]">
          JPG, PNG, WebP ou AVIF · até 25 MB · convertidas automaticamente para WebP em 480/1080/1920px
        </p>
        {total > 0 && (
          <div className="mx-auto mt-4 max-w-sm">
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-line)]">
              <div className="h-full bg-[var(--color-bronze)] transition-all" style={{ width: `${(busy / total) * 100}%` }} />
            </div>
            <p className="mt-2 text-[12px] text-[var(--color-mute)]">
              Otimizando {busy} de {total}…
            </p>
          </div>
        )}
      </div>
      <input
        ref={input}
        type="file"
        multiple
        accept={ALLOWED.join(',')}
        className="hidden"
        onChange={(e) => handle(e.target.files)}
      />
      {errors.length > 0 && (
        <ul className="mt-3 space-y-1 text-[12px] text-red-600">
          {errors.map((e) => (
            <li key={e}>⚠ {e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { kb };

/* ------------------------------- SEO editor ------------------------------- */

export function SeoEditor({
  seo,
  onChange,
  urlPath,
  fallbackTitle,
  fallbackDescription,
  d,
}: {
  seo: Seo;
  onChange: (s: Seo) => void;
  urlPath: string;
  fallbackTitle: string;
  fallbackDescription: string;
  d: CmsData;
}) {
  const set = <K extends keyof Seo>(k: K, v: Seo[K]) => onChange({ ...seo, [k]: v });
  const title = seo.title || fallbackTitle;
  const desc = seo.description || fallbackDescription;
  const base = d.settings.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <div className="space-y-5 rounded-lg border border-[var(--color-line)] bg-[var(--color-sand)]/50 p-5">
      <div className="flex items-center justify-between">
        <h3 className="eyebrow">SEO & Indexação</h3>
        <Pill tone={seo.index ? 'ok' : 'off'}>{seo.index ? 'Indexável' : 'noindex'}</Pill>
      </div>

      <Field label="SEO title" value={seo.title} onChange={(v) => set('title', v)} placeholder={fallbackTitle} max={60} />
      <Area
        label="Meta description"
        value={seo.description}
        onChange={(v) => set('description', v)}
        rows={3}
        max={160}
        hint={desc ? '' : 'Sem descrição, o Google escolhe um trecho aleatório da página.'}
      />

      {/* SERP preview */}
      <div className="rounded-md border border-[var(--color-line)] bg-white p-4">
        <p className="mb-2 text-[11px] uppercase tracking-[.14em] text-[var(--color-mute)]">Prévia no Google</p>
        <p className="serp-url">
          {base} › {urlPath.replace(/^\//, '').split('/').join(' › ')}
        </p>
        <p className="serp-title">{clamp(title, 60)}</p>
        <p className="serp-desc">{clamp(desc, 160) || 'Sem meta description definida.'}</p>
      </div>

      <Row>
        <Field label="H1 da página" value={seo.h1} onChange={(v) => set('h1', v)} placeholder="Herda o título" />
        <Field
          label="Canonical (opcional)"
          value={seo.canonical}
          onChange={(v) => set('canonical', v)}
          placeholder={`${d.settings.siteUrl}${urlPath}`}
          hint="Deixe vazio para gerar automaticamente."
        />
      </Row>

      <Row>
        <Toggle label="Indexar no Google" checked={seo.index} onChange={(v) => set('index', v)} hint="Desligado aplica noindex." />
        <Toggle label="Seguir links" checked={seo.follow} onChange={(v) => set('follow', v)} hint="Desligado aplica nofollow." />
      </Row>

      <details className="rounded-md border border-[var(--color-line)] bg-white p-4">
        <summary className="cursor-pointer text-[13px] font-medium">Open Graph / redes sociais</summary>
        <div className="mt-4 space-y-4">
          <Field label="OG title" value={seo.ogTitle} onChange={(v) => set('ogTitle', v)} placeholder={title} />
          <Area label="OG description" value={seo.ogDescription} onChange={(v) => set('ogDescription', v)} rows={2} />
          <PhotoPicker label="OG image (1200×630 recomendado)" value={seo.ogImageId} onChange={(v) => set('ogImageId', v)} />
        </div>
      </details>
    </div>
  );
}

export { slugify };
