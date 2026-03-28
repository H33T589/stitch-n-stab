import Link from "next/link";
import { ContactActions } from "@/components/site/contact-actions";

export function SiteFooter() {
  return (
    <footer id="contact" className="mt-auto pb-8 pt-14 sm:pb-10 sm:pt-20">
      <div className="page-section">
        <div className="panel-surface overflow-hidden rounded-[1.75rem] px-5 py-7 sm:rounded-[2rem] sm:px-8 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="section-kicker">Get in touch</p>
              <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                See something you love? Elaine is easy to reach.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                Every piece is handmade, one of a kind, and usually carrying a
                little humor with it too. Call, text, or say hello on
                Instagram.
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-warm-bg/70 p-5 ring-1 ring-white/70 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Reach Elaine
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Fastest option: text or call directly. Instagram is there too if
                that is easier.
              </p>

              <ContactActions
                className="mt-5 flex-col sm:flex-row"
                buttonClassName="w-full justify-center sm:w-auto sm:min-w-0"
              />
            </div>
          </div>

          <div className="my-8 thread-divider" />

          <div className="flex flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              Handmade in British Columbia by Elaine, with color, humor, and a
              lot of yarn.
            </p>

            <Link
              href="/admin/login"
              className="w-fit text-xs uppercase tracking-[0.18em] text-muted/55 transition-colors hover:text-muted"
              aria-label="Admin sign in"
            >
              &copy; {new Date().getFullYear()} Stitch-n-Stab
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
