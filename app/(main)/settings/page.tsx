import { LogOut } from "lucide-react";
import { signOut } from "@/app/actions";
import { ProfileSettingsForm } from "@/components/profile-settings-form";
import { requireViewer } from "@/lib/queries";

export default async function SettingsPage() {
  const { profile } = await requireViewer();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-bold">تعديل الملف الشخصي</h1>
      <ProfileSettingsForm profile={profile} />
      <form action={signOut} className="md:hidden">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg border bg-card py-3 text-sm font-semibold text-destructive hover:bg-muted"
        >
          <LogOut className="size-4" aria-hidden="true" />
          تسجيل الخروج
        </button>
      </form>
    </div>
  );
}
