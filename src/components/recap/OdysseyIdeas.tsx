"use client";

import { FormEvent, useState } from "react";

type SubmissionState = "idle" | "sending" | "success" | "error";

export default function OdysseyIdeas() {
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");

  async function submitIdea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/odyssey-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          idea: formData.get("idea"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not save your idea. Please try again.");
      form.reset();
      setState("success");
      setMessage("Thank you - your idea is now part of the Odyssey '27 conversation.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not save your idea. Please try again.");
    }
  }

  return (
    <section className="bg-teal-dark py-16 text-cream lg:py-24" aria-labelledby="odyssey-ideas-title">
      <div className="mx-auto grid max-w-[80rem] gap-12 px-6 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="text-micro font-semibold uppercase text-cyan-soft">Looking ahead</p>
          <h2 id="odyssey-ideas-title" className="mt-4 max-w-[12ch] font-display text-h1">Put your ideas here for Odyssey &apos;27.</h2>
          <p className="mt-6 max-w-[42ch] text-body text-cream/75">What should we explore, change or create together next year? Share the thought while the momentum is still fresh.</p>
        </div>
        <form onSubmit={submitIdea} className="grid gap-4 self-end" aria-describedby="odyssey-ideas-status">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-small font-medium text-cream">
              Your name <span className="text-cream/55">(optional)</span>
              <input name="name" autoComplete="name" maxLength={100} className="w-full border border-white/25 bg-white/8 px-4 py-3 text-cream outline-none transition placeholder:text-cream/40 focus:border-cyan-bright" placeholder="Name" />
            </label>
            <label className="grid gap-2 text-small font-medium text-cream">
              Email <span className="text-cream/55">(optional)</span>
              <input name="email" type="email" autoComplete="email" maxLength={254} className="w-full border border-white/25 bg-white/8 px-4 py-3 text-cream outline-none transition placeholder:text-cream/40 focus:border-cyan-bright" placeholder="you@company.com" />
            </label>
          </div>
          <label className="grid gap-2 text-small font-medium text-cream">
            Your idea <span className="text-orange-soft">(required)</span>
            <textarea name="idea" required maxLength={1500} rows={5} className="w-full resize-y border border-white/25 bg-white/8 px-4 py-3 text-cream outline-none transition placeholder:text-cream/40 focus:border-cyan-bright" placeholder="A speaker, conversation, format or moment you would like to see at Odyssey '27..." />
          </label>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button type="submit" disabled={state === "sending"} className="rounded-full bg-orange-bright px-6 py-3 text-micro font-semibold uppercase text-white transition hover:bg-orange-deep disabled:cursor-wait disabled:opacity-70">
              {state === "sending" ? "Sending..." : "Share your idea →"}
            </button>
            <p id="odyssey-ideas-status" role="status" className={`text-small ${state === "error" ? "text-orange-soft" : "text-cyan-soft"}`}>
              {message}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
