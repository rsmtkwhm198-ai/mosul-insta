"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth-shell";
import { Button, FormError, Input, Label } from "@/components/ui";

function loginErrorMessage(error: unknown): string {
  const { code, status } = (error ?? {}) as { code?: string; status?: number };
  if (code === "email_not_confirmed") return "يرجى تأكيد بريدك الإلكتروني أولاً — تحقق من صندوق الوارد.";
  if (code === "over_request_rate_limit" || status === 429) return "محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً.";
  if (code === "invalid_credentials") return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  return "حدث خطأ غير متوقع. حاول مجدداً.";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) {
      setError(loginErrorMessage(error));
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <AuthShell
      title="تسجيل الدخول"
      description="مرحباً بعودتك، سجّل الدخول لمشاهدة آخر الصور"
      footer={
        <>
          ليس لديك حساب؟{" "}
          <Link href="/auth/sign-up" className="font-semibold text-primary hover:underline">
            إنشاء حساب
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            dir="ltr"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <FormError message={error} />
        <Button type="submit" disabled={loading} className="h-11">
          {loading ? "جارٍ الدخول..." : "دخول"}
        </Button>
      </form>
    </AuthShell>
  );
}
