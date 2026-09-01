"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Sessions", href: "/sessions" },
  { label: "Itinerary", href: "/itinerary" },
  { label: "Participants", href: "/speakers" },
  { label: "Relive’25", href: "/relive" },
  { label: "FAQ", href: "/faq" },
];

const Wordmark = () => (
  <a
    href="https://www.botconsulting.io/"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center"
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/assets/bot-logo-light.svg"
      alt="BOT Consulting"
      className="h-7 w-auto transition-opacity hover:opacity-90"
    />
  </a>
);

export default function Navbar() {
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.removeAttribute("open");
    }
  }, [pathname]);

  const closeMobileMenu = () => {
    if (detailsRef.current) {
      detailsRef.current.removeAttribute("open");
    }
  };

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("/#")) {
      return false;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="fixed top-0 left-0 z-100 w-full border-b border-rule-light bg-teal-dark/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[80rem] items-center justify-between gap-6 px-6 py-4">
        <Wordmark />

        <div className="flex items-center gap-8">
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-spy={
                    link.href === "/"
                      ? "hero"
                      : link.href.startsWith("/#")
                      ? link.href.slice(2)
                      : undefined
                  }
                  aria-current={active ? "page" : undefined}
                  className={`nav-link text-small font-medium transition-colors duration-300 ${
                    active
                      ? "is-current text-cyan-bright"
                      : "text-cream/85 hover:text-cyan-bright"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Lands on the footer's Support block — the address and numbers live there already. */}
          <Link
            href="/#contact"
            className="rounded-full bg-accent px-5 py-2.5 text-micro font-semibold tracking-normal whitespace-nowrap text-white uppercase transition-colors duration-300 hover:bg-orange-deep"
          >
            Contact
          </Link>

          {/*
            Native <details> disclosure: below `lg` the links used to be display:none with no
            menu behind them, so /itinerary and /faq were unreachable on a phone. No state,
            no JS, keyboard and screen-reader support for free.
          */}
          <details ref={detailsRef} className="relative lg:hidden">
            <summary className="flex cursor-pointer list-none items-center text-cream [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Menu</span>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              >
                <path d="M3.5 7.5h17M3.5 12h17M3.5 16.5h17" />
              </svg>
            </summary>
            {/* Opaque, not /85: the panel hangs below the bar, where there is no
                backdrop-filter behind it to blur the page underneath. */}
            <div className="absolute top-full right-0 mt-4 flex w-56 flex-col border border-rule-light bg-teal-dark py-2 shadow-xl">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    aria-current={active ? "page" : undefined}
                    className={`px-5 py-3 text-small transition-colors ${
                      active
                        ? "bg-cream/15 text-cyan-bright font-semibold border-l-2 border-cyan-bright"
                        : "font-medium text-cream hover:bg-cream/10 hover:text-cyan-bright"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </details>
        </div>
      </div>
    </nav>
  );
}
