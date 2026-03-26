export function SiteFooter() {
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

  return (
    <footer className="border-t border-line bg-paper mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-center space-y-4">
        {instagram && (
          <p className="text-sm text-muted">
            <a
              href={instagram}
              className="text-accent font-medium underline decoration-dotted underline-offset-4 hover:text-accent-hover transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              See more on Instagram
            </a>
          </p>
        )}
        <p className="text-muted text-sm">
          Interested in a piece? Reach out on social media or by message —
          we&apos;re happy to help local customers.
        </p>
        <p className="text-muted/80 text-xs">
          &copy; {new Date().getFullYear()} Stitch-n-Stab
        </p>
      </div>
    </footer>
  );
}
