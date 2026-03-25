import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Stitch-n-Stab
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Handmade crochet with love
          </p>
        </div>
      </header>

      {/* Catalog */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {products.length === 0 ? (
          <p className="text-zinc-500 text-center py-20 text-lg">
            New products coming soon — check back later!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => {
              const images: string[] = JSON.parse(product.imageUrls);
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="aspect-square bg-zinc-100 overflow-hidden">
                    {images[0] ? (
                      <img
                        src={images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
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

                  {/* Info */}
                  <div className="p-3 sm:p-4">
                    <h2 className="font-medium text-zinc-900 truncate">
                      {product.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      {product.price != null && (
                        <span className="text-zinc-600 text-sm">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                      {product.sold && (
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
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

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Stitch-n-Stab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
