import { Link } from '../lib/router';
import { useCms, publishedServices } from '../lib/store';
import { useHead } from '../lib/head';
import { WaButton } from '../components/Layout';

export default function NotFound() {
  const d = useCms();
  useHead(
    {
      title: `Página não encontrada (404) | ${d.settings.brand}`,
      description: 'A página que você procura não existe ou foi movida.',
      path: typeof window !== 'undefined' ? window.location.pathname : '/404',
      index: false,
      follow: true,
    },
    d
  );

  return (
    <section className="wrap flex min-h-[70svh] flex-col justify-center py-32">
      <p className="eyebrow">Erro 404</p>
      <h1 className="display mt-4 text-[clamp(2.2rem,1.6rem+3vw,4rem)]">Essa página saiu de quadro.</h1>
      <p className="lede mt-5 max-w-lg">
        O endereço que você abriu não existe ou foi movido. Que tal seguir por aqui?
      </p>
      <nav aria-label="Links úteis" className="mt-10 grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
        {[
          { to: '/portfolio', label: 'Ver o portfólio completo' },
          { to: '/ensaios', label: 'Conhecer os tipos de ensaio' },
          { to: '/sobre', label: 'Sobre a Giovana' },
          { to: '/contato', label: 'Falar comigo' },
          ...publishedServices(d)
            .slice(0, 2)
            .map((s) => ({ to: `/ensaios/${s.slug}`, label: s.title })),
        ].map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="flex items-center justify-between border-b border-[var(--color-line)] py-3 text-[15px] hover:text-[var(--color-bronze)]"
          >
            {l.label} <span aria-hidden="true">→</span>
          </Link>
        ))}
      </nav>
      <div className="mt-10">
        <WaButton variant="dark" location="404" />
      </div>
    </section>
  );
}
