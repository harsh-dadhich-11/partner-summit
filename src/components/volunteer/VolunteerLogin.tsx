"use client";

import { useState } from "react";

export interface VolunteerSession {
  id: string;
  name: string;
  email: string;
  assignedTheatreId: string; // 'theatre-1', 'theatre-2', 'theatre-3', or 'all'
}

interface Props {
  onLoginSuccess: (volunteer: VolunteerSession) => void;
}

export default function VolunteerLogin({ onLoginSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !pin.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/volunteer/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          accessCode: pin.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Authentication failed. Invalid email or PIN.");
      }

      onLoginSuccess(json.volunteer);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication error";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 pt-28 pb-16 md:px-8 md:pt-36 md:pb-24">
      <div className="w-full max-w-md border border-rule-light bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-block rounded-full bg-teal-base/10 px-3 py-1 text-micro font-bold uppercase tracking-wider text-teal-base">
            Volunteer Portal
          </span>
          <h1 className="mt-3 font-display text-h2 text-ink">Theatre Staff Login</h1>
          <p className="mt-2 text-small text-muted">
            Enter your assigned volunteer credentials to access your theatre roster and live scanner.
          </p>
        </div>

        {error && (
          <div className="mb-6 border border-orange-deep bg-panel-orange p-3 text-small text-orange-deep">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="vol-email" className="block text-small font-medium text-ink">
              Work Email
            </label>
            <input
              id="vol-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="theatre1.lead@botconsulting.io"
              className="mt-1.5 w-full border border-rule bg-white px-4 py-3 text-body text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="vol-pin" className="block text-small font-medium text-ink">
              4-Digit Access PIN
            </label>
            <input
              id="vol-pin"
              type="password"
              inputMode="numeric"
              maxLength={6}
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="mt-1.5 w-full border border-rule bg-white px-4 py-3 text-body text-ink tracking-widest placeholder:tracking-normal placeholder:text-muted/60 focus:border-accent focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !email.trim() || !pin.trim()}
              className="w-full rounded-full bg-accent py-3.5 text-small font-semibold text-white hover:bg-orange-deep transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{isLoading ? "Verifying..." : "Access Theatre Roster"}</span>
              {!isLoading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 border-t border-rule/30 pt-4 text-center">
          <p className="text-micro text-muted">
            Assigned to a specific theatre? Your login automatically locks to your designated room.
          </p>
        </div>
      </div>
    </div>
  );
}
