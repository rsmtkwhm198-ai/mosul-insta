import { CreatePostForm } from "@/components/create-post-form";
import { requireViewer } from "@/lib/queries";

export default async function NewPostPage() {
  const { user } = await requireViewer();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-bold">منشور جديد</h1>
      <CreatePostForm userId={user.id} />
    </div>
  );
}
