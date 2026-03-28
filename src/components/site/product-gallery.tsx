"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  title: string;
};

export function ProductGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-[1.75rem] bg-warm-bg">
        <svg
          className="h-16 w-16 text-muted/30"
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
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-warm-bg ring-1 ring-white/80">
        <Image
          src={images[active]}
          alt={`${title} - photo ${active + 1}`}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 40rem, 100vw"
        />

        <div className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-white backdrop-blur-sm">
          {active + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-[1rem] transition-all duration-200 ${
                i === active
                  ? "scale-[1.02] ring-2 ring-accent ring-offset-2 ring-offset-canvas"
                  : "opacity-75 ring-1 ring-line hover:opacity-100 hover:ring-stitch"
              }`}
              aria-label={`Show photo ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${title} - thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="5rem"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
