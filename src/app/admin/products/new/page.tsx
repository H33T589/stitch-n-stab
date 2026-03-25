"use client";

import { createProduct } from "@/lib/actions";
import { useState } from "react";
import Link from "next/link";

export default function NewProductPage() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setPreviews(Array.from(files).map((f) => URL.createObjectURL(f)));
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/admin"
          className="text-zinc-500 hover:text-zinc-800 text-sm mb-6 inline-block"
        >
          &larr; Back to dashboard
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-8">
          Add New Product
        </h1>

        <form
          action={async (formData) => {
            setIsSubmitting(true);
            try {
              await createProduct(formData);
            } catch {
              setIsSubmitting(false);
            }
          }}
          className="bg-white rounded-2xl p-6 shadow-sm space-y-6"
        >
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Product Name *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. Cozy Bear Amigurumi"
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Tell customers about this item..."
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
            />
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Price (optional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">
                $
              </span>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border border-zinc-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Photos
            </label>
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full text-base text-zinc-500
                file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0
                file:text-base file:font-medium file:bg-zinc-900 file:text-white
                hover:file:bg-zinc-800 file:cursor-pointer"
            />
            {previews.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Preview ${i + 1}`}
                    className="w-24 h-24 object-cover rounded-lg border border-zinc-200"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-zinc-900 text-white text-lg font-medium rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
