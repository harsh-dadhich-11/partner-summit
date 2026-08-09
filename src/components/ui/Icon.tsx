/**
 * Minimal stroke-icon set, drawn on a 24x24 grid so they sit on the same optical weight.
 * Inline SVG rather than an icon package: twelve glyphs is not worth a dependency, and
 * `currentColor` lets the existing CSS tint them.
 */

const PATHS = {
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  phone: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.5s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10.5" r="2.5" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8 12.2l2.8 2.8L16 9.8" />
    </>
  ),
  plane: <path d="M2.5 13.2l19-6.7-3.2 12.5-5.4-3.7-2.6 3.4-.6-4.6z" />,
  landing: (
    <>
      <path d="M3 20.5h18" />
      <path d="M4 8.4l1.6 4.6 8.4 2.4 6.2 1c.9.2 1.6-.9 1-1.6l-3.3-3.6-6.7-6.6-1.7-.5.9 5.2-4.2-1.2-.7-2.1-1.6-.4z" />
    </>
  ),
  luggage: (
    <>
      <rect x="4.5" y="7" width="15" height="12.5" rx="2" />
      <path d="M9 7V4.5a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 4.5V7" />
      <path d="M7.5 21.5v-2M16.5 21.5v-2M12 10v6.5" />
    </>
  ),
  bed: (
    <>
      <path d="M3 19.5V7" />
      <path d="M3 11.5h18v8" />
      <path d="M3 15.5h18" />
      <circle cx="7.5" cy="9" r="1.8" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 10h17M8.5 3v4M15.5 3v4" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8.5" r="3.5" />
      <path d="M3 20c0-3.3 2.9-5.5 6.5-5.5S16 16.7 16 20" />
      <path d="M16.5 5.6a3.5 3.5 0 010 6.6" />
      <path d="M18 14.9c2 .7 3.4 2.3 3.4 5.1" />
    </>
  ),
  landmark: (
    <>
      <path d="M3 21.5h18" />
      <path d="M4.5 9.5L12 4l7.5 5.5" />
      <path d="M6.5 18.5v-8M11 18.5v-8M15.5 18.5v-8M19.5 18.5v-8" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9.4 9.4a2.7 2.7 0 115.1 1.3c-.4.8-1.3 1.2-1.9 1.8-.4.4-.6.9-.6 1.5" />
      <path d="M12 17.7h.01" />
    </>
  ),
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
