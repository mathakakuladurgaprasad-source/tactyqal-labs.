import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import PostForm from "../PostForm";

export const dynamic = "force-dynamic";

export default async function EditPost({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requireAdmin();
  const { id } = await searchParams;
  const post = id ? await db.post.findUnique({ where: { id } }) : null;
  if (!post) notFound();
  return (
    <main className="mx-auto max-w-5xl px-6 pt-8">
      <h1 className="mb-6 text-4xl font-extrabold">Edit post</h1>
      <PostForm post={post} />
    </main>
  );
}