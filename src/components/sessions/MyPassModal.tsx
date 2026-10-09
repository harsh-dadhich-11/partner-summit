"use client";

import { useState } from "react";
import PassQrCode from "@/components/ui/PassQrCode";
import PrintablePass from "@/components/ui/PrintablePass";
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

  // Lost-ID recovery: re-send the pass to the registered inbox
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError("");
    setRegistration(null);

    try {
      const res = await fetch(`/api/registration/${encodeURIComponent(query.trim().toUpperCase())}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "No registration found with this Registration ID.");
      }

      setRegistration(json.registration);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error looking up registration";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;

    setIsLoading(true);
    setError("");
    setRecoveryMessage("");

    try {
      const res = await fetch("/api/registration/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail.trim().toLowerCase() }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Couldn't send your pass. Please try again.");
      }

      setRecoveryMessage(json.message);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Couldn't send your pass";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (toRecovery: boolean) => {
    setIsRecoveryMode(toRecovery);
    setError("");
    setRecoveryMessage("");
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
          {!registration && isRecoveryMode ? (
            <form onSubmit={handleRecovery}>
              <p className="text-small text-muted mb-4">
                Enter the work email you registered with. If it&apos;s registered, we&apos;ll email your pass and Registration ID to that inbox.
              </p>

              <div>
                <label htmlFor="recovery-email" className="block text-small font-medium text-ink">
                  Work Email
                </label>
                <input
                  id="recovery-email"
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="name@botconsulting.io"
                  className="mt-1.5 w-full border border-rule bg-white px-4 py-3 text-body text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
                />
              </div>

              {error && (
                <div className="mt-3 border border-orange-deep bg-panel-orange p-3 text-micro font-medium text-orange-deep">
                  ⚠️ {error}
                </div>
              )}
              {recoveryMessage && (
                <div className="mt-3 border border-teal-mid/40 bg-cyan-bright/10 p-3 text-micro font-medium text-teal-base">
                  ✓ {recoveryMessage}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => switchMode(false)}
                  className="text-small font-medium text-muted hover:text-ink transition-colors"
                >
                  Back to ID lookup
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !recoveryEmail.trim()}
                  className="rounded-full bg-accent px-8 py-3 text-small font-semibold text-white hover:bg-orange-deep transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Email My Pass"}
                </button>
              </div>
            </form>
          ) : !registration ? (
            <form onSubmit={handleLookup}>
              <p className="text-small text-muted mb-4">
                Enter the Registration ID from your confirmation email to retrieve your theatre assignments.
              </p>

              <div>
                <label htmlFor="query" className="block text-small font-medium text-ink">
                  Registration ID
                </label>
                <input
                  id="query"
                  type="text"
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value.toUpperCase())}
                  placeholder="REG-123456"
                  autoComplete="off"
                  className="mt-1.5 w-full border border-rule bg-white px-4 py-3 font-mono text-body text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
                />
              </div>

              {error && (
                <div className="mt-3 border border-orange-deep bg-panel-orange p-3 text-micro font-medium text-orange-deep">
                  ⚠️ {error}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  className="text-left text-micro font-semibold text-teal-base hover:text-accent transition-colors"
                >
                  Lost your ID? Email my pass to me
                </button>
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
              <div className="border-2 border-teal-mid/30 bg-white p-5 sm:p-6 shadow-sm text-left">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 border-b border-rule/30 pb-3">
                  <div className="min-w-0">
                    <p className="font-display text-h3 text-ink truncate">{registration.attendee_name}</p>
                    <p className="text-small text-muted break-all sm:break-normal">{registration.attendee_email}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-cyan-bright/15 px-3.5 py-1 text-micro font-bold text-teal-base uppercase">
                    {registration.registration_id}
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  <p className="text-micro font-bold uppercase text-muted tracking-wider">
                    Assigned Theatres
                  </p>

                  <div className="border border-rule/30 bg-surface-sunk p-3 text-small">
                    <div className="flex justify-between font-semibold text-ink">
                      <span>3:00 – 3:45 PM (Slot 1)</span>
                      <span className="text-teal-base">{registration.slot_1?.theatre_name || "Theatre 1"}</span>
                    </div>
                    <p className="mt-0.5 text-micro font-medium text-ink">{registration.slot_1?.title || "Breakout Session"}</p>
                    {registration.slot_1?.speaker_name && (
                      <p className="mt-0.5 text-micro font-medium text-teal-base">
                        {registration.slot_1.speaker_name}
                        {registration.slot_1.speaker_company && (
                          <span className="text-muted font-normal"> · {registration.slot_1.speaker_company}</span>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="border border-rule/30 bg-surface-sunk p-3 text-small">
                    <div className="flex justify-between font-semibold text-ink">
                      <span>3:45 – 4:30 PM (Slot 2)</span>
                      <span className="text-teal-base">{registration.slot_2?.theatre_name || "Theatre 2"}</span>
                    </div>
                    <p className="mt-0.5 text-micro font-medium text-ink">{registration.slot_2?.title || "Breakout Session"}</p>
                    {registration.slot_2?.speaker_name && (
                      <p className="mt-0.5 text-micro font-medium text-teal-base">
                        {registration.slot_2.speaker_name}
                        {registration.slot_2.speaker_company && (
                          <span className="text-muted font-normal"> · {registration.slot_2.speaker_company}</span>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="border border-rule/30 bg-surface-sunk p-3 text-small">
                    <div className="flex justify-between font-semibold text-ink">
                      <span>4:30 – 5:15 PM (Slot 3)</span>
                      <span className="text-teal-base">{registration.slot_3?.theatre_name || "Theatre 3"}</span>
                    </div>
                    <p className="mt-0.5 text-micro font-medium text-ink">{registration.slot_3?.title || "Breakout Session"}</p>
                    {registration.slot_3?.speaker_name && (
                      <p className="mt-0.5 text-micro font-medium text-teal-base">
                        {registration.slot_3.speaker_name}
                        {registration.slot_3.speaker_company && (
                          <span className="text-muted font-normal"> · {registration.slot_3.speaker_company}</span>
                        )}
                      </p>
                    )}
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

              <PrintablePass
                registrationId={registration.registration_id}
                attendeeName={registration.attendee_name}
                attendeeEmail={registration.attendee_email}
                slots={[
                  {
                    label: "Slot 1 · 3:00 – 3:45 PM",
                    theatreName: registration.slot_1?.theatre_name,
                    title: registration.slot_1?.title,
                    sessionId: registration.slot_1?.id,
                    speakerName: registration.slot_1?.speaker_name || undefined,
                    speakerCompany: registration.slot_1?.speaker_company || undefined,
                  },
                  {
                    label: "Slot 2 · 3:45 – 4:30 PM",
                    theatreName: registration.slot_2?.theatre_name,
                    title: registration.slot_2?.title,
                    sessionId: registration.slot_2?.id,
                    speakerName: registration.slot_2?.speaker_name || undefined,
                    speakerCompany: registration.slot_2?.speaker_company || undefined,
                  },
                  {
                    label: "Slot 3 · 4:30 – 5:15 PM",
                    theatreName: registration.slot_3?.theatre_name,
                    title: registration.slot_3?.title,
                    sessionId: registration.slot_3?.id,
                    speakerName: registration.slot_3?.speaker_name || undefined,
                    speakerCompany: registration.slot_3?.speaker_company || undefined,
                  },
                ]}
              />

              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRegistration(null);
                    setQuery("");
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 text-small font-semibold text-muted hover:text-ink transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  <span>Search Another</span>
                </button>
                <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full sm:w-auto rounded-full border border-rule bg-white px-5 py-2.5 text-small font-semibold text-ink hover:bg-surface-sunk transition-colors flex items-center justify-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 6 2 18 2 18 9" />
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                      <rect x="6" y="14" width="12" height="8" />
                    </svg>
                    <span>Print / Save Pass</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto rounded-full bg-accent px-6 py-2.5 text-small font-bold text-white hover:bg-orange-deep"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
