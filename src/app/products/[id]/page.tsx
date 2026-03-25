import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

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

  const images: string[] = JSON.parse(product.imageUrls);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader linkWholeTitle />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/"
          className="text-muted hover:text-accent text-sm font-medium mb-6 inline-flex items-center gap-1 transition-colors"
        >
          <span aria-hidden>&larr;</span> All products
        </Link>

        <div className="rounded-2xl border border-line bg-paper shadow-sm overflow-hidden ring-1 ring-black/[0.04]">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="bg-[#ebe4db] min-h-[200px]">
              {images.length > 0 ? (
                <div>
                  <img
                    src={images[0]}
                    alt={product.title}
                    className="w-full aspect-square object-cover"
                  />
                  {images.length > 1 && (
                    <div className="flex gap-2 p-3 overflow-x-auto">
                      {images.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`${product.title} — image ${i + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border-2 border-paper shadow-sm flex-shrink-0"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center text-muted/40">
                  <svg
                    className="w-20 h-20"
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

            <div className="p-6 sm:p-8 flex flex-col">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink leading-tight">
                {product.title}
              </h1>

              {product.price != null && (
                <p className="text-2xl font-semibold text-accent mt-3">
                  ${product.price.toFixed(2)}
                </p>
              )}

              {product.sold && (
                <span className="inline-block mt-4 bg-accent-soft text-accent px-3 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide w-fit">
                  Sold
                </span>
              )}

              {product.description && (
                <p className="text-muted mt-6 leading-relaxed whitespace-pre-wrap text-base">
                  {product.description}
                </p>
              )}

              <div className="mt-auto pt-8 text-sm text-muted border-t border-line/80 mt-8 pt-6">
                Interested? Reach out the same way you usually do — this page
                is just an easier way to browse what&apos;s available.
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
