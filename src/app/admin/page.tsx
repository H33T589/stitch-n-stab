import { prisma } from "@/lib/db";
import { logout, deleteProduct, toggleSold, togglePublished } from "@/lib/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
            Your Products
          </h1>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </form>
        </div>

        {/* Add Product Button */}
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white text-lg font-medium rounded-xl hover:bg-zinc-800 transition-colors mb-8"
        >
          + Add New Product
        </Link>

        {/* Product List */}
        {products.length === 0 ? (
          <p className="text-zinc-500 text-center py-16 text-lg">
            No products yet. Add your first one!
          </p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const images: string[] = JSON.parse(product.imageUrls);
              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center ${
                    !product.published ? "opacity-60" : ""
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg bg-zinc-100 flex-shrink-0 overflow-hidden">
                    {images[0] ? (
                      <img
                        src={images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-lg truncate text-zinc-900">
                      {product.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-1 text-sm">
                      {product.price != null && (
                        <span className="text-zinc-600">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                      {product.sold && (
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          Sold
                        </span>
                      )}
                      {!product.published && (
                        <span className="bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full text-xs font-medium">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 flex-shrink-0">
                    <form action={toggleSold.bind(null, product.id)}>
                      <button
                        type="submit"
                        className="px-3 py-2 text-sm bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
                      >
                        {product.sold ? "Mark Available" : "Mark Sold"}
                      </button>
                    </form>
                    <form action={togglePublished.bind(null, product.id)}>
                      <button
                        type="submit"
                        className="px-3 py-2 text-sm bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
                      >
                        {product.published ? "Hide" : "Show"}
                      </button>
                    </form>
                    <form action={deleteProduct.bind(null, product.id)}>
                      <button
                        type="submit"
                        className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
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
