import Image from "next/image";
import Link from "next/link";

type Props = {
  linkWholeTitle?: boolean;
};

export function SiteHeader({ linkWholeTitle = false }: Props) {
  const brand = (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
      <Image
        src="/stitch-n-stab-logo.svg"
        alt="Stitch 'N' Stab logo"
        width={220}
        height={168}
        className="h-auto w-[128px] sm:w-[176px]"
        priority
      />

      <div className="min-w-0 border-l-0 sm:border-l sm:border-line sm:pl-6">
        <p className="section-kicker">Handmade crochet</p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          Original pieces by Elaine, made in British Columbia. Each listing is
          one of a kind.
        </p>
        <p className="mt-2.5 text-xs text-muted sm:text-sm">
          Affiliated with Forever Crocheting.
        </p>
      </div>
    </div>
  );

  return (
    <header className="border-b border-line bg-paper/80 pt-5 backdrop-blur-sm sm:pt-8">
      <div className="page-section pb-5 sm:pb-7">
        <div className="panel-surface relative overflow-hidden rounded-xl px-4 py-5 sm:rounded-2xl sm:px-8 sm:py-6">
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {linkWholeTitle ? (
              <Link
                href="/"
                className="rounded-lg transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                {brand}
              </Link>
            ) : (
              brand
            )}

            <div className="grid w-full grid-cols-1 gap-2.5 sm:flex sm:w-auto sm:flex-wrap lg:justify-end">
              <Link
                href={linkWholeTitle ? "/" : "#catalog"}
                className="button-secondary"
              >
                {linkWholeTitle ? "Catalog" : "Collection"}
              </Link>
              <Link href="#contact" className="button-primary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
