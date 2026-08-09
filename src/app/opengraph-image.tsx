import { ImageResponse } from "next/og";

// Rendered once at build time, so link previews aren't a blank card.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Odyssey 2026 — BOT Consulting's Annual Partner Summit, Jaipur";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          // Flat, not the diagonal brand gradient — this card is the first thing anyone
          // sees when the invite gets shared, so it should not lead with the one tell
          // the rest of the site just removed.
          // ponytail: no Fraunces here. Satori needs the font as a binary, which means a
          // network fetch during build; not worth making the build fail offline for one card.
          background: "#183944",
          color: "#faf5ee",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 6, color: "#7dd8e5", textTransform: "uppercase" }}>
          BOT&rsquo;s Annual Partner Summit
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 24 }}>
          <div style={{ fontSize: 130, letterSpacing: -3 }}>Odyssey</div>
          <div style={{ fontSize: 130, letterSpacing: -3, color: "#f8a370", fontStyle: "italic" }}>
            2026
          </div>
        </div>
        <div style={{ width: 96, height: 1, background: "rgba(250,245,238,.35)", margin: "34px 0" }} />
        <div style={{ fontSize: 32 }}>October 23&ndash;25, 2026</div>
        <div style={{ fontSize: 26, color: "rgba(250,245,238,.65)", marginTop: 12 }}>
          Ananta Spa &amp; Resort &middot; Jaipur, India
        </div>
      </div>
    ),
    size
  );
}
