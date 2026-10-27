"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const protectedPrefixes = ["/recap", "/highlights", "/insights", "/gallery"];

export default function RecapLogoutButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const isRecapRoute = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (!isRecapRoute) return null;

  return (
    <button
      type="button"
      onClick={async () => {
        setLoggingOut(true);
        await fetch("/api/recap-access/logout", { method: "POST" });
        router.replace("/");
        router.refresh();
      }}
      disabled={loggingOut}
      className="hidden text-micro font-semibold uppercase text-cream/75 transition hover:text-cyan-bright disabled:opacity-50 lg:inline-flex"
    >
      {loggingOut ? "Signing out…" : "Sign out"}
    </button>
  );
}
