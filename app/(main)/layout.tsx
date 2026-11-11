import { AppNav } from "@/components/app-nav";
import { requireViewer } from "@/lib/queries";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireViewer();

  return (
    <div className="min-h-svh">
      <AppNav profile={profile} />
      <main className="pb-20 md:mr-64 md:pb-10">{children}</main>
    </div>
  );
}
