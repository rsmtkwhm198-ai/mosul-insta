import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Camera, Heart, MessageCircle } from "lucide-react";
import { FollowButton } from "@/components/follow-button";
import { UserAvatar } from "@/components/user-avatar";
import { getProfilePage, requireViewer } from "@/lib/queries";
import { formatCount } from "@/lib/utils";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { user } = await requireViewer();
  const data = await getProfilePage(user.id, decodeURIComponent(username).toLowerCase());
  if (!data) notFound();

  const { profile, posts, followerCount, followingCount, isFollowing } = data;
  const isMe = profile.id === user.id;

  const stats = [
    { label: "منشور", value: posts.length },
    { label: "متابِع", value: followerCount },
    { label: "يتابع", value: followingCount },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      <header className="flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-center sm:gap-10">
        <UserAvatar
          src={profile.avatar_url}
          name={profile.username}
          size={112}
          className="self-center sm:self-auto"
        />
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold" dir="ltr">
              {profile.username}
            </h1>
            {isMe ? (
              <Link
                href="/settings"
                className="rounded-lg border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted"
              >
                تعديل الملف الشخصي
              </Link>
            ) : (
              <FollowButton targetId={profile.id} username={profile.username} isFollowing={isFollowing} />
            )}
          </div>
          <dl className="flex gap-8">
            {stats.map((s) => (
              <div key={s.label} className="flex gap-1.5">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-sm">
                  <span className="font-bold">{formatCount(s.value)}</span>{" "}
                  <span className="text-muted-foreground">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          {(profile.full_name || profile.bio) && (
            <div className="flex flex-col gap-1">
              {profile.full_name && <p className="text-sm font-semibold">{profile.full_name}</p>}
              {profile.bio && (
                <p className="whitespace-pre-line text-sm leading-relaxed">{profile.bio}</p>
              )}
            </div>
          )}
        </div>
      </header>

      <h2 className="sr-only">المنشورات</h2>
      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex size-16 items-center justify-center rounded-full border-2 border-foreground">
            <Camera className="size-7" aria-hidden="true" />
          </span>
          <p className="text-lg font-bold">لا توجد منشورات</p>
          {isMe && (
            <Link href="/new" className="text-sm font-semibold text-primary hover:underline">
              شارك صورتك الأولى
            </Link>
          )}
        </div>
      ) : (
        <ul className="mt-1 grid grid-cols-3 gap-1">
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={`/p/${p.id}`} className="group relative block aspect-square bg-muted">
                <Image
                  src={p.image_url}
                  alt={p.caption ? p.caption.slice(0, 100) : `منشور من ${profile.username}`}
                  fill
                  sizes="(max-width: 768px) 33vw, 300px"
                  className="object-cover"
                />
                <span className="absolute inset-0 hidden items-center justify-center gap-5 bg-foreground/40 text-sm font-bold text-white group-hover:flex group-focus-visible:flex">
                  <span className="flex items-center gap-1.5">
                    <Heart className="size-5 fill-white" aria-hidden="true" />
                    {formatCount(p.likeCount)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="size-5 fill-white" aria-hidden="true" />
                    {formatCount(p.commentCount)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
