/**
 * Admin authentication.
 * PBKDF2-SHA256 (120k iterations) + random salt via WebCrypto. Plain passwords are never stored.
 * Session = random token + expiry in sessionStorage. Login attempts are rate-limited.
 */

const CRED_KEY = 'vibe-admin-cred';
const SESS_KEY = 'vibe-admin-session';
const RATE_KEY = 'vibe-admin-rate';
const TTL = 2 * 60 * 60 * 1000; // 2h
const MAX_TRIES = 5;
const LOCK_MS = 5 * 60 * 1000;
export const DEFAULT_PASSWORD = 'vibefotos2026';

const buf2hex = (b: ArrayBuffer) =>
  Array.from(new Uint8Array(b))
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');

async function derive(password: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = new Uint8Array((saltHex.match(/.{2}/g) || []).map((h) => parseInt(h, 16)));
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, key, 256);
  return buf2hex(bits);
}

function randHex(n: number) {
  const a = new Uint8Array(n);
  crypto.getRandomValues(a);
  return buf2hex(a.buffer);
}

type Cred = { salt: string; hash: string; updatedAt: string };

function readCred(): Cred | null {
  try {
    return JSON.parse(localStorage.getItem(CRED_KEY) || 'null');
  } catch {
    return null;
  }
}

export async function setPassword(password: string) {
  const salt = randHex(16);
  const hash = await derive(password, salt);
  localStorage.setItem(CRED_KEY, JSON.stringify({ salt, hash, updatedAt: new Date().toISOString() } as Cred));
}

export async function ensureCred() {
  if (!readCred()) await setPassword(DEFAULT_PASSWORD);
}

export function isDefaultPasswordLikely() {
  const c = readCred();
  return !c || !localStorage.getItem('vibe-admin-changed');
}

type Rate = { tries: number; until: number };
const readRate = (): Rate => {
  try {
    return JSON.parse(localStorage.getItem(RATE_KEY) || '{"tries":0,"until":0}');
  } catch {
    return { tries: 0, until: 0 };
  }
};

export function lockedFor(): number {
  const r = readRate();
  return r.until > Date.now() ? Math.ceil((r.until - Date.now()) / 1000) : 0;
}

export async function login(password: string): Promise<{ ok: boolean; error?: string }> {
  const locked = lockedFor();
  if (locked) return { ok: false, error: `Muitas tentativas. Tente novamente em ${locked}s.` };
  await ensureCred();
  const cred = readCred()!;
  const hash = await derive(password, cred.salt);
  if (hash !== cred.hash) {
    const r = readRate();
    const tries = r.tries + 1;
    localStorage.setItem(
      RATE_KEY,
      JSON.stringify({ tries, until: tries >= MAX_TRIES ? Date.now() + LOCK_MS : 0 } as Rate)
    );
    return { ok: false, error: tries >= MAX_TRIES ? 'Conta bloqueada por 5 minutos.' : 'Senha incorreta.' };
  }
  localStorage.setItem(RATE_KEY, JSON.stringify({ tries: 0, until: 0 }));
  sessionStorage.setItem(SESS_KEY, JSON.stringify({ token: randHex(24), exp: Date.now() + TTL }));
  return { ok: true };
}

export async function changePassword(current: string, next: string): Promise<{ ok: boolean; error?: string }> {
  if (next.length < 8) return { ok: false, error: 'A nova senha precisa de pelo menos 8 caracteres.' };
  const check = await login(current);
  if (!check.ok) return { ok: false, error: 'Senha atual incorreta.' };
  await setPassword(next);
  localStorage.setItem('vibe-admin-changed', '1');
  return { ok: true };
}

export function isAuthed(): boolean {
  try {
    const s = JSON.parse(sessionStorage.getItem(SESS_KEY) || 'null');
    if (!s || s.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export function touchSession() {
  try {
    const s = JSON.parse(sessionStorage.getItem(SESS_KEY) || 'null');
    if (s) sessionStorage.setItem(SESS_KEY, JSON.stringify({ ...s, exp: Date.now() + TTL }));
  } catch {
    /* noop */
  }
}

export function logout() {
  sessionStorage.removeItem(SESS_KEY);
}
