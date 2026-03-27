import Link from "next/link";

type Props = {
  linkWholeTitle?: boolean;
};

function YarnIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 8c4 3 8 10 12 16"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M6 16c5-2 12-2 20 0"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M10 24c4-4 10-8 14-12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M26 14c1.5-2 2.5-3 3-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteHeader({ linkWholeTitle = false }: Props) {
  const brand = (
    <div className="flex flex-col items-center text-center">
      <YarnIcon className="w-9 h-9 sm:w-10 sm:h-10 text-stitch mb-2" />
      <p className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight leading-none">
        Stitch-n-Stab
      </p>
      <p className="text-muted text-sm sm:text-base mt-1.5 max-w-xs leading-snug">
        Handmade with love by Elaine
      </p>
    </div>
  );

  return (
    <header className="bg-paper border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center">
        {linkWholeTitle ? (
          <Link
            href="/"
            className="group inline-flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded-lg transition-opacity hover:opacity-80"
          >
            {brand}
          </Link>
        ) : (
          brand
        )}
      </div>
      <div className="stitch-line" />
    </header>
  );
}
