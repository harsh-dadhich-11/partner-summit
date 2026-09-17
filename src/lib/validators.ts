import { z } from "zod";

// Strict validation pattern for @botconsulting.io emails
export const BOTCONSULTING_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@botconsulting\.io$/i;

export const registerBreakoutSchema = z
  .object({
    registrationId: z
      .string()
      .trim()
      .optional()
      .transform((val) => val || `REG-${Math.floor(100000 + Math.random() * 900000)}`),
    attendeeName: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long"),
    attendeeEmail: z
      .string()
      .trim()
      .email("Invalid email address format")
      .refine((email) => BOTCONSULTING_EMAIL_REGEX.test(email), {
        message: "Only @botconsulting.io email addresses are permitted to register.",
      }),
    slot1SessionId: z.string().min(1, "Slot 1 session selection is required"),
    slot2SessionId: z.string().min(1, "Slot 2 session selection is required"),
    slot3SessionId: z.string().min(1, "Slot 3 session selection is required"),
  })
  .refine(
    (data) => {
      // Ensure all 3 selections are distinct
      const uniqueSessions = new Set([data.slot1SessionId, data.slot2SessionId, data.slot3SessionId]);
      return uniqueSessions.size === 3;
    },
    {
      message: "You must select three distinct sessions across the three time slots.",
      path: ["slot1SessionId"],
    }
  );

export const updateCapacitySchema = z.object({
  newCapacity: z
    .number()
    .int("Capacity must be an integer")
    .nonnegative("Capacity cannot be negative"),
});

export const markAttendanceSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  registrationId: z.string().min(1, "Registration ID is required"),
  isPresent: z.boolean(),
  isWalkIn: z.boolean().optional().default(false),
  volunteerId: z.string().optional().default("volunteer"),
  notes: z.string().optional(),
});
