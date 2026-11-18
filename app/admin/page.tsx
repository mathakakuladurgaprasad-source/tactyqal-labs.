import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { deletePost, logout, togglePublish } from "./actions";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function Admin() {
  await requireAdmin();
  const posts = await db.post.findMany({ orderBy: { updatedAt: "desc" }, omit: { content: true } });
  return (
    <main className="mx-auto max-w-5xl px-6 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl font-extrabold">Blog posts</h1>
        <div className="flex gap-3">
          <Link href="/admin/new" className="rounded-full bg-signal px-5 py-2 font-semibold text-white">New post</Link>
          <form action={logout}><button className="rounded-full border-2 border-ink px-5 py-2 font-semibold">Log out</button></form>
        </div>
      </div>
      {posts.length === 0 ? (
        <p className="mt-10 text-slate">No posts yet. Click New post to write the first one.</p>
      ) : (
        <ul className="mt-8 divide-y divide-ink/15 border-y border-ink/15">
          {posts.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="text-lg font-bold">{p.title}</p>
                <p className="text-sm text-slate">
                  <span className={p.status === "PUBLISHED" ? "font-semibold text-signal" : "font-semibold"}>
                    {p.status === "PUBLISHED" ? "Published" : "Draft"}
                  </span>{" "}
                  in {p.category}, updated {p.updatedAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}
                </p>
              </div>
              <div className="flex items-center gap-5 text-sm font-semibold">
                {p.status === "PUBLISHED" && <Link href={`/blog/${p.slug}`} className="underline underline-offset-4">View</Link>}
                <Link href={`/admin/edit?id=${p.id}`} className="underline underline-offset-4">Edit</Link>
                <form action={togglePublish}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="underline underline-offset-4">{p.status === "PUBLISHED" ? "Unpublish" : "Publish"}</button>
                </form>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={p.id} />
                  <DeleteButton />
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}