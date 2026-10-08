"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { playSuccessTone, playWarningTone, playErrorTone } from "@/lib/sound";
import type { DbSessionAttendance } from "@/types/database";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentSessionId: string;
  theatreName?: string;
  roster?: DbSessionAttendance[];
  onScanSuccess?: (registrationId: string) => void;
}

interface ScanFeedback {
  type: "success" | "wrong_theatre" | "error" | "already_checked_in";
  title: string;
  message: string;
  attendeeName?: string;
  timestamp: number;
}

export default function QrScannerModal({
  isOpen,
  onClose,
  currentSessionId,
  theatreName = "Assigned Theatre",
  roster = [],
  onScanSuccess,
}: Props) {
  const [feedback, setFeedback] = useState<ScanFeedback | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [sessionScanCount, setSessionScanCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);
  const recentlyScannedRef = useRef<Map<string, number>>(new Map());
  const regionId = "qr-reader-region";

  // Helper to extract clean ID / Email from QR payload
  const parseQrPayload = (qrText: string): { regId: string; email: string } => {
    let regId = "";
    let email = "";
    try {
      const trimmed = qrText.trim();
      if (trimmed.startsWith("{")) {
        const parsed = JSON.parse(trimmed);
        regId = parsed.regId || parsed.registrationId || "";
        email = (parsed.email || parsed.attendeeEmail || "").toLowerCase();
      } else if (trimmed.startsWith("ODYSSEY|")) {
        const parts = trimmed.split("|");
        regId = parts[1] || "";
      } else {
        regId = trimmed;
      }
    } catch {
      regId = qrText.trim();
    }
    return { regId: regId.trim(), email: email.trim() };
  };

  const handleQrCodeScanned = useCallback(
    async (qrText: string) => {
      const now = Date.now();
      const { regId, email } = parseQrPayload(qrText);
      const cacheKey = regId || email || qrText;

      // Prevent duplicate scan of the SAME badge within 2.5 seconds
      const lastScanned = recentlyScannedRef.current.get(cacheKey);
      if (lastScanned && now - lastScanned < 2500) {
        return;
      }
      recentlyScannedRef.current.set(cacheKey, now);

      // 1. Instant Local Roster Check (0ms latency)
      const localMatch = roster.find((a) => {
        if (regId && a.registration_id.toLowerCase() === regId.toLowerCase()) return true;
        if (email && a.attendee_email.toLowerCase() === email.toLowerCase()) return true;
        if (regId && a.attendee_email.toLowerCase() === regId.toLowerCase()) return true;
        return false;
      });

      if (localMatch) {
        // Instant Haptic + Audio cue
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([40, 30, 40]);
        }
        playSuccessTone();

        const wasAlreadyPresent = localMatch.is_present;
        setFeedback({
          type: wasAlreadyPresent ? "already_checked_in" : "success",
          title: wasAlreadyPresent ? "Already Checked In" : "Checked In!",
          message: `${localMatch.attendee_name} (${localMatch.registration_id})`,
          attendeeName: localMatch.attendee_name,
          timestamp: now,
        });

        if (!wasAlreadyPresent) {
          setSessionScanCount((prev) => prev + 1);
        }

        if (onScanSuccess) {
          onScanSuccess(localMatch.registration_id);
        }

        // Fire background async API sync (non-blocking)
        setIsSyncing(true);
        fetch("/api/volunteer/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            qrData: qrText,
            currentSessionId,
            volunteerId: "speed-scanner",
          }),
        })
          .catch((err) => console.warn("Background sync warning:", err))
          .finally(() => setIsSyncing(false));

        return;
      }

      // 2. Attendee not in local roster -> query API for cross-theatre verification or walk-in
      setIsSyncing(true);
      try {
        const res = await fetch("/api/volunteer/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            qrData: qrText,
            currentSessionId,
            volunteerId: "camera-scanner",
          }),
        });

        const data = await res.json();

        if (data.status === "CHECKED_IN") {
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([40, 30, 40]);
          }
          playSuccessTone();

          setFeedback({
            type: "success",
            title: "Checked In!",
            message: `${data.attendeeName} (${data.registrationId})`,
            attendeeName: data.attendeeName,
            timestamp: Date.now(),
          });
          setSessionScanCount((prev) => prev + 1);
          if (onScanSuccess) {
            onScanSuccess(data.registrationId);
          }
        } else if (data.status === "WRONG_THEATRE") {
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([150, 80, 150]);
          }
          playWarningTone();

          setFeedback({
            type: "wrong_theatre",
            title: `Wrong Theatre! Send to: ${data.correctTheatreName}`,
            message: `${data.attendeeName} is registered for ${data.correctTheatreName} (${data.correctSessionTitle}).`,
            attendeeName: data.attendeeName,
            timestamp: Date.now(),
          });
        } else {
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([250]);
          }
          playErrorTone();

          setFeedback({
            type: "error",
            title: "Pass Not Found",
            message: data.error || data.message || "Attendee not found on registration list.",
            timestamp: Date.now(),
          });
        }
      } catch (err: unknown) {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([250]);
        }
        playErrorTone();
        const msg = err instanceof Error ? err.message : "Error verifying pass";
        setFeedback({
          type: "error",
          title: "Network Error",
          message: msg,
          timestamp: Date.now(),
        });
      } finally {
        setIsSyncing(false);
      }
    },
    [currentSessionId, roster, onScanSuccess]
  );

  // Auto-clear feedback banner after 3 seconds without blocking camera
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Mount scanner ONCE when modal opens; unmount ONLY when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (scannerRef.current && isScanningRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch((e) => console.warn("Failed to stop scanner:", e))
          .finally(() => {
            isScanningRef.current = false;
          });
      }
      return;
    }

    let isMounted = true;
    const startScanner = async () => {
      try {
        setCameraError("");
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode(regionId);
        }

        if (!isScanningRef.current) {
          await scannerRef.current.start(
            { facingMode: "environment" },
            {
              fps: 20, // 20 FPS for high-speed capture
              qrbox: { width: 260, height: 260 },
              aspectRatio: 1.0,
            },
            (decodedText) => {
              handleQrCodeScanned(decodedText);
            },
            () => {}
          );
          isScanningRef.current = true;
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : "Unable to access camera.";
        setCameraError(msg);
      }
    };

    const timer = setTimeout(startScanner, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (scannerRef.current && isScanningRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch((e) => console.warn("Failed to stop scanner on cleanup:", e))
          .finally(() => {
            isScanningRef.current = false;
          });
      }
    };
  }, [isOpen, handleQrCodeScanned]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-2 sm:p-4 bg-teal-dark/85 backdrop-blur-md">
      <div className="relative w-full max-w-md border border-rule-light bg-cream shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rule bg-teal-dark px-5 py-3 text-cream">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-cyan-bright animate-pulse" />
              <p className="text-micro font-semibold uppercase tracking-wider text-cyan-bright">
                Continuous Rapid Scanner
              </p>
            </div>
            <h2 className="font-display text-h3 text-white">
              {theatreName}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-micro font-bold text-white border border-white/20">
              Scanned: {sessionScanCount}
            </span>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-cream/70 hover:bg-cream/10 hover:text-white"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scanner Container */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          {cameraError ? (
            <div className="border border-orange-deep bg-panel-orange p-4 text-small text-orange-deep">
              <p className="font-bold">Camera Permission Needed</p>
              <p className="mt-1">{cameraError}</p>
              <p className="mt-2 text-micro text-muted">
                Please grant camera permissions in your browser settings to scan attendee QR codes.
              </p>
            </div>
          ) : (
            <div className="relative overflow-hidden bg-ink border border-rule/50 shadow-inner">
              <div id={regionId} className="w-full min-h-[280px]" />

              {/* Viewfinder Target Graphic */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-56 border-2 border-cyan-bright/60 relative">
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-bright" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-bright" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-bright" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-bright" />
                </div>
              </div>

              {/* Status Sync Indicator */}
              {isSyncing && (
                <div className="absolute top-2 right-2 bg-teal-dark/80 backdrop-blur-sm text-cyan-bright text-[10px] font-semibold px-2 py-0.5 rounded-full border border-cyan-bright/30">
                  Syncing...
                </div>
              )}
            </div>
          )}

          {/* Realtime Instant Feedback Banner */}
          <div className="min-h-[72px] mt-3 flex items-center">
            {feedback ? (
              <div
                className={`w-full border p-3 transition-all duration-150 animate-in fade-in zoom-in-95 ${
                  feedback.type === "success" || feedback.type === "already_checked_in"
                    ? "border-teal-base bg-panel-teal text-teal-base"
                    : feedback.type === "wrong_theatre"
                    ? "border-accent bg-panel-orange text-orange-deep"
                    : "border-orange-deep bg-panel-orange text-orange-deep"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-body font-bold">
                    {feedback.type === "success" || feedback.type === "already_checked_in" ? "✓" : "⚠️"}
                  </span>
                  <p className="font-display text-small font-bold">{feedback.title}</p>
                </div>
                <p className="mt-0.5 text-micro leading-tight font-medium">{feedback.message}</p>
              </div>
            ) : (
              <div className="w-full text-center py-2 text-micro text-muted">
                Point camera at attendee pass. Rapid-fire scan enabled (continuous feed).
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-rule/30 pt-3">
            <span className="text-micro text-muted">
              Roster: {roster.length} registered
            </span>
            <button
              onClick={onClose}
              className="rounded-full border border-rule bg-white px-5 py-1.5 text-small font-semibold text-ink hover:bg-surface-sunk"
            >
              Done Scanning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
