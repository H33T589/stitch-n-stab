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
      <div className="panel-surface rounded-xl px-5 py-5 sm:rounded-2xl">
        <p className="section-kicker">Page views</p>
        <p className="mt-2 font-display text-xl font-semibold tabular-nums text-ink">
          {formatViewCount(viewCount)}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          How many times this listing has been opened.
        </p>
      </div>

      <div className="panel-surface rounded-xl px-5 py-5 sm:rounded-2xl">
        <p className="section-kicker">Listed</p>
        <p className="mt-2 font-display text-xl font-semibold text-ink">
          {listedDate}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Use contact on the home page to ask about this piece.
        </p>
      </div>
    </section>
  );
}
