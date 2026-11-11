"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, FormError, Input, Label, Textarea } from "@/components/ui";
import { UserAvatar } from "@/components/user-avatar";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, USERNAME_PATTERN } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export function ProfileSettingsForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [username, setUsername] = useState(profile.username);
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_BYTES) {
      setError("اختر صورة JPG أو PNG أو WebP بحجم أقل من 8 ميغابايت");
      return;
    }
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${profile.id}/avatar-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, file, { contentType: file.type });
    setUploading(false);
    if (uploadError) {
      setError("تعذر رفع الصورة الشخصية");
      return;
    }
    setAvatarUrl(supabase.storage.from("media").getPublicUrl(path).data.publicUrl);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = username.trim().toLowerCase();
    if (!USERNAME_PATTERN.test(normalized)) {
      setError("اسم المستخدم: 3 إلى 30 حرفاً إنجليزياً صغيراً أو أرقام أو _ أو .");
      return;
    }
    setLoading(true);
    setError(null);
    setSaved(false);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: normalized,
        full_name: fullName.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl,
      })
      .eq("id", profile.id);
    setLoading(false);

    if (updateError) {
      setError(updateError.code === "23505" ? "اسم المستخدم مستخدم بالفعل" : "تعذر حفظ التغييرات");
      return;
    }
    setUsername(normalized);
    setSaved(true);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6 rounded-xl border bg-card p-6">
      <div className="flex items-center gap-4">
        <UserAvatar src={avatarUrl} name={username || profile.username} size={72} />
        <div className="flex flex-col gap-1">
          <span className="font-semibold" dir="ltr">
            {profile.username}
          </span>
          <label
            htmlFor="avatar"
            className="cursor-pointer text-sm font-semibold text-primary hover:underline focus-within:underline"
          >
            {uploading ? "جارٍ الرفع..." : "تغيير الصورة الشخصية"}
            <input
              id="avatar"
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(",")}
              onChange={onAvatar}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="username">اسم المستخدم</Label>
        <Input
          id="username"
          dir="ltr"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoCapitalize="none"
          autoComplete="username"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="full-name">الاسم</Label>
        <Input
          id="full-name"
          value={fullName}
          maxLength={60}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="bio">نبذة</Label>
        <Textarea id="bio" rows={3} maxLength={200} value={bio} onChange={(e) => setBio(e.target.value)} />
        <span className="text-xs text-muted-foreground">{bio.length} / 200</span>
      </div>

      <FormError message={error} />
      {saved && (
        <p role="status" className="text-sm text-primary">
          تم حفظ التغييرات
        </p>
      )}
      <Button type="submit" disabled={loading || uploading} className="self-start">
        {loading ? "جارٍ الحفظ..." : "حفظ"}
      </Button>
    </form>
  );
}
