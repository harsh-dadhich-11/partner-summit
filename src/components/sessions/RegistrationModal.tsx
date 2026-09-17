"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import PassQrCode from "@/components/ui/PassQrCode";
import SessionCard from "@/components/sessions/SessionCard";
import type { GroupedSessionSlot, SessionWithAvailability } from "@/types/database";

interface ConfirmedBreakoutData {
  success: boolean;
  registrationId: string;
  attendeeName: string;
  attendeeEmail: string;
  selections?: {
    slot1?: { theatreName: string; title: string };
    slot2?: { theatreName: string; title: string };
    slot3?: { theatreName: string; title: string };
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  slots: GroupedSessionSlot[];
  onRegistrationSuccess?: () => void;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  slots,
  onRegistrationSuccess,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [selectedSlot1, setSelectedSlot1] = useState<SessionWithAvailability | null>(null);
  const [selectedSlot2, setSelectedSlot2] = useState<SessionWithAvailability | null>(null);
  const [selectedSlot3, setSelectedSlot3] = useState<SessionWithAvailability | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmedData, setConfirmedData] = useState<ConfirmedBreakoutData | null>(null);

  if (!isOpen) return null;

  const validateEmail = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) {
      setEmailError("Email is required");
      return false;
    }
    const isBot = /^[a-zA-Z0-9._%+-]+@botconsulting\.io$/i.test(trimmed);
    if (!isBot) {
      setEmailError("Only @botconsulting.io email addresses are permitted.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!validateEmail(email)) return;
    setStep(2);
  };

  const handleSubmitRegistration = async () => {
    if (!selectedSlot1 || !selectedSlot2 || !selectedSlot3) {
      setSubmitError("Please select a session for all 3 time slots.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendeeName: name.trim(),
          attendeeEmail: email.trim().toLowerCase(),
          slot1SessionId: selectedSlot1.id,
          slot2SessionId: selectedSlot2.id,
          slot3SessionId: selectedSlot3.id,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Registration failed. Please try again.");
      }

      setConfirmedData(json.data);
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to register";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const slot1 = slots.find((s) => s.slotId === "slot-1")?.sessions || [];
  const slot2 = slots.find((s) => s.slotId === "slot-2")?.sessions || [];
  const slot3 = slots.find((s) => s.slotId === "slot-3")?.sessions || [];

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-teal-dark/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl border border-rule-light bg-cream shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-rule bg-teal-dark px-6 py-5 text-cream">
          <div>
            <p className="text-micro font-semibold uppercase tracking-wider text-cyan-bright">
              Odyssey 2026 Summit
            </p>
            <h2 className="font-display text-h3 text-white">
              Breakout Session Registration
            </h2>
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

        {/* Progress Bar (if not confirmed) */}
        {!confirmedData && (
          <div className="border-b border-rule bg-surface-sunk px-6 py-3">
            <div className="flex items-center justify-between text-micro font-medium text-muted">
              <span className={step === 1 ? "font-bold text-accent" : step > 1 ? "text-teal-base font-bold" : ""}>
                1. Attendee Info
              </span>
              <span>&rarr;</span>
              <span className={step === 2 ? "font-bold text-accent" : step > 2 ? "text-teal-base font-bold" : ""}>
                2. Slot 1 (15:00)
              </span>
              <span>&rarr;</span>
              <span className={step === 3 ? "font-bold text-accent" : step > 3 ? "text-teal-base font-bold" : ""}>
                3. Slot 2 (15:40)
              </span>
              <span>&rarr;</span>
              <span className={step === 4 ? "font-bold text-accent" : step > 4 ? "text-teal-base font-bold" : ""}>
                4. Slot 3 (16:20)
              </span>
              <span>&rarr;</span>
              <span className={step === 5 ? "font-bold text-accent" : ""}>
                5. Confirm
              </span>
            </div>
          </div>
        )}

        {/* Body content */}
        <div className="overflow-y-auto p-6 flex-1">
          {/* Confirmed State */}
          {confirmedData ? (
            <div className="text-center py-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-mid/15 text-teal-base">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <span className="mt-4 inline-block rounded-full bg-cyan-bright/15 px-4 py-1 text-micro font-semibold uppercase text-teal-base">
                Registration Confirmed
              </span>

              <h3 className="mt-2 font-display text-h2 text-ink">
                You’re All Set, {confirmedData.attendeeName}!
              </h3>
              <p className="mt-2 text-small text-muted">
                Your breakout session registration has been reserved. Keep your Registration ID handy for on-site theatre entry.
              </p>

              {/* Pass Card */}
              <div className="mt-6 mx-auto max-w-md border-2 border-teal-mid/30 bg-white p-6 shadow-md text-left">
                <div className="flex justify-between items-start border-b border-rule/30 pb-4">
                  <div>
                    <p className="text-micro uppercase text-muted">Registration ID</p>
                    <p className="font-mono text-lead font-bold text-accent">
                      {confirmedData.registrationId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-micro uppercase text-muted">Attendee Email</p>
                    <p className="text-small font-medium text-ink">{confirmedData.attendeeEmail}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-micro font-bold uppercase tracking-wider text-muted">
                    Your Breakout Itinerary
                  </p>

                  {/* Slot 1 */}
                  <div className="border border-rule/30 bg-surface-sunk p-3 text-small">
                    <div className="flex justify-between font-semibold text-ink">
                      <span>15:00 – 15:40</span>
                      <span className="text-teal-base">{confirmedData.selections?.slot1?.theatreName}</span>
                    </div>
                    <p className="mt-1 text-micro text-muted">{confirmedData.selections?.slot1?.title}</p>
                  </div>

                  {/* Slot 2 */}
                  <div className="border border-rule/30 bg-surface-sunk p-3 text-small">
                    <div className="flex justify-between font-semibold text-ink">
                      <span>15:40 – 16:20</span>
                      <span className="text-teal-base">{confirmedData.selections?.slot2?.theatreName}</span>
                    </div>
                    <p className="mt-1 text-micro text-muted">{confirmedData.selections?.slot2?.title}</p>
                  </div>

                  {/* Slot 3 */}
                  <div className="border border-rule/30 bg-surface-sunk p-3 text-small">
                    <div className="flex justify-between font-semibold text-ink">
                      <span>16:20 – 17:00</span>
                      <span className="text-teal-base">{confirmedData.selections?.slot3?.theatreName}</span>
                    </div>
                    <p className="mt-1 text-micro text-muted">{confirmedData.selections?.slot3?.title}</p>
                  </div>
                </div>

                {/* Scannable Pass QR Code */}
                <div className="mt-5 border-t border-rule/30 pt-4 flex flex-col items-center">
                  <p className="text-micro font-bold uppercase tracking-wider text-muted mb-2">
                    Volunteer Entry QR Pass
                  </p>
                  <PassQrCode
                    registrationId={confirmedData.registrationId}
                    attendeeName={confirmedData.attendeeName}
                    attendeeEmail={confirmedData.attendeeEmail}
                    slot1SessionId={selectedSlot1?.id}
                    slot2SessionId={selectedSlot2?.id}
                    slot3SessionId={selectedSlot3?.id}
                    size={140}
                  />
                  <p className="mt-2 text-micro text-muted text-center">
                    Show this QR code at the door of each theatre for instant volunteer check-in.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="rounded-full border border-rule bg-white px-6 py-3 text-small font-semibold text-ink hover:bg-surface-sunk transition-colors"
                >
                  Print / Save Pass
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full bg-accent px-8 py-3 text-small font-semibold text-white hover:bg-orange-deep transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : step === 1 ? (
            /* Step 1: Attendee Info */
            <form onSubmit={handleStep1Submit} className="max-w-xl mx-auto py-4">
              <div className="text-center mb-6">
                <h3 className="font-display text-h3 text-ink">Enter Attendee Details</h3>
                <p className="mt-1 text-small text-muted">
                  Breakout registration is reserved exclusively for BOT Consulting team members and partners.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-small font-medium text-ink">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="mt-1.5 w-full border border-rule bg-white px-4 py-3 text-body text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-small font-medium text-ink">
                    Work Email (@botconsulting.io) *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    placeholder="name@botconsulting.io"
                    className={`mt-1.5 w-full border ${
                      emailError ? "border-orange-deep bg-panel-orange" : "border-rule bg-white"
                    } px-4 py-3 text-body text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none`}
                  />
                  {emailError && (
                    <p className="mt-1.5 text-micro font-medium text-orange-deep flex items-center gap-1">
                      <span>⚠️</span> {emailError}
                    </p>
                  )}
                  <p className="mt-1 text-micro text-muted">
                    Only emails ending with <strong>@botconsulting.io</strong> are permitted.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={!name.trim() || !email.trim()}
                  className="rounded-full bg-accent px-8 py-3 text-small font-semibold text-white hover:bg-orange-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Slot 1 &rarr;
                </button>
              </div>
            </form>
          ) : step === 2 ? (
            /* Step 2: Slot 1 Selection */
            <div>
              <div className="mb-4">
                <span className="rounded-full bg-teal-base/10 px-3 py-1 text-micro font-bold text-teal-base uppercase">
                  Time Slot 1 · 15:00 – 15:40
                </span>
                <h3 className="mt-2 font-display text-h3 text-ink">Select One Session for Slot 1</h3>
                <p className="text-small text-muted">
                  Choose which theatre breakout you would like to attend from 15:00 to 15:40.
                </p>
              </div>

              <ul className="grid gap-4 md:grid-cols-3">
                {slot1.map((s, idx) => (
                  <SessionCard
                    key={s.id}
                    session={s}
                    index={idx}
                    selectable
                    isSelected={selectedSlot1?.id === s.id}
                    onSelect={(session) => setSelectedSlot1(session)}
                  />
                ))}
              </ul>

              <div className="mt-8 flex justify-between items-center border-t border-rule pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-small font-medium text-muted hover:text-ink"
                >
                  &larr; Back to Details
                </button>
                <button
                  type="button"
                  disabled={!selectedSlot1}
                  onClick={() => setStep(3)}
                  className="rounded-full bg-accent px-8 py-3 text-small font-semibold text-white hover:bg-orange-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Slot 2 &rarr;
                </button>
              </div>
            </div>
          ) : step === 3 ? (
            /* Step 3: Slot 2 Selection */
            <div>
              <div className="mb-4">
                <span className="rounded-full bg-teal-base/10 px-3 py-1 text-micro font-bold text-teal-base uppercase">
                  Time Slot 2 · 15:40 – 16:20
                </span>
                <h3 className="mt-2 font-display text-h3 text-ink">Select One Session for Slot 2</h3>
                <p className="text-small text-muted">
                  Choose which theatre breakout you would like to attend from 15:40 to 16:20.
                </p>
              </div>

              <ul className="grid gap-4 md:grid-cols-3">
                {slot2.map((s, idx) => (
                  <SessionCard
                    key={s.id}
                    session={s}
                    index={idx}
                    selectable
                    isSelected={selectedSlot2?.id === s.id}
                    onSelect={(session) => setSelectedSlot2(session)}
                  />
                ))}
              </ul>

              <div className="mt-8 flex justify-between items-center border-t border-rule pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-small font-medium text-muted hover:text-ink"
                >
                  &larr; Back to Slot 1
                </button>
                <button
                  type="button"
                  disabled={!selectedSlot2}
                  onClick={() => setStep(4)}
                  className="rounded-full bg-accent px-8 py-3 text-small font-semibold text-white hover:bg-orange-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Slot 3 &rarr;
                </button>
              </div>
            </div>
          ) : step === 4 ? (
            /* Step 4: Slot 3 Selection */
            <div>
              <div className="mb-4">
                <span className="rounded-full bg-teal-base/10 px-3 py-1 text-micro font-bold text-teal-base uppercase">
                  Time Slot 3 · 16:20 – 17:00
                </span>
                <h3 className="mt-2 font-display text-h3 text-ink">Select One Session for Slot 3</h3>
                <p className="text-small text-muted">
                  Choose which closing breakout you would like to attend from 16:20 to 17:00.
                </p>
              </div>

              <ul className="grid gap-4 md:grid-cols-3">
                {slot3.map((s, idx) => (
                  <SessionCard
                    key={s.id}
                    session={s}
                    index={idx}
                    selectable
                    isSelected={selectedSlot3?.id === s.id}
                    onSelect={(session) => setSelectedSlot3(session)}
                  />
                ))}
              </ul>

              <div className="mt-8 flex justify-between items-center border-t border-rule pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-small font-medium text-muted hover:text-ink"
                >
                  &larr; Back to Slot 2
                </button>
                <button
                  type="button"
                  disabled={!selectedSlot3}
                  onClick={() => setStep(5)}
                  className="rounded-full bg-accent px-8 py-3 text-small font-semibold text-white hover:bg-orange-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review & Confirm &rarr;
                </button>
              </div>
            </div>
          ) : (
            /* Step 5: Review & Submit */
            <div className="max-w-2xl mx-auto py-2">
              <div className="text-center mb-6">
                <h3 className="font-display text-h3 text-ink">Review Your Selections</h3>
                <p className="text-small text-muted">
                  Please verify your 3 breakout sessions before confirming your seat reservation.
                </p>
              </div>

              {submitError && (
                <div className="mb-6 border border-orange-deep bg-panel-orange p-4 text-small text-orange-deep">
                  <p className="font-bold flex items-center gap-1.5">
                    <span>⚠️</span> Registration Issue
                  </p>
                  <p className="mt-1">{submitError}</p>
                </div>
              )}

              <div className="border border-rule bg-white p-6 shadow-sm space-y-4">
                <div className="border-b border-rule/30 pb-3 flex justify-between items-center">
                  <div>
                    <p className="text-micro uppercase text-muted">Attendee</p>
                    <p className="text-body font-semibold text-ink">{name}</p>
                    <p className="text-small text-muted">{email}</p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-micro font-semibold text-teal-base hover:underline"
                  >
                    Edit
                  </button>
                </div>

                {/* Selected Sessions list */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-start border border-rule/30 bg-surface-sunk p-3">
                    <div>
                      <p className="text-micro font-bold text-teal-mid uppercase">Slot 1 · 15:00–15:40</p>
                      <p className="font-semibold text-ink">{selectedSlot1?.title}</p>
                      <p className="text-micro text-muted flex items-center gap-1 mt-0.5">
                        <Icon name="pin" size={12} /> {selectedSlot1?.theatre_name}
                      </p>
                    </div>
                    <button onClick={() => setStep(2)} className="text-micro text-teal-base hover:underline">
                      Change
                    </button>
                  </div>

                  <div className="flex justify-between items-start border border-rule/30 bg-surface-sunk p-3">
                    <div>
                      <p className="text-micro font-bold text-teal-mid uppercase">Slot 2 · 15:40–16:20</p>
                      <p className="font-semibold text-ink">{selectedSlot2?.title}</p>
                      <p className="text-micro text-muted flex items-center gap-1 mt-0.5">
                        <Icon name="pin" size={12} /> {selectedSlot2?.theatre_name}
                      </p>
                    </div>
                    <button onClick={() => setStep(3)} className="text-micro text-teal-base hover:underline">
                      Change
                    </button>
                  </div>

                  <div className="flex justify-between items-start border border-rule/30 bg-surface-sunk p-3">
                    <div>
                      <p className="text-micro font-bold text-teal-mid uppercase">Slot 3 · 16:20–17:00</p>
                      <p className="font-semibold text-ink">{selectedSlot3?.title}</p>
                      <p className="text-micro text-muted flex items-center gap-1 mt-0.5">
                        <Icon name="pin" size={12} /> {selectedSlot3?.theatre_name}
                      </p>
                    </div>
                    <button onClick={() => setStep(4)} className="text-micro text-teal-base hover:underline">
                      Change
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center border-t border-rule pt-4">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-small font-medium text-muted hover:text-ink"
                >
                  &larr; Back to Slot 3
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitRegistration}
                  className="rounded-full bg-accent px-8 py-3.5 text-small font-semibold text-white hover:bg-orange-deep transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Reserving Seats..." : "Confirm My Registration &rarr;"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
