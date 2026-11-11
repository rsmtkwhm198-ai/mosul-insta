"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleLike } from "@/app/actions";
import { cn, formatCount } from "@/lib/utils";

type Props = { postId: string; liked: boolean; count: number };

export function LikeButton({ postId, liked, count }: Props) {
  const [, startTransition] = useTransition();
  const [state, setState] = useOptimistic({ liked, count });

  const onClick = () => {
    const next = !state.liked;
    startTransition(async () => {
      setState({ liked: next, count: state.count + (next ? 1 : -1) });
      await toggleLike(postId, next);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={state.liked}
        aria-label={state.liked ? "إلغاء الإعجاب" : "إعجاب"}
        className="rounded-full p-1.5 transition-transform hover:bg-muted active:scale-90"
      >
        <Heart
          aria-hidden="true"
          className={cn("size-6", state.liked ? "fill-primary text-primary" : "text-foreground")}
        />
      </button>
      <span className="text-sm font-semibold">
        {formatCount(state.count)} <span className="font-normal text-muted-foreground">إعجاب</span>
      </span>
    </div>
  );
}
