"""Create the per-session source-note downloads for the Odyssey '26 insights library."""

from __future__ import annotations

from pathlib import Path
from shutil import copy2

from pypdf import PdfReader, PdfWriter


ROOT = Path(__file__).resolve().parents[1]
DOWNLOADS = Path("/Users/harshdadhich/Downloads")
OUTPUT_DIR = ROOT / "output" / "pdf"
PUBLIC_SUMMARIES_DIR = ROOT / "public" / "resources" / "session-summaries"
SOURCE_SESSIONS = DOWNLOADS / "PS'26 Sessions (2).pdf"

SESSIONS = [
    ("how-ai-learned-to-use-your-tools", "How AI Learned to Use Your Tools"),
    ("ai-driven-sdlc", "AI-Driven SDLC: Orchestrating Autonomous Software Development"),
    ("same-seat-different-lengths", "Same Seat, Different Lengths"),
    ("headless-360", "Headless 360: Salesforce Beyond the Desktop"),
    ("production-grade-agentcore", "Production-Grade AgentCore: Deploying Multi-Agent Systems at Scale"),
    ("gcc-panel-allcloud-cloudsmith", "GCC Panel: AllCloud and Cloudsmith"),
    ("what-odyssey-is", "What Odyssey Is"),
    ("pilot-to-p-and-l", "Pilot to P&L: What Separates Durable AI from One-Off Experiments"),
    ("untold-chapters", "The Untold Chapters"),
    ("chris-barbin-talk", "Chris Barbin: The C-Brows Journey"),
]


def split_session_summaries() -> list[Path]:
    if not SOURCE_SESSIONS.exists():
        raise FileNotFoundError(f"Session source not found: {SOURCE_SESSIONS}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_SUMMARIES_DIR.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(str(SOURCE_SESSIONS))
    created: list[Path] = []

    for index, (slug, title) in enumerate(SESSIONS):
        start = index * 2
        writer = PdfWriter()
        writer.add_page(reader.pages[start])
        writer.add_page(reader.pages[start + 1])
        writer.add_metadata(
            {
                "/Title": f"Odyssey 2026 - {title}",
                "/Author": "BOT Consulting",
                "/Subject": "Complete session summary from Odyssey, Partner Summit '26",
            }
        )
        path = OUTPUT_DIR / f"odyssey-2026-session-summary-{slug}.pdf"
        with path.open("wb") as stream:
            writer.write(stream)
        copy2(path, PUBLIC_SUMMARIES_DIR / path.name)
        created.append(path)

    return created


if __name__ == "__main__":
    summaries = split_session_summaries()
    print(f"Created {len(summaries)} session summary PDFs")
