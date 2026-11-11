"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth-shell";
import { Button, FormError, Input, Label } from "@/components/ui";
import { USERNAME_PATTERN } from "@/lib/utils";

function signUpErrorMessage(error: unknown): string {
  const { code, status } = (error ?? {}) as { code?: string; status?: number };
  if (code === "weak_password") return "اختر كلمة مرور أقوى (6 أحرف على الأقل).";
  if (code === "email_address_invalid") return "استخدم بريداً إلكترونياً حقيقياً.";
  if (code === "email_address_not_authorized") return "لا يمكن إرسال رسالة التأكيد إلى هذا البريد. جرّب بريداً آخر.";
  if (code === "validation_failed") return "تحقق من البيانات المدخلة.";
  if (code === "over_email_send_rate_limit" || status === 429) return "محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً.";
  return "تعذر إنشاء الحساب. حاول مجدداً.";
}

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", username: "", fullName: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = form.username.trim().toLowerCase();
    if (!USERNAME_PATTERN.test(username)) {
      setError("اسم المستخدم: 3 إلى 30 حرفاً إنجليزياً صغيراً أو أرقام أو _ أو .");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await createClient().auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
        data: { username, full_name: form.fullName.trim() },
      },
    });
    if (error) {
      setError(signUpErrorMessage(error));
      setLoading(false);
      return;
    }
    router.push("/auth/sign-up-success");
  };

  return (
    <AuthShell
      title="إنشاء حساب"
      description="انضم وشارك صور مدينتك مع أصدقائك"
      footer={
        <>
          لديك حساب بالفعل؟{" "}
          <Link href="/auth/login" className="font-semibold text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" dir="ltr" autoComplete="email" required value={form.email} onChange={update("email")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="full-name">الاسم الكامل</Label>
          <Input id="full-name" maxLength={60} autoComplete="name" value={form.fullName} onChange={update("fullName")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="username">اسم المستخدم</Label>
          <Input
            id="username"
            dir="ltr"
            autoCapitalize="none"
            autoComplete="username"
            placeholder="mosul_lens"
            required
            value={form.username}
            onChange={update("username")}
            aria-describedby="username-hint"
          />
          <span id="username-hint" className="text-xs text-muted-foreground">
            أحرف إنجليزية صغيرة وأرقام و _ و . فقط
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            minLength={6}
            required
            value={form.password}
            onChange={update("password")}
          />
        </div>
        <FormError message={error} />
        <Button type="submit" disabled={loading} className="h-11">
          {loading ? "جارٍ إنشاء الحساب..." : "إنشاء حساب"}
        </Button>
      </form>
    </AuthShell>
  );
}
