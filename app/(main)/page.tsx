import Link from "next/link";
import { Camera } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { getFeed, requireViewer } from "@/lib/queries";

export default async function FeedPage() {
  const { user } = await requireViewer();
  const posts = await getFeed(user.id);

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 py-6 sm:px-4">
      <h1 className="sr-only">آخر المنشورات</h1>
      {posts.length === 0 ? (
        <div className="mx-4 flex flex-col items-center gap-4 rounded-xl border border-dashed bg-card px-6 py-16 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-muted text-primary">
            <Camera className="size-8" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold">لا توجد منشورات بعد</h2>
            <p className="text-sm text-muted-foreground">كن أول من يشارك صورة من الموصل.</p>
          </div>
          <Link
            href="/new"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            شارك أول صورة
          </Link>
        </div>
      ) : (
        posts.map((post, i) => <PostCard key={post.id} post={post} priority={i === 0} />)
      )}
    </div>
  );
}
