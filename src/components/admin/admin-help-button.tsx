"use client";

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.09 9a3 3 0 0 1 5.82 1c0 2-3 2-3 4" />
      <path d="M12 17h.01" />
      <path d="M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z" />
    </svg>
  );
}

const PHONE_NUMBER_E164 = "17788795796";

export function AdminHelpButton() {
  return (
    <a
      href={`sms:+${PHONE_NUMBER_E164}`}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm sm:text-base font-semibold text-white shadow-[0_14px_40px_rgba(239,68,68,0.35)] ring-1 ring-white/10 hover:bg-red-700 transition-colors cursor-pointer select-none"
      aria-label="Text Elaine for help"
    >
      <HelpIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      Help
    </a>
  );
}

