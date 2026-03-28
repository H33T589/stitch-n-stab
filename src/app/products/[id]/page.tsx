import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/site/product-gallery";
import { ProductMetaCards } from "@/components/site/product-meta-cards";
import { SiteFooter } from "@/components/site/site-footer";
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
      <main className="flex-1 pb-14 pt-5 sm:pb-20 sm:pt-8">
        <div className="page-section">
          <div className="mb-4 flex items-start justify-between gap-4 sm:mb-6">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-accent"
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

            <Link
              href="/"
              className="opacity-75 transition-opacity hover:opacity-100"
              aria-label="Stitch 'N' Stab home"
            >
              <Image
                src="/stitch-n-stab-logo.svg"
                alt="Stitch 'N' Stab logo"
                width={84}
                height={70}
                className="h-auto w-[68px] sm:w-[84px]"
                priority
              />
            </Link>
          </div>

          <div className="grid gap-5 lg:mt-2 lg:grid-cols-[1.02fr_0.98fr] lg:items-start xl:gap-8">
            <div className="panel-surface rounded-[1.6rem] p-3 sm:rounded-[2rem] sm:p-5 lg:sticky lg:top-8">
              <ProductGallery images={images} title={product.title} />
            </div>

            <div className="space-y-4 sm:space-y-5">
              <section className="panel-surface rounded-[1.6rem] px-5 py-6 sm:rounded-[2rem] sm:px-8 sm:py-8">
                <p className="section-kicker">Elaine&apos;s latest piece</p>
                <h1 className="mt-4 font-display text-[2.05rem] font-semibold leading-[1.02] text-ink sm:text-[3.3rem] sm:leading-[0.96]">
                  {product.title}
                </h1>

                <div className="mt-5 flex flex-col items-start gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
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

              <ProductMetaCards
                productId={product.id}
                initialViewCount={product.viewCount}
                listedDate={listedDate}
              />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
