"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentSessionId: string;
  onScanSuccess?: () => void;
}

interface ScanFeedback {
  type: "success" | "wrong_theatre" | "error";
  title: string;
  message: string;
  attendeeName?: string;
}

export default function QrScannerModal({
  isOpen,
  onClose,
  currentSessionId,
  onScanSuccess,
}: Props) {
  const [feedback, setFeedback] = useState<ScanFeedback | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = "qr-reader-region";

  const handleQrCodeScanned = useCallback(async (qrText: string) => {
    setIsProcessing(true);

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
        setFeedback({
          type: "success",
          title: "Checked In Successfully!",
          message: `${data.attendeeName} (${data.registrationId}) marked present for ${data.theatreName}.`,
          attendeeName: data.attendeeName,
        });
        if (onScanSuccess) {
          onScanSuccess();
        }
      } else if (data.status === "WRONG_THEATRE") {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([150, 100, 150]);
        }
        setFeedback({
          type: "wrong_theatre",
          title: "Wrong Theatre!",
          message: `${data.attendeeName} is registered for ${data.correctTheatreName} (${data.correctSessionTitle}).`,
          attendeeName: data.attendeeName,
        });
      } else {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([200]);
        }
        setFeedback({
          type: "error",
          title: "Scan Unsuccessful",
          message: data.error || data.message || "Attendee not found on registration list.",
        });
      }
    } catch (err: unknown) {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([200]);
      }
      const msg = err instanceof Error ? err.message : "Error verifying QR code";
      setFeedback({
        type: "error",
        title: "Network Error",
        message: msg,
      });
    } finally {
      // Pause 2.5s before allowing next scan
      setTimeout(() => {
        setIsProcessing(false);
      }, 2500);
    }
  }, [currentSessionId, onScanSuccess]);

  useEffect(() => {
    if (!isOpen) return;

    let html5QrCode: Html5Qrcode | null = null;
    let isMounted = true;

    const startScanner = async () => {
      try {
        setCameraError("");
        html5QrCode = new Html5Qrcode(regionId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 15,
            qrbox: { width: 260, height: 260 },
            aspectRatio: 1.0,
          },
          async (decodedText) => {
            if (isProcessing) return;
            handleQrCodeScanned(decodedText);
          },
          () => {
            // scan frame ignored
          }
        );
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : "Unable to access camera.";
        setCameraError(msg);
      }
    };

    const timer = setTimeout(startScanner, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch((e) => console.warn("Failed to stop scanner:", e));
      }
    };
  }, [isOpen, currentSessionId, isProcessing, handleQrCodeScanned]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-2 sm:p-4 bg-teal-dark/85 backdrop-blur-md">
      <div className="relative w-full max-w-md border border-rule-light bg-cream shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rule bg-teal-dark px-6 py-4 text-cream">
          <div>
            <p className="text-micro font-semibold uppercase tracking-wider text-cyan-bright">
              Camera Scanner
            </p>
            <h2 className="font-display text-h3 text-white">Scan Attendee Pass</h2>
          </div>
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

        {/* Scanner Container */}
        <div className="p-6">
          {cameraError ? (
            <div className="border border-orange-deep bg-panel-orange p-4 text-small text-orange-deep">
              <p className="font-bold">Camera Permission Needed</p>
              <p className="mt-1">{cameraError}</p>
              <p className="mt-2 text-micro text-muted">
                Please ensure you have granted camera permissions in your browser.
              </p>
            </div>
          ) : (
            <div className="relative overflow-hidden bg-ink border border-rule/50">
              <div id={regionId} className="w-full" />
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-teal-dark/50 backdrop-blur-sm text-cyan-bright font-display text-small">
                  Verifying Pass...
                </div>
              )}
            </div>
          )}

          {/* Realtime Feedback Banner */}
          {feedback && (
            <div
              className={`mt-4 border p-4 transition-all duration-300 ${
                feedback.type === "success"
                  ? "border-teal-base bg-panel-teal text-teal-base"
                  : feedback.type === "wrong_theatre"
                  ? "border-orange-deep bg-panel-orange text-orange-deep"
                  : "border-orange-deep bg-panel-orange text-orange-deep"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-body font-bold">
                  {feedback.type === "success" ? "✓" : "⚠️"}
                </span>
                <p className="font-display text-small font-bold">{feedback.title}</p>
              </div>
              <p className="mt-1 text-small leading-tight">{feedback.message}</p>
            </div>
          )}

          <p className="mt-4 text-center text-micro text-muted">
            Point camera at the QR code on the attendee&apos;s phone or badge.
          </p>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-full border border-rule bg-white px-6 py-2 text-small font-semibold text-ink hover:bg-surface-sunk"
            >
              Done Scanning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
