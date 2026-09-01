import { useCallback, useEffect, useState } from 'react';

/** Minimal History-API router: clean URLs only, no hashes, no query ids. */

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export function currentPath(): string {
  const p = window.location.pathname.replace(/\/+$/, '');
  return p === '' ? '/' : p;
}

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  const url = to.startsWith('http') ? to : to;
  if (currentPath() === url.replace(/\/+$/, '')) return;
  if (opts.replace) window.history.replaceState({}, '', url);
  else window.history.pushState({}, '', url);
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  notify();
}

export function usePath(): string {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const on = () => setPath(currentPath());
    listeners.add(on);
    window.addEventListener('popstate', on);
    return () => {
      listeners.delete(on);
      window.removeEventListener('popstate', on);
    };
  }, []);
  return path;
}

/** <Link> that keeps SEO-crawlable <a href> while doing client-side nav. */
export function Link({
  to,
  children,
  className,
  onClick,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const handle = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      navigate(to);
    },
    [to, onClick]
  );
  return (
    <a href={to} onClick={handle} className={className} {...rest}>
      {children}
    </a>
  );
}

/** /portfolio/:slug → { slug } */
export function match(pattern: string, path: string): Record<string, string> | null {
  const pp = pattern.split('/').filter(Boolean);
  const cp = path.split('/').filter(Boolean);
  if (pp.length !== cp.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(':')) params[pp[i].slice(1)] = decodeURIComponent(cp[i]);
    else if (pp[i] !== cp[i]) return null;
  }
  return params;
}
