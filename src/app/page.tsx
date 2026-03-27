import { prisma } from "@/server/db";
import Link from "next/link";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export const dynamic = "force-dynamic";

function PlaceholderIcon() {
  return (
    <svg
      className="w-10 h-10 text-muted/25"
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
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm9 3a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Personal intro */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-2">
          <div className="text-center max-w-lg mx-auto">
            <p className="text-muted text-base sm:text-lg leading-relaxed">
              Hi there! I&rsquo;m Elaine, and I crochet one-of-a-kind pieces
              right here in beautiful British Columbia. Everything you see is
              handmade with love &mdash; take a look around!
            </p>
          </div>
        </section>

        {/* Catalog */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {products.length === 0 ? (
            <div className="animate-fade-in-up rounded-2xl border-2 border-dashed border-stitch/40 bg-warm-bg/60 px-6 py-20 text-center">
              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-accent-soft flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              </div>
              <p className="font-display text-xl text-ink sm:text-2xl">
                New pieces coming soon!
              </p>
              <p className="text-muted mt-2 max-w-sm mx-auto text-sm sm:text-base">
                I&rsquo;m working on some fresh creations right now &mdash;
                check back soon or give me a shout below!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {products.map((product, i) => {
                const images: string[] = JSON.parse(product.imageUrls);
                const hasSecondImage = images.length >= 2;

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group animate-fade-in-up rounded-2xl bg-paper shadow-sm overflow-hidden ring-1 ring-black/[0.04] transition-all duration-250 hover:-translate-y-1 hover:shadow-lg hover:ring-accent/20"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* Image with hover swap */}
                    <div className="relative aspect-square bg-warm-bg overflow-hidden">
                      {images[0] ? (
                        <>
                          <img
                            src={images[0]}
                            alt={product.title}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out ${
                              hasSecondImage
                                ? "group-hover:opacity-0 group-hover:scale-[1.02]"
                                : "group-hover:scale-[1.04]"
                            }`}
                          />
                          {hasSecondImage && (
                            <img
                              src={images[1]}
                              alt={`${product.title} — alternate view`}
                              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 scale-[1.02] group-hover:scale-100 transition-all duration-500 ease-out"
                            />
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PlaceholderIcon />
                        </div>
                      )}

                      {product.sold && (
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="inline-block bg-accent text-white text-[0.625rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                            Sold
                          </span>
                        </div>
                      )}

                      {images.length > 1 && (
                        <div className="absolute bottom-2 right-2 z-10">
                          <span className="inline-flex items-center gap-1 bg-ink/60 text-white text-[0.625rem] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
                            <CameraIcon />
                            {images.length}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 sm:p-4">
                      <h2 className="text-sm sm:text-base font-semibold text-ink leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-200">
                        {product.title}
                      </h2>

                      {product.price != null && (
                        <p className="mt-1.5 text-accent font-bold text-sm sm:text-base">
                          ${product.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Subtle admin shortcut for Elaine (hidden-ish, but clickable) */}
      <Link
        href="/admin/login"
        aria-label="Admin sign in"
        className="fixed z-50 bottom-4 left-4 opacity-30 hover:opacity-100 transition-opacity"
      >
        <span className="inline-flex items-center gap-2 rounded-2xl bg-ink/90 text-white px-4 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/15">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            className="w-4 h-4"
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
          </svg>
          <span className="text-xs font-semibold">Elaine</span>
        </span>
      </Link>

      <SiteFooter />
    </div>
  );
}
