"use client";

import Script from "next/script";
import { FormEvent, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const COOLDOWN_SECONDS = 60;

function turnstileErrorMessage(errorCode?: string): string {
  if (errorCode === "110200") {
    return "Human verification is not authorised for this website address yet. Please contact the summit team.";
  }

  return "Human verification could not load. Please refresh the page or try again in a private window.";
}

function safeDestination(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/recap";
  return value;
}

export default function RecapAccessForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [step, setStep] = useState<"email" | "code">("email");
  const [cooldown, setCooldown] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1_000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (!siteKey || !turnstileReady || !captchaContainerRef.current || !window.turnstile || widgetIdRef.current) return;

    widgetIdRef.current = window.turnstile.render(captchaContainerRef.current, {
      sitekey: siteKey,
      theme: "light",
      size: "flexible",
      callback: (token: string) => {
        setCaptchaToken(token);
        setCaptchaError("");
      },
      "expired-callback": () => {
        setCaptchaToken("");
        setCaptchaError("Human verification expired. Please complete it again.");
      },
      "error-callback": (errorCode?: string) => {
        setCaptchaToken("");
        setCaptchaError(turnstileErrorMessage(errorCode));
      },
    });

    return () => {
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, [siteKey, step, turnstileReady]);

  const resetCaptcha = () => {
    setCaptchaToken("");
    if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
  };

  const sendCode = async (event?: FormEvent) => {
    event?.preventDefault();
    setError("");
    setNotice("");

    if (!captchaToken) {
      setError("Please complete the human verification first.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/recap-access/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, captchaToken }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "We could not send the code.");

      setStep("code");
      setCooldown(COOLDOWN_SECONDS);
      setNotice(`We sent a six-digit code to ${email.trim().toLowerCase()}.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We could not send the code.");
      resetCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  const verifyCode = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/recap-access/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "We could not verify the code.");

      const destination = safeDestination(new URLSearchParams(window.location.search).get("next"));
      window.location.assign(destination);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We could not verify the code.");
    } finally {
      setSubmitting(false);
    }
  };

  const startOver = () => {
    setStep("email");
    setCode("");
    setError("");
    setNotice("");
    resetCaptcha();
  };

  return (
    <>
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setTurnstileReady(true)}
          onError={() => setCaptchaError(turnstileErrorMessage())}
        />
      )}
      <section className="mx-auto flex min-h-[calc(100vh-16rem)] max-w-[80rem] items-center px-6 py-32">
        <div className="grid w-full overflow-hidden border border-rule bg-white shadow-sm lg:grid-cols-[1fr_.9fr]">
          <div className="bg-teal-dark px-7 py-12 text-cream sm:px-12 lg:py-16">
            <p className="text-micro font-semibold uppercase tracking-[.18em] text-cyan-soft">Odyssey 2026</p>
            <h1 className="mt-5 max-w-[12ch] font-display text-h1 text-white">The recap is ready.</h1>
            <p className="mt-6 max-w-[40ch] text-body leading-relaxed text-cream/75">
              Verify your email to revisit the people, ideas and moments from Partner Summit ’26.
            </p>
            <div className="mt-12 border-t border-white/15 pt-6 text-small leading-relaxed text-cream/65">
              Access is available to BOT Consulting colleagues and invited guests.
            </div>
          </div>

          <div className="px-7 py-12 sm:px-12 lg:py-16">
            {step === "email" ? (
              <form onSubmit={sendCode} noValidate>
                <p className="text-micro font-semibold uppercase text-orange-deep">Secure access</p>
                <h2 className="mt-3 font-display text-h2 text-teal-dark">Enter your email</h2>
                <p className="mt-3 text-small leading-relaxed text-muted">We’ll email a one-time verification code.</p>

                <label className="mt-8 block text-micro font-semibold uppercase text-teal-dark" htmlFor="recap-email">Email address</label>
                <input
                  id="recap-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="you@example.com"
                  className="mt-2 w-full border border-rule bg-cream px-4 py-3 text-body text-ink outline-none transition focus:border-teal-dark focus:ring-2 focus:ring-cyan-bright/30"
                />

                <div className="mt-5 min-h-[65px]" ref={captchaContainerRef} />
                {!siteKey && <p className="mt-3 text-small text-orange-deep">Human verification is not configured yet. Please contact the summit team.</p>}
                {captchaError && <p className="mt-3 border-l-2 border-orange-bright bg-panel-orange px-4 py-3 text-small text-ink" role="alert">{captchaError}</p>}

                {error && <p className="mt-5 border-l-2 border-orange-bright bg-panel-orange px-4 py-3 text-small text-ink" role="alert">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting || !siteKey || !captchaToken}
                  className="mt-7 w-full bg-orange-bright px-6 py-3.5 text-micro font-semibold uppercase text-white transition hover:bg-orange-deep disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Sending code…" : "Send verification code"}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyCode} noValidate>
                <p className="text-micro font-semibold uppercase text-orange-deep">One more step</p>
                <h2 className="mt-3 font-display text-h2 text-teal-dark">Check your inbox</h2>
                <p className="mt-3 text-small leading-relaxed text-muted">Enter the six-digit code sent to <strong className="font-semibold text-ink">{email.trim().toLowerCase()}</strong>.</p>

                <label className="mt-8 block text-micro font-semibold uppercase text-teal-dark" htmlFor="recap-code">Verification code</label>
                <input
                  id="recap-code"
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  maxLength={6}
                  placeholder="000000"
                  className="mt-2 w-full border border-rule bg-cream px-4 py-3 text-center font-mono text-xl tracking-[.45em] text-ink outline-none transition focus:border-teal-dark focus:ring-2 focus:ring-cyan-bright/30"
                />

                {notice && <p className="mt-5 border-l-2 border-cyan-bright bg-panel-cyan px-4 py-3 text-small text-ink" role="status">{notice}</p>}
                {error && <p className="mt-5 border-l-2 border-orange-bright bg-panel-orange px-4 py-3 text-small text-ink" role="alert">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting || code.length !== 6}
                  className="mt-7 w-full bg-orange-bright px-6 py-3.5 text-micro font-semibold uppercase text-white transition hover:bg-orange-deep disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Verifying…" : "Access the recap"}
                </button>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-small">
                  <button type="button" onClick={startOver} className="text-teal-dark underline underline-offset-4 hover:text-orange-deep">Use a different email</button>
                  <button type="button" disabled={cooldown > 0 || submitting} onClick={startOver} className="text-teal-dark underline underline-offset-4 hover:text-orange-deep disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50">
                    {cooldown > 0 ? `New code in ${cooldown}s` : "Request a new code"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
