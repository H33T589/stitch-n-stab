type Props = {
  /** e.g. when item is sold, skip sale ribbon or parent handles z-index */
  className?: string;
};

/**
 * Diagonal “Sale” marker for product imagery — high contrast, readable at small sizes.
 */
export function SaleRibbon({ className = "" }: Props) {
  return (
    <div
      className={`pointer-events-none absolute right-0 top-0 z-20 h-16 w-16 overflow-hidden sm:h-[4.25rem] sm:w-[4.25rem] ${className}`}
      aria-hidden
    >
      <div className="absolute right-[-42%] top-[24%] w-[130%] origin-top rotate-45 border border-white/25 bg-gradient-to-b from-[#c43d62] to-accent py-[5px] text-center shadow-[0_6px_16px_rgba(180,69,106,0.35)]">
        <span className="block text-[0.58rem] font-extrabold uppercase tracking-[0.28em] text-white sm:text-[0.62rem]">
          Sale
        </span>
      </div>
    </div>
  );
}
