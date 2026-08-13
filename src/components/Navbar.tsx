import Link from "next/link";

/** Labels must match what the destination actually shows — "Speakers" led to a page with none. */
const navLinks = [
  { label: "Experience", href: "/#experience" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Itinerary", href: "/itinerary" },
  { label: "Travel", href: "/#travel" },
  { label: "FAQ", href: "/faq" },
];

/**
 * The event name alone. The BOT Consulting mark used to sit to the left of it behind a hair
 * rule; the footer still carries the corporate logo and the link out to botconsulting.io,
 * which is where it belongs — the bar is for getting around this site.
 */
const Wordmark = () => (
  <Link href="/" className="font-display text-lg text-cream">
    Odyssey <span className="text-orange-soft italic">2026</span>
  </Link>
);

/**
 * Dark, on every page. The hero is now a dark video and this bar sits over it, and
 * PageHeader — the first element on /faq and /itinerary — is already bg-teal-dark, so the
 * top of every route in the site is dark teal. No scroll listener needed.
 */
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 z-100 w-full border-b border-rule-light bg-teal-dark/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[80rem] items-center justify-between gap-6 px-6 py-4">
        <Wordmark />

        <div className="flex items-center gap-8">
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-spy={link.href.startsWith("/#") ? link.href.slice(2) : undefined}
                className="nav-link text-small font-medium text-cream/85 transition-colors duration-300 hover:text-cyan-bright"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Lands on the footer's Support block — the address and numbers live there already. */}
          <Link
            href="/#contact"
            className="bg-accent px-5 py-2.5 text-micro font-semibold tracking-normal whitespace-nowrap text-white uppercase transition-colors duration-300 hover:bg-orange-deep"
          >
            Contact
          </Link>

          {/*
            Native <details> disclosure: below `lg` the links used to be display:none with no
            menu behind them, so /itinerary and /faq were unreachable on a phone. No state,
            no JS, keyboard and screen-reader support for free.
          */}
          <details className="relative lg:hidden">
            <summary className="flex cursor-pointer list-none items-center text-cream [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Menu</span>
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <path d="M3.5 7.5h17M3.5 12h17M3.5 16.5h17" />
              </svg>
            </summary>
            {/* Opaque, not /85: the panel hangs below the bar, where there is no
                backdrop-filter behind it to blur the page underneath. */}
            <div className="absolute top-full right-0 mt-4 flex w-56 flex-col border border-rule-light bg-teal-dark py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-5 py-3 text-small font-medium text-cream transition-colors hover:bg-cream/10 hover:text-cyan-bright"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </nav>
  );
}
