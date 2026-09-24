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

const STEP_LABELS = [
  { step: 1, title: "Attendee Info" },
  { step: 2, title: "Slot 1 (15:00)" },
  { step: 3, title: "Slot 2 (15:40)" },
  { step: 4, title: "Slot 3 (16:20)" },
  { step: 5, title: "Confirm" },
];

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
      setEmailError("Work email is required");
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
    <div className="fixed inset-0 z-150 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-teal-dark/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl border border-rule-light bg-cream shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-rule bg-teal-dark px-6 py-5 sm:px-8 text-cream">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-bright/15 px-3 py-0.5 text-micro font-bold uppercase tracking-wider text-cyan-bright">
              Odyssey 2026 Summit
            </span>
            <h2 className="mt-1 font-display text-h2 text-white">
              Breakout Session Registration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-cream/70 hover:bg-cream/15 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Progress Stepper Bar */}
        {!confirmedData && (
          <div className="border-b border-rule bg-surface-sunk px-4 py-3 sm:px-8">
            {/* Desktop Stepper */}
            <div className="hidden sm:flex items-center justify-between">
              {STEP_LABELS.map((item, idx) => {
                const isPassed = step > item.step;
                const isCurrent = step === item.step;
                return (
                  <div key={item.step} className="flex items-center flex-1 last:flex-initial">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-micro font-bold transition-all duration-300 ${
                          isPassed
                            ? "bg-teal-mid text-white shadow-sm"
                            : isCurrent
                            ? "bg-accent text-white shadow-md ring-4 ring-accent/20"
                            : "border border-rule bg-white text-muted"
                        }`}
                      >
                        {isPassed ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          item.step
                        )}
                      </div>
                      <span
                        className={`text-small transition-colors ${
                          isCurrent
                            ? "font-bold text-ink"
                            : isPassed
                            ? "font-semibold text-teal-base"
                            : "font-normal text-muted"
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>

                    {idx < STEP_LABELS.length - 1 && (
                      <div
                        className={`mx-3 h-[2px] flex-1 transition-colors duration-300 ${
                          step > idx + 1 ? "bg-teal-mid" : "bg-rule/40"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Compact Stepper */}
            <div className="sm:hidden">
              <div className="flex items-center justify-between text-micro font-medium text-muted mb-2">
                <span className="font-bold text-ink">
                  Step {step} of 5: <span className="text-accent">{STEP_LABELS[step - 1]?.title}</span>
                </span>
                <span className="text-muted">{Math.round((step / 5) * 100)}% Complete</span>
              </div>
              <div className="h-1.5 w-full bg-rule/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300 rounded-full"
                  style={{ width: `${(step / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Body content */}
        <div className="overflow-y-auto p-5 sm:p-8 flex-1">
          {/* Confirmed State */}
          {confirmedData ? (
            <div className="text-center py-4 sm:py-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-mid/15 text-teal-base ring-8 ring-teal-mid/10">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <span className="mt-4 inline-block rounded-full bg-cyan-bright/15 px-4 py-1 text-micro font-semibold uppercase text-teal-base">
                Registration Confirmed
              </span>

              <h3 className="mt-2 font-display text-h2 text-ink">
                You’re All Set, {confirmedData.attendeeName}!
              </h3>
              <p className="mt-2 text-small text-muted max-w-lg mx-auto">
                Your breakout session registration has been reserved. Keep your Registration ID handy for on-site theatre entry.
              </p>

              {/* Pass Card */}
              <div className="mt-6 mx-auto max-w-md border-2 border-teal-mid/30 bg-white p-6 shadow-md text-left">
                <div className="flex justify-between items-start border-b border-rule/30 pb-4">
                  <div>
                    <p className="text-micro uppercase text-muted font-bold">Registration ID</p>
                    <p className="font-mono text-lead font-bold text-accent">
                      {confirmedData.registrationId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-micro uppercase text-muted font-bold">Attendee Email</p>
                    <p className="text-small font-medium text-ink">{confirmedData.attendeeEmail}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-micro font-bold uppercase tracking-wider text-muted">
                    Your Breakout Itinerary
                  </p>

                  {/* Slot 1 */}
                  <div className="border border-rule/40 bg-surface-sunk p-3 text-small">
                    <div className="flex justify-between font-semibold text-ink">
                      <span>15:00 – 15:40</span>
                      <span className="rounded-full bg-teal-base/10 px-2.5 py-0.5 text-micro font-bold text-teal-base">
                        {confirmedData.selections?.slot1?.theatreName}
                      </span>
                    </div>
                    <p className="mt-1 text-micro text-muted">{confirmedData.selections?.slot1?.title}</p>
                  </div>

                  {/* Slot 2 */}
                  <div className="border border-rule/40 bg-surface-sunk p-3 text-small">
                    <div className="flex justify-between font-semibold text-ink">
                      <span>15:40 – 16:20</span>
                      <span className="rounded-full bg-teal-base/10 px-2.5 py-0.5 text-micro font-bold text-teal-base">
                        {confirmedData.selections?.slot2?.theatreName}
                      </span>
                    </div>
                    <p className="mt-1 text-micro text-muted">{confirmedData.selections?.slot2?.title}</p>
                  </div>

                  {/* Slot 3 */}
                  <div className="border border-rule/40 bg-surface-sunk p-3 text-small">
                    <div className="flex justify-between font-semibold text-ink">
                      <span>16:20 – 17:00</span>
                      <span className="rounded-full bg-teal-base/10 px-2.5 py-0.5 text-micro font-bold text-teal-base">
                        {confirmedData.selections?.slot3?.theatreName}
                      </span>
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
                  className="rounded-full border border-rule bg-white px-6 py-3 text-small font-semibold text-ink hover:bg-surface-sunk transition-colors shadow-sm"
                >
                  Print / Save Pass
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full bg-accent px-8 py-3 text-small font-semibold text-white hover:bg-orange-deep transition-colors shadow-md hover:shadow-lg"
                >
                  Done
                </button>
              </div>
            </div>
          ) : step === 1 ? (
            /* Step 1: Attendee Info */
            <form onSubmit={handleStep1Submit} className="max-w-xl mx-auto py-2 sm:py-4">
              <div className="text-center mb-6">
                <h3 className="font-display text-h3 text-ink">Attendee Details</h3>
                <p className="mt-1 text-small text-muted">
                  Breakout registration is reserved exclusively for BOT Consulting team members and partners.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-small font-semibold text-ink">
                    Full Name <span className="text-accent">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Harsh Dadhich"
                    className="mt-1.5 w-full border border-rule bg-white px-4 py-3 text-body text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none transition-colors shadow-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-small font-semibold text-ink">
                    Work Email (@botconsulting.io) <span className="text-accent">*</span>
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
                    } px-4 py-3 text-body text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none transition-colors shadow-sm`}
                  />
                  {emailError && (
                    <p className="mt-2 text-micro font-medium text-orange-deep flex items-center gap-1.5 bg-panel-orange border border-orange-deep/30 p-2">
                      <span>⚠️</span> {emailError}
                    </p>
                  )}
                  <p className="mt-1.5 text-micro text-muted">
                    Only verified emails ending with <strong>@botconsulting.io</strong> are permitted.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={!name.trim() || !email.trim()}
                  className="rounded-full bg-accent px-8 py-3.5 text-small font-semibold text-white hover:bg-orange-deep transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>Continue to Slot 1</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </form>
          ) : step === 2 ? (
            /* Step 2: Slot 1 Selection */
            <div>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-rule/40 pb-3">
                <div>
                  <span className="rounded-full bg-teal-base/10 px-3 py-1 text-micro font-bold text-teal-base uppercase tracking-wider">
                    Time Slot 1 · 15:00 – 15:40
                  </span>
                  <h3 className="mt-1.5 font-display text-h3 text-ink">Select One Session for Slot 1</h3>
                </div>
                <p className="text-micro text-muted">
                  Choose 1 of 3 parallel theatre breakouts
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

              <div className="mt-8 flex justify-between items-center border-t border-rule/50 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-small font-medium text-muted hover:text-ink transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  <span>Back to Details</span>
                </button>
                <button
                  type="button"
                  disabled={!selectedSlot1}
                  onClick={() => setStep(3)}
                  className="rounded-full bg-accent px-8 py-3 text-small font-semibold text-white hover:bg-orange-deep transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>Continue to Slot 2</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          ) : step === 3 ? (
            /* Step 3: Slot 2 Selection */
            <div>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-rule/40 pb-3">
                <div>
                  <span className="rounded-full bg-teal-base/10 px-3 py-1 text-micro font-bold text-teal-base uppercase tracking-wider">
                    Time Slot 2 · 15:40 – 16:20
                  </span>
                  <h3 className="mt-1.5 font-display text-h3 text-ink">Select One Session for Slot 2</h3>
                </div>
                <p className="text-micro text-muted">
                  Choose 1 of 3 parallel theatre breakouts
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

              <div className="mt-8 flex justify-between items-center border-t border-rule/50 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 text-small font-medium text-muted hover:text-ink transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  <span>Back to Slot 1</span>
                </button>
                <button
                  type="button"
                  disabled={!selectedSlot2}
                  onClick={() => setStep(4)}
                  className="rounded-full bg-accent px-8 py-3 text-small font-semibold text-white hover:bg-orange-deep transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>Continue to Slot 3</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          ) : step === 4 ? (
            /* Step 4: Slot 3 Selection */
            <div>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-rule/40 pb-3">
                <div>
                  <span className="rounded-full bg-teal-base/10 px-3 py-1 text-micro font-bold text-teal-base uppercase tracking-wider">
                    Time Slot 3 · 16:20 – 17:00
                  </span>
                  <h3 className="mt-1.5 font-display text-h3 text-ink">Select One Session for Slot 3</h3>
                </div>
                <p className="text-micro text-muted">
                  Choose 1 of 3 parallel theatre breakouts
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

              <div className="mt-8 flex justify-between items-center border-t border-rule/50 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1.5 text-small font-medium text-muted hover:text-ink transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  <span>Back to Slot 2</span>
                </button>
                <button
                  type="button"
                  disabled={!selectedSlot3}
                  onClick={() => setStep(5)}
                  className="rounded-full bg-accent px-8 py-3 text-small font-semibold text-white hover:bg-orange-deep transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>Review & Confirm</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
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
                <div className="mb-6 border border-orange-deep bg-panel-orange p-4 text-small text-orange-deep shadow-sm">
                  <p className="font-bold flex items-center gap-1.5">
                    <span>⚠️</span> Registration Issue
                  </p>
                  <p className="mt-1">{submitError}</p>
                </div>
              )}

              <div className="border border-rule bg-white p-6 shadow-sm space-y-5">
                {/* Attendee Info Card */}
                <div className="border-b border-rule/40 pb-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-base/10 text-teal-base font-bold text-small">
                      {name.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div>
                      <p className="text-micro uppercase font-bold text-muted">Attendee</p>
                      <p className="text-body font-bold text-ink">{name}</p>
                      <p className="text-small text-muted">{email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="rounded-full border border-rule px-3 py-1 text-micro font-semibold text-teal-base hover:bg-surface-sunk transition-colors"
                  >
                    Edit
                  </button>
                </div>

                {/* Selected Sessions list */}
                <div className="space-y-3">
                  {/* Slot 1 */}
                  <div className="border border-rule/50 bg-[#faf8f4] p-4 flex justify-between items-center hover:border-teal-mid/40 transition-colors">
                    <div className="space-y-1">
                      <span className="inline-block rounded-full bg-teal-base/10 px-2.5 py-0.5 text-micro font-bold text-teal-base uppercase">
                        Slot 1 · 15:00–15:40
                      </span>
                      <p className="font-semibold text-ink">{selectedSlot1?.title}</p>
                      <p className="text-micro text-muted flex items-center gap-1">
                        <Icon name="pin" size={12} />
                        <span>{selectedSlot1?.theatre_name}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="text-micro font-semibold text-teal-base hover:text-accent transition-colors"
                    >
                      Change
                    </button>
                  </div>

                  {/* Slot 2 */}
                  <div className="border border-rule/50 bg-[#faf8f4] p-4 flex justify-between items-center hover:border-teal-mid/40 transition-colors">
                    <div className="space-y-1">
                      <span className="inline-block rounded-full bg-teal-base/10 px-2.5 py-0.5 text-micro font-bold text-teal-base uppercase">
                        Slot 2 · 15:40–16:20
                      </span>
                      <p className="font-semibold text-ink">{selectedSlot2?.title}</p>
                      <p className="text-micro text-muted flex items-center gap-1">
                        <Icon name="pin" size={12} />
                        <span>{selectedSlot2?.theatre_name}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(3)}
                      className="text-micro font-semibold text-teal-base hover:text-accent transition-colors"
                    >
                      Change
                    </button>
                  </div>

                  {/* Slot 3 */}
                  <div className="border border-rule/50 bg-[#faf8f4] p-4 flex justify-between items-center hover:border-teal-mid/40 transition-colors">
                    <div className="space-y-1">
                      <span className="inline-block rounded-full bg-teal-base/10 px-2.5 py-0.5 text-micro font-bold text-teal-base uppercase">
                        Slot 3 · 16:20–17:00
                      </span>
                      <p className="font-semibold text-ink">{selectedSlot3?.title}</p>
                      <p className="text-micro text-muted flex items-center gap-1">
                        <Icon name="pin" size={12} />
                        <span>{selectedSlot3?.theatre_name}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(4)}
                      className="text-micro font-semibold text-teal-base hover:text-accent transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center border-t border-rule/50 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex items-center gap-1.5 text-small font-medium text-muted hover:text-ink transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  <span>Back to Slot 3</span>
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitRegistration}
                  className="rounded-full bg-accent px-8 py-3.5 text-small font-semibold text-white hover:bg-orange-deep transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Reserving Seats...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm My Registration</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
