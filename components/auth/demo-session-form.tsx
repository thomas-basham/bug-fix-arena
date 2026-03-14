import { signInDemoUserAction, signOutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

type DemoSessionFormProps = {
  mode: "sign-in" | "sign-out";
  redirectTo: string;
  className?: string;
  label?: string;
};

export function DemoSessionForm({
  mode,
  redirectTo,
  className,
  label,
}: DemoSessionFormProps) {
  const action = mode === "sign-in" ? signInDemoUserAction : signOutAction;
  const buttonLabel =
    label ?? (mode === "sign-in" ? "Sign In As Demo User" : "Sign Out");
  const fallbackClassName =
    mode === "sign-in"
      ? "inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_-20px_rgba(15,118,110,0.65)] transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
      : "inline-flex items-center justify-center rounded-full border border-line bg-white/90 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10";

  return (
    <form action={action}>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <button
        type="submit"
        className={cn(
          "appearance-none cursor-pointer",
          className ?? fallbackClassName,
        )}
      >
        {buttonLabel}
      </button>
    </form>
  );
}
