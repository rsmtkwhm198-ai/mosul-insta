import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Author, FeedPost, PostComment, Profile } from "@/lib/types";

const POST_SELECT =
  "id, caption, image_url, created_at, user_id, author:profiles(id, username, full_name, avatar_url), likes(count), comments(count)";

type RawPost = {
  id: string;
  caption: string | null;
  image_url: string;
  created_at: string;
  user_id: string;
  author: Author;
  likes: { count: number }[];
  comments: { count: number }[];
};

export async function requireViewer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name, bio, avatar_url")
    .eq("id", user.id)
    .single<Profile>();
  if (!profile) redirect("/auth/error");

  return { supabase, user, profile };
}

async function withLikes(
  supabase: Awaited<ReturnType<typeof createClient>>,
  viewerId: string,
  rows: RawPost[],
): Promise<FeedPost[]> {
  const ids = rows.map((r) => r.id);
  const likedIds = new Set<string>();
  if (ids.length > 0) {
    const { data } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", viewerId)
      .in("post_id", ids);
    data?.forEach((l) => likedIds.add(l.post_id));
  }
  return rows.map(({ likes, comments, ...post }) => ({
    ...post,
    likeCount: likes[0]?.count ?? 0,
    commentCount: comments[0]?.count ?? 0,
    liked: likedIds.has(post.id),
  }));
}

export async function getFeed(viewerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .order("created_at", { ascending: false })
    .limit(40)
    .returns<RawPost[]>();
  if (error) throw error;
  return withLikes(supabase, viewerId, data ?? []);
}

export async function getPost(viewerId: string, postId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("id", postId)
    .maybeSingle<RawPost>();
  if (!data) return null;
  const [post] = await withLikes(supabase, viewerId, [data]);

  const { data: comments } = await supabase
    .from("comments")
    .select("id, body, created_at, user_id, author:profiles(id, username, full_name, avatar_url)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .returns<PostComment[]>();

  return { post, comments: comments ?? [] };
}

export async function getProfilePage(viewerId: string, username: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name, bio, avatar_url")
    .eq("username", username)
    .maybeSingle<Profile>();
  if (!profile) return null;

  const [posts, followers, following, isFollowing] = await Promise.all([
    supabase
      .from("posts")
      .select("id, image_url, caption, likes(count), comments(count)")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("follows")
      .select("follower_id", { count: "exact", head: true })
      .eq("following_id", profile.id),
    supabase
      .from("follows")
      .select("following_id", { count: "exact", head: true })
      .eq("follower_id", profile.id),
    supabase
      .from("follows")
      .select("follower_id")
      .eq("follower_id", viewerId)
      .eq("following_id", profile.id)
      .maybeSingle(),
  ]);

  type GridPost = {
    id: string;
    image_url: string;
    caption: string | null;
    likes: { count: number }[];
    comments: { count: number }[];
  };

  return {
    profile,
    posts: ((posts.data ?? []) as GridPost[]).map((p) => ({
      id: p.id,
      image_url: p.image_url,
      caption: p.caption,
      likeCount: p.likes[0]?.count ?? 0,
      commentCount: p.comments[0]?.count ?? 0,
    })),
    followerCount: followers.count ?? 0,
    followingCount: following.count ?? 0,
    isFollowing: Boolean(isFollowing.data),
  };
}
