"use client";

import { useFormStatus } from "react-dom";

export function SyncSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="button-primary disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Syncing GitHub Challenges..." : "Run Sync Now"}
    </button>
  );
}
