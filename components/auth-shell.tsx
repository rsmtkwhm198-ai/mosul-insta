import { Logo } from "@/components/logo";

type Props = { title: string; description: string; children: React.ReactNode; footer?: React.ReactNode };

export function AuthShell({ title, description, children, footer }: Props) {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="flex flex-col gap-6 rounded-2xl border bg-card p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <Logo className="text-2xl" />
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          {children}
        </div>
        {footer && (
          <div className="rounded-2xl border bg-card px-8 py-5 text-center text-sm">{footer}</div>
        )}
      </div>
    </main>
  );
}
