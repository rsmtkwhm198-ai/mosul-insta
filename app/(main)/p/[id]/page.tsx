import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentForm } from "@/components/comment-form";
import { CommentList } from "@/components/comment-list";
import { DeletePostButton } from "@/components/delete-post-button";
import { LikeButton } from "@/components/like-button";
import { UserAvatar } from "@/components/user-avatar";
import { getPost, requireViewer } from "@/lib/queries";
import { timeAgo } from "@/lib/utils";

const UUID = /^[0-9a-f-]{36}$/i;

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const { user } = await requireViewer();
  const data = await getPost(user.id, id);
  if (!data) notFound();
  const { post, comments } = data;
  const authorHref = `/u/${post.author.username}`;

  return (
    <div className="mx-auto max-w-5xl py-0 sm:px-4 sm:py-6">
      <article className="flex flex-col overflow-hidden bg-card sm:rounded-xl sm:border md:flex-row">
        <div className="relative aspect-square w-full bg-muted md:w-3/5">
          <Image
            src={post.image_url}
            alt={post.caption ? `صورة: ${post.caption.slice(0, 100)}` : `منشور من ${post.author.username}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col md:w-2/5 md:border-r">
          <header className="flex items-center gap-3 border-b px-4 py-3">
            <Link href={authorHref}>
              <UserAvatar src={post.author.avatar_url} name={post.author.username} />
            </Link>
            <div className="flex min-w-0 flex-col">
              <Link href={authorHref} className="truncate text-sm font-semibold hover:underline">
                {post.author.full_name || post.author.username}
              </Link>
              <span className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</span>
            </div>
            {post.user_id === user.id && <DeletePostButton postId={post.id} />}
          </header>

          {post.caption && (
            <p className="whitespace-pre-line border-b px-4 py-3 text-sm leading-relaxed">
              <Link href={authorHref} className="ml-1 font-semibold">
                {post.author.username}
              </Link>
              {post.caption}
            </p>
          )}

          <h2 className="sr-only">التعليقات</h2>
          <div className="flex-1 md:max-h-[420px] md:overflow-y-auto">
            <CommentList
              comments={comments}
              postId={post.id}
              viewerId={user.id}
              postOwnerId={post.user_id}
            />
          </div>

          <div className="border-t px-4 py-2">
            <LikeButton postId={post.id} liked={post.liked} count={post.likeCount} />
          </div>
          <CommentForm postId={post.id} />
        </div>
      </article>
    </div>
  );
}
