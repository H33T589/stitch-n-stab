import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/site/product-gallery";
import { ContactActions } from "@/components/site/contact-actions";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { prisma } from "@/server/db";

function parseImageUrls(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id, published: true },
  });

  if (!product) notFound();

  const images = parseImageUrls(product.imageUrls);
  const listedDate = product.createdAt.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="site-shell flex min-h-screen flex-col">
      <SiteHeader linkWholeTitle />

      <main className="flex-1 pb-14 pt-6 sm:pb-20 sm:pt-8">
        <div className="page-section">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-accent"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to all products
          </Link>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start xl:gap-8">
            <div className="panel-surface rounded-[2rem] p-4 sm:p-5 lg:sticky lg:top-8">
              <ProductGallery images={images} title={product.title} />
            </div>

            <div className="space-y-5">
              <section className="panel-surface rounded-[2rem] px-6 py-7 sm:px-8 sm:py-8">
                <p className="section-kicker">Elaine&apos;s latest piece</p>
                <h1 className="mt-4 font-display text-[2.5rem] font-semibold leading-[0.96] text-ink sm:text-[3.3rem]">
                  {product.title}
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {product.price != null && (
                    <p className="rounded-full bg-accent-soft px-4 py-2 text-lg font-bold text-accent">
                      ${product.price.toFixed(2)}
                    </p>
                  )}
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      product.sold
                        ? "bg-accent text-white"
                        : "bg-[#fff4ea] text-ink"
                    }`}
                  >
                    {product.sold ? "Already sold" : "Available right now"}
                  </span>
                  <span className="rounded-full bg-[#f6efe8] px-4 py-2 text-sm font-semibold text-muted">
                    One of a kind
                  </span>
                </div>

                {product.description && (
                  <div className="mt-7 rounded-[1.5rem] bg-[#fff7f1] p-5 ring-1 ring-white/75">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                      About this piece
                    </p>
                    <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-ink/85">
                      {product.description}
                    </p>
                  </div>
                )}
              </section>

              <section className="grid gap-4 sm:grid-cols-3">
                <div className="panel-surface rounded-[1.6rem] px-5 py-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                    Handmade
                  </p>
                  <p className="mt-2 font-display text-xl font-semibold text-ink">
                    Crafted by Elaine
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Made with care in British Columbia.
                  </p>
                </div>

                <div className="panel-surface rounded-[1.6rem] px-5 py-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                    Photos
                  </p>
                  <p className="mt-2 font-display text-xl font-semibold text-ink">
                    {images.length} view{images.length === 1 ? "" : "s"}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Tap through the gallery for a closer look.
                  </p>
                </div>

                <div className="panel-surface rounded-[1.6rem] px-5 py-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                    Listed
                  </p>
                  <p className="mt-2 font-display text-xl font-semibold text-ink">
                    {listedDate}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Reach out soon if this piece feels right.
                  </p>
                </div>
              </section>

              <section className="panel-surface rounded-[2rem] px-6 py-7 sm:px-8 sm:py-8">
                <p className="section-kicker">Love this piece?</p>
                <h2 className="mt-4 font-display text-3xl font-semibold text-ink">
                  Elaine would love to hear from you.
                </h2>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
                  The fastest way to claim a piece or ask a question is to call
                  or text directly. Instagram works too if that is easier.
                </p>

                <ContactActions className="mt-6" />
              </section>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
