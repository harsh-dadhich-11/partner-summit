"""Create the Odyssey 2026 Summit Report and per-session source-note downloads.

The report is a public, editorial summary. The ten session-download PDFs preserve
the supplied session-note pages in their original order, split into one file per
insight so visitors can download the complete notes for that conversation.
"""

from __future__ import annotations

from pathlib import Path
from shutil import copy2

from PIL import Image, ImageOps
from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas


ROOT = Path(__file__).resolve().parents[1]
DOWNLOADS = Path("/Users/harshdadhich/Downloads")
ASSET_DIR = Path("/private/tmp/odyssey-report-assets")
OUTPUT_DIR = ROOT / "output" / "pdf"
PUBLIC_DIR = ROOT / "public" / "resources"
PUBLIC_SUMMARIES_DIR = PUBLIC_DIR / "session-summaries"

SOURCE_SESSIONS = DOWNLOADS / "PS'26 Sessions.pdf"
FONT_DIR = DOWNLOADS / "Plus_Jakarta_Sans" / "static"

REPORT_NAME = "odyssey-2026-summit-report.pdf"

DEEP_GREEN = HexColor("#215052")
AQUA = HexColor("#3EC3D6")
ORANGE = HexColor("#F15D2B")
BLACK = HexColor("#000000")
PALE = HexColor("#F4F8F7")
MIST = HexColor("#D9ECEB")
SLATE = HexColor("#526669")

PAGE_W, PAGE_H = A4
MARGIN = 46

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


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("Jakarta", str(FONT_DIR / "PlusJakartaSans-Regular.ttf")))
    pdfmetrics.registerFont(TTFont("Jakarta-Semibold", str(FONT_DIR / "PlusJakartaSans-SemiBold.ttf")))
    pdfmetrics.registerFont(TTFont("Jakarta-Bold", str(FONT_DIR / "PlusJakartaSans-Bold.ttf")))
    pdfmetrics.registerFont(TTFont("Jakarta-ExtraBold", str(FONT_DIR / "PlusJakartaSans-ExtraBold.ttf")))


def crop_to_fill(source: Path, name: str, width: int, height: int) -> Path:
    """Create an efficient image crop that fills a given report area."""
    target = ASSET_DIR / name
    if target.exists():
        return target
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        source_ratio = image.width / image.height
        target_ratio = width / height
        if source_ratio > target_ratio:
            crop_width = round(image.height * target_ratio)
            left = (image.width - crop_width) // 2
            image = image.crop((left, 0, left + crop_width, image.height))
        else:
            crop_height = round(image.width / target_ratio)
            top = (image.height - crop_height) // 2
            image = image.crop((0, top, image.width, top + crop_height))
        image = image.resize((width, height), Image.Resampling.LANCZOS)
        image.save(target, "JPEG", quality=88, optimize=True)
    return target


def word_width(text: str, font: str, size: float) -> float:
    return pdfmetrics.stringWidth(text, font, size)


def wrap(text: str, font: str, size: float, width: float) -> list[str]:
    words = text.split()
    lines: list[str] = []
    line = ""
    for word in words:
        candidate = word if not line else f"{line} {word}"
        if word_width(candidate, font, size) <= width:
            line = candidate
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def text_block(
    canvas: Canvas,
    text: str,
    x: float,
    y: float,
    width: float,
    font: str,
    size: float,
    leading: float,
    colour: Color = BLACK,
) -> float:
    canvas.setFont(font, size)
    canvas.setFillColor(colour)
    for line in wrap(text, font, size, width):
        canvas.drawString(x, y, line)
        y -= leading
    return y


def label(canvas: Canvas, text: str, x: float, y: float, colour: Color = ORANGE) -> None:
    canvas.setFont("Jakarta-Bold", 7.7)
    canvas.setFillColor(colour)
    canvas.drawString(x, y, text.upper())


def page_number(canvas: Canvas, number: int) -> None:
    canvas.setStrokeColor(HexColor("#C7D5D4"))
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 34, PAGE_W - MARGIN, 34)
    canvas.setFont("Jakarta-Semibold", 7.5)
    canvas.setFillColor(SLATE)
    canvas.drawString(MARGIN, 20, "ODYSSEY, PARTNER SUMMIT '26")
    canvas.drawRightString(PAGE_W - MARGIN, 20, f"{number:02d}")


