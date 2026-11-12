"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deletePost } from "@/app/actions";

export function DeletePostButton({ postId }: { postId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("هل تريد حذف هذا المنشور نهائياً؟")) return;
        startTransition(() => deletePost(postId));
      }}
      className="mr-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-destructive disabled:opacity-50"
    >
      <Trash2 className="size-4" aria-hidden="true" />
      {pending ? "جارٍ الحذف..." : "حذف"}
    </button>
  );
}
