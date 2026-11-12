import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">الصفحة غير موجودة</h1>
      <p className="text-sm text-muted-foreground">ربما تم حذف هذا المحتوى أو أن الرابط غير صحيح.</p>
      <Link href="/" className="text-sm font-semibold text-primary hover:underline">
        العودة للرئيسية
      </Link>
    </main>
  );
}
