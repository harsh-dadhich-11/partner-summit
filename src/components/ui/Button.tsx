import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Renders a link when given; otherwise a submit button. */
  href?: string;
  /** `quiet` is the outline treatment for secondary actions and dark grounds. */
  variant?: "solid" | "quiet";
  className?: string;
};

/**
 * Square corners, no drop shadow — the border and the colour carry it. The arrow is
 * rendered here rather than typed into each label so the hover micro-interaction has
 * something to move.
 */
const base =
  "group/cta inline-flex cursor-pointer items-center gap-2.5 px-8 py-4 text-small font-semibold " +
  "transition-colors duration-300 ease-out";

const variants = {
  solid: "bg-accent text-white hover:bg-orange-deep",
  quiet: "border border-current text-current hover:bg-current/10",
};

export default function Button({ children, href, variant = "solid", className = "" }: Props) {
  const classes = `${base} ${variants[variant]} ${className}`.trim();
  const label = (
    <>
      {children}
      <span className="cta-arrow" aria-hidden="true">
        &rarr;
      </span>
    </>
  );

  // mailto:/tel:/external URLs must not go through the client router.
  if (href && /^(mailto:|tel:|https?:)/.test(href)) {
    const offsite = href.startsWith("http");
    return (
      <a href={href} className={classes} {...(offsite && { target: "_blank", rel: "noopener noreferrer" })}>
        {label}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <button type="submit" className={classes}>
      {label}
    </button>
  );
}
