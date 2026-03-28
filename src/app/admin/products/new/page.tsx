"use client";

import { createProduct } from "@/server/actions";
import { useState, useRef } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { RotatingElaineGreeting } from "@/components/admin/rotating-elaine-greeting";
import { AdminHelpButton } from "@/components/admin/admin-help-button";

const MAX_PHOTOS = 6;

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

type PhotoEntry = { file: File; preview: string };

export default function NewProductPage() {
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addFiles(fileList: FileList | File[]) {
    const incoming = Array.from(fileList).filter(
      (f) => f.size > 0 && f.type.startsWith("image/")
    );
    if (incoming.length === 0) return;

    setPhotos((prev) => {
      const room = MAX_PHOTOS - prev.length;
      const toAdd = incoming.slice(0, room).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      return [...prev, ...toAdd];
    });
    setError(null);
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].preview);
      copy.splice(index, 1);
      return copy;
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      const resized = new FormData();
      resized.set("title", formData.get("title") as string);
      resized.set("description", formData.get("description") as string);
      resized.set("price", formData.get("price") as string);

      for (const { file } of photos) {
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

  const spotsLeft = MAX_PHOTOS - photos.length;

  return (
    <div className="min-h-screen bg-canvas p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/admin"
          className="text-muted hover:text-accent text-sm font-medium mb-6 inline-flex items-center min-h-11 transition-colors"
        >
          &larr; Back to dashboard
        </Link>

        <div className="flex justify-end mb-4">
          <AdminHelpButton />
        </div>
        <RotatingElaineGreeting />

        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink mb-2">
          Add new product
        </h1>
        <p className="text-muted text-sm mb-8">
          Fill in the details and add up to {MAX_PHOTOS} photos.
        </p>

        <form
          action={handleSubmit}
          className="bg-paper border border-line rounded-2xl p-6 sm:p-8 shadow-sm ring-1 ring-black/[0.03] space-y-6"
        >
          {/* Title */}
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

          {/* Description */}
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

          {/* Price */}
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

          {/* Photos */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label className="block text-sm font-medium text-ink">
                Photos
              </label>
              <span className="text-xs text-muted">
                {photos.length} / {MAX_PHOTOS}
              </span>
            </div>

            {/* Preview grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-3">
                {photos.map((entry, i) => (
                  <div key={entry.preview} className="relative group/thumb">
                    <NextImage
                      src={entry.preview}
                      alt={`Photo ${i + 1}`}
                      width={400}
                      height={400}
                      unoptimized
                      className="w-full aspect-square object-cover rounded-xl border border-line"
                    />
                    {i === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 bg-ink/60 text-white text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-ink/60 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm hover:bg-red-600"
                      aria-label={`Remove photo ${i + 1}`}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone / add button */}
            {spotsLeft > 0 && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center border-2 border-dashed border-line rounded-xl px-4 py-8 cursor-pointer hover:border-accent/40 hover:bg-accent-soft/20 transition-colors"
              >
                <svg
                  className="w-8 h-8 text-muted/40 mb-2"
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
                <p className="text-sm font-medium text-muted">
                  {photos.length === 0
                    ? "Tap to choose photos"
                    : `Add more (${spotsLeft} left)`}
                </p>
                <p className="text-xs text-muted/60 mt-1">
                  or drag and drop here
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
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
