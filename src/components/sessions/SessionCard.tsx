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
      <div className="flex items-center justify-between gap-2 min-w-0">
        <p className={`shrink-0 rounded-full px-2.5 py-1 text-micro font-semibold uppercase tracking-wider whitespace-nowrap ${track.tile}`}>
          {track.label}
        </p>

        {/* Live Availability Badges: Strictly 'Sold Out' or 'Filling Fast' */}
        {isFull ? (
          <span className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 rounded-full bg-panel-orange px-2.5 py-0.5 text-micro font-bold text-orange-deep uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-deep" />
            Sold Out
          </span>
        ) : (
          <span className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 rounded-full bg-orange-bright/12 px-2.5 py-0.5 text-micro font-bold text-orange-deep uppercase tracking-wider">
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

      {/* Speaker Section: Anchored with mt-auto so all cards across parallel boxes align horizontally at the exact same height */}
      <div className="mt-auto pt-4">
        {session.speaker_name && (
          <div className="flex flex-col gap-0.5">
            <p
              className="text-[12.5px] sm:text-[13px] font-semibold text-teal-base leading-snug tracking-tight whitespace-nowrap overflow-hidden text-ellipsis"
              title={session.speaker_name}
            >
              {session.speaker_name}
            </p>
            {session.speaker_company && (
              <p className="text-micro text-muted whitespace-nowrap overflow-hidden text-ellipsis">
                {session.speaker_company}
              </p>
            )}
          </div>
        )}

        {/* Footer line with Room & Selection state */}
        <div className="mt-4 flex items-center justify-between gap-2 pt-4 border-t border-rule/30 text-micro tracking-normal text-muted">
          <p className="flex items-center gap-2 truncate">
            <span className="text-teal-mid shrink-0">
              <Icon name="pin" size={14} />
            </span>
            <span className="truncate">{session.theatre_name}</span>
          </p>

          {selectable && isFull && (
            <div className="shrink-0">
              <span className="text-orange-deep text-micro font-bold uppercase tracking-wider">Sold Out</span>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
