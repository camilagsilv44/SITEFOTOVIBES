import { useEffect, useMemo, useState } from 'react';
import { Link, navigate, usePath } from '../lib/router';
import {
  useCms,
  setData,
  photoById,
  buildSitemap,
  buildRobots,
  registerRedirect,
  exportData,
  importData,
  resetData,
} from '../lib/store';
import type { Gallery, PageDoc, Photo, Service, Testimonial } from '../lib/types';
import { emptySeo, uid, slugify } from '../lib/types';
import { applyHead } from '../lib/seo';
import { isAuthed, login, logout, changePassword, touchSession, DEFAULT_PASSWORD, isDefaultPasswordLikely } from '../lib/auth';
import { onEvents, recentEvents } from '../lib/analytics';
import { delBlob, kb } from '../lib/images';
import { SmartImage } from '../components/ui';
import { Field, Area, Toggle, Select, Modal, Row, Pill, StringList, PhotoPicker, PhotosPicker, Uploader, SeoEditor } from './parts';

const SECTIONS = [
  ['', 'Painel'],
  ['midia', 'Mídia'],
  ['galerias', 'Galerias'],
  ['ensaios', 'Ensaios / Serviços'],
  ['depoimentos', 'Depoimentos'],
  ['paginas', 'Páginas'],
  ['home', 'Home & textos'],
  ['seo', 'SEO & indexação'],
  ['contato', 'Contato & CTAs'],
  ['analytics', 'Analytics'],
  ['seguranca', 'Segurança'],
] as const;

export default function Admin() {
  const d = useCms();
  const path = usePath();
  const [authed, setAuthed] = useState(isAuthed);

  useEffect(() => {
    applyHead(
      { title: 'Painel · Vibe Fotos', description: '', path, index: false, follow: false },
      d
    );
  }, [path, d]);

  useEffect(() => {
    if (!authed) return;
    const on = () => touchSession();
    window.addEventListener('click', on);
    const t = window.setInterval(() => setAuthed(isAuthed()), 60000);
    return () => {
      window.removeEventListener('click', on);
      window.clearInterval(t);
    };
  }, [authed]);

  if (!authed) return <LoginScreen onOk={() => setAuthed(true)} />;

  const section = path.replace(/^\/admin\/?/, '');

  return (
    <div className="min-h-screen bg-[var(--color-ivory)] lg:flex">
      <aside className="border-b border-[var(--color-line)] bg-white lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:sticky lg:top-0">
        <div className="flex items-center justify-between p-5">
          <div>
            <p className="display text-lg">Vibe Fotos</p>
            <p className="text-[11px] uppercase tracking-[.16em] text-[var(--color-mute)]">Painel de conteúdo</p>
          </div>
          <Link to="/" className="text-[12px] text-[var(--color-bronze)] lg:hidden">
            Ver site ↗
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {SECTIONS.map(([slug, label]) => {
            const to = `/admin${slug ? `/${slug}` : ''}`;
            const active = section === slug;
            return (
              <Link
                key={slug}
                to={to}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-[13.5px] transition-colors ${
                  active ? 'bg-[var(--color-ink)] text-white' : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-sand)]'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden border-t border-[var(--color-line)] p-4 lg:block">
          <Link to="/" className="btn btn-outline btn-sm w-full">
            Ver site ↗
          </Link>
          <button
            className="mt-2 w-full text-[12px] text-[var(--color-mute)] hover:text-red-600"
            onClick={() => {
              logout();
              setAuthed(false);
            }}
          >
            Sair do painel
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 p-5 lg:p-10">
        {section === '' && <Dashboard />}
        {section === 'midia' && <Media />}
        {section === 'galerias' && <Galleries />}
        {section === 'ensaios' && <Services />}
        {section === 'depoimentos' && <Testimonials />}
        {section === 'paginas' && <Pages />}
        {section === 'home' && <HomeText />}
        {section === 'seo' && <SeoCenter />}
        {section === 'contato' && <ContactSettings />}
        {section === 'analytics' && <AnalyticsPanel />}
        {section === 'seguranca' && <Security onLogout={() => setAuthed(false)} />}
      </div>
    </div>
  );
}

/* -------------------------------- login --------------------------------- */

function LoginScreen({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-ink)] p-5">
      <form
        className="w-full max-w-sm rounded-xl bg-[var(--color-ivory)] p-8"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const r = await login(pw);
          setBusy(false);
          if (r.ok) onOk();
          else setErr(r.error || 'Erro');
        }}
      >
        <p className="display text-2xl">Vibe Fotos</p>
        <p className="mt-1 text-[13px] text-[var(--color-mute)]">Acesso restrito ao painel de conteúdo.</p>
        <div className="mt-6">
          <Field label="Senha" type="password" value={pw} onChange={setPw} />
        </div>
        {err && <p className="mt-3 text-[12.5px] text-red-600">{err}</p>}
        <button className="btn btn-dark mt-5 w-full" disabled={busy}>
          {busy ? 'Verificando…' : 'Entrar'}
        </button>
        <p className="mt-5 rounded-md bg-[var(--color-sand)] p-3 text-[11.5px] leading-relaxed text-[var(--color-mute)]">
          Senha inicial: <strong className="text-[var(--color-ink)]">{DEFAULT_PASSWORD}</strong> — altere em Segurança após o
          primeiro acesso. Senhas são guardadas com PBKDF2 + salt, nunca em texto plano.
        </p>
        <Link to="/" className="mt-4 block text-center text-[12px] text-[var(--color-mute)] hover:text-[var(--color-ink)]">
          ← Voltar ao site
        </Link>
      </form>
    </div>
  );
}

/* -------------------------------- shared -------------------------------- */

function Head({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="display text-2xl">{title}</h1>
        {text && <p className="mt-1 max-w-2xl text-[13.5px] text-[var(--color-mute)]">{text}</p>}
      </div>
      {action}
    </div>
  );
}