def report_logo(canvas: Canvas, x: float, y: float, colour: Color = white) -> None:
    canvas.setFillColor(colour)
    canvas.setFont("Jakarta-Bold", 9)
    canvas.drawString(x, y, "BOT CONSULTING")
    canvas.setFillColor(AQUA if colour == white else ORANGE)
    canvas.circle(x - 12, y + 3, 3, fill=1, stroke=0)


def card(canvas: Canvas, x: float, y: float, width: float, height: float, title: str, value: str) -> None:
    canvas.setFillColor(PALE)
    canvas.roundRect(x, y - height, width, height, 12, fill=1, stroke=0)
    label(canvas, title, x + 16, y - 19, DEEP_GREEN)
    canvas.setFillColor(DEEP_GREEN)
    canvas.setFont("Jakarta-ExtraBold", 25)
    canvas.drawString(x + 16, y - 55, value)


def insight_row(canvas: Canvas, y: float, category: str, title: str, message: str) -> float:
    canvas.setStrokeColor(HexColor("#CADAD9"))
    canvas.line(MARGIN, y, PAGE_W - MARGIN, y)
    label(canvas, category, MARGIN, y - 17, DEEP_GREEN)
    canvas.setFillColor(DEEP_GREEN)
    canvas.setFont("Jakarta-Bold", 12.5)
    canvas.drawString(MARGIN, y - 38, title)
    return text_block(canvas, message, MARGIN, y - 57, PAGE_W - 2 * MARGIN, "Jakarta", 9.4, 14, SLATE) - 15


