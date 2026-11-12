import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";

export default function AuthErrorPage() {
  return (
    <AuthShell title="حدث خطأ" description="تعذر إكمال عملية المصادقة. قد يكون الرابط منتهي الصلاحية.">
      <Link
        href="/auth/login"
        className="flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        العودة لتسجيل الدخول
      </Link>
    </AuthShell>
  );
}
