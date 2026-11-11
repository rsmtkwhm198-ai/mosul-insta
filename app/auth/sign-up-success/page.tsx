import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";

export default function SignUpSuccessPage() {
  return (
    <AuthShell
      title="تحقق من بريدك الإلكتروني"
      description="أرسلنا لك رابط تأكيد. افتحه لتفعيل حسابك ثم سجّل الدخول."
    >
      <Link
        href="/auth/login"
        className="flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        الذهاب لتسجيل الدخول
      </Link>
    </AuthShell>
  );
}