function ListCard({
  cover,
  title,
  meta,
  badges,
  onEdit,
  onDelete,
  href,
  onMove,
}: {
  cover?: Photo;
  title: string;
  meta: string;
  badges?: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  href?: string;
  onMove?: (dir: -1 | 1) => void;
}) {
  return (
    <div className="card flex items-center gap-4 p-3">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md">
        <SmartImage photo={cover} sizes="64px" ratio={1} zoom={false} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14.5px] font-medium">{title}</p>
        <p className="truncate text-[12.5px] text-[var(--color-mute)]">{meta}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">{badges}</div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {onMove && (
          <>
            <button onClick={() => onMove(-1)} className="px-1.5 text-[var(--color-mute)] hover:text-[var(--color-ink)]" aria-label="Subir">
              ↑
            </button>
            <button onClick={() => onMove(1)} className="px-1.5 text-[var(--color-mute)] hover:text-[var(--color-ink)]" aria-label="Descer">
              ↓
            </button>
          </>
        )}
        {href && (
          <a href={href} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
            Ver
          </a>
        )}
        <button onClick={onEdit} className="btn btn-dark btn-sm">
          Editar
        </button>
        <button onClick={onDelete} className="px-2 text-[var(--color-mute)] hover:text-red-600" aria-label="Excluir">
          🗑
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- dashboard ------------------------------- */

function Dashboard() {
  const d = useCms();
  const stats = [
    ['Fotografias', d.photos.length],
    ['Galerias publicadas', d.galleries.filter((g) => g.published).length],
    ['Ensaios ativos', d.services.filter((s) => s.published).length],
    ['Depoimentos', d.testimonials.filter((t) => t.published).length],
    ['Redirects 301', d.redirects.length],
    ['Páginas indexáveis', d.galleries.filter((g) => g.published && g.seo.index).length + d.services.filter((s) => s.published && s.seo.index).length + 5],
  ] as [string, number][];

  const missingAlt = d.photos.filter((p) => !p.alt.trim()).length;
  const missingSeo = [
    ...d.galleries.filter((g) => g.published && !g.seo.description).map((g) => `Galeria "${g.title}" sem meta description`),
    ...d.services.filter((s) => s.published && !s.seo.description).map((s) => `Ensaio "${s.title}" sem meta description`),
  ];

  return (
    <>
      <Head title="Painel" text="Visão geral do conteúdo publicado e da saúde de SEO do site." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(([l, v]) => (
          <div key={l} className="card p-5">
            <p className="display text-3xl">{v}</p>
            <p className="mt-1 text-[12.5px] text-[var(--color-mute)]">{l}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="eyebrow">Saúde de SEO</h2>
          <ul className="mt-4 space-y-2 text-[13.5px]">
            <li className="flex items-center gap-2">
              {missingAlt === 0 ? '✅' : '⚠️'} {missingAlt === 0 ? 'Todas as imagens têm alt text' : `${missingAlt} imagens sem alt text`}
            </li>
            {missingSeo.length === 0 ? (
              <li className="flex items-center gap-2">✅ Todas as páginas publicadas têm meta description</li>
            ) : (
              missingSeo.slice(0, 5).map((m) => (
                <li key={m} className="flex items-center gap-2">
                  ⚠️ {m}
                </li>
              ))
            )}
            <li className="flex items-center gap-2">
              {isDefaultPasswordLikely() ? '⚠️ Senha padrão ainda em uso — altere em Segurança' : '✅ Senha personalizada configurada'}
            </li>
          </ul>
        </div>

        <div className="card p-5">
          <h2 className="eyebrow">Atalhos</h2>
          <div className="mt-4 grid gap-2">
            <Link to="/admin/galerias" className="btn btn-outline btn-sm">
              + Nova galeria
            </Link>
            <Link to="/admin/midia" className="btn btn-outline btn-sm">
              Enviar fotografias
            </Link>
            <Link to="/admin/seo" className="btn btn-outline btn-sm">
              Sitemap & indexação
            </Link>
          </div>
        </div>
      </div>

      <div className="card mt-8 p-5">
        <h2 className="eyebrow">Backup do conteúdo</h2>
        <p className="mt-2 text-[13px] text-[var(--color-mute)]">
          Exporte um JSON com todo o conteúdo (textos, galerias, SEO). As imagens enviadas ficam no armazenamento local do
          navegador (IndexedDB) e são otimizadas em WebP.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              const blob = new Blob([exportData()], { type: 'application/json' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = 'vibefotos-conteudo.json';
              a.click();
            }}
          >
            Exportar JSON
          </button>
          <label className="btn btn-outline btn-sm cursor-pointer">
            Importar JSON
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const ok = importData(await f.text());
                alert(ok ? 'Conteúdo importado.' : 'Arquivo inválido.');
              }}
            />
          </label>
          <button
            className="btn btn-outline btn-sm !border-red-300 !text-red-600"
            onClick={() => confirm('Restaurar o conteúdo original de demonstração?') && resetData()}
          >
            Restaurar padrão
          </button>
        </div>
      </div>
    </>
  );
}

/* --------------------------------- media --------------------------------- */

