import type { Photo } from './types';
import { uid } from './types';

/**
 * Client-side media pipeline.
 * - Validates MIME + size
 * - Rasterises to 3 responsive widths (480 / 1080 / 1920) as WebP q0.82
 * - Generates a 24px LQIP data URL (prevents flash + layout shift)
 * - Stores binaries in IndexedDB, never in localStorage
 */

const DB = 'vibe-media';
const STORE = 'blobs';
export const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
export const MAX_BYTES = 25 * 1024 * 1024;
const WIDTHS: [keyof Photo['sources'], number][] = [
  ['sm', 480],
  ['md', 1080],
  ['lg', 1920],
];

let dbp: Promise<IDBDatabase> | null = null;

function db(): Promise<IDBDatabase> {
  if (!dbp) {
    dbp = new Promise((res, rej) => {
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => {
        const d = req.result;
        if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE);
      };
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
  }
  return dbp;
}

async function put(key: string, blob: Blob) {
  const d = await db();
  await new Promise<void>((res, rej) => {
    const tx = d.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(blob, key);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

async function get(key: string): Promise<Blob | undefined> {
  const d = await db();
  return new Promise((res, rej) => {
    const tx = d.transaction(STORE, 'readonly');
    const r = tx.objectStore(STORE).get(key);
    r.onsuccess = () => res(r.result as Blob | undefined);
    r.onerror = () => rej(r.error);
  });
}

export async function delBlob(key: string) {
  if (!key.startsWith('idb:')) return;
  const d = await db();
  const tx = d.transaction(STORE, 'readwrite');
  tx.objectStore(STORE).delete(key.slice(4));
}

const urlCache = new Map<string, string>();

/** Resolve a stored source (remote URL or `idb:` key) to something an <img> can use. */
export async function resolveSrc(src: string): Promise<string> {
  if (!src) return '';
  if (!src.startsWith('idb:')) return src;
  const cached = urlCache.get(src);
  if (cached) return cached;
  const blob = await get(src.slice(4));
  if (!blob) return '';
  const url = URL.createObjectURL(blob);
  urlCache.set(src, url);
  return url;
}

export function resolveSync(src: string): string {
  if (!src) return '';
  if (!src.startsWith('idb:')) return src;
  return urlCache.get(src) || '';
}

function canvasToBlob(c: HTMLCanvasElement, type: string, q: number): Promise<Blob> {
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), type, q));
}

async function decode(file: File): Promise<{ w: number; h: number; draw: CanvasImageSource }> {
  if ('createImageBitmap' in window) {
    const bmp = await createImageBitmap(file);
    return { w: bmp.width, h: bmp.height, draw: bmp };
  }
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;
  await img.decode();
  return { w: img.naturalWidth, h: img.naturalHeight, draw: img };
}

export type UploadResult = { ok: true; photo: Photo } | { ok: false; error: string };

export async function processUpload(file: File, categoryId: string, altFallback = ''): Promise<UploadResult> {
  if (!ALLOWED.includes(file.type)) return { ok: false, error: `Formato não permitido (${file.type || 'desconhecido'})` };
  if (file.size > MAX_BYTES) return { ok: false, error: 'Arquivo maior que 25 MB' };

  let src: { w: number; h: number; draw: CanvasImageSource };
  try {
    src = await decode(file);
  } catch {
    return { ok: false, error: 'Não foi possível ler a imagem' };
  }

  const id = uid('ph');
  const ratio = src.h / src.w;
  const sources = { sm: '', md: '', lg: '' } as Photo['sources'];
  let bytes = 0;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return { ok: false, error: 'Canvas indisponível' };

  const supportsWebp = document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp');
  const type = supportsWebp ? 'image/webp' : 'image/jpeg';

  for (const [key, w] of WIDTHS) {
    const targetW = Math.min(w, src.w);
    canvas.width = targetW;
    canvas.height = Math.round(targetW * ratio);
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(src.draw, 0, 0, canvas.width, canvas.height);
    const blob = await canvasToBlob(canvas, type, 0.82);
    const key2 = `${id}_${key}`;
    await put(key2, blob);
    sources[key] = `idb:${key2}`;
    bytes += blob.size;
  }

  // LQIP
  canvas.width = 24;
  canvas.height = Math.max(1, Math.round(24 * ratio));
  ctx.drawImage(src.draw, 0, 0, canvas.width, canvas.height);
  const lqip = canvas.toDataURL('image/jpeg', 0.4);

  if ('close' in src.draw && typeof (src.draw as ImageBitmap).close === 'function') (src.draw as ImageBitmap).close();

  const cleanName = file.name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ');
  return {
    ok: true,
    photo: {
      id,
      alt: altFallback || cleanName,
      caption: '',
      categoryId,
      sources,
      width: src.w,
      height: src.h,
      lqip,
      bytes,
      featured: false,
      createdAt: new Date().toISOString(),
    },
  };
}

export const kb = (b: number) => (b > 1024 * 1024 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);
