import Link from "next/link";
import { SUMMIT_EMAIL } from "@/data/site";

const footerLinks = [
  { label: "Sessions", href: "/sessions" },
  { label: "Itinerary", href: "/itinerary" },
  { label: "Guests and Speakers", href: "/speakers" },
  // { label: "Relive’25", href: "/relive" },
  { label: "Event experience", href: "/#experience" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-rule-light bg-teal-dark text-cream mt-24">
      <div className="mx-auto max-w-[80rem] px-6 pt-16 pb-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="mb-5 flex items-center gap-3.5">
              <a
                href="https://www.botconsulting.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/bot-logo-light.svg"
                  alt="BOT Consulting"
                  className="h-8 w-auto"
                />
              </a>
              <span className="h-5 w-px bg-white/20" aria-hidden="true" />
              <span className="font-display text-lg text-cream">
                Odyssey <span className="text-orange-soft italic">2026</span>
              </span>
            </div>
            <p className="max-w-[34ch] text-small text-cream/70">
              Building world-class Global Capability Centers.
            </p>
            <p className="mt-2 text-small">
              <a
                href="https://www.blackrockhotels.com/ananta-spa-resort-jaipur/location"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/75 transition-colors duration-300 hover:text-cyan-bright"
              >
                Ananta Spa &amp; Resort, Jaipur
              </a>
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-micro font-semibold uppercase tracking-wider text-cyan-bright">
              Odyssey 2026
            </h2>
            <div className="flex flex-col space-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-small text-cream/75 transition-colors duration-300 hover:text-cyan-bright"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-micro font-semibold uppercase tracking-wider text-cyan-bright">
              Support
            </h2>
            <div className="flex flex-col space-y-2">
              <a
                href={`mailto:${SUMMIT_EMAIL}`}
                className="text-small text-cream/75 transition-colors duration-300 hover:text-cyan-bright break-all"
              >
                {SUMMIT_EMAIL}
              </a>
              <p className="text-small text-cream/75 tabular-nums">
                +91 92567 68903 | +91 85519 60354
              </p>
              <a
                href="https://www.botconsulting.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-small text-cream/75 transition-colors duration-300 hover:text-cyan-bright"
              >
                botconsulting.io
              </a>
            </div>
          </div>
        </div>

        <p className="mt-14 border-t border-white/10 pt-6 text-micro tracking-normal text-cream/50">
          © 2026 BOT Consulting ·{" "}
          <a
            href="https://www.blackrockhotels.com/ananta-spa-resort-jaipur/location"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-cyan-bright"
          >
            Ananta Spa &amp; Resort, Jaipur
          </a>
          , India · All rights reserved.
        </p>
      </div>
    </footer>
  );
}