def make_report() -> Path:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    register_fonts()

    hero = crop_to_fill(ASSET_DIR / "Odyssey_26 Team Image.jpg", "report-hero.jpg", 1700, 2360)
    group = crop_to_fill(ASSET_DIR / "DJI_20261023174823_0019_D.jpg", "report-group.jpg", 1520, 760)
    award = crop_to_fill(ASSET_DIR / "I91A8715.jpg", "report-award.jpg", 800, 800)
    stage = crop_to_fill(ASSET_DIR / "I91A8509.jpg", "report-stage.jpg", 800, 800)
    report_path = OUTPUT_DIR / REPORT_NAME
    canvas = Canvas(str(report_path), pagesize=A4, pageCompression=1)
    canvas.setTitle("Odyssey 2026 Summit Report")
    canvas.setAuthor("BOT Consulting")
    canvas.setSubject("Post-event executive report for Odyssey, Partner Summit '26")

    # 1. Cover
    canvas.drawImage(str(hero), 0, 0, width=PAGE_W, height=PAGE_H)
    canvas.setFillColor(Color(0.06, 0.18, 0.20, alpha=0.78))
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    report_logo(canvas, MARGIN + 12, PAGE_H - 62)
    canvas.setFillColor(AQUA)
    canvas.rect(MARGIN, PAGE_H - 114, 48, 2, fill=1, stroke=0)
    label(canvas, "Post-event executive report", MARGIN, PAGE_H - 137, AQUA)
    canvas.setFillColor(white)
    canvas.setFont("Jakarta-ExtraBold", 36)
    canvas.drawString(MARGIN, PAGE_H - 202, "Odyssey")
    canvas.drawString(MARGIN, PAGE_H - 246, "Partner Summit '26")
    canvas.setFont("Jakarta", 14)
    canvas.setFillColor(HexColor("#D8E9E8"))
    canvas.drawString(MARGIN, PAGE_H - 288, "23 - 25 October 2026")
    canvas.drawString(MARGIN, PAGE_H - 310, "Ananta Spa & Resorts, Jaipur")
    canvas.setFillColor(ORANGE)
    canvas.circle(MARGIN + 3, 93, 4, fill=1, stroke=0)
    canvas.setFillColor(white)
    canvas.setFont("Jakarta-Semibold", 9)
    canvas.drawString(MARGIN + 17, 89, "THE IDEAS TRAVELLED. THE PEOPLE MADE IT MATTER.")
    canvas.showPage()

    # 2. Executive snapshot
    canvas.setFillColor(white)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    report_logo(canvas, MARGIN + 12, PAGE_H - 54, DEEP_GREEN)
    label(canvas, "Executive summary", MARGIN, PAGE_H - 105)
    canvas.setFillColor(DEEP_GREEN)
    canvas.setFont("Jakarta-ExtraBold", 28)
    canvas.drawString(MARGIN, PAGE_H - 146, "One summit. A lasting signal.")
    body = (
        "Odyssey brought together BOT Consulting's partners, teams and guests in Jaipur for three days of ideas, "
        "recognition and practical conversation. Across technology, Global Capability Centers and leadership, the "
        "summit returned to one recurring question: how do we apply new capability without losing human judgement?"
    )
    text_block(canvas, body, MARGIN, PAGE_H - 181, PAGE_W - 2 * MARGIN, "Jakarta", 11, 17, SLATE)
    grid_y = PAGE_H - 305
    cards = [
        ("People", "350+"), ("Guest speakers", "16"), ("GCC teams", "8"),
        ("Data and AI sessions", "4"), ("Yearly R&R", "12"), ("Sri volunteer activity", "90 min"),
    ]
    card_w, card_h = 156, 88
    for index, (title, value) in enumerate(cards):
        col = index % 3
        row = index // 3
        card(canvas, MARGIN + col * (card_w + 10), grid_y - row * (card_h + 12), card_w, card_h, title, value)
    canvas.setFillColor(DEEP_GREEN)
    canvas.setFont("Jakarta-Bold", 13)
    canvas.drawString(MARGIN, 150, "What the conversations made clear")
    takeaways = [
        "AI becomes durable when it works inside governed systems, not beside them.",
        "GCC value is built through integration, ownership and a consulting mindset.",
        "Leadership remains a practice of judgment, connection and decisive action.",
    ]
    for index, takeaway in enumerate(takeaways):
        y = 118 - index * 25
        canvas.setFillColor(ORANGE)
        canvas.circle(MARGIN + 4, y + 3, 3, fill=1, stroke=0)
        canvas.setFillColor(SLATE)
        canvas.setFont("Jakarta", 9.5)
        canvas.drawString(MARGIN + 16, y, takeaway)
    page_number(canvas, 2)
    canvas.showPage()

    # 3. AI and technology
    canvas.setFillColor(PALE)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    label(canvas, "Session highlights / 01", MARGIN, PAGE_H - 74)
    canvas.setFillColor(DEEP_GREEN)
    canvas.setFont("Jakarta-ExtraBold", 25)
    canvas.drawString(MARGIN, PAGE_H - 112, "Turning AI into operating capability")
    canvas.setFont("Jakarta", 10.5)
    canvas.setFillColor(SLATE)
    canvas.drawString(MARGIN, PAGE_H - 138, "Four sessions moved the conversation from potential to the systems that make it dependable.")
    rows = [
        ("Technology and AI", "How AI Learned to Use Your Tools", "MCP and specialised agents can connect AI to enterprise tools with clearer boundaries, shared context and approval for consequential actions."),
        ("Technology and AI", "AI-Driven SDLC", "Autonomous workflows can accelerate delivery when design and post-test gates keep accountability with experienced engineers."),
        ("Technology and AI", "Headless 360", "Salesforce can act as a governed, context-rich backend for people and AI systems working through the interfaces that fit the work."),
        ("Technology and AI", "Production-Grade AgentCore", "Live telemetry, limited tools and policy guardrails make multi-agent operations safer and more useful during production incidents."),
    ]
    y = PAGE_H - 180
    for row in rows:
        y = insight_row(canvas, y, *row)
    canvas.drawImage(str(stage), PAGE_W - MARGIN - 145, 58, width=145, height=145, mask="auto")
    canvas.setFillColor(DEEP_GREEN)
    canvas.setFont("Jakarta-Semibold", 8)
    canvas.drawRightString(PAGE_W - MARGIN, 45, "THE WORK IS HUMAN. THE SYSTEMS SHOULD HELP.")
    page_number(canvas, 3)
    canvas.showPage()

    # 4. GCCs and business
    canvas.setFillColor(white)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    label(canvas, "Session highlights / 02", MARGIN, PAGE_H - 74)
    canvas.setFillColor(DEEP_GREEN)
    canvas.setFont("Jakarta-ExtraBold", 25)
    canvas.drawString(MARGIN, PAGE_H - 112, "Building GCCs with intent")
    canvas.setFont("Jakarta", 10.5)
    canvas.setFillColor(SLATE)
    canvas.drawString(MARGIN, PAGE_H - 138, "Partner and BOT perspectives placed integration and real business value ahead of novelty.")
    rows = [
        ("GCC and business", "GCC Panel: AllCloud and Cloudsmith", "High-performing GCCs combine deep capability with customer proximity, learning culture and shared leadership across geographies."),
        ("GCC and business", "What Odyssey Is", "BOT's operating system connects people, processes and platforms, using AI for heavy lifting while keeping final judgment close to the work."),
        ("GCC and business", "Pilot to P&L", "A promising pilot becomes durable only when total cost, data readiness, adoption and a clear business case are addressed together."),
    ]
    y = PAGE_H - 180
    for row in rows:
        y = insight_row(canvas, y, *row)
    canvas.setFillColor(DEEP_GREEN)
    canvas.roundRect(MARGIN, 95, PAGE_W - 2 * MARGIN, 120, 14, fill=1, stroke=0)
    label(canvas, "The operating question", MARGIN + 22, 188, AQUA)
    canvas.setFillColor(white)
    canvas.setFont("Jakarta-Bold", 16)
    canvas.drawString(MARGIN + 22, 157, "Does this release capacity to create measurable value?")
    text_block(canvas, "The strongest conversations at Odyssey treated AI as a business and operating-model decision, not a layer of language added to an existing process.", MARGIN + 22, 132, PAGE_W - 2 * MARGIN - 44, "Jakarta", 9.6, 14, HexColor("#D8E9E8"))
    page_number(canvas, 4)
    canvas.showPage()

    # 5. Leadership
    canvas.setFillColor(PALE)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    label(canvas, "Session highlights / 03", MARGIN, PAGE_H - 74)
    canvas.setFillColor(DEEP_GREEN)
    canvas.setFont("Jakarta-ExtraBold", 25)
    canvas.drawString(MARGIN, PAGE_H - 112, "Leadership, in the conversations that matter")
    canvas.setFont("Jakarta", 10.5)
    canvas.setFillColor(SLATE)
    canvas.drawString(MARGIN, PAGE_H - 138, "The main stage made room for context: the personal stories and hard choices behind leadership practice.")
    rows = [
        ("Leadership", "Same Seat, Different Lengths", "Five CEOs reflected on hiring, capital, culture and AI, showing that good judgement depends on the stage of the business as much as a leader's conviction."),
        ("Leadership", "The Untold Chapters", "Pivotal choices, mentors and difficult people decisions reminded the room that a meaningful career is rarely a straight line."),
        ("Leadership", "The C-Brows Journey", "A reflection on endurance and connection reframed support systems as practical infrastructure for the long term."),
    ]
    y = PAGE_H - 180
    for row in rows:
        y = insight_row(canvas, y, *row)
    canvas.setFillColor(ORANGE)
    canvas.circle(MARGIN + 10, 147, 10, fill=1, stroke=0)
    canvas.setFillColor(DEEP_GREEN)
    canvas.setFont("Jakarta-Bold", 16)
    canvas.drawString(MARGIN + 33, 144, "Connection is not soft. It is how good work holds.")
    page_number(canvas, 5)
    canvas.showPage()

    # 6. Photo record
    canvas.setFillColor(DEEP_GREEN)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    report_logo(canvas, MARGIN + 12, PAGE_H - 54)
    label(canvas, "The moments that made it matter", MARGIN, PAGE_H - 105, AQUA)
    canvas.setFillColor(white)
    canvas.setFont("Jakarta-ExtraBold", 25)
    canvas.drawString(MARGIN, PAGE_H - 145, "People, purpose and a shared table")
    canvas.drawImage(str(group), MARGIN, 356, width=PAGE_W - 2 * MARGIN, height=238, mask="auto")
    canvas.drawImage(str(award), MARGIN, 103, width=203, height=203, mask="auto")
    canvas.setFillColor(HexColor("#D8E9E8"))
    canvas.setFont("Jakarta", 11)
    text_block(canvas, "The summit's real record is not only the agenda. It is the people exchanging perspectives, taking the stage, celebrating each other and giving time to the Sri volunteer activity.", MARGIN + 232, 273, PAGE_W - MARGIN - (MARGIN + 232), "Jakarta", 11, 18, HexColor("#D8E9E8"))
    canvas.setFillColor(ORANGE)
    canvas.rect(MARGIN + 232, 133, 58, 2, fill=1, stroke=0)
    canvas.setFillColor(white)
    canvas.setFont("Jakarta-Bold", 17)
    canvas.drawString(MARGIN + 232, 102, "350+ people.")
    canvas.drawString(MARGIN + 232, 78, "One shared story.")
    page_number(canvas, 6)
    canvas.showPage()

    # 7. What moves forward
    canvas.setFillColor(white)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    label(canvas, "What we carry forward", MARGIN, PAGE_H - 74)
    canvas.setFillColor(DEEP_GREEN)
    canvas.setFont("Jakarta-ExtraBold", 27)
    canvas.drawString(MARGIN, PAGE_H - 114, "From conversations to next steps")
    canvas.setFillColor(SLATE)
    canvas.setFont("Jakarta", 10.5)
    canvas.drawString(MARGIN, PAGE_H - 140, "The work after a summit is to turn the strongest signals into everyday practice.")
    commitments = [
        ("01", "Build for governed action", "Design AI systems that can explain their evidence, respect policy boundaries and keep people responsible for consequential decisions."),
        ("02", "Measure value beyond the pilot", "Treat cost, data readiness, adoption and margin or growth impact as part of the same business case."),
        ("03", "Make the GCC a connected venture", "Invest in a culture where technical capability, consulting instincts and shared ownership reinforce one another."),
        ("04", "Keep connection in the system", "Use leadership conversations and support networks to make sustained performance more human and more resilient."),
    ]
    y = PAGE_H - 205
    for number, heading, copy in commitments:
        canvas.setFillColor(MIST)
        canvas.roundRect(MARGIN, y - 91, PAGE_W - 2 * MARGIN, 82, 12, fill=1, stroke=0)
        canvas.setFillColor(ORANGE)
        canvas.setFont("Jakarta-ExtraBold", 19)
        canvas.drawString(MARGIN + 16, y - 39, number)
        canvas.setFillColor(DEEP_GREEN)
        canvas.setFont("Jakarta-Bold", 12)
        canvas.drawString(MARGIN + 62, y - 34, heading)
        text_block(canvas, copy, MARGIN + 62, y - 53, PAGE_W - 2 * MARGIN - 78, "Jakarta", 9.3, 13.5, SLATE)
        y -= 101
    page_number(canvas, 7)
    canvas.showPage()

    # 8. Closing
    canvas.setFillColor(DEEP_GREEN)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.drawImage(str(hero), 0, 0, width=PAGE_W, height=PAGE_H, mask="auto")
    canvas.setFillColor(Color(0.06, 0.18, 0.20, alpha=0.86))
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    report_logo(canvas, MARGIN + 12, PAGE_H - 58)
    label(canvas, "Odyssey 2026", MARGIN, PAGE_H - 125, AQUA)
    canvas.setFillColor(white)
    canvas.setFont("Jakarta-ExtraBold", 31)
    canvas.drawString(MARGIN, PAGE_H - 174, "The ideas travelled.")
    canvas.drawString(MARGIN, PAGE_H - 213, "The people made it matter.")
    canvas.setFillColor(HexColor("#D8E9E8"))
    canvas.setFont("Jakarta", 12)
    text_block(canvas, "Thank you to our partners, speakers, teams and guests for making Odyssey, Partner Summit '26 a generous, grounded and forward-looking gathering.", MARGIN, PAGE_H - 262, 360, "Jakarta", 12, 19, HexColor("#D8E9E8"))
    canvas.setFillColor(AQUA)
    canvas.setFont("Jakarta-Semibold", 10)
    canvas.drawString(MARGIN, 98, "botconsulting.io")
    canvas.setFillColor(white)
    canvas.setFont("Jakarta", 9)
    canvas.drawString(MARGIN, 76, "partnersummit@botconsulting.io")
    canvas.drawString(MARGIN, 58, "Ananta Spa & Resorts, Jaipur")
    canvas.save()

    copy2(report_path, PUBLIC_DIR / REPORT_NAME)
    return report_path


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
        writer.add_metadata({
            "/Title": f"Odyssey 2026 - {title}",
            "/Author": "BOT Consulting",
            "/Subject": "Complete session summary from Odyssey, Partner Summit '26",
        })
        path = OUTPUT_DIR / f"odyssey-2026-session-summary-{slug}.pdf"
        with path.open("wb") as stream:
            writer.write(stream)
        copy2(path, PUBLIC_SUMMARIES_DIR / path.name)
        created.append(path)
    return created


if __name__ == "__main__":
    report = make_report()
    summaries = split_session_summaries()
    print(f"Created {report}")
    print(f"Created {len(summaries)} session summary PDFs")
