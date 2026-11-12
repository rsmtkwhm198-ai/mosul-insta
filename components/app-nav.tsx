"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogOut, PlusSquare, Settings } from "lucide-react";
import { signOut } from "@/app/actions";
import { Logo } from "@/components/logo";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export function AppNav({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const profileHref = `/u/${profile.username}`;

  const items = [
    { href: "/", label: "الرئيسية", icon: <Home className="size-6" aria-hidden="true" /> },
    { href: "/new", label: "منشور جديد", icon: <PlusSquare className="size-6" aria-hidden="true" /> },
    {
      href: profileHref,
      label: "ملفي الشخصي",
      icon: <UserAvatar src={profile.avatar_url} name={profile.username} size={26} />,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:hidden">
        <Logo />
        <Link
          href="/settings"
          aria-label="الإعدادات"
          className="rounded-lg p-2 hover:bg-muted"
        >
          <Settings className="size-5" aria-hidden="true" />
        </Link>
      </header>

      <aside className="fixed inset-y-0 right-0 z-30 hidden w-64 flex-col border-l bg-card px-4 py-6 md:flex">
        <Logo className="px-3" />
        <nav aria-label="التنقل الرئيسي" className="mt-10 flex flex-1 flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-base hover:bg-muted",
                pathname === item.href && "font-bold",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <Link
            href="/settings"
            aria-current={pathname === "/settings" ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-3 text-base hover:bg-muted",
              pathname === "/settings" && "font-bold",
            )}
          >
            <Settings className="size-6" aria-hidden="true" />
            الإعدادات
          </Link>
        </nav>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-base text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-6" aria-hidden="true" />
            تسجيل الخروج
          </button>
        </form>
      </aside>

      <nav
        aria-label="التنقل الرئيسي"
        className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-around border-t bg-card md:hidden"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={pathname === item.href ? "page" : undefined}
            className={cn(
              "flex size-11 items-center justify-center rounded-lg",
              pathname === item.href ? "text-primary" : "text-foreground",
            )}
          >
            {item.icon}
          </Link>
        ))}
      </nav>
    </>
  );
}