function Media() {
  const d = useCms();
  const [cat, setCat] = useState(d.categories[0]?.id || '');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState<Photo | null>(null);
  const list = filter === 'all' ? d.photos : d.photos.filter((p) => p.categoryId === filter);

  const addPhotos = (photos: Photo[]) => setData((x) => void x.photos.unshift(...photos));

  const remove = (p: Photo) => {
    if (!confirm(`Excluir "${p.alt || 'foto'}"? Ela será removida das galerias também.`)) return;
    Object.values(p.sources).forEach((s) => delBlob(s));
    setData((x) => {
      x.photos = x.photos.filter((i) => i.id !== p.id);
      x.galleries.forEach((g) => {
        g.photoIds = g.photoIds.filter((i) => i !== p.id);
        if (g.coverPhotoId === p.id) g.coverPhotoId = g.photoIds[0] || '';
      });
      x.services.forEach((s) => {
        s.photoIds = s.photoIds.filter((i) => i !== p.id);
        if (s.coverPhotoId === p.id) s.coverPhotoId = s.photoIds[0] || '';
      });
    });
  };

  return (
    <>
      <Head
        title="Mídia"
        text="Envie várias fotos de uma vez. Cada arquivo é convertido para WebP em três larguras (480/1080/1920) com placeholder de baixa resolução."
      />

      <div className="card mb-6 p-5">
        <div className="mb-4 max-w-xs">
          <Select
            label="Categoria dos próximos uploads"
            value={cat}
            onChange={setCat}
            options={d.categories.map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>
        <Uploader categoryId={cat} onDone={addPhotos} />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button className="chip" data-active={filter === 'all'} onClick={() => setFilter('all')}>
          Todas ({d.photos.length})
        </button>
        {d.categories.map((c) => (
          <button key={c.id} className="chip" data-active={filter === c.id} onClick={() => setFilter(c.id)}>
            {c.name} ({d.photos.filter((p) => p.categoryId === c.id).length})
          </button>
        ))}
        <button
          className="chip"
          onClick={() => {
            const name = prompt('Nome da nova categoria');
            if (!name) return;
            setData((x) => void x.categories.push({ id: uid('cat'), name, slug: slugify(name) }));
          }}
        >
          + categoria
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {list.map((p) => (
          <figure key={p.id} className="card overflow-hidden">
            <button className="block w-full" onClick={() => setEditing(p)} aria-label={`Editar ${p.alt}`}>
              <SmartImage photo={p} sizes="220px" ratio={1} />
            </button>
            <figcaption className="p-2.5">
              <p className="truncate text-[12px]">{p.alt || <span className="text-red-600">sem alt text</span>}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[11px] text-[var(--color-mute)]">{p.bytes ? kb(p.bytes) : 'CDN'}</span>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(p)} className="text-[11px] text-[var(--color-bronze)]">
                    editar
                  </button>
                  <button onClick={() => remove(p)} className="text-[11px] text-[var(--color-mute)] hover:text-red-600">
                    excluir
                  </button>
                </div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar fotografia">
        {editing && (
          <PhotoEditor
            photo={editing}
            onClose={() => setEditing(null)}
            onSave={(next) => {
              setData((x) => {
                const i = x.photos.findIndex((p) => p.id === next.id);
                if (i >= 0) x.photos[i] = next;
              });
              setEditing(null);
            }}
          />
        )}
      </Modal>
    </>
  );
}

function PhotoEditor({ photo, onSave, onClose }: { photo: Photo; onSave: (p: Photo) => void; onClose: () => void }) {
  const d = useCms();
  const [p, setP] = useState(photo);
  return (
    <div className="space-y-4">
      <div className="mx-auto max-w-[220px]">
        <SmartImage photo={p} sizes="220px" ratio={p.width / p.height} zoom={false} />
      </div>
      <Field label="Alt text (acessibilidade + SEO)" value={p.alt} onChange={(v) => setP({ ...p, alt: v })} max={125} hint="Descreva a cena objetivamente." />
      <Field label="Legenda (opcional)" value={p.caption} onChange={(v) => setP({ ...p, caption: v })} />
      <Row>
        <Select
          label="Categoria"
          value={p.categoryId}
          onChange={(v) => setP({ ...p, categoryId: v })}
          options={d.categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <Toggle label="Destacar na Home" checked={p.featured} onChange={(v) => setP({ ...p, featured: v })} hint="Aparece na faixa de destaques." />
      </Row>
      <p className="text-[11.5px] text-[var(--color-mute)]">
        {p.width}×{p.height}px · variantes 480/1080/1920 {p.bytes ? `· ${kb(p.bytes)} no total` : '· servida por CDN'}
      </p>
      <div className="flex justify-end gap-2">
        <button className="btn btn-outline btn-sm" onClick={onClose}>
          Cancelar
        </button>
        <button className="btn btn-dark btn-sm" onClick={() => onSave(p)}>
          Salvar
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- galleries -------------------------------- */

function Galleries() {
  const d = useCms();
  const [edit, setEdit] = useState<Gallery | null>(null);

  const blank = (): Gallery => ({
    id: uid('gal'),
    title: '',
    slug: '',
    description: '',
    coverPhotoId: '',
    photoIds: [],
    categoryId: d.categories[0]?.id || '',
    date: new Date().toISOString().slice(0, 10),
    featured: false,
    published: false,
    seo: emptySeo(),
  });

  return (
    <>
      <Head
        title="Galerias"
        text="Cada galeria vira uma página pública em /portfolio/slug, com breadcrumb, dados estruturados e entrada automática no sitemap."
        action={
          <button className="btn btn-dark btn-sm" onClick={() => setEdit(blank())}>
            + Nova galeria
          </button>
        }
      />
      <div className="space-y-3">
        {d.galleries.map((g) => (
          <ListCard
            key={g.id}
            cover={photoById(d, g.coverPhotoId)}
            title={g.title || '(sem título)'}
            meta={`/portfolio/${g.slug} · ${g.photoIds.length} fotos`}
            href={`/portfolio/${g.slug}`}
            badges={
              <>
                <Pill tone={g.published ? 'ok' : 'off'}>{g.published ? 'Publicada' : 'Rascunho'}</Pill>
                {g.featured && <Pill tone="warn">Destaque na Home</Pill>}
                <Pill tone={g.seo.index ? 'neutral' : 'off'}>{g.seo.index ? 'index' : 'noindex'}</Pill>
              </>
            }
            onEdit={() => setEdit(g)}
            onDelete={() => confirm(`Excluir a galeria "${g.title}"?`) && setData((x) => void (x.galleries = x.galleries.filter((i) => i.id !== g.id)))}
          />
        ))}
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.title ? `Editar: ${edit.title}` : 'Nova galeria'} wide>
        {edit && <GalleryForm key={edit.id} initial={edit} onClose={() => setEdit(null)} />}
      </Modal>
    </>
  );
}

function GalleryForm({ initial, onClose }: { initial: Gallery; onClose: () => void }) {
  const d = useCms();
  const [g, setG] = useState(initial);
  const set = <K extends keyof Gallery>(k: K, v: Gallery[K]) => setG((p) => ({ ...p, [k]: v }));
  const exists = d.galleries.some((x) => x.id === g.id);

  const save = () => {
    const slug = slugify(g.slug || g.title);
    if (!g.title || !slug) return alert('Título e URL são obrigatórios.');
    if (d.galleries.some((x) => x.slug === slug && x.id !== g.id)) return alert('Já existe uma galeria com essa URL.');
    const next = { ...g, slug, coverPhotoId: g.coverPhotoId || g.photoIds[0] || '' };
    if (exists && initial.slug && initial.slug !== slug) registerRedirect(`/portfolio/${initial.slug}`, `/portfolio/${slug}`);
    setData((x) => {
      const i = x.galleries.findIndex((y) => y.id === next.id);
      if (i >= 0) x.galleries[i] = next;
      else x.galleries.unshift(next);
    });
    onClose();
  };

  return (
    <div className="space-y-5">
      <Row>
        <Field label="Título" value={g.title} onChange={(v) => set('title', v)} />
        <Field
          label="URL (slug)"
          value={g.slug}
          onChange={(v) => set('slug', slugify(v))}
          placeholder={slugify(g.title)}
          hint={`/portfolio/${g.slug || slugify(g.title) || '...'} — mudar gera um redirect 301 automático`}
        />
      </Row>
      <Area label="Descrição" value={g.description} onChange={(v) => set('description', v)} rows={3} />
      <Row cols={3}>
        <Select label="Categoria" value={g.categoryId} onChange={(v) => set('categoryId', v)} options={d.categories.map((c) => ({ value: c.id, label: c.name }))} />
        <Field label="Data" type="date" value={g.date} onChange={(v) => set('date', v)} />
        <PhotoPicker label="Foto de capa" value={g.coverPhotoId} onChange={(v) => set('coverPhotoId', v)} />
      </Row>
      <PhotosPicker label="Fotografias da galeria" value={g.photoIds} onChange={(v) => set('photoIds', v)} />
      <Row>
        <Toggle label="Publicada" checked={g.published} onChange={(v) => set('published', v)} hint="Rascunhos não aparecem no site nem no sitemap." />
        <Toggle label="Destaque na Home" checked={g.featured} onChange={(v) => set('featured', v)} />
      </Row>
      <SeoEditor
        seo={g.seo}
        onChange={(s) => set('seo', s)}
        urlPath={`/portfolio/${g.slug || slugify(g.title)}`}
        fallbackTitle={`${g.title} | ${d.settings.brand}`}
        fallbackDescription={g.description.slice(0, 158)}
        d={d}
      />
      <div className="flex justify-end gap-2 border-t border-[var(--color-line)] pt-4">
        <button className="btn btn-outline btn-sm" onClick={onClose}>
          Cancelar
        </button>
        <button className="btn btn-dark btn-sm" onClick={save}>
          {g.published ? 'Publicar alterações' : 'Salvar rascunho'}
        </button>
      </div>
    </div>
  );
}

/* -------------------------------- services -------------------------------- */

function Services() {
  const d = useCms();
  const [edit, setEdit] = useState<Service | null>(null);

  const blank = (): Service => ({
    id: uid('srv'),
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    coverPhotoId: '',
    photoIds: [],
    priceFrom: '',
    duration: '',
    includes: [],
    ctaLabel: 'Quero meu ensaio',
    ctaMessage: 'Oi Giovana! Quero saber mais sobre esse ensaio.',
    order: d.services.length + 1,
    published: false,
    seo: emptySeo(),
  });

  const move = (s: Service, dir: -1 | 1) =>
    setData((x) => {
      const sorted = [...x.services].sort((a, b) => a.order - b.order);
      const i = sorted.findIndex((y) => y.id === s.id);
      const j = i + dir;
      if (j < 0 || j >= sorted.length) return;
      [sorted[i].order, sorted[j].order] = [sorted[j].order, sorted[i].order];
    });

  return (
    <>
      <Head
        title="Ensaios / Serviços"
        text="Cada serviço gera uma página em /ensaios/slug com Schema.org Service, FAQ e CTA próprio de WhatsApp."
        action={
          <button className="btn btn-dark btn-sm" onClick={() => setEdit(blank())}>
            + Novo ensaio
          </button>
        }
      />
      <div className="space-y-3">
        {[...d.services]
          .sort((a, b) => a.order - b.order)
          .map((s) => (
            <ListCard
              key={s.id}
              cover={photoById(d, s.coverPhotoId)}
              title={s.title || '(sem título)'}
              meta={`/ensaios/${s.slug} · ${s.priceFrom || 'sem preço'}`}
              href={`/ensaios/${s.slug}`}
              onMove={(dir) => move(s, dir)}
              badges={
                <>
                  <Pill tone={s.published ? 'ok' : 'off'}>{s.published ? 'Publicado' : 'Rascunho'}</Pill>
                  <Pill tone={s.seo.index ? 'neutral' : 'off'}>{s.seo.index ? 'index' : 'noindex'}</Pill>
                </>
              }
              onEdit={() => setEdit(s)}
              onDelete={() => confirm(`Excluir "${s.title}"?`) && setData((x) => void (x.services = x.services.filter((i) => i.id !== s.id)))}
            />
          ))}
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.title ? `Editar: ${edit.title}` : 'Novo ensaio'} wide>
        {edit && <ServiceForm key={edit.id} initial={edit} onClose={() => setEdit(null)} />}
      </Modal>
    </>
  );
}

function ServiceForm({ initial, onClose }: { initial: Service; onClose: () => void }) {
  const d = useCms();
  const [s, setS] = useState(initial);
  const set = <K extends keyof Service>(k: K, v: Service[K]) => setS((p) => ({ ...p, [k]: v }));
  const exists = d.services.some((x) => x.id === s.id);

  const save = () => {
    const slug = slugify(s.slug || s.title);
    if (!s.title || !slug) return alert('Título e URL são obrigatórios.');
    if (d.services.some((x) => x.slug === slug && x.id !== s.id)) return alert('Já existe um ensaio com essa URL.');
    const next = { ...s, slug };
    if (exists && initial.slug && initial.slug !== slug) registerRedirect(`/ensaios/${initial.slug}`, `/ensaios/${slug}`);
    setData((x) => {
      const i = x.services.findIndex((y) => y.id === next.id);
      if (i >= 0) x.services[i] = next;
      else x.services.push(next);
    });
    onClose();
  };

  return (
    <div className="space-y-5">
      <Row>
        <Field label="Título" value={s.title} onChange={(v) => set('title', v)} />
        <Field label="URL (slug)" value={s.slug} onChange={(v) => set('slug', slugify(v))} placeholder={slugify(s.title)} hint={`/ensaios/${s.slug || slugify(s.title) || '...'}`} />
      </Row>
      <Area label="Resumo (aparece nos cards)" value={s.excerpt} onChange={(v) => set('excerpt', v)} rows={2} max={160} />
      <Area label="Descrição completa" value={s.body} onChange={(v) => set('body', v)} rows={6} hint="Separe parágrafos com uma linha em branco." />
      <Row cols={3}>
        <Field label="Investimento (a partir de)" value={s.priceFrom} onChange={(v) => set('priceFrom', v)} placeholder="R$ 690" />
        <Field label="Duração / formato" value={s.duration} onChange={(v) => set('duration', v)} placeholder="2 horas · 2 looks" />
        <PhotoPicker label="Foto de capa" value={s.coverPhotoId} onChange={(v) => set('coverPhotoId', v)} />
      </Row>
      <StringList label="O que está incluso" items={s.includes} onChange={(v) => set('includes', v)} />
      <PhotosPicker label="Galeria do serviço" value={s.photoIds} onChange={(v) => set('photoIds', v)} />
      <Row>
        <Field label="Texto do botão (CTA)" value={s.ctaLabel} onChange={(v) => set('ctaLabel', v)} />
        <Field label="Mensagem automática no WhatsApp" value={s.ctaMessage} onChange={(v) => set('ctaMessage', v)} />
      </Row>
      <Toggle label="Publicado" checked={s.published} onChange={(v) => set('published', v)} />
      <SeoEditor
        seo={s.seo}
        onChange={(v) => set('seo', v)}
        urlPath={`/ensaios/${s.slug || slugify(s.title)}`}
        fallbackTitle={`${s.title} | ${d.settings.brand}`}
        fallbackDescription={s.excerpt}
        d={d}
      />
      <div className="flex justify-end gap-2 border-t border-[var(--color-line)] pt-4">
        <button className="btn btn-outline btn-sm" onClick={onClose}>
          Cancelar
        </button>
        <button className="btn btn-dark btn-sm" onClick={save}>
          Salvar
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ testimonials ------------------------------ */

function Testimonials() {
  const d = useCms();
  const [edit, setEdit] = useState<Testimonial | null>(null);
  const blank = (): Testimonial => ({
    id: uid('tes'),
    name: '',
    sessionType: '',
    quote: '',
    rating: 5,
    photoId: '',
    avatarUrl: '',
    order: d.testimonials.length + 1,
    published: true,
  });

  return (
    <>
      <Head
        title="Depoimentos"
        text="Prova social exibida na Home e usada nos dados estruturados de avaliação (AggregateRating)."
        action={
          <button className="btn btn-dark btn-sm" onClick={() => setEdit(blank())}>
            + Novo depoimento
          </button>
        }
      />
      <div className="space-y-3">
        {[...d.testimonials]
          .sort((a, b) => a.order - b.order)
          .map((t) => (
            <ListCard
              key={t.id}
              cover={photoById(d, t.photoId)}
              title={`${t.name} — ${'★'.repeat(t.rating)}`}
              meta={t.quote.slice(0, 90)}
              badges={<Pill tone={t.published ? 'ok' : 'off'}>{t.published ? 'Publicado' : 'Oculto'}</Pill>}
              onEdit={() => setEdit(t)}
              onDelete={() => confirm('Excluir depoimento?') && setData((x) => void (x.testimonials = x.testimonials.filter((i) => i.id !== t.id)))}
            />
          ))}
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title="Depoimento">
        {edit && (
          <TestimonialForm
            key={edit.id}
            initial={edit}
            onClose={() => setEdit(null)}
            onSave={(t) => {
              setData((x) => {
                const i = x.testimonials.findIndex((y) => y.id === t.id);
                if (i >= 0) x.testimonials[i] = t;
                else x.testimonials.push(t);
              });
              setEdit(null);
            }}
          />
        )}
      </Modal>
    </>
  );
}

function TestimonialForm({ initial, onSave, onClose }: { initial: Testimonial; onSave: (t: Testimonial) => void; onClose: () => void }) {
  const [t, setT] = useState(initial);
  const set = <K extends keyof Testimonial>(k: K, v: Testimonial[K]) => setT((p) => ({ ...p, [k]: v }));
  return (
    <div className="space-y-4">
      <Row>
        <Field label="Nome do cliente" value={t.name} onChange={(v) => set('name', v)} />
        <Field label="Tipo de ensaio" value={t.sessionType} onChange={(v) => set('sessionType', v)} />
      </Row>
      <Area label="Depoimento" value={t.quote} onChange={(v) => set('quote', v)} rows={4} />
      <Row>
        <Select
          label="Avaliação"
          value={String(t.rating)}
          onChange={(v) => set('rating', Number(v))}
          options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${'★'.repeat(n)} (${n})` }))}
        />
        <PhotoPicker label="Foto do cliente" value={t.photoId} onChange={(v) => set('photoId', v)} />
      </Row>
      <Toggle label="Publicado" checked={t.published} onChange={(v) => set('published', v)} />
      <div className="flex justify-end gap-2">
        <button className="btn btn-outline btn-sm" onClick={onClose}>
          Cancelar
        </button>
        <button className="btn btn-dark btn-sm" onClick={() => onSave(t)}>
          Salvar
        </button>
      </div>
    </div>
  );
}

/* --------------------------------- pages ---------------------------------- */

function Pages() {
  const d = useCms();
  const [edit, setEdit] = useState<PageDoc | null>(null);
  const blank = (): PageDoc => ({ id: uid('pg'), title: '', slug: '', intro: '', blocks: [], published: false, seo: emptySeo() });

  return (
    <>
      <Head
        title="Páginas"
        text="Páginas de conteúdo livres, publicadas em URL raiz (ex.: /marketing). Ideal para serviços paralelos e conteúdo editorial."
        action={
          <button className="btn btn-dark btn-sm" onClick={() => setEdit(blank())}>
            + Nova página
          </button>
        }
      />
      <div className="space-y-3">
        {d.pages.map((p) => (
          <ListCard
            key={p.id}
            title={p.title}
            meta={`/${p.slug} · ${p.blocks.length} blocos`}
            href={`/${p.slug}`}
            badges={
              <>
                <Pill tone={p.published ? 'ok' : 'off'}>{p.published ? 'Publicada' : 'Rascunho'}</Pill>
                <Pill tone={p.seo.index ? 'neutral' : 'off'}>{p.seo.index ? 'index' : 'noindex'}</Pill>
              </>
            }
            onEdit={() => setEdit(p)}
            onDelete={() => confirm(`Excluir "${p.title}"?`) && setData((x) => void (x.pages = x.pages.filter((i) => i.id !== p.id)))}
          />
        ))}
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.title || 'Nova página'} wide>
        {edit && <PageForm key={edit.id} initial={edit} onClose={() => setEdit(null)} />}
      </Modal>
    </>
  );
}

function PageForm({ initial, onClose }: { initial: PageDoc; onClose: () => void }) {
  const d = useCms();
  const [p, setP] = useState(initial);
  const set = <K extends keyof PageDoc>(k: K, v: PageDoc[K]) => setP((x) => ({ ...x, [k]: v }));
  const exists = d.pages.some((x) => x.id === p.id);

  const save = () => {
    const slug = slugify(p.slug || p.title);
    const reserved = ['portfolio', 'ensaios', 'sobre', 'contato', 'admin'];
    if (!p.title || !slug) return alert('Título e URL são obrigatórios.');
    if (reserved.includes(slug)) return alert('Essa URL é reservada pelo sistema.');
    if (d.pages.some((x) => x.slug === slug && x.id !== p.id)) return alert('Já existe uma página com essa URL.');
    if (exists && initial.slug && initial.slug !== slug) registerRedirect(`/${initial.slug}`, `/${slug}`);
    const next = { ...p, slug };
    setData((x) => {
      const i = x.pages.findIndex((y) => y.id === next.id);
      if (i >= 0) x.pages[i] = next;
      else x.pages.push(next);
    });
    onClose();
  };

  return (
    <div className="space-y-5">
      <Row>
        <Field label="Título" value={p.title} onChange={(v) => set('title', v)} />
        <Field label="URL (slug)" value={p.slug} onChange={(v) => set('slug', slugify(v))} hint={`/${p.slug || slugify(p.title) || '...'}`} />
      </Row>
      <Area label="Introdução" value={p.intro} onChange={(v) => set('intro', v)} rows={3} />

      <div className="space-y-4">
        <span className="label">Blocos de conteúdo</span>
        {p.blocks.map((b, i) => (
          <div key={i} className="card space-y-3 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[var(--color-mute)]">Bloco {i + 1}</span>
              <button className="text-[12px] text-[var(--color-mute)] hover:text-red-600" onClick={() => set('blocks', p.blocks.filter((_, j) => j !== i))}>
                remover
              </button>
            </div>
            <Field label="Título (H2)" value={b.heading} onChange={(v) => set('blocks', p.blocks.map((x, j) => (j === i ? { ...x, heading: v } : x)))} />
            <Area label="Texto" value={b.text} onChange={(v) => set('blocks', p.blocks.map((x, j) => (j === i ? { ...x, text: v } : x)))} rows={3} />
            <StringList label="Lista de itens" items={b.items} onChange={(v) => set('blocks', p.blocks.map((x, j) => (j === i ? { ...x, items: v } : x)))} />
          </div>
        ))}
        <button className="btn btn-outline btn-sm" onClick={() => set('blocks', [...p.blocks, { heading: '', text: '', items: [] }])}>
          + Adicionar bloco
        </button>
      </div>

      <Toggle label="Publicada" checked={p.published} onChange={(v) => set('published', v)} />
      <SeoEditor seo={p.seo} onChange={(v) => set('seo', v)} urlPath={`/${p.slug || slugify(p.title)}`} fallbackTitle={`${p.title} | ${d.settings.brand}`} fallbackDescription={p.intro.slice(0, 158)} d={d} />
      <div className="flex justify-end gap-2 border-t border-[var(--color-line)] pt-4">
        <button className="btn btn-outline btn-sm" onClick={onClose}>
          Cancelar
        </button>
        <button className="btn btn-dark btn-sm" onClick={save}>
          Salvar
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- home texts ------------------------------- */

function HomeText() {
  const d = useCms();
  const h = d.settings.home;
  const set = (patch: Partial<typeof h>) => setData((x) => void Object.assign(x.settings.home, patch));

  return (
    <>
      <Head title="Home & textos" text="Controle o herói, a proposta de valor, os diferenciais, o passo a passo e o CTA final." />
      <div className="space-y-6">
        <section className="card space-y-4 p-5">
          <h2 className="eyebrow">Primeira dobra</h2>
          <Row>
            <Field label="Kicker" value={h.heroKicker} onChange={(v) => set({ heroKicker: v })} />
            <PhotoPicker label="Fotografia do herói (LCP)" value={h.heroPhotoId} onChange={(v) => set({ heroPhotoId: v })} />
          </Row>
          <Field label="Título (H1)" value={h.heroTitle} onChange={(v) => set({ heroTitle: v })} />
          <Area label="Subtítulo" value={h.heroSubtitle} onChange={(v) => set({ heroSubtitle: v })} rows={2} />
          <Row>
            <Field label="CTA primário" value={h.ctaPrimary} onChange={(v) => set({ ctaPrimary: v })} />
            <Field label="CTA secundário" value={h.ctaSecondary} onChange={(v) => set({ ctaSecondary: v })} />
          </Row>
        </section>

        <section className="card space-y-4 p-5">
          <h2 className="eyebrow">Proposta de valor</h2>
          <Area label="Texto" value={d.settings.valueProp} onChange={(v) => setData((x) => void (x.settings.valueProp = v))} rows={3} />
        </section>

        <section className="card space-y-4 p-5">
          <h2 className="eyebrow">Diferenciais</h2>
          {h.differentials.map((f, i) => (
            <div key={i} className="grid gap-3 border-b border-[var(--color-line)] pb-4 md:grid-cols-[1fr_2fr_auto]">
              <Field label="Título" value={f.title} onChange={(v) => set({ differentials: h.differentials.map((x, j) => (j === i ? { ...x, title: v } : x)) })} />
              <Area label="Texto" value={f.text} onChange={(v) => set({ differentials: h.differentials.map((x, j) => (j === i ? { ...x, text: v } : x)) })} rows={2} />
              <button className="self-end pb-2 text-[12px] text-[var(--color-mute)] hover:text-red-600" onClick={() => set({ differentials: h.differentials.filter((_, j) => j !== i) })}>
                remover
              </button>
            </div>
          ))}
          <button className="btn btn-outline btn-sm" onClick={() => set({ differentials: [...h.differentials, { title: '', text: '' }] })}>
            + Adicionar diferencial
          </button>
        </section>

        <section className="card space-y-4 p-5">
          <h2 className="eyebrow">Como funciona</h2>
          {h.steps.map((f, i) => (
            <div key={i} className="grid gap-3 border-b border-[var(--color-line)] pb-4 md:grid-cols-[1fr_2fr_auto]">
              <Field label={`Passo ${i + 1}`} value={f.title} onChange={(v) => set({ steps: h.steps.map((x, j) => (j === i ? { ...x, title: v } : x)) })} />
              <Area label="Texto" value={f.text} onChange={(v) => set({ steps: h.steps.map((x, j) => (j === i ? { ...x, text: v } : x)) })} rows={2} />
              <button className="self-end pb-2 text-[12px] text-[var(--color-mute)] hover:text-red-600" onClick={() => set({ steps: h.steps.filter((_, j) => j !== i) })}>
                remover
              </button>
            </div>
          ))}
          <button className="btn btn-outline btn-sm" onClick={() => set({ steps: [...h.steps, { title: '', text: '' }] })}>
            + Adicionar passo
          </button>
        </section>

        <section className="card space-y-4 p-5">
          <h2 className="eyebrow">Sobre / bio</h2>
          <Row>
            <Field label="Título" value={h.aboutTitle} onChange={(v) => set({ aboutTitle: v })} />
            <PhotoPicker label="Retrato da fotógrafa" value={h.aboutPhotoId} onChange={(v) => set({ aboutPhotoId: v })} />
          </Row>
          <Area label="Biografia" value={h.aboutText} onChange={(v) => set({ aboutText: v })} rows={8} hint="Separe parágrafos com uma linha em branco." />
        </section>

        <section className="card space-y-4 p-5">
          <h2 className="eyebrow">CTA final</h2>
          <Field label="Título" value={h.finalCtaTitle} onChange={(v) => set({ finalCtaTitle: v })} />
          <Area label="Texto" value={h.finalCtaText} onChange={(v) => set({ finalCtaText: v })} rows={2} />
        </section>
      </div>
    </>
  );
}

/* -------------------------------- SEO center ------------------------------ */

function SeoCenter() {
  const d = useCms();
  const sitemap = useMemo(() => buildSitemap(d), [d]);
  const robots = useMemo(() => buildRobots(d), [d]);

  const download = (name: string, content: string, type: string) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = name;
    a.click();
  };

  const rows = [
    ...d.galleries.map((g) => ({ id: g.id, kind: 'Galeria', title: g.title, url: `/portfolio/${g.slug}`, pub: g.published, index: g.seo.index, desc: !!g.seo.description })),
    ...d.services.map((s) => ({ id: s.id, kind: 'Ensaio', title: s.title, url: `/ensaios/${s.slug}`, pub: s.published, index: s.seo.index, desc: !!s.seo.description })),
    ...d.pages.map((p) => ({ id: p.id, kind: 'Página', title: p.title, url: `/${p.slug}`, pub: p.published, index: p.seo.index, desc: !!p.seo.description })),
  ];

  const toggleIndex = (id: string) =>
    setData((x) => {
      [...x.galleries, ...x.services, ...x.pages].forEach((e) => {
        if (e.id === id) e.seo.index = !e.seo.index;
      });
    });

  return (
    <>
      <Head title="SEO & indexação" text="Controle o que entra no Google, gere sitemap/robots e acompanhe os redirects 301." />

      <div className="card mb-6 overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-[var(--color-sand)] text-[11px] uppercase tracking-[.12em] text-[var(--color-mute)]">
            <tr>
              <th className="px-4 py-3">Conteúdo</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Indexação</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-[var(--color-line)]">
                <td className="px-4 py-3">
                  <span className="text-[11px] uppercase tracking-wider text-[var(--color-mute)]">{r.kind}</span>
                  <br />
                  {r.title}
                </td>
                <td className="px-4 py-3 font-mono text-[12px] text-[var(--color-ink-soft)]">{r.url}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <Pill tone={r.pub ? 'ok' : 'off'}>{r.pub ? 'publicado' : 'rascunho'}</Pill>
                    {!r.desc && <Pill tone="warn">sem description</Pill>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button className="chip" data-active={r.index} onClick={() => toggleIndex(r.id)}>
                    {r.index ? 'Indexar' : 'Não indexar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="eyebrow">sitemap.xml</h2>
            <button className="btn btn-outline btn-sm" onClick={() => download('sitemap.xml', sitemap, 'application/xml')}>
              Baixar
            </button>
          </div>
          <pre className="mt-3 max-h-64 overflow-auto rounded-md bg-[var(--color-ink)] p-4 text-[11px] leading-relaxed text-[#d7cfc4] scrollbar-thin">{sitemap}</pre>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="eyebrow">robots.txt</h2>
            <button className="btn btn-outline btn-sm" onClick={() => download('robots.txt', robots, 'text/plain')}>
              Baixar
            </button>
          </div>
          <pre className="mt-3 max-h-64 overflow-auto rounded-md bg-[var(--color-ink)] p-4 text-[11px] leading-relaxed text-[#d7cfc4]">{robots}</pre>
        </div>
      </div>

      <div className="card mt-6 p-5">
        <h2 className="eyebrow">Redirecionamentos 301</h2>
        <p className="mt-2 text-[13px] text-[var(--color-mute)]">
          Criados automaticamente quando você altera o slug de uma galeria, ensaio ou página — assim nenhum link antigo quebra.
        </p>
        <div className="mt-4 space-y-2">
          {d.redirects.length === 0 && <p className="text-[13px] text-[var(--color-mute)]">Nenhum redirect ainda.</p>}
          {d.redirects.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 rounded-md border border-[var(--color-line)] bg-white px-3 py-2 font-mono text-[12px]">
              <span className="truncate">
                {r.from} <span className="text-[var(--color-bronze)]">→</span> {r.to} <Pill>301</Pill>
              </span>
              <button className="text-[var(--color-mute)] hover:text-red-600" onClick={() => setData((x) => void (x.redirects = x.redirects.filter((i) => i.id !== r.id)))}>
                remover
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------------------------- contact settings ---------------------------- */

function ContactSettings() {
  const d = useCms();
  const s = d.settings;
  const set = (fn: (st: typeof s) => void) => setData((x) => void fn(x.settings));

  return (
    <>
      <Head title="Contato & CTAs" text="Número de WhatsApp, mensagem automática, texto dos botões, e-mail e redes sociais." />
      <div className="space-y-6">
        <section className="card space-y-4 p-5">
          <h2 className="eyebrow">WhatsApp</h2>
          <Row>
            <Field label="Número (com DDI+DDD)" value={s.whatsapp.number} onChange={(v) => set((st) => void (st.whatsapp.number = v.replace(/\D/g, '')))} hint="Ex.: 5531991860038" />
            <Field label="Como aparece no site" value={s.whatsapp.display} onChange={(v) => set((st) => void (st.whatsapp.display = v))} />
          </Row>
          <Row>
            <Field label="Texto padrão do botão" value={s.whatsapp.label} onChange={(v) => set((st) => void (st.whatsapp.label = v))} />
            <Field label="Mensagem automática" value={s.whatsapp.message} onChange={(v) => set((st) => void (st.whatsapp.message = v))} />
          </Row>
          <a href={`https://wa.me/${s.whatsapp.number}?text=${encodeURIComponent(s.whatsapp.message)}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
            Testar link
          </a>
        </section>

        <section className="card space-y-4 p-5">
          <h2 className="eyebrow">Contato</h2>
          <Row cols={3}>
            <Field label="E-mail" value={s.contact.email} onChange={(v) => set((st) => void (st.contact.email = v))} />
            <Field label="Cidade / região" value={s.contact.city} onChange={(v) => set((st) => void (st.contact.city = v))} />
            <Field label="Horário" value={s.contact.hours} onChange={(v) => set((st) => void (st.contact.hours = v))} />
          </Row>
        </section>

        <section className="card space-y-4 p-5">
          <h2 className="eyebrow">Redes sociais</h2>
          <Row>
            <Field label="Instagram" value={s.social.instagram} onChange={(v) => set((st) => void (st.social.instagram = v))} />
            <Field label="TikTok" value={s.social.tiktok} onChange={(v) => set((st) => void (st.social.tiktok = v))} />
            <Field label="YouTube" value={s.social.youtube} onChange={(v) => set((st) => void (st.social.youtube = v))} />
            <Field label="Pinterest" value={s.social.pinterest} onChange={(v) => set((st) => void (st.social.pinterest = v))} />
          </Row>
        </section>

        <section className="card space-y-4 p-5">
          <h2 className="eyebrow">Marca & domínio</h2>
          <Row cols={3}>
            <Field label="Nome da marca" value={s.brand} onChange={(v) => set((st) => void (st.brand = v))} />
            <Field label="Assinatura / tagline" value={s.tagline} onChange={(v) => set((st) => void (st.tagline = v))} />
            <Field label="URL do site (canonical base)" value={s.siteUrl} onChange={(v) => set((st) => void (st.siteUrl = v.replace(/\/$/, '')))} />
          </Row>
        </section>
      </div>
    </>
  );
}

/* -------------------------------- analytics ------------------------------- */

function AnalyticsPanel() {
  const d = useCms();
  const a = d.settings.analytics;
  const set = (patch: Partial<typeof a>) => setData((x) => void Object.assign(x.settings.analytics, patch));
  const [, force] = useState(0);
  useEffect(() => {
    const off = onEvents(() => force((n) => n + 1));
    return () => {
      off();
    };
  }, []);

  return (
    <>
      <Head title="Analytics" text="Conecte suas contas. Os eventos de conversão já estão instrumentados no site." />
      <div className="card space-y-4 p-5">
        <Row>
          <Field label="Google Analytics 4 (ID de medição)" value={a.ga4} onChange={(v) => set({ ga4: v })} placeholder="G-XXXXXXX" />
          <Field label="Google Tag Manager" value={a.gtm} onChange={(v) => set({ gtm: v })} placeholder="GTM-XXXXXXX" />
          <Field label="Meta Pixel" value={a.pixel} onChange={(v) => set({ pixel: v })} placeholder="123456789012345" />
          <Field label="Google Search Console (verificação)" value={a.gscToken} onChange={(v) => set({ gscToken: v })} placeholder="token da meta tag" />
        </Row>
      </div>

      <div className="card mt-6 p-5">
        <h2 className="eyebrow">Eventos instrumentados</h2>
        <ul className="mt-3 grid gap-2 text-[13px] sm:grid-cols-2">
          {[
            ['whatsapp_click', 'Clique em qualquer botão de WhatsApp'],
            ['quote_request', 'Clique em solicitar orçamento / quero meu ensaio'],
            ['form_submit', 'Envio de formulário ou e-mail'],
            ['view_service', 'Visualização de serviço'],
            ['view_gallery', 'Visualização de galeria'],
            ['view_item_list', 'Clique em card de listagem'],
          ].map(([e, l]) => (
            <li key={e} className="rounded-md border border-[var(--color-line)] bg-white p-3">
              <code className="text-[12px] text-[var(--color-bronze)]">{e}</code>
              <p className="mt-1 text-[12.5px] text-[var(--color-mute)]">{l}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="card mt-6 p-5">
        <h2 className="eyebrow">Eventos capturados nesta sessão</h2>
        <div className="mt-3 max-h-64 overflow-auto scrollbar-thin">
          {recentEvents().length === 0 && <p className="text-[13px] text-[var(--color-mute)]">Nenhum evento ainda — navegue no site para testar.</p>}
          {recentEvents().map((e, i) => (
            <div key={i} className="border-b border-[var(--color-line)] py-2 font-mono text-[11.5px]">
              <span className="text-[var(--color-bronze)]">{e.name}</span>{' '}
              <span className="text-[var(--color-mute)]">{JSON.stringify(e.params)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* -------------------------------- security -------------------------------- */

function Security({ onLogout }: { onLogout: () => void }) {
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [msg, setMsg] = useState('');

  return (
    <>
      <Head title="Segurança" text="O painel fica fora do índice do Google (noindex, nofollow + Disallow no robots.txt)." />
      <div className="card max-w-lg space-y-4 p-6">
        <h2 className="eyebrow">Alterar senha</h2>
        <Field label="Senha atual" type="password" value={cur} onChange={setCur} />
        <Field label="Nova senha (mín. 8 caracteres)" type="password" value={next} onChange={setNext} />
        {msg && <p className="text-[12.5px]">{msg}</p>}
        <button
          className="btn btn-dark btn-sm"
          onClick={async () => {
            const r = await changePassword(cur, next);
            setMsg(r.ok ? '✅ Senha alterada com sucesso.' : `⚠️ ${r.error}`);
            if (r.ok) {
              setCur('');
              setNext('');
            }
          }}
        >
          Salvar nova senha
        </button>
      </div>

      <div className="card mt-6 max-w-lg space-y-3 p-6 text-[13px] text-[var(--color-ink-soft)]">
        <h2 className="eyebrow">Proteções ativas</h2>
        <ul className="space-y-2">
          <li>✅ Hash PBKDF2-SHA256 com 120.000 iterações e salt aleatório</li>
          <li>✅ Sessão expira em 2 horas de inatividade</li>
          <li>✅ Bloqueio temporário após 5 tentativas de login</li>
          <li>✅ Upload restrito a JPG, PNG, WebP e AVIF até 25 MB</li>
          <li>✅ Rotas /admin com noindex, nofollow e Disallow no robots.txt</li>
        </ul>
        <button
          className="btn btn-outline btn-sm mt-2"
          onClick={() => {
            logout();
            onLogout();
            navigate('/');
          }}
        >
          Encerrar sessão
        </button>
      </div>
    </>
  );
}
