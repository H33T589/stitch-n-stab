import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/server/db";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SaleRibbon } from "@/components/site/sale-ribbon";
import { ListingPrice } from "@/components/site/listing-price";

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
    compareAtPrice: number | null;
    onSale: boolean;
    images: string[];
  };
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group panel-surface block overflow-hidden rounded-xl p-2.5 transition-shadow duration-200 hover:shadow-md sm:rounded-2xl sm:p-3"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-warm-bg sm:aspect-[0.92]">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(min-width: 1280px) 18rem, (min-width: 768px) 30vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <PlaceholderIcon />
          </div>
        )}

        {product.sold && (
          <div className="absolute left-2.5 top-2.5 z-10 rounded-md bg-ink px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-wider text-white">
            Sold
          </div>
        )}

        {product.onSale && !product.sold && product.price != null && (
          <SaleRibbon />
        )}

        {product.images.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-1 rounded-md bg-ink/80 px-2 py-1 text-[0.625rem] font-medium text-white">
            <CameraIcon />
            {product.images.length} photos
          </div>
        )}
      </div>

      <div className="px-0.5 pb-1 pt-3.5">
        <p className="section-kicker">Unique piece</p>

        <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <h2 className="max-w-[15rem] font-display text-lg font-semibold leading-snug text-ink group-hover:text-accent sm:text-xl">
            {product.title}
          </h2>
          <ListingPrice
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            onSale={product.onSale}
            size="sm"
          />
        </div>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
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

  const markedFeatured = catalog.find(
    (product) => product.featured && product.published
  );
  const featuredProduct =
    markedFeatured ??
    catalog.find((product) => !product.sold) ??
    catalog[0] ??
    null;

  const remainingProducts = featuredProduct
    ? catalog.filter((product) => product.id !== featuredProduct.id)
    : [];

  const heroPreview =
    featuredProduct?.images[0] != null
      ? {
          src: featuredProduct.images[0],
          alt: featuredProduct.title,
        }
      : catalog[0]?.images[0] != null
        ? {
            src: catalog[0].images[0],
            alt: catalog[0].title,
          }
        : null;

  return (
    <div className="site-shell flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="page-section pb-8 pt-6 sm:pb-12 sm:pt-10 lg:pb-14">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14">
            <div className="animate-fade-in-up">
              <p className="section-kicker">Stitch-n-Stab</p>
              <h1 className="mt-4 font-display text-[2.15rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.1rem]">
                Handmade crochet, one piece at a time.
              </h1>
              <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-muted sm:text-lg">
                Original crochet work by Elaine in British Columbia. Scroll to
                the catalog for what&apos;s available—each piece is listed on
                its own page with photos.
              </p>

              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <Link href="#catalog" className="button-primary">
                  View catalog
                </Link>
                <Link href="#contact" className="button-secondary">
                  Get in touch
                </Link>
              </div>

              <p className="mt-8 text-sm leading-relaxed text-muted">
                <span className="font-medium text-ink">
                  {catalog.length} listing{catalog.length === 1 ? "" : "s"}
                </span>
                <span className="mx-2 text-line">·</span>
                <span className="font-medium text-ink">
                  {availableCount} available
                </span>
                <span className="mx-2 text-line">·</span>
                BC, Canada
              </p>
            </div>

            {/* Desktop only: one preview image (matches homepage highlight when set). Mobile stays text-first to reduce visual clutter. */}
            <div className="animate-fade-in-up hidden lg:block">
              <div className="panel-surface overflow-hidden rounded-2xl p-4">
                {heroPreview ? (
                  <div className="relative aspect-[3/4] max-h-[min(520px,58vh)] overflow-hidden rounded-xl bg-warm-bg">
                    <Image
                      src={heroPreview.src}
                      alt={heroPreview.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 480px, 0px"
                      priority
                    />
                  </div>
                ) : (
                  <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl bg-warm-bg px-8 py-12 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-paper text-muted">
                      <PlaceholderIcon />
                    </div>
                    <p className="font-display text-lg font-semibold text-ink">
                      New work coming soon
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="catalog" className="page-section pb-14 sm:pb-20">
          <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-8">
            <div>
              <p className="section-kicker">Catalog</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
                Current pieces
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted sm:text-right">
              Tap a piece for full photos and details. Availability updates as
              pieces sell—use contact below to inquire.
            </p>
          </div>

          {catalog.length === 0 ? (
            <div className="panel-surface mt-8 rounded-xl px-6 py-14 text-center sm:rounded-2xl sm:px-10">
              <p className="font-display text-xl font-semibold text-ink sm:text-2xl">
                No listings yet
              </p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
                The catalog will show new work here once it is published. Use
                the contact section if you would like to reach out in the
                meantime.
              </p>
            </div>
          ) : (
            <>
              {featuredProduct && (
                <Link
                  href={`/products/${featuredProduct.id}`}
                  className="group panel-surface mt-6 grid overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md sm:mt-8 sm:rounded-2xl sm:p-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8"
                >
                  <div className="relative aspect-[4/5] min-h-[13rem] overflow-hidden rounded-lg bg-warm-bg sm:aspect-auto sm:min-h-[20rem] lg:min-h-[22rem]">
                    {featuredProduct.images[0] ? (
                      <Image
                        src={featuredProduct.images[0]}
                        alt={featuredProduct.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        sizes="(min-width: 1024px) 36rem, 100vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <PlaceholderIcon />
                      </div>
                    )}

                    <div className="absolute left-3 top-3 z-10 rounded-md bg-paper/95 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-ink shadow-sm ring-1 ring-line">
                      Featured
                    </div>
                    {featuredProduct.onSale &&
                      !featuredProduct.sold &&
                      featuredProduct.price != null && <SaleRibbon />}
                  </div>

                  <div className="px-1 pb-1 pt-4 sm:px-2 sm:pt-5 lg:py-4">
                    <p className="section-kicker">Highlight</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                      {featuredProduct.title}
                    </h3>
                    <p className="mt-4 line-clamp-4 text-base leading-relaxed text-muted sm:line-clamp-none">
                      {featuredProduct.description ||
                        "Details and more photos on the product page."}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                      <ListingPrice
                        price={featuredProduct.price}
                        compareAtPrice={featuredProduct.compareAtPrice}
                        onSale={featuredProduct.onSale}
                        size="sm"
                      />
                      <span className="text-muted">
                        {featuredProduct.sold ? "Sold" : "Available"}
                      </span>
                      <span className="text-muted">
                        {featuredProduct.images.length} photo
                        {featuredProduct.images.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                      View listing
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                  {remainingProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
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
        className="fixed bottom-4 right-4 z-50 rounded-md border border-line bg-paper/95 px-3 py-1.5 text-xs font-medium text-muted shadow-md backdrop-blur-sm transition hover:text-ink"
      >
        Admin
      </Link>

      <SiteFooter />
    </div>
  );
}
