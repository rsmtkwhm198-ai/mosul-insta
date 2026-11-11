"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function getUserOrThrow() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("غير مسجل الدخول");
  return { supabase, user };
}

export async function toggleLike(postId: string, like: boolean) {
  const { supabase, user } = await getUserOrThrow();
  const { error } = like
    ? await supabase.from("likes").upsert({ post_id: postId, user_id: user.id })
    : await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user.id);
  if (error) throw new Error("تعذر تحديث الإعجاب");
}

export async function addComment(postId: string, body: string) {
  const text = body.trim();
  if (text.length < 1 || text.length > 500) return { error: "يجب أن يكون التعليق بين 1 و500 حرف" };
  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase
    .from("comments")
    .insert({ post_id: postId, user_id: user.id, body: text });
  if (error) return { error: "تعذر إضافة التعليق" };
  revalidatePath(`/p/${postId}`);
  return { error: null };
}

export async function deleteComment(commentId: string, postId: string) {
  const { supabase } = await getUserOrThrow();
  await supabase.from("comments").delete().eq("id", commentId);
  revalidatePath(`/p/${postId}`);
}

export async function deletePost(postId: string) {
  const { supabase, user } = await getUserOrThrow();
  const { data: post } = await supabase
    .from("posts")
    .select("image_url")
    .eq("id", postId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!post) return;

  await supabase.from("posts").delete().eq("id", postId).eq("user_id", user.id);
  const marker = "/storage/v1/object/public/media/";
  const idx = post.image_url.indexOf(marker);
  if (idx !== -1) {
    await supabase.storage.from("media").remove([post.image_url.slice(idx + marker.length)]);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();
  revalidatePath("/");
  redirect(profile ? `/u/${profile.username}` : "/");
}

export async function toggleFollow(targetId: string, follow: boolean, username: string) {
  const { supabase, user } = await getUserOrThrow();
  if (targetId === user.id) return;
  if (follow) {
    await supabase.from("follows").upsert({ follower_id: user.id, following_id: targetId });
  } else {
    await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", targetId);
  }
  revalidatePath(`/u/${username}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
