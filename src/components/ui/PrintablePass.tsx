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
      <div className="mx-auto max-w-[170mm] border-2 border-teal-mid p-8 text-ink bg-white">
        <div className="border-b border-rule pb-4 text-center">
          <p className="text-micro font-bold uppercase tracking-wider text-teal-mid">
            Odyssey 2026 · Partner Summit
          </p>
          <h1 className="mt-1 font-display text-h2">Breakout Session Pass</h1>
        </div>

        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <p className="text-micro font-bold uppercase text-muted">Attendee</p>
            <p className="text-lead font-bold">{attendeeName}</p>
            <p className="text-small text-muted">{attendeeEmail}</p>
          </div>
          <div className="text-right">
            <p className="text-micro font-bold uppercase text-muted">Registration ID</p>
            <p className="font-mono text-lead font-bold text-accent">{registrationId}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-micro font-bold uppercase tracking-wider text-muted">
            Your Day 1 Schedule · Oct 23, 2026
          </p>
          {slots.map((slot) => (
            <div key={slot.label} className="border border-rule p-3">
              <div className="flex justify-between text-small font-semibold">
                <span>{slot.label}</span>
                <span className="text-teal-base">{slot.theatreName}</span>
              </div>
              <p className="mt-1 text-micro text-ink font-medium">{slot.title}</p>
              {slot.speakerName && (
                <p className="mt-0.5 text-micro text-teal-base">
                  {slot.speakerName}
                  {slot.speakerCompany && (
                    <span className="text-muted"> · {slot.speakerCompany}</span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center border-t border-dashed border-rule pt-5">
          <p className="mb-2 text-micro font-bold uppercase tracking-wider text-muted">
            Volunteer Entry QR Pass
          </p>
          <PassQrCode
            registrationId={registrationId}
            attendeeName={attendeeName}
            attendeeEmail={attendeeEmail}
            slot1SessionId={slots[0].sessionId}
            slot2SessionId={slots[1].sessionId}
            slot3SessionId={slots[2].sessionId}
            size={200}
          />
          <p className="mt-2 text-micro text-muted">
            Show this QR code at the door of each theatre for instant check-in.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
