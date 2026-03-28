import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/server/db";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export const dynamic = "force-dynamic";

function PlaceholderIcon() {
  return (
    <svg
      className="h-10 w-10 text-muted/25"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
      />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm9 3a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function formatPrice(price: number | null) {
  return price == null ? null : `$${price.toFixed(2)}`;
}

function parseImageUrls(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
  } catch {
    return [];
  }
}

type ProductCardProps = {
  product: {
    id: string;
    title: string;
    description: string;
    sold: boolean;
    price: number | null;
    images: string[];
  };
  index: number;
};

function ProductCard({ product, index }: ProductCardProps) {
  const price = formatPrice(product.price);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group animate-fade-in-up panel-surface block overflow-hidden rounded-[1.55rem] p-3 transition duration-300 hover:-translate-y-1.5 sm:rounded-[1.85rem]"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative aspect-[0.94] overflow-hidden rounded-[1.2rem] bg-warm-bg sm:rounded-[1.4rem]">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            sizes="(min-width: 1280px) 18rem, (min-width: 768px) 30vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <PlaceholderIcon />
          </div>
        )}

        {product.sold && (
          <div className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-white shadow-sm">
            Sold
          </div>
        )}

        {product.images.length > 1 && (
          <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-ink/68 px-2.5 py-1 text-[0.68rem] font-semibold text-white backdrop-blur-sm">
            <CameraIcon />
            {product.images.length} views
          </div>
        )}
      </div>

      <div className="px-1 pb-1 pt-4">
        <p className="section-kicker text-[0.68rem]">One of a kind</p>

        <div className="mt-3 flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <h2 className="max-w-[15rem] font-display text-[1.28rem] font-semibold leading-tight text-ink transition-colors group-hover:text-accent sm:text-[1.35rem]">
            {product.title}
          </h2>
          {price && (
            <p className="rounded-full bg-accent-soft px-3 py-1 text-sm font-bold text-accent">
              {price}
            </p>
          )}
        </div>

        {product.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
            {product.description}
          </p>
        )}
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const catalog = products.map((product) => ({
    ...product,
    images: parseImageUrls(product.imageUrls),
  }));

  const availableCount = catalog.filter((product) => !product.sold).length;
  const featuredProduct = catalog.find((product) => !product.sold) ?? catalog[0] ?? null;
  const remainingProducts = featuredProduct
    ? catalog.filter((product) => product.id !== featuredProduct.id)
    : [];
  const heroImages = catalog
    .flatMap((product) =>
      product.images.slice(0, 1).map((src) => ({
        src,
        title: product.title,
      }))
    )
    .slice(0, 3);

  return (
    <div className="site-shell flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="page-section pb-10 pt-5 sm:pb-14 sm:pt-8">
          <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div className="animate-fade-in-up">
              <p className="section-kicker">Bright and cheeky crochet</p>
              <h1 className="mt-5 font-display text-[2.5rem] font-semibold leading-[0.98] text-ink sm:mt-6 sm:text-[4.1rem] lg:mt-7 lg:text-[4.95rem]">
                <span className="block">Bright, funny, funky</span>
                <span className="block">crochet by Elaine.</span>
              </h1>
              <p className="mt-5 max-w-[41rem] text-[0.98rem] leading-[1.68] text-muted sm:mt-7 sm:text-[1.22rem]">
                From cheeky little cacti to playful creatures and creative
                oddballs, Elaine makes handmade crochet with real grandma
                energy and a wicked sense of humor. Every piece is stitched in
                British Columbia and made to make somebody smile.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                <Link href="#catalog" className="button-primary">
                  Browse the collection
                </Link>
                <Link href="#contact" className="button-secondary">
                  Talk to Elaine
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 text-sm sm:mt-9 sm:flex sm:flex-wrap">
                <div className="rounded-full bg-paper/80 px-4 py-2 font-semibold text-ink ring-1 ring-white/80">
                  {catalog.length} published piece{catalog.length === 1 ? "" : "s"}
                </div>
                <div className="rounded-full bg-paper/80 px-4 py-2 font-semibold text-ink ring-1 ring-white/80">
                  {availableCount} available right now
                </div>
                <div className="rounded-full bg-paper/80 px-4 py-2 font-semibold text-ink ring-1 ring-white/80">
                  Handmade in BC
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up panel-surface relative overflow-hidden rounded-[1.65rem] p-4 sm:rounded-[2.2rem] sm:p-6">
              <div className="hero-orb -right-8 bottom-6 h-32 w-32 bg-accent-soft" />
              <div className="hero-orb left-12 top-10 h-20 w-20 bg-[#fde0cb]" />

              <div className="relative aspect-[1.08] sm:aspect-[1.03]">
                {heroImages.length > 0 ? (
                  <>
                    <div className="absolute inset-x-0 top-0 h-[70%] overflow-hidden rounded-[1.3rem] bg-warm-bg shadow-[0_20px_45px_rgba(94,53,43,0.14)] sm:inset-x-[10%] sm:h-[68%] sm:rounded-[1.8rem] sm:shadow-[0_28px_60px_rgba(94,53,43,0.14)]">
                      <Image
                        src={heroImages[0].src}
                        alt={heroImages[0].title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 28rem, 100vw"
                      />
                    </div>
                    {heroImages[1] && (
                      <div className="absolute bottom-[18%] left-0 hidden h-[42%] w-[42%] overflow-hidden rounded-[1.5rem] bg-paper shadow-[0_22px_48px_rgba(94,53,43,0.12)] ring-8 ring-[#fff8f3] sm:block">
                        <Image
                          src={heroImages[1].src}
                          alt={heroImages[1].title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 12rem, 40vw"
                        />
                      </div>
                    )}
                    {heroImages[2] && (
                      <div className="absolute inset-x-0 bottom-0 rounded-[1.25rem] bg-[#fff8f1]/96 p-4 shadow-[0_18px_36px_rgba(94,53,43,0.12)] sm:inset-x-auto sm:right-0 sm:h-[38%] sm:w-[48%] sm:rounded-[1.6rem] sm:bg-[#fff8f1] sm:shadow-[0_22px_48px_rgba(94,53,43,0.12)]">
                        <p className="section-kicker text-[0.65rem]">Elaine&apos;s touch</p>
                        <p className="mt-3 font-display text-lg font-semibold text-ink sm:text-xl">
                          Handmade, hilarious, and impossible to mass-produce.
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          The best pieces have personality, a little attitude,
                          and a lot of charm.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center rounded-[1.8rem] bg-warm-bg px-8 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <PlaceholderIcon />
                    </div>
                    <p className="font-display text-2xl font-semibold text-ink">
                      Fresh pieces are on the hook.
                    </p>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
                      Elaine is working on the next batch of funny, funky
                      creations. Check back soon or reach out directly.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="catalog" className="page-section pb-14 sm:pb-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">Shop the catalog</p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
                Fresh off Elaine&apos;s crochet hook.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted sm:text-right">
              Browse the latest bright, funny, one-of-a-kind pieces. If
              something makes you laugh or catches your eye, grab it quickly.
            </p>
          </div>

          {catalog.length === 0 ? (
            <div className="panel-surface mt-8 rounded-[2rem] px-6 py-16 text-center sm:px-10">
              <p className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                New pieces are coming soon.
              </p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
                Elaine is working on something lovely right now. Reach out below
                if you want first dibs when the next creation is ready.
              </p>
            </div>
          ) : (
            <>
              {featuredProduct && (
                <Link
                  href={`/products/${featuredProduct.id}`}
                  className="group panel-surface mt-8 grid overflow-hidden rounded-[1.65rem] p-3 transition duration-300 hover:-translate-y-1.5 sm:rounded-[2.1rem] sm:p-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-6"
                >
                  <div className="relative min-h-[16rem] overflow-hidden rounded-[1.35rem] bg-warm-bg sm:min-h-[25rem] sm:rounded-[1.7rem]">
                    {featuredProduct.images[0] ? (
                      <Image
                        src={featuredProduct.images[0]}
                        alt={featuredProduct.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="(min-width: 1024px) 36rem, 100vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <PlaceholderIcon />
                      </div>
                    )}

                    <div className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-accent shadow-sm">
                      Spotlight piece
                    </div>
                  </div>

                  <div className="px-2 pb-2 pt-4 sm:px-4 sm:pt-5 lg:py-4">
                    <p className="section-kicker text-[0.7rem]">Made with care</p>
                    <h3 className="mt-3 font-display text-[2rem] font-semibold leading-tight text-ink sm:mt-4 sm:text-[2.6rem]">
                      {featuredProduct.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-muted">
                      {featuredProduct.description ||
                        "A bright little oddball from Elaine's latest collection."}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      {formatPrice(featuredProduct.price) && (
                        <span className="rounded-full bg-accent-soft px-4 py-2 text-base font-bold text-accent">
                          {formatPrice(featuredProduct.price)}
                        </span>
                      )}
                      <span className="rounded-full bg-[#fff4ea] px-4 py-2 text-sm font-semibold text-ink">
                        {featuredProduct.sold ? "Already sold" : "Available now"}
                      </span>
                      <span className="rounded-full bg-[#f6efe8] px-4 py-2 text-sm font-semibold text-muted">
                        {featuredProduct.images.length} photo
                        {featuredProduct.images.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                      See full details
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12h14m-6-6 6 6-6 6"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              )}

              {remainingProducts.length > 0 && (
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {remainingProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Link
        href="/admin/login"
        aria-label="Admin sign in"
        className="fixed bottom-4 left-4 z-50 rounded-full bg-ink/82 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white opacity-45 shadow-[0_18px_50px_rgba(0,0,0,0.28)] ring-1 ring-white/15 backdrop-blur-sm transition hover:opacity-100"
      >
        Elaine
      </Link>

      <SiteFooter />
    </div>
  );
}
