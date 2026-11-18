"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { postInput, slugify } from "@/lib/api";
import { clearSession, requireAdmin, setSession } from "@/lib/auth";

const refresh = () => { revalidatePath("/"); revalidatePath("/blog"); revalidatePath("/admin"); };

export async function login(_: string | null, fd: FormData) {
  if (!process.env.ADMIN_TOKEN || String(fd.get("token")) !== process.env.ADMIN_TOKEN)
    return "Wrong token. Use the ADMIN_TOKEN value from your .env file.";
  await setSession();
  redirect("/admin");
}

export async function logout() {
  await clearSession();
  redirect("/admin/login");
}

export async function savePost(_: string | null, fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const parsed = postInput.safeParse({
    title: fd.get("title"),
    slug: fd.get("slug") || undefined,
    excerpt: fd.get("excerpt"),
    content: fd.get("content"),
    coverImage: fd.get("coverImage") || null,
    category: fd.get("category") || "General",
    tags: String(fd.get("tags") ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    status: fd.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
  });
  if (!parsed.success) {
    const f = parsed.error.flatten().fieldErrors;
    return Object.entries(f).map(([k, v]) => `${k}: ${v?.[0]}`).join("; ");
  }
  const d = parsed.data;
  const slug = slugify(d.slug ?? d.title);
  const clash = await db.post.findUnique({ where: { slug } });
  if (clash && clash.id !== id) return `The slug "${slug}" is already used. Change the slug.`;

  if (id) {
    const old = await db.post.findUnique({ where: { id } });
    await db.post.update({
      where: { id },
      data: { ...d, slug, publishedAt: d.status === "PUBLISHED" ? old?.publishedAt ?? new Date() : null },
    });
  } else {
    await db.post.create({ data: { ...d, slug, publishedAt: d.status === "PUBLISHED" ? new Date() : null } });
  }
  refresh();
  redirect("/admin");
}

export async function togglePublish(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id"));
  const post = await db.post.findUnique({ where: { id } });
  if (!post) return;
  const publish = post.status === "DRAFT";
  await db.post.update({
    where: { id },
    data: { status: publish ? "PUBLISHED" : "DRAFT", publishedAt: publish ? post.publishedAt ?? new Date() : null },
  });
  refresh();
}

export async function deletePost(fd: FormData) {
  await requireAdmin();
  await db.post.delete({ where: { id: String(fd.get("id")) } }).catch(() => null);
  refresh();
}