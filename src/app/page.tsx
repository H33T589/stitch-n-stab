import { prisma } from "@/lib/db";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper/60 px-6 py-16 text-center">
            <p className="font-display text-xl text-ink sm:text-2xl">
              New pieces coming soon
            </p>
            <p className="text-muted mt-2 max-w-md mx-auto text-base">
              Check back later for freshly stitched crochet — or follow along
              on social if we&apos;ve linked it below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => {
              const images: string[] = JSON.parse(product.imageUrls);
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group rounded-2xl border border-line bg-paper shadow-sm overflow-hidden ring-1 ring-black/[0.03] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-accent/15 hover:border-accent-soft"
                >
                  <div className="aspect-square bg-[#ebe4db] overflow-hidden">
                    {images[0] ? (
                      <img
                        src={images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted/40">
                        <svg
                          className="w-12 h-12"
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
                      </div>
                    )}
                  </div>

                  <div className="p-3 sm:p-4">
                    <h2 className="font-medium text-ink leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                      {product.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {product.price != null && (
                        <span className="text-accent font-semibold text-sm sm:text-base">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                      {product.sold && (
                        <span className="bg-accent-soft text-accent px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide">
                          Sold
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
