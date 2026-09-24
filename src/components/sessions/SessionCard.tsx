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
  const isLowSeats = session.urgency_status === "low_seats" || (session.remaining_seats <= 15 && session.remaining_seats > 0);

  return (
    <li
      onClick={() => {
        if (selectable && !isFull && onSelect) {
          onSelect(session);
        }
      }}
      className={`row-in visible card flex flex-col p-6 transition-all duration-300 ${
        selectable ? "cursor-pointer" : ""
      } ${
        isSelected
          ? "border-2 border-accent bg-cream shadow-md ring-2 ring-accent/20"
          : isFull
          ? "border border-rule/50 bg-cream/40 opacity-75"
          : "border border-rule/30 bg-white shadow-[0_1px_2px_rgba(24,57,68,.06)] hover:border-cyan-bright/50 hover:shadow-lg"
      }`}
      style={{ "--i": index } as React.CSSProperties}
    >
      <div className={`flex items-center ${selectable ? "justify-start" : "justify-between"} gap-3`}>
        {!selectable && (
          <p className={`self-start rounded-full px-3 py-1 text-micro font-semibold uppercase ${track.tile}`}>
            {track.label}
          </p>
        )}

        {/* Live Availability Badges */}
        {isFull ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-panel-orange px-2.5 py-0.5 text-micro font-bold text-orange-deep uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-deep" />
            Session Full
          </span>
        ) : isLowSeats ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-panel-orange px-2.5 py-0.5 text-micro font-bold text-orange-deep uppercase animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-bright" />
            {session.seats_left_badge || `${session.remaining_seats} seats left`}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-base/10 px-2.5 py-0.5 text-micro font-medium text-teal-base">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-mid" />
            {session.remaining_seats} seats available
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-h3 text-ink">{session.title}</h3>
      <p className="mt-2.5 text-small text-muted leading-relaxed">{session.description}</p>

      {session.speaker_name && (
        <div className="mt-3 flex items-center gap-2 text-small font-semibold text-teal-base">
          <span>{session.speaker_name}</span>
          {session.speaker_company && (
            <span className="text-micro font-normal text-muted">· {session.speaker_company}</span>
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
            <span className="text-muted font-medium">Unavailable</span>
          </div>
        )}
      </div>
    </li>
  );
}
