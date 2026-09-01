// ─── Camada de nuvem (Supabase) — Plano B: persistência real ────────────────
// Guarda os dados do site numa tabela `vf_data` e sincroniza com o painel.
// Quando desligada, o site usa apenas o cache local (Plano A).

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { defaultData, type SiteData } from './siteData';

export type SyncState = 'local' | 'syncing' | 'ok' | 'err';

export interface BackendCfg {
  url: string;
  key: string;
  enabled: boolean;
}

const CFG_KEY = 'vf_backend_cfg';

export function getCfg(): BackendCfg {
  try {
    return { url: '', key: '', enabled: false, ...JSON.parse(localStorage.getItem(CFG_KEY) || '{}') };
  } catch {
    return { url: '', key: '', enabled: false };
  }
}

export function setCfg(c: BackendCfg): void {
  localStorage.setItem(CFG_KEY, JSON.stringify(c));
}

function client(): SupabaseClient | null {
  const c = getCfg();
  if (!c.enabled || !c.url || !c.key) return null;
  try {
    return createClient(c.url, c.key);
  } catch {
    return null;
  }
}

// Testa a conexão e se a tabela existe
export async function testConnection(): Promise<{ ok: boolean; msg: string }> {
  const c = client();
  if (!c) return { ok: false, msg: 'Preencha a URL e a chave antes de testar.' };
  try {
    const { data, error } = await c.from('vf_data').select('id').limit(1);
    if (error) return { ok: false, msg: `Erro: ${error.message}` };
    return {
      ok: true,
      msg: data && data.length > 0
        ? 'Conectado! Já existem dados no banco — serão carregados no site.'
        : 'Conectado! Tabela pronta, sem dados ainda. Clique em Salvar para enviar.',
    };
  } catch (e) {
    return { ok: false, msg: `Falha na conexão: ${(e as Error).message}` };
  }
}

// Busca os dados do site no banco
export async function fetchRemote(): Promise<SiteData | null> {
  const c = client();
  if (!c) return null;
  try {
    const { data } = await c.from('vf_data').select('data').eq('id', 1).maybeSingle();
    if (!data || !(data as { data?: SiteData }).data) return null;
    return { ...defaultData, ...(data as { data: SiteData }).data };
  } catch {
    return null;
  }
}

// Envia os dados para o banco (upsert da linha id=1)
export async function pushRemote(site: SiteData): Promise<{ ok: boolean; msg: string }> {
  const c = client();
  if (!c) return { ok: false, msg: 'Nuvem desligada.' };
  try {
    const { error } = await c.from('vf_data').upsert(
      { id: 1, data: site, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    );
    return error ? { ok: false, msg: error.message } : { ok: true, msg: 'Sincronizado na nuvem.' };
  } catch (e) {
    return { ok: false, msg: (e as Error).message };
  }
}

// SQL para criar a tabela no Supabase (executar uma única vez no SQL Editor)
export const SETUP_SQL = `-- Rode uma única vez no SQL Editor do seu projeto Supabase

create table if not exists public.vf_data (
  id int primary key default 1,
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table public.vf_data enable row level security;

drop policy if exists vf_policy on public.vf_data;
create policy vf_policy on public.vf_data
  for all using (true) with check (true);`;
