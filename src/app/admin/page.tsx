import { prisma } from "@/server/db";
import {
  logout,
  deleteProduct,
  toggleSold,
  togglePublished,
} from "@/server/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-canvas p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <p className="font-display text-xl text-ink sm:text-2xl font-semibold">
              Your products
            </p>
            <p className="text-muted text-sm mt-1">
              Add, hide, mark sold, or remove listings.
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-muted hover:text-accent transition-colors cursor-pointer min-h-11 px-2"
            >
              Sign out
            </button>
          </form>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center w-full sm:w-auto min-h-14 px-8 py-3.5 bg-accent text-white text-lg font-semibold rounded-xl hover:bg-accent-hover transition-colors mb-8 shadow-sm"
        >
          + Add new product
        </Link>

        {products.length === 0 ? (
          <p className="text-muted text-center py-16 text-lg rounded-2xl border border-dashed border-line bg-paper/50">
            No products yet. Add your first one!
          </p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const images: string[] = JSON.parse(product.imageUrls);
              return (
                <div
                  key={product.id}
                  className={`bg-paper border border-line rounded-2xl p-4 shadow-sm ring-1 ring-black/[0.03] flex flex-col sm:flex-row gap-4 items-start sm:items-center ${
                    !product.published ? "opacity-65" : ""
                  }`}
                >
                  <div className="w-24 h-24 rounded-xl bg-[#ebe4db] flex-shrink-0 overflow-hidden border border-line">
                    {images[0] ? (
                      <img
                        src={images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted/60 text-xs">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-lg text-ink leading-snug">
                      {product.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2 text-sm">
                      {product.price != null && (
                        <span className="text-accent font-semibold">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                      {product.sold && (
                        <span className="bg-accent-soft text-accent px-2 py-0.5 rounded-full text-xs font-semibold uppercase">
                          Sold
                        </span>
                      )}
                      {!product.published && (
                        <span className="bg-muted/15 text-muted px-2 py-0.5 rounded-full text-xs font-semibold">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 flex-shrink-0 w-full sm:w-auto">
                    <form action={toggleSold.bind(null, product.id)}>
                      <button
                        type="submit"
                        className="min-h-11 px-4 text-sm font-medium bg-canvas border border-line rounded-xl hover:bg-accent-soft/50 transition-colors cursor-pointer"
                      >
                        {product.sold ? "Mark available" : "Mark sold"}
                      </button>
                    </form>
                    <form action={togglePublished.bind(null, product.id)}>
                      <button
                        type="submit"
                        className="min-h-11 px-4 text-sm font-medium bg-canvas border border-line rounded-xl hover:bg-accent-soft/50 transition-colors cursor-pointer"
                      >
                        {product.published ? "Hide" : "Show"}
                      </button>
                    </form>
                    <form action={deleteProduct.bind(null, product.id)}>
                      <button
                        type="submit"
                        className="min-h-11 px-4 text-sm font-medium bg-red-50 text-red-700 border border-red-100 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
