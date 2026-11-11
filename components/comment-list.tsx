import Link from "next/link";
import { Trash2 } from "lucide-react";
import { deleteComment } from "@/app/actions";
import { UserAvatar } from "@/components/user-avatar";
import { timeAgo } from "@/lib/utils";
import type { PostComment } from "@/lib/types";

type Props = {
  comments: PostComment[];
  postId: string;
  viewerId: string;
  postOwnerId: string;
};

export function CommentList({ comments, postId, viewerId, postOwnerId }: Props) {
  if (comments.length === 0) {
    return <p className="px-4 py-6 text-center text-sm text-muted-foreground">لا توجد تعليقات بعد.</p>;
  }

  return (
    <ul className="flex flex-col gap-4 px-4 py-4">
      {comments.map((c) => {
        const canDelete = c.user_id === viewerId || postOwnerId === viewerId;
        return (
          <li key={c.id} className="flex gap-3">
            <Link href={`/u/${c.author.username}`}>
              <UserAvatar src={c.author.avatar_url} name={c.author.username} size={32} />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-sm leading-relaxed">
                <Link href={`/u/${c.author.username}`} className="ml-1 font-semibold">
                  {c.author.username}
                </Link>
                <span className="break-words">{c.body}</span>
              </p>
              <span className="text-xs text-muted-foreground">{timeAgo(c.created_at)}</span>
            </div>
            {canDelete && (
              <form action={deleteComment.bind(null, c.id, postId)}>
                <button
                  type="submit"
                  aria-label="حذف التعليق"
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </form>
            )}
          </li>
        );
      })}
    </ul>
  );
}
