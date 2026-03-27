import { prisma } from "@/server/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ProductGallery } from "@/components/site/product-gallery";

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
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader linkWholeTitle />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent transition-colors mb-6 sm:mb-8 group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
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

        <div className="animate-fade-in-up grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          <ProductGallery images={images} title={product.title} />

          <div className="flex flex-col">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-ink leading-tight">
              {product.title}
            </h1>

            {product.price != null && (
              <p className="mt-3 text-2xl sm:text-3xl font-bold text-accent">
                ${product.price.toFixed(2)}
              </p>
            )}

            {product.sold && (
              <span className="mt-4 inline-flex items-center gap-1.5 bg-accent text-white px-3.5 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide w-fit shadow-sm">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Sold
              </span>
            )}

            {product.description && (
              <div className="mt-6 sm:mt-8">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-2">
                  About this piece
                </h2>
                <p className="text-ink/80 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Contact CTA */}
            <div className="mt-auto pt-8">
              <div className="rounded-2xl bg-warm-bg border border-line p-5 sm:p-6">
                <p className="font-display text-lg font-semibold text-ink mb-1.5">
                  Love this piece?
                </p>
                <p className="text-muted text-sm leading-relaxed mb-4">
                  Just reach out &mdash; I&rsquo;d love to hear from you!
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <a
                    href="tel:+17788715252"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Call
                  </a>
                  <a
                    href="sms:+17788715252"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Text
                  </a>

                  {instagram && (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-plum text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                        />
                        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
                      </svg>
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs text-muted/70">
              <span>
                Listed{" "}
                {product.createdAt.toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              {images.length > 0 && (
                <>
                  <span className="w-0.5 h-0.5 rounded-full bg-muted/40" />
                  <span>
                    {images.length} photo{images.length > 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
