type Props = {
  className?: string;
  buttonClassName?: string;
};

export const CONTACT_PHONE_E164 = "+17788715252";

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

export function ContactActions({ className, buttonClassName }: Props) {
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  const baseButtonClassName =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5";

  return (
    <div className={joinClasses("flex flex-wrap gap-3", className)}>
      <a
        href={`tel:${CONTACT_PHONE_E164}`}
        className={joinClasses(
          baseButtonClassName,
          "bg-sage text-white hover:opacity-95",
          buttonClassName
        )}
      >
        <PhoneIcon className="h-4 w-4" />
        Call Elaine
      </a>

      <a
        href={`sms:${CONTACT_PHONE_E164}`}
        className={joinClasses(
          baseButtonClassName,
          "bg-sky text-white hover:opacity-95",
          buttonClassName
        )}
      >
        <MessageIcon className="h-4 w-4" />
        Text Elaine
      </a>

      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={joinClasses(
            baseButtonClassName,
            "bg-plum text-white hover:opacity-95",
            buttonClassName
          )}
        >
          <InstagramIcon className="h-4 w-4" />
          Instagram
        </a>
      )}
    </div>
  );
}
