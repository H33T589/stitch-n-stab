"use client";

import { createProduct } from "@/server/actions";
import { useState } from "react";
import Link from "next/link";

function resizeImage(
  file: File,
  maxDim = 1600,
  quality = 0.82
): Promise<File> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      if (width <= maxDim && height <= maxDim && file.size <= 1_048_576) {
        resolve(file);
        return;
      }

      const scale = Math.min(maxDim / width, maxDim / height, 1);
      width = Math.round(width * scale);
      height = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          resolve(
            new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
              type: "image/jpeg",
            })
          );
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

export default function NewProductPage() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const list = Array.from(files);
    setSelectedFiles(list);
    setPreviews(list.map((f) => URL.createObjectURL(f)));
    setError(null);
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      const resized = new FormData();
      resized.set("title", formData.get("title") as string);
      resized.set("description", formData.get("description") as string);
      resized.set("price", formData.get("price") as string);

      for (const file of selectedFiles) {
        if (file.size === 0) continue;
        const compressed = await resizeImage(file);
        resized.append("images", compressed);
      }

      await createProduct(resized);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "digest" in err) {
        throw err;
      }
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/admin"
          className="text-muted hover:text-accent text-sm font-medium mb-6 inline-flex items-center min-h-11 transition-colors"
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
          action={handleSubmit}
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-14 py-3.5 bg-accent text-white text-lg font-semibold rounded-xl hover:bg-accent-hover disabled:opacity-50 transition-colors cursor-pointer shadow-sm"
          >
            {isSubmitting ? "Compressing photos & saving…" : "Save product"}
          </button>
        </form>
      </div>
    </div>
  );
}
