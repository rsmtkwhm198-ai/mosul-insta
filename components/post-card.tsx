import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { LikeButton } from "@/components/like-button";
import { UserAvatar } from "@/components/user-avatar";
import { formatCount, timeAgo } from "@/lib/utils";
import type { FeedPost } from "@/lib/types";

export function PostCard({ post, priority = false }: { post: FeedPost; priority?: boolean }) {
  const authorHref = `/u/${post.author.username}`;

  return (
    <article className="overflow-hidden border-y bg-card sm:rounded-xl sm:border">
      <header className="flex items-center gap-3 px-4 py-3">
        <Link href={authorHref}>
          <UserAvatar src={post.author.avatar_url} name={post.author.username} />
        </Link>
        <div className="flex min-w-0 flex-col">
          <Link href={authorHref} className="truncate text-sm font-semibold hover:underline">
            {post.author.full_name || post.author.username}
          </Link>
          <span className="text-xs text-muted-foreground">
            <span dir="ltr">@{post.author.username}</span> · {timeAgo(post.created_at)}
          </span>
        </div>
      </header>

      <Link href={`/p/${post.id}`} className="relative block aspect-square bg-muted">
        <Image
          src={post.image_url}
          alt={post.caption ? `صورة: ${post.caption.slice(0, 100)}` : `منشور من ${post.author.username}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, 560px"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-col gap-2 px-4 py-3">
        <div className="flex items-center gap-4">
          <LikeButton postId={post.id} liked={post.liked} count={post.likeCount} />
          <Link
            href={`/p/${post.id}`}
            className="flex items-center gap-2 rounded-full p-1.5 text-sm hover:bg-muted"
          >
            <MessageCircle className="size-6" aria-hidden="true" />
            <span className="font-semibold">{formatCount(post.commentCount)}</span>
            <span className="sr-only">تعليقات</span>
          </Link>
        </div>
        {post.caption && (
          <p className="whitespace-pre-line text-sm leading-relaxed">
            <Link href={authorHref} className="ml-1 font-semibold">
              {post.author.username}
            </Link>
            {post.caption}
          </p>
        )}
      </div>
    </article>
  );
}
