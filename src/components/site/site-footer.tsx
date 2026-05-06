import Link from "next/link";
import { ContactActions } from "@/components/site/contact-actions";

export function SiteFooter() {
  return (
    <footer id="contact" className="mt-auto border-t border-line bg-paper pb-8 pt-12 sm:pb-10 sm:pt-16">
      <div className="page-section">
        <div className="panel-surface overflow-hidden rounded-xl px-5 py-8 sm:rounded-2xl sm:px-8 sm:py-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-start">
            <div>
              <p className="section-kicker">Contact</p>
              <h2 className="mt-3 max-w-xl font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                Questions or interested in a piece? Reach out directly.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
                Handmade, one-of-a-kind work. For availability, use phone, text,
                or Instagram.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-canvas/50 p-5 sm:p-6">
              <p className="text-sm font-semibold text-ink">How to reach Elaine</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Phone or text is usually fastest. Instagram works too.
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
              Handmade in British Columbia · Stitch-n-Stab · affiliated with
              Forever Crocheting
            </p>

            <Link
              href="/admin/login"
              className="w-fit text-xs tracking-wide text-muted/70 transition-colors hover:text-muted"
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
