import type { SubmissionStatus } from "@/types/domain";

export type SubmissionIntent = "draft" | "submit";

export function resolveNextSubmissionStatus(
  currentStatus: SubmissionStatus | undefined,
  intent: SubmissionIntent,
): SubmissionStatus {
  if (
    currentStatus === "under_review" ||
    currentStatus === "accepted" ||
    currentStatus === "rejected"
  ) {
    return currentStatus;
  }

  if (intent === "submit" || currentStatus === "submitted") {
    return "submitted";
  }

  return "draft";
}

