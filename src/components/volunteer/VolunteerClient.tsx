"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Icon } from "@/components/ui/Icon";
import QrScannerModal from "@/components/volunteer/QrScannerModal";
import VolunteerLogin, { VolunteerSession } from "@/components/volunteer/VolunteerLogin";
import { supabase } from "@/lib/supabase/client";
import type { DbSession, DbSessionAttendance } from "@/types/database";

const THEATRES = [
  { id: "theatre-1", name: "Sakura · Theatre 1" },
  { id: "theatre-2", name: "Sakura · Theatre 2" },
  { id: "theatre-3", name: "Sakura · Theatre 3" },
];

const SLOTS = [
  { id: "slot-1", time: "15:00–15:40", label: "Slot 1" },
  { id: "slot-2", time: "15:40–16:20", label: "Slot 2" },
  { id: "slot-3", time: "16:20–17:00", label: "Slot 3" },
];

const STORAGE_KEY = "partner_summit_volunteer_session";

export default function VolunteerClient() {
  const [volunteerSession, setVolunteerSession] = useState<VolunteerSession | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [selectedTheatre, setSelectedTheatre] = useState("theatre-1");
  const [selectedSlot, setSelectedSlot] = useState("slot-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [attendees, setAttendees] = useState<DbSessionAttendance[]>([]);
  const [sessionInfo, setSessionInfo] = useState<DbSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Walk-in modal state
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [walkInName, setWalkInName] = useState("");
  const [walkInEmail, setWalkInEmail] = useState("");

  // QR Scanner modal state
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Check saved session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: VolunteerSession = JSON.parse(saved);
        setVolunteerSession(parsed);
        if (parsed.assignedTheatreId && parsed.assignedTheatreId !== "all") {
          setSelectedTheatre(parsed.assignedTheatreId);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  const handleLoginSuccess = (session: VolunteerSession) => {
    setVolunteerSession(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    if (session.assignedTheatreId && session.assignedTheatreId !== "all") {
      setSelectedTheatre(session.assignedTheatreId);
    }
  };

  const handleLogout = () => {
    setVolunteerSession(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const currentSessionId = `${selectedSlot.replace("-", "")}-${selectedTheatre.replace("-", "")}`;

  const fetchSheet = useCallback(async () => {
    if (!volunteerSession) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/volunteer/sessions/${currentSessionId}/sheet`);
      const json = await res.json();
      if (json.success) {
        setAttendees(json.attendees || []);
        setSessionInfo(json.session);
      }
    } catch (err) {
      console.error("Error fetching sheet:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, volunteerSession]);

  useEffect(() => {
    if (volunteerSession) {
      fetchSheet();
    }
  }, [fetchSheet, volunteerSession]);

  // Realtime attendance updates
  useEffect(() => {
    if (!volunteerSession) return;

    const channel = supabase
      .channel(`attendance:${currentSessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_attendance",
          filter: `session_id=eq.${currentSessionId}`,
        },
        () => {
          fetchSheet();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentSessionId, fetchSheet, volunteerSession]);

  const handleToggleAttendance = async (item: DbSessionAttendance) => {
    const newStatus = !item.is_present;
    setIsUpdating(item.registration_id);

    // Optimistic update
    setAttendees((prev) =>
      prev.map((a) =>
        a.registration_id === item.registration_id ? { ...a, is_present: newStatus } : a
      )
    );

    try {
      const res = await fetch("/api/volunteer/attendance/mark", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSessionId,
          registrationId: item.registration_id,
          isPresent: newStatus,
          volunteerId: volunteerSession?.email || "volunteer",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        // Rollback
        fetchSheet();
      }
    } catch (err) {
      console.error("Failed to update check-in:", err);
      fetchSheet();
    } finally {
      setIsUpdating(null);
    }
  };

  const handleAddWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) return;

    try {
      const randomId = `WALK-${Math.floor(1000 + Math.random() * 9000)}`;
      const res = await fetch("/api/volunteer/attendance/mark", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSessionId,
          registrationId: randomId,
          attendeeName: walkInName.trim(),
          attendeeEmail: walkInEmail.trim() || `${randomId.toLowerCase()}@botconsulting.io`,
          isPresent: true,
          isWalkIn: true,
          volunteerId: volunteerSession?.email || "onsite-volunteer",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsWalkInOpen(false);
        setWalkInName("");
        setWalkInEmail("");
        fetchSheet();
      }
    } catch (err) {
      console.error("Failed to add walk-in:", err);
    }
  };

  const filteredAttendees = useMemo(() => {
    if (!searchQuery.trim()) return attendees;
    const q = searchQuery.toLowerCase().trim();
    return attendees.filter(
      (a) =>
        a.attendee_name.toLowerCase().includes(q) ||
        a.attendee_email.toLowerCase().includes(q) ||
        a.registration_id.toLowerCase().includes(q)
    );
  }, [attendees, searchQuery]);

  // Auth Loading state
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8 text-center text-muted">
        <p>Loading volunteer portal...</p>
      </div>
    );
  }

  // Not authenticated -> show login
  if (!volunteerSession) {
    return <VolunteerLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const presentCount = attendees.filter((a) => a.is_present).length;
  const capacity = sessionInfo?.capacity || 100;
  const occupancyPct = Math.round((presentCount / capacity) * 100);
  const isLockedToSingleTheatre = volunteerSession.assignedTheatreId !== "all";

  return (
    <div className="min-h-screen bg-cream px-4 pt-28 pb-16 md:px-8 md:pt-36 md:pb-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule/50 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-teal-base/10 px-3 py-1 text-micro font-bold text-teal-base uppercase tracking-wider">
                On-Site Portal
              </span>
              <span className="text-micro font-medium text-muted">
                Staff: <strong>{volunteerSession.name}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="text-micro font-semibold text-orange-deep hover:underline"
              >
                Sign Out
              </button>
            </div>
            <h1 className="mt-2 font-display text-h2 text-ink">
              Volunteer Theatre Attendance
            </h1>
            <p className="text-small text-muted">
              {isLockedToSingleTheatre
                ? `Authorized for ${THEATRES.find((t) => t.id === volunteerSession.assignedTheatreId)?.name || "Assigned Theatre"}`
                : "Summit Lead · All Theatres Access"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="rounded-full bg-teal-dark border border-cyan-bright/40 px-6 py-2.5 text-small font-semibold text-cyan-bright hover:bg-teal-base transition-all shadow-md flex items-center gap-2"
            >
              <span>📷 Scan Attendee QR</span>
            </button>
            <button
              onClick={() => setIsWalkInOpen(true)}
              className="rounded-full bg-accent px-6 py-2.5 text-small font-semibold text-white hover:bg-orange-deep transition-all shadow-md flex items-center gap-2"
            >
              <span>+ Add Walk-In</span>
            </button>
          </div>
        </div>

        {/* Theatre & Slot Selector Tabs */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Theatre Pick */}
          <div className="border border-rule bg-white p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-micro font-bold uppercase tracking-wider text-muted">
                Assigned Theatre
              </p>
              {isLockedToSingleTheatre && (
                <span className="text-micro font-bold text-teal-base">🔒 Locked</span>
              )}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {THEATRES.map((t) => {
                const isAssigned =
                  !isLockedToSingleTheatre || volunteerSession.assignedTheatreId === t.id;
                const isSelected = selectedTheatre === t.id;

                return (
                  <button
                    key={t.id}
                    disabled={!isAssigned}
                    onClick={() => setSelectedTheatre(t.id)}
                    className={`px-3 py-2 text-micro font-semibold transition-all ${
                      isSelected
                        ? "bg-teal-dark text-cyan-bright shadow-inner"
                        : isAssigned
                        ? "bg-surface-sunk text-ink hover:bg-rule/20"
                        : "bg-surface-sunk/40 text-muted/40 cursor-not-allowed"
                    }`}
                  >
                    {t.name.replace("Sakura · ", "")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slot Pick */}
          <div className="border border-rule bg-white p-4 shadow-sm">
            <p className="text-micro font-bold uppercase tracking-wider text-muted">
              Select Time Slot
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {SLOTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSlot(s.id)}
                  className={`px-3 py-2 text-micro font-semibold transition-all ${
                    selectedSlot === s.id
                      ? "bg-teal-dark text-cyan-bright shadow-inner"
                      : "bg-surface-sunk text-ink hover:bg-rule/20"
                  }`}
                >
                  {s.time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Headcount Stats Bar */}
        <div className="mt-6 border border-teal-mid/30 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center">
            <div className="border-r border-rule/30">
              <p className="text-micro uppercase text-muted font-bold">Room Capacity</p>
              <p className="font-display text-h3 text-ink mt-1">{capacity}</p>
            </div>
            <div className="border-r border-rule/30">
              <p className="text-micro uppercase text-muted font-bold">Registered</p>
              <p className="font-display text-h3 text-teal-base mt-1">{attendees.length}</p>
            </div>
            <div className="border-r border-rule/30">
              <p className="text-micro uppercase text-muted font-bold">Checked In (Present)</p>
              <p className="font-display text-h3 text-accent mt-1">{presentCount}</p>
            </div>
            <div>
              <p className="text-micro uppercase text-muted font-bold">Occupancy</p>
              <p className="font-display text-h3 text-ink mt-1">{occupancyPct}%</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-surface-sunk">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                occupancyPct >= 100 ? "bg-orange-deep" : occupancyPct >= 80 ? "bg-orange-bright" : "bg-teal-mid"
              }`}
              style={{ width: `${Math.min(100, occupancyPct)}%` }}
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by attendee name, email, or Registration ID (e.g. REG-123456)..."
              className="w-full border border-rule bg-white px-5 py-3.5 pl-12 text-body text-ink placeholder:text-muted/60 shadow-sm focus:border-accent focus:outline-none"
            />
            <span className="absolute left-4 top-4 text-muted">
              <Icon name="search" size={18} />
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-3.5 text-micro font-bold text-muted hover:text-ink"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Attendee Checklist Table */}
        <div className="mt-6 border border-rule bg-white shadow-sm overflow-hidden">
          <div className="border-b border-rule bg-surface-sunk px-6 py-4 flex items-center justify-between">
            <h2 className="font-display text-h3 text-ink">
              Attendee Checklist ({filteredAttendees.length})
            </h2>
            <span className="text-micro text-muted">
              Tap checkbox or scan QR code to check in
            </span>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-muted">
              <p>Loading attendance roster...</p>
            </div>
          ) : filteredAttendees.length === 0 ? (
            <div className="py-16 text-center text-muted">
              <p>No attendees found matching your filter.</p>
            </div>
          ) : (
            <ul className="divide-y divide-rule/30">
              {filteredAttendees.map((item) => (
                <li
                  key={item.registration_id}
                  className={`flex items-center justify-between p-4 sm:px-6 transition-colors ${
                    item.is_present ? "bg-panel-teal/40" : "hover:bg-surface-sunk/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleToggleAttendance(item)}
                      disabled={isUpdating === item.registration_id}
                      className={`flex h-8 w-8 items-center justify-center border-2 transition-all ${
                        item.is_present
                          ? "border-teal-base bg-teal-base text-white shadow-sm"
                          : "border-rule bg-white text-transparent hover:border-teal-mid"
                      }`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink text-body">
                          {item.attendee_name}
                        </span>
                        {item.is_walk_in && (
                          <span className="rounded-full bg-panel-orange px-2 py-0.5 text-micro font-bold text-orange-deep uppercase">
                            Walk-In
                          </span>
                        )}
                      </div>
                      <p className="text-micro text-muted font-mono">{item.attendee_email}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-micro font-bold text-teal-base uppercase">
                      {item.registration_id}
                    </span>
                    <p className="text-micro text-muted">
                      {item.is_present ? "✓ Present" : "Pending"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Walk-in Modal */}
        {isWalkInOpen && (
          <div className="fixed inset-0 z-150 flex items-center justify-center p-4 bg-teal-dark/80 backdrop-blur-md">
            <div className="w-full max-w-md border border-rule-light bg-cream p-6 shadow-2xl">
              <h3 className="font-display text-h3 text-ink">Add Walk-In Attendee</h3>
              <p className="text-small text-muted mt-1">
                Record an on-site attendee who arrived at {sessionInfo?.theatre_name || "Theatre"}.
              </p>

              <form onSubmit={handleAddWalkIn} className="mt-4 space-y-3">
                <div>
                  <label className="block text-micro font-bold uppercase text-muted">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    placeholder="e.g. John Smith"
                    className="mt-1 w-full border border-rule bg-white px-4 py-2.5 text-body text-ink focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-micro font-bold uppercase text-muted">
                    Work Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={walkInEmail}
                    onChange={(e) => setWalkInEmail(e.target.value)}
                    placeholder="john@botconsulting.io"
                    className="mt-1 w-full border border-rule bg-white px-4 py-2.5 text-body text-ink focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsWalkInOpen(false)}
                    className="rounded-full px-5 py-2 text-small font-medium text-muted hover:text-ink"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-accent px-6 py-2 text-small font-semibold text-white hover:bg-orange-deep"
                  >
                    Mark Present &rarr;
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* QR Scanner Modal */}
        <QrScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          currentSessionId={currentSessionId}
          onScanSuccess={() => {
            fetchSheet();
          }}
        />
      </div>
    </div>
  );
}
