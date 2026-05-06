function fmt(n: number) {
  return `$${n.toFixed(2)}`;
}

type Props = {
  price: number | null;
  compareAtPrice: number | null;
  onSale: boolean;
  /** Card vs product detail */
  size?: "sm" | "lg";
};

export function ListingPrice({
  price,
  compareAtPrice,
  onSale,
  size = "sm",
}: Props) {
  const showCompare =
    onSale &&
    compareAtPrice != null &&
    price != null &&
    compareAtPrice > price;

  if (price == null && !showCompare) return null;

  if (size === "lg") {
    return (
      <div className="flex flex-wrap items-baseline gap-3 gap-y-1">
        {showCompare && (
          <span className="text-xl font-medium tabular-nums text-muted line-through decoration-muted/70 sm:text-2xl">
            {fmt(compareAtPrice!)}
          </span>
        )}
        {price != null && (
          <span
            className={`tabular-nums text-ink ${
              showCompare
                ? "text-2xl font-bold text-accent sm:text-3xl"
                : "text-2xl font-semibold sm:text-3xl"
            }`}
          >
            {fmt(price)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-0.5 sm:items-start sm:gap-1">
      {showCompare && (
        <span className="text-sm font-medium tabular-nums text-muted line-through">
          {fmt(compareAtPrice!)}
        </span>
      )}
      {price != null && (
        <span
          className={`tabular-nums text-ink ${
            showCompare ? "text-lg font-bold text-accent sm:text-xl" : "text-base font-semibold sm:text-lg"
          }`}
        >
          {fmt(price)}
        </span>
      )}
    </div>
  );
}
