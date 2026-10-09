import { Icon } from "@/components/ui/Icon";
import { SESSION_TRACKS } from "@/data/sessions";
import type { SessionTrack } from "@/types";
import type { SessionWithAvailability } from "@/types/database";

interface Props {
  session: SessionWithAvailability;
  index: number;
  onSelect?: (session: SessionWithAvailability) => void;
  isSelected?: boolean;
  selectable?: boolean;
}

export default function SessionCard({
  session,
  index,
  onSelect,
  isSelected = false,
  selectable = false,
}: Props) {
  const track = SESSION_TRACKS[session.track as SessionTrack] || {
    label: session.track,
    tile: "bg-teal-mid/12 text-teal-mid",
  };

  const isFull = session.is_full || session.remaining_seats <= 0;

  return (
    <li
      onClick={() => {
        if (selectable && !isFull && onSelect) {
          onSelect(session);
        }
      }}
      className={`row-in visible card flex flex-col p-6 transition-all duration-300 ${
        selectable && !isFull ? "cursor-pointer" : ""
      } ${
        isSelected
          ? "border-2 border-accent bg-cream shadow-md ring-2 ring-accent/20"
          : isFull
          ? "border border-rule/50 bg-cream/40 opacity-75 cursor-not-allowed"
          : "border border-rule/30 bg-white shadow-[0_1px_2px_rgba(24,57,68,.06)] hover:border-cyan-bright/50 hover:shadow-lg"
      }`}
      style={{ "--i": index } as React.CSSProperties}
    >
      <div className="flex items-center justify-between gap-3">
        <p className={`self-start rounded-full px-3 py-1 text-micro font-semibold uppercase ${track.tile}`}>
          {track.label}
        </p>

        {/* Live Availability Badges: Strictly 'Sold Out' or 'Filling Fast' */}
        {isFull ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-panel-orange px-2.5 py-0.5 text-micro font-bold text-orange-deep uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-deep" />
            Sold Out
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-bright/12 px-2.5 py-0.5 text-micro font-bold text-orange-deep uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-bright animate-pulse" />
            Filling Fast
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-h3 text-ink">{session.title}</h3>

      {session.description && (
        <p className="mt-2 text-micro text-muted leading-relaxed">
          {session.description}
        </p>
      )}

      {session.speaker_name && (
        <div className="mt-3 flex flex-col gap-0.5">
          <p className="text-small font-semibold text-teal-base">
            {session.speaker_name}
          </p>
          {session.speaker_company && (
            <p className="text-micro text-muted">
              {session.speaker_company}
            </p>
          )}
        </div>
      )}

      {/* Footer line with Room & Selection state */}
      <div className="mt-auto flex items-center justify-between gap-2 pt-6 border-t border-rule/30 text-micro tracking-normal text-muted">
        <p className="flex items-center gap-2">
          <span className="text-teal-mid">
            <Icon name="pin" size={14} />
          </span>
          {session.theatre_name}
        </p>

        {selectable && isFull && (
          <div>
            <span className="text-orange-deep text-micro font-bold uppercase tracking-wider">Sold Out</span>
          </div>
        )}
      </div>
    </li>
  );
}
