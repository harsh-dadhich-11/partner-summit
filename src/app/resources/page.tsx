import { redirect } from "next/navigation";

/**
 * Keeps previously shared /resources links useful after the report was retired.
 * Individual session-summary downloads remain available from /insights.
 */
export default function ResourcesPage() {
  redirect("/insights");
}
