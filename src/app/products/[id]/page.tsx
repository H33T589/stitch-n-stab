import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

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
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <Link
            href="/"
            className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight hover:text-zinc-700 transition-colors"
          >
            Stitch-n-Stab
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/"
          className="text-zinc-500 hover:text-zinc-800 text-sm mb-6 inline-block"
        >
          &larr; Back to all products
        </Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Images */}
            <div className="bg-zinc-100">
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
                          alt={`${product.title} ${i + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border-2 border-transparent hover:border-zinc-400 transition-colors flex-shrink-0"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center text-zinc-300">
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

            {/* Details */}
            <div className="p-6 sm:p-8 flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                {product.title}
              </h1>

              {product.price != null && (
                <p className="text-xl text-zinc-700 mt-2">
                  ${product.price.toFixed(2)}
                </p>
              )}

              {product.sold && (
                <span className="inline-block mt-3 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium w-fit">
                  Sold
                </span>
              )}

              {product.description && (
                <p className="text-zinc-600 mt-6 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              )}

              <div className="mt-auto pt-8 text-sm text-zinc-500">
                Interested? Reach out on social media or send a message!
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
