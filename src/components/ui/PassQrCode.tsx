"use client";

import { QRCodeSVG } from "qrcode.react";

interface Props {
  registrationId: string;
  attendeeEmail: string;
  attendeeName: string;
  slot1SessionId?: string;
  slot2SessionId?: string;
  slot3SessionId?: string;
  size?: number;
}

export default function PassQrCode({
  registrationId,
  attendeeEmail,
  attendeeName,
  slot1SessionId,
  slot2SessionId,
  slot3SessionId,
  size = 160,
}: Props) {
  // Format payload as structured JSON
  const qrPayload = JSON.stringify({
    type: "ODYSSEY_PASS",
    regId: registrationId,
    name: attendeeName,
    email: attendeeEmail,
    s1: slot1SessionId,
    s2: slot2SessionId,
    s3: slot3SessionId,
  });

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white border border-rule/40 shadow-inner">
      <QRCodeSVG
        value={qrPayload}
        size={size}
        level="M"
        fgColor="#183944"
        bgColor="#ffffff"
        includeMargin={false}
      />
      <p className="mt-2 text-micro font-mono font-bold tracking-wider text-muted uppercase">
        {registrationId}
      </p>
    </div>
  );
}
