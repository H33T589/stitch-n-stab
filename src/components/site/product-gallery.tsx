"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SaleRibbon } from "@/components/site/sale-ribbon";

type Props = {
  images: string[];
  title: string;
  showSale?: boolean;
};

export function ProductGallery({ images, title, showSale }: Props) {
  const [active, setActive] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  function goPrev() {
    setActive((current) => (current === 0 ? images.length - 1 : current - 1));
  }

  function goNext() {
    setActive((current) => (current === images.length - 1 ? 0 : current + 1));
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null || touchStartY.current == null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        goPrev();
      } else {
        goNext();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  }

  useEffect(() => {
    if (!isViewerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsViewerOpen(false);
      if (images.length > 1 && event.key === "ArrowLeft") {
        setActive((current) => (current === 0 ? images.length - 1 : current - 1));
      }
      if (images.length > 1 && event.key === "ArrowRight") {
        setActive((current) => (current === images.length - 1 ? 0 : current + 1));
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [images.length, isViewerOpen]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-xl bg-warm-bg sm:aspect-square">
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
    <>
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setIsViewerOpen(true)}
          className="group relative block aspect-[4/5] overflow-hidden rounded-xl border border-line bg-canvas sm:aspect-square"
          aria-label="Open full-screen photo viewer"
        >
          <Image
            src={images[active]}
            alt={`${title} - photo ${active + 1}`}
            fill
            className="object-contain transition duration-300 group-hover:scale-[1.01]"
            sizes="(min-width: 1024px) 40rem, 100vw"
          />

          {showSale && <SaleRibbon />}

          <div className="absolute left-3 top-3 rounded-md bg-ink/75 px-2 py-1 text-[0.625rem] font-medium tabular-nums text-white sm:left-3.5 sm:top-3.5 sm:px-2.5 sm:text-xs">
            {active + 1} / {images.length}
          </div>

          <div className="absolute bottom-3 right-3 rounded-md border border-line bg-paper/95 px-2.5 py-1 text-[0.625rem] font-medium text-ink shadow-sm sm:text-xs">
            Full screen
          </div>
        </button>

        {images.length > 1 && (
          <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:gap-3 sm:px-0">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                className={`relative h-[4.5rem] w-[4.5rem] snap-start flex-shrink-0 overflow-hidden rounded-lg transition-opacity duration-150 sm:h-20 sm:w-20 ${
                  i === active
                    ? "ring-2 ring-accent ring-offset-2 ring-offset-paper opacity-100"
                    : "opacity-70 ring-1 ring-line hover:opacity-100"
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

      {isViewerOpen && (
        <div className="fixed inset-0 z-[100] bg-[#171117]/95 text-white">
          <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between gap-3 sm:inset-x-6 sm:top-6">
            <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] backdrop-blur-sm">
              {active + 1} / {images.length}
            </div>

            <button
              type="button"
              onClick={() => setIsViewerOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
              aria-label="Close photo viewer"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
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

          <div className="relative flex h-full flex-col">
            <div
              className="relative flex-1 px-3 pb-28 pt-20 sm:px-10 sm:pb-32 sm:pt-24"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={images[active]}
                alt={`${title} - full photo ${active + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm sm:left-6"
                    aria-label="Previous photo"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm sm:right-6"
                    aria-label="Next photo"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-[#211921]/90 px-4 py-4 backdrop-blur-md sm:px-6">
                <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1">
                  {images.map((src, i) => (
                    <button
                      key={`${src}-viewer`}
                      type="button"
                      onClick={() => setActive(i)}
                      className={`relative h-16 w-16 snap-start flex-shrink-0 overflow-hidden rounded-[0.9rem] ${
                        i === active
                          ? "ring-2 ring-white"
                          : "opacity-70 ring-1 ring-white/15"
                      }`}
                      aria-label={`View photo ${i + 1}`}
                    >
                      <Image
                        src={src}
                        alt={`${title} - viewer thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="4rem"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
