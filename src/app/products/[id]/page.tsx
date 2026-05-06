import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/site/product-gallery";
import { ListingPrice } from "@/components/site/listing-price";
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
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
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

          <div className="grid gap-6 lg:mt-2 lg:grid-cols-[1.02fr_0.98fr] lg:items-start xl:gap-8">
            <div className="panel-surface rounded-xl p-3 sm:rounded-2xl sm:p-4 lg:sticky lg:top-8">
              <ProductGallery
                images={images}
                title={product.title}
                showSale={product.onSale && !product.sold}
              />
            </div>

            <div className="space-y-4 sm:space-y-5">
              <section className="panel-surface rounded-xl px-5 py-6 sm:rounded-2xl sm:px-8 sm:py-8">
                <p className="section-kicker">Product</p>
                <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                  {product.title}
                </h1>

                <div className="mt-5 flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
                  <ListingPrice
                    price={product.price}
                    compareAtPrice={product.compareAtPrice}
                    onSale={product.onSale}
                    size="lg"
                  />
                  <span
                    className={`inline-flex w-fit rounded-md px-2.5 py-1 text-sm font-medium ${
                      product.sold
                        ? "bg-ink text-white"
                        : "border border-line bg-canvas text-ink"
                    }`}
                  >
                    {product.sold ? "Sold" : "Available"}
                  </span>
                  <span className="text-sm text-muted">One of a kind</span>
                </div>

                {product.description && (
                  <div className="mt-6 border-t border-line pt-6">
                    <p className="section-kicker">Description</p>
                    <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-ink">
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
