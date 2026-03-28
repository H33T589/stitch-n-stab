import Image from "next/image";
import Link from "next/link";

type Props = {
  linkWholeTitle?: boolean;
};

export function SiteHeader({ linkWholeTitle = false }: Props) {
  const brand = (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Image
        src="/stitch-n-stab-logo.svg"
        alt="Stitch 'N' Stab logo"
        width={220}
        height={168}
        className="h-auto w-[170px] sm:w-[200px]"
        priority
      />

      <div className="min-w-0">
        <p className="section-kicker">Funny and funky crochet</p>
        <p className="mt-3 max-w-md text-base leading-relaxed text-muted sm:text-lg">
          Bright handmade pieces from Elaine in British Columbia, with humor,
          charm, and just the right amount of weird.
        </p>
      </div>
    </div>
  );

  return (
    <header className="pt-5 sm:pt-8">
      <div className="page-section">
        <div className="panel-surface relative overflow-hidden rounded-[2rem] px-5 py-5 sm:px-8 sm:py-7">
          <div className="hero-orb -left-10 top-4 h-28 w-28 bg-accent-soft" />
          <div className="hero-orb right-6 top-0 h-24 w-24 bg-[#fde7d7]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {linkWholeTitle ? (
              <Link
                href="/"
                className="rounded-[1.5rem] transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                {brand}
              </Link>
            ) : (
              brand
            )}

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href={linkWholeTitle ? "/" : "#catalog"}
                className="button-secondary"
              >
                {linkWholeTitle ? "Browse catalog" : "See the collection"}
              </Link>
              <Link href="#contact" className="button-primary">
                Contact Elaine
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-4 w-[min(94%,1040px)]">
          <div className="thread-divider" />
        </div>
      </div>
    </header>
  );
}
