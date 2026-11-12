import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2 text-xl font-bold tracking-tight", className)}
    >
      <span
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-lg bg-primary text-base text-primary-foreground"
      >
        م
      </span>
      <span>
        موصل <span className="text-primary">إنستا</span>
      </span>
    </Link>
  );
}
