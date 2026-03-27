"use client";

import { useState } from "react";

type Props = {
  images: string[];
  title: string;
};

export function ProductGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-warm-bg rounded-2xl flex items-center justify-center">
        <svg
          className="w-16 h-16 text-muted/30"
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
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square overflow-hidden rounded-2xl bg-warm-bg">
        <img
          src={images[active]}
          alt={`${title} — photo ${active + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 sm:w-[72px] sm:h-[72px] flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
                i === active
                  ? "ring-2 ring-accent ring-offset-2 ring-offset-canvas"
                  : "ring-1 ring-line hover:ring-stitch opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={src}
                alt={`${title} — thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
