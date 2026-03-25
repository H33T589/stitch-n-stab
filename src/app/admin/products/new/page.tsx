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
    <div className="min-h-screen bg-canvas p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/admin"
          className="text-muted hover:text-accent text-sm font-medium mb-6 inline-block min-h-11 flex items-center transition-colors"
        >
          &larr; Back to dashboard
        </Link>

        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink mb-2">
          Add new product
        </h1>
        <p className="text-muted text-sm mb-8">
          Fill in the details and choose one or more photos from your device.
        </p>

        <form
          action={async (formData) => {
            setIsSubmitting(true);
            try {
              await createProduct(formData);
            } catch {
              setIsSubmitting(false);
            }
          }}
          className="bg-paper border border-line rounded-2xl p-6 sm:p-8 shadow-sm ring-1 ring-black/[0.03] space-y-6"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-ink mb-1.5"
            >
              Product name *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. Cozy bear amigurumi"
              className="w-full px-4 py-3.5 border border-line rounded-xl text-lg bg-paper focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-ink mb-1.5"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Tell customers about sizes, colours, care…"
              className="w-full px-4 py-3.5 border border-line rounded-xl text-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-ink mb-1.5"
            >
              Price (optional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-lg">
                $
              </span>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-3.5 border border-line rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              Photos
            </label>
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full text-base text-muted
                file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0
                file:text-base file:font-semibold file:bg-accent file:text-white
                hover:file:bg-accent-hover file:cursor-pointer"
            />
            {previews.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Preview ${i + 1}`}
                    className="w-24 h-24 object-cover rounded-xl border border-line"
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-14 py-3.5 bg-accent text-white text-lg font-semibold rounded-xl hover:bg-accent-hover disabled:opacity-50 transition-colors cursor-pointer shadow-sm"
          >
            {isSubmitting ? "Saving…" : "Save product"}
          </button>
        </form>
      </div>
    </div>
  );
}
