"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button, FormError, Label, Textarea } from "@/components/ui";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/utils";

export function CreatePostForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_IMAGE_TYPES.includes(f.type)) {
      setError("الصيغ المدعومة: JPG وPNG وWebP وGIF");
      return;
    }
    if (f.size > MAX_IMAGE_BYTES) {
      setError("حجم الصورة يجب ألا يتجاوز 8 ميغابايت");
      return;
    }
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("اختر صورة أولاً");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
    if (uploadError) {
      setError("تعذر رفع الصورة، حاول مجدداً");
      setLoading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(path);

    const { data, error: insertError } = await supabase
      .from("posts")
      .insert({ user_id: userId, image_url: publicUrl, caption: caption.trim() || null })
      .select("id")
      .single();

    if (insertError || !data) {
      await supabase.storage.from("media").remove([path]);
      setError("تعذر نشر المنشور، حاول مجدداً");
      setLoading(false);
      return;
    }

    router.push(`/p/${data.id}`);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <label
        htmlFor="image"
        className="relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed bg-card text-muted-foreground hover:bg-muted focus-within:outline-2 focus-within:outline-primary"
      >
        {preview && file ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview
          <img src={preview} alt="معاينة الصورة المختارة" className="absolute inset-0 size-full object-cover" />
        ) : (
          <>
            <ImagePlus className="size-12 text-primary" aria-hidden="true" />
            <span className="text-base font-semibold text-foreground">اختر صورة</span>
            <span className="text-xs">JPG، PNG، WebP أو GIF حتى 8 ميغابايت</span>
          </>
        )}
        <input
          id="image"
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          onChange={onFile}
          className="sr-only"
        />
      </label>
      {file && (
        <p className="-mt-3 text-center text-xs text-muted-foreground">
          اضغط على الصورة لاختيار صورة أخرى
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="caption">الوصف</Label>
        <Textarea
          id="caption"
          rows={4}
          maxLength={2200}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="اكتب شيئاً عن هذه الصورة..."
        />
        <span className="text-xs text-muted-foreground">{caption.length} / 2200</span>
      </div>

      <FormError message={error} />
      <Button type="submit" disabled={loading || !file} className="h-11">
        {loading ? "جارٍ النشر..." : "مشاركة"}
      </Button>
    </form>
  );
}
