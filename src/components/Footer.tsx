import Link from "next/link";
import { SUMMIT_EMAIL } from "@/data/site";

const footerLinks = [
  { label: "Event experience", href: "/#experience" },
  { label: "Itinerary", href: "/itinerary" },
  { label: "Speaker updates", href: "/#agenda" },
];

const linkStyles =
  "block py-1.5 text-small text-muted transition-colors duration-300 hover:text-accent";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[80rem] px-6 pt-20 pb-10">
      <div className="grid gap-12 border-t border-rule pt-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="mb-5 flex items-center gap-3.5">
            <a
              href="https://www.botconsulting.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/bot-logo.svg" alt="BOT Consulting" className="h-7 w-auto" />
            </a>
            <span className="h-5 w-px bg-rule" aria-hidden="true" />
            <span className="font-display text-lg text-ink">
              Odyssey <span className="text-orange-deep italic">2026</span>
            </span>
          </div>
          <p className="max-w-[34ch] text-small text-muted">
            Building world-class Global Capability Centers.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-micro font-semibold uppercase text-ink">Odyssey 2026</h2>
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkStyles}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Every "Contact" control on the site scrolls here; scroll-mt clears the fixed navbar. */}
        <div id="contact" className="scroll-mt-24">
          <h2 className="mb-4 text-micro font-semibold uppercase text-ink">Support</h2>
          <a href={`mailto:${SUMMIT_EMAIL}`} className={linkStyles}>
            {SUMMIT_EMAIL}
          </a>
          <p className="py-1.5 text-small text-muted tabular-nums">
            +91 92567 68903 | +91 85519 60354
          </p>
          <a
            href="https://www.botconsulting.io/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkStyles}
          >
            botconsulting.io
          </a>
        </div>
      </div>

      <p className="mt-14 border-t border-rule pt-6 text-micro tracking-normal text-muted">
        © 2026 BOT Consulting · Ananta Spa &amp; Resort, Jaipur, India · All rights reserved.
      </p>
    </footer>
  );
}
