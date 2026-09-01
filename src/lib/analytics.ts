import type { Settings } from './types';

/** Vendor-neutral analytics layer: GA4 + GTM + Meta Pixel, wired from the admin panel. */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...a: unknown[]) => void;
    fbq?: (...a: unknown[]) => void;
  }
}

export type TrackedEvent = { name: string; params: Record<string, unknown>; at: number };
const recent: TrackedEvent[] = [];
const listeners = new Set<() => void>();
let booted = '';

export function onEvents(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
export const recentEvents = () => recent;

function inject(id: string, src: string, inlineText?: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id;
  if (src) {
    s.async = true;
    s.src = src;
  }
  if (inlineText) s.text = inlineText;
  document.head.appendChild(s);
}

export function initAnalytics(a: Settings['analytics']) {
  const key = `${a.ga4}|${a.gtm}|${a.pixel}`;
  if (key === booted) return;
  booted = key;
  window.dataLayer = window.dataLayer || [];

  if (a.gtm) {
    inject(
      'gtm-loader',
      '',
      `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${a.gtm}');`
    );
  }
  if (a.ga4) {
    inject('ga4-loader', `https://www.googletagmanager.com/gtag/js?id=${a.ga4}`);
    inject('ga4-init', '', `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${a.ga4}',{send_page_view:false});`);
  }
  if (a.pixel) {
    inject(
      'fb-pixel',
      '',
      `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${a.pixel}');`
    );
  }
  if (a.gscToken && !document.querySelector('meta[name="google-site-verification"]')) {
    const m = document.createElement('meta');
    m.name = 'google-site-verification';
    m.content = a.gscToken;
    document.head.appendChild(m);
  }
}

export function track(name: string, params: Record<string, unknown> = {}) {
  const evt: TrackedEvent = { name, params, at: Date.now() };
  recent.unshift(evt);
  if (recent.length > 40) recent.pop();
  listeners.forEach((l) => l());

  window.dataLayer?.push({ event: name, ...params });
  window.gtag?.('event', name, params);
  if (name === 'whatsapp_click' || name === 'quote_request') window.fbq?.('track', 'Contact', params);
  if (name === 'form_submit') window.fbq?.('track', 'Lead', params);
}

export function pageView(path: string, title: string) {
  window.gtag?.('event', 'page_view', { page_path: path, page_title: title });
  window.dataLayer?.push({ event: 'page_view', page_path: path, page_title: title });
  window.fbq?.('track', 'PageView');
}
