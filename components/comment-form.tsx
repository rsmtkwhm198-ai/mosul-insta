"use client";

import { useRef, useState, useTransition } from "react";
import { addComment } from "@/app/actions";
import { FormError } from "@/components/ui";

export function CommentForm({ postId }: { postId: string }) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    startTransition(async () => {
      const result = await addComment(postId, body);
      if (result.error) {
        setError(result.error);
        return;
      }
      setError(null);
      setBody("");
      inputRef.current?.focus();
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-1 border-t px-4 py-3">
      <div className="flex items-center gap-2">
        <label htmlFor="comment" className="sr-only">
          أضف تعليقاً
        </label>
        <input
          ref={inputRef}
          id="comment"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={500}
          placeholder="أضف تعليقاً..."
          className="h-10 flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none"
        />
        <button
          type="submit"
          disabled={pending || !body.trim()}
          className="text-sm font-semibold text-primary disabled:opacity-40"
        >
          {pending ? "جارٍ النشر..." : "نشر"}
        </button>
      </div>
      <FormError message={error} />
    </form>
  );
}
