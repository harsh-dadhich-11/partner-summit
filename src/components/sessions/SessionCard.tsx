import { Icon } from "@/components/ui/Icon";
import { SESSION_TRACKS } from "@/data/sessions";
import type { Session } from "@/types";

export default function SessionCard({ session, index }: { session: Session; index: number }) {
  const track = SESSION_TRACKS[session.track];

  return (
    <li
      className="row-in visible card flex flex-col bg-white p-6 shadow-[0_1px_2px_rgba(24,57,68,.06)]"
      style={{ "--i": index } as React.CSSProperties}
    >
      <p
        className={`self-start rounded-full px-3 py-1 text-micro font-semibold uppercase ${track.tile}`}
      >
        {track.label}
      </p>

      <h3 className="mt-5 font-display text-h3 text-ink">{session.title}</h3>
      <p className="mt-3 text-small text-muted">{session.description}</p>

      {session.speaker && (
        <p className="mt-3 text-small font-semibold text-teal-base">{session.speaker}</p>
      )}

      {/* mt-auto so the room line sits on the baseline of the card regardless of how
          much copy the session above it carries — the grid rows are equal height. */}
      <p className="mt-auto flex items-center gap-2 pt-6 text-micro tracking-normal text-muted">
        <span className="text-teal-mid">
          <Icon name="pin" size={14} />
        </span>
        {session.room}
      </p>
    </li>
  );
}
