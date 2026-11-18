import { requireAdmin } from "@/lib/auth";
import PostForm from "../PostForm";

export default async function NewPost() {
  await requireAdmin();
  return (
    <main className="mx-auto max-w-5xl px-6 pt-8">
      <h1 className="mb-6 text-4xl font-extrabold">New post</h1>
      <PostForm />
    </main>
  );
}