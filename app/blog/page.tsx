import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Blog", description: "Notes on building products from idea to launch." };
export const revalidate = 60;

export default async function Blog({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q, category } = await searchParams;
  const posts = await db.post.findMany({
    where: {
      status: "PUBLISHED",
      ...(category && { category }),
      ...(q && { title: { contains: q, mode: "insensitive" } }),
    },
    orderBy: { publishedAt: "desc" },
    omit: { content: true },
  });
  return (
    <main className="mx-auto max-w-3xl px-6 pt-10">
      <h1 className="text-5xl font-extrabold">Blog</h1>
      <form className="mt-6 flex gap-2" role="search">
        <input name="q" defaultValue={q} placeholder="Search posts" aria-label="Search posts"
          className="w-full rounded-full border-2 border-ink/20 bg-white px-5 py-2" />
        <button className="rounded-full bg-ink px-5 py-2 font-semibold text-paper">Search</button>
      </form>
      {posts.length === 0 && <p className="mt-10 text-slate">No posts match. Try a different search.</p>}
      <ul className="mt-8 space-y-8">
        {posts.map((p) => (
          <li key={p.id}>
            <p className="text-sm text-slate">{p.category} · {p.publishedAt?.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
            <Link href={`/blog/${p.slug}`} className="text-2xl font-bold underline-offset-4 hover:underline">{p.title}</Link>
            <p className="mt-1 text-slate">{p.excerpt}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
