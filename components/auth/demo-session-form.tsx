import { signInDemoUserAction, signOutAction } from "@/lib/auth/actions";

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

  return (
    <form action={action}>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <button type="submit" className={className}>
        {buttonLabel}
      </button>
    </form>
  );
}
