import Link from "next/link";

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

export function SiteFooter() {
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

  return (
    <footer className="mt-auto border-t border-line bg-paper">
      <div className="stitch-line" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col items-center text-center gap-6">
          <p className="font-display text-xl text-ink">Get in touch</p>
          <p className="text-muted text-sm max-w-sm leading-relaxed">
            Like something you see? Don&rsquo;t be shy — give me a call, shoot
            me a text, or find me on Instagram.
          </p>

          {/* Contact buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="tel:+17788715252"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sage text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              <PhoneIcon className="w-4 h-4" />
              Call me
            </a>
            <a
              href="sms:+17788715252"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              <MessageIcon className="w-4 h-4" />
              Text me
            </a>
            {instagram && (
              <a
                href={instagram}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-plum text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon className="w-4 h-4" />
                Instagram
              </a>
            )}
          </div>

          <div className="w-16 stitch-line mt-2" />

          <p className="text-muted text-sm max-w-xs leading-relaxed">
            Every piece is handmade and one-of-a-kind, crocheted right here in
            BC.
          </p>

          {/* Hidden admin link — looks like plain copyright text */}
          <Link
            href="/admin/login"
            className="text-muted/40 text-xs hover:text-muted/60 transition-colors cursor-default"
            aria-label="Admin"
            tabIndex={-1}
          >
            &copy; {new Date().getFullYear()} Stitch-n-Stab
          </Link>
        </div>
      </div>
    </footer>
  );
}
