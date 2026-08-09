import Link from "next/link";
import { RSVP_HREF } from "@/data/site";

/** Labels must match what the destination actually shows — "Speakers" led to a page with none. */
const navLinks = [
  { label: "Experience", href: "/#experience" },
  { label: "Relive ’25", href: "/#relive" },
  { label: "Itinerary", href: "/itinerary" },
  { label: "Travel", href: "/#travel" },
  { label: "FAQ", href: "/faq" },
];

/** The logo is an SVG — next/image has nothing to optimise here, so a plain img is correct. */
const Wordmark = () => (
  <div className="flex items-center gap-3.5">
    <a href="https://www.botconsulting.io/" target="_blank" rel="noopener noreferrer">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/bot-logo.svg" alt="BOT Consulting" className="h-7 w-auto" />
    </a>
    <span className="h-5 w-px bg-rule" aria-hidden="true" />
    <Link href="/" className="font-display text-lg text-ink">
      Odyssey <span className="text-orange-deep italic">2026</span>
    </Link>
  </div>
);

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 z-100 w-full border-b border-rule bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[80rem] items-center justify-between gap-6 px-6 py-4">
        <Wordmark />

        <div className="flex items-center gap-8">
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-spy={link.href.startsWith("/#") ? link.href.slice(2) : undefined}
                className="nav-link text-small font-medium text-ink transition-colors duration-300 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <a
            href={RSVP_HREF}
            className="bg-accent px-5 py-2.5 text-micro font-semibold tracking-normal whitespace-nowrap text-white uppercase transition-colors duration-300 hover:bg-orange-deep"
          >
            Confirm
          </a>

          {/*
            Native <details> disclosure: below `lg` the links used to be display:none with no
            menu behind them, so /itinerary and /faq were unreachable on a phone. No state,
            no JS, keyboard and screen-reader support for free.
          */}
          <details className="relative lg:hidden">
            <summary className="flex cursor-pointer list-none items-center text-ink [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Menu</span>
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <path d="M3.5 7.5h17M3.5 12h17M3.5 16.5h17" />
              </svg>
            </summary>
            <div className="absolute top-full right-0 mt-4 flex w-56 flex-col border border-rule bg-surface py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-5 py-3 text-small font-medium text-ink transition-colors hover:bg-surface-sunk hover:text-accent"
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
