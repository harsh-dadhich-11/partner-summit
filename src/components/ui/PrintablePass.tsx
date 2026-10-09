"use client";

import { createPortal } from "react-dom";
import PassQrCode from "@/components/ui/PassQrCode";

export interface PrintableSlot {
  label: string; // e.g. "Slot 1 · 15:00 – 15:40"
  theatreName?: string;
  title?: string;
  sessionId?: string;
  speakerName?: string;
  speakerCompany?: string;
}

interface Props {
  registrationId: string;
  attendeeName: string;
  attendeeEmail: string;
  slots: [PrintableSlot, PrintableSlot, PrintableSlot];
}

/**
 * Print-only copy of the pass, portalled directly under <body>.
 * The @media print rule in globals.css hides every other body child with display:none,
 * so "Print / Save Pass" produces exactly one page instead of the whole page + modal.
 */
export default function PrintablePass({ registrationId, attendeeName, attendeeEmail, slots }: Props) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div id="print-pass" className="hidden print:block">
      <div className="pass-card mx-auto max-w-[170mm] border-2 border-teal-mid p-5 sm:p-6 text-ink bg-white">
        <div className="border-b border-rule pb-2.5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-mid">
            Odyssey 2026 · Partner Summit
          </p>
          <h1 className="mt-0.5 font-display text-lg sm:text-xl font-bold">Breakout Session Pass</h1>
        </div>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase text-muted">Attendee</p>
            <p className="text-sm font-bold truncate">{attendeeName}</p>
            <p className="text-xs text-muted truncate">{attendeeEmail}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-bold uppercase text-muted">Registration ID</p>
            <p className="font-mono text-sm font-bold text-accent">{registrationId}</p>
          </div>
        </div>

        <div className="mt-3.5 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Your Day 1 Schedule · Oct 23, 2026
          </p>
          {slots.map((slot) => (
            <div key={slot.label} className="border border-rule/70 p-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span>{slot.label}</span>
                <span className="text-teal-base font-bold">{slot.theatreName}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-ink font-medium leading-snug">{slot.title}</p>
              {slot.speakerName && (
                <p className="mt-0.5 text-[10px] text-teal-base leading-tight">
                  {slot.speakerName}
                  {slot.speakerCompany && (
                    <span className="text-muted"> · {slot.speakerCompany}</span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3.5 flex flex-col items-center border-t border-dashed border-rule pt-3">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
            Volunteer Entry QR Pass
          </p>
          <PassQrCode
            registrationId={registrationId}
            attendeeName={attendeeName}
            attendeeEmail={attendeeEmail}
            slot1SessionId={slots[0].sessionId}
            slot2SessionId={slots[1].sessionId}
            slot3SessionId={slots[2].sessionId}
            size={120}
          />
          <p className="mt-1.5 text-[10px] text-muted text-center">
            Show this QR code at the door of each theatre for instant check-in.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
