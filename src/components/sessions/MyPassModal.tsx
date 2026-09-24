"use client";

import { useState } from "react";
import PassQrCode from "@/components/ui/PassQrCode";
import type { DbSession } from "@/types/database";

interface RegistrationPass {
  id: string;
  registration_id: string;
  attendee_name: string;
  attendee_email: string;
  status: string;
  registered_at: string;
  slot_1?: DbSession;
  slot_2?: DbSession;
  slot_3?: DbSession;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyPassModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [registration, setRegistration] = useState<RegistrationPass | null>(null);

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError("");
    setRegistration(null);

    try {
      const res = await fetch(`/api/registration/${encodeURIComponent(query.trim())}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "No registration found with this email or ID.");
      }

      setRegistration(json.registration);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error looking up registration";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-teal-dark/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg border border-rule-light bg-cream shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-rule bg-teal-dark px-6 py-5 text-cream">
          <div>
            <p className="text-micro font-semibold uppercase tracking-wider text-cyan-bright">
              Attendee Portal
            </p>
            <h2 className="font-display text-h3 text-white">Find My Breakout Pass</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-cream/70 hover:bg-cream/10 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!registration ? (
            <form onSubmit={handleLookup}>
              <p className="text-small text-muted mb-4">
                Enter your work email (<code>@botconsulting.io</code>) or your 6-digit Registration ID to retrieve your theatre assignments.
              </p>

              <div>
                <label htmlFor="query" className="block text-small font-medium text-ink">
                  Work Email or Registration ID
                </label>
                <input
                  id="query"
                  type="text"
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="name@botconsulting.io or REG-123456"
                  className="mt-1.5 w-full border border-rule bg-white px-4 py-3 text-body text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
                />
              </div>

              {error && (
                <div className="mt-3 border border-orange-deep bg-panel-orange p-3 text-micro font-medium text-orange-deep">
                  ⚠️ {error}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="rounded-full bg-accent px-8 py-3 text-small font-semibold text-white hover:bg-orange-deep transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <span>{isLoading ? "Searching..." : "Find My Pass"}</span>
                  {!isLoading && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="border-2 border-teal-mid/30 bg-white p-5 shadow-sm text-left">
                <div className="flex justify-between items-start border-b border-rule/30 pb-3">
                  <div>
                    <p className="font-display text-h3 text-ink">{registration.attendee_name}</p>
                    <p className="text-small text-muted">{registration.attendee_email}</p>
                  </div>
                  <span className="rounded-full bg-cyan-bright/15 px-3 py-1 text-micro font-bold text-teal-base uppercase">
                    {registration.registration_id}
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  <p className="text-micro font-bold uppercase text-muted tracking-wider">
                    Assigned Theatres
                  </p>

                  <div className="border border-rule/30 bg-surface-sunk p-3 text-small">
                    <div className="flex justify-between font-semibold text-ink">
                      <span>15:00 – 15:40 (Slot 1)</span>
                      <span className="text-teal-base">{registration.slot_1?.theatre_name || "Theatre 1"}</span>
                    </div>
                    <p className="mt-0.5 text-micro text-muted">{registration.slot_1?.title || "Breakout Session"}</p>
                  </div>

                  <div className="border border-rule/30 bg-surface-sunk p-3 text-small">
                    <div className="flex justify-between font-semibold text-ink">
                      <span>15:40 – 16:20 (Slot 2)</span>
                      <span className="text-teal-base">{registration.slot_2?.theatre_name || "Theatre 2"}</span>
                    </div>
                    <p className="mt-0.5 text-micro text-muted">{registration.slot_2?.title || "Breakout Session"}</p>
                  </div>

                  <div className="border border-rule/30 bg-surface-sunk p-3 text-small">
                    <div className="flex justify-between font-semibold text-ink">
                      <span>16:20 – 17:00 (Slot 3)</span>
                      <span className="text-teal-base">{registration.slot_3?.theatre_name || "Theatre 3"}</span>
                    </div>
                    <p className="mt-0.5 text-micro text-muted">{registration.slot_3?.title || "Breakout Session"}</p>
                  </div>
                </div>

                {/* Scannable Pass QR Code */}
                <div className="mt-5 border-t border-rule/30 pt-4 flex flex-col items-center">
                  <p className="text-micro font-bold uppercase tracking-wider text-muted mb-2">
                    Volunteer Entry QR Pass
                  </p>
                  <PassQrCode
                    registrationId={registration.registration_id}
                    attendeeName={registration.attendee_name}
                    attendeeEmail={registration.attendee_email}
                    slot1SessionId={registration.slot_1?.id}
                    slot2SessionId={registration.slot_2?.id}
                    slot3SessionId={registration.slot_3?.id}
                    size={140}
                  />
                  <p className="mt-2 text-micro text-muted text-center">
                    Show this QR code at the door for instant check-in.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => {
                    setRegistration(null);
                    setQuery("");
                  }}
                  className="flex items-center gap-1.5 text-small font-medium text-muted hover:text-ink transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  <span>Search Another</span>
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full bg-accent px-6 py-2.5 text-small font-semibold text-white hover:bg-orange-deep"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
