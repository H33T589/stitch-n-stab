"use client";

import { useEffect, useState } from "react";

type Props = {
  initialViewCount: number;
  listedDate: string;
  productId: string;
};

function formatViewCount(viewCount: number) {
  return new Intl.NumberFormat("en-US").format(viewCount);
}

export function ProductMetaCards({
  initialViewCount,
  listedDate,
  productId,
}: Props) {
  const [viewCount, setViewCount] = useState(initialViewCount);

  useEffect(() => {
    let isCancelled = false;

    async function trackView() {
      try {
        const response = await fetch(`/api/products/${productId}/view`, {
          method: "POST",
          cache: "no-store",
          keepalive: true,
        });

        if (!response.ok) return;

        const data = (await response.json()) as { viewCount?: number };
        if (!isCancelled && typeof data.viewCount === "number") {
          setViewCount(data.viewCount);
        }
      } catch {
        // Keep the server-rendered count if tracking fails.
      }
    }

    void trackView();

    return () => {
      isCancelled = true;
    };
  }, [productId]);

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <div className="panel-surface rounded-[1.35rem] px-5 py-5 sm:rounded-[1.6rem]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Views
        </p>
        <p className="mt-2 font-display text-xl font-semibold text-ink">
          {formatViewCount(viewCount)}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Total product-page opens from visitors.
        </p>
      </div>

      <div className="panel-surface rounded-[1.35rem] px-5 py-5 sm:rounded-[1.6rem]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Listed
        </p>
        <p className="mt-2 font-display text-xl font-semibold text-ink">
          {listedDate}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Reach out soon if this piece feels right.
        </p>
      </div>
    </section>
  );
}
