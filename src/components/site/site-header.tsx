import Link from "next/link";

type Props = {
  /** When true, title block links home (e.g. product detail) */
  linkWholeTitle?: boolean;
};

export function SiteHeader({ linkWholeTitle = false }: Props) {
  const inner = (
    <>
      <p className="font-display text-2xl sm:text-4xl font-semibold text-ink tracking-tight">
        Stitch-n-Stab
      </p>
      <p className="text-muted text-sm sm:text-base mt-1 max-w-md leading-snug">
        Handmade crochet — each piece stitched with care.
      </p>
      <span
        className="mt-3 block h-0.5 w-16 rounded-full bg-stitch opacity-90"
        aria-hidden
      />
    </>
  );

  return (
    <header className="border-b border-line bg-paper/90 shadow-[0_1px_0_rgba(42,38,34,0.04)] backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
        {linkWholeTitle ? (
          <Link
            href="/"
            className="group inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded-lg"
          >
            {inner}
          </Link>
        ) : (
          inner
        )}
      </div>
    </header>
  );
}
