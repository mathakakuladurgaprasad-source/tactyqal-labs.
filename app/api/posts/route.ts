import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fail, isAdmin, postInput, slugify } from "@/lib/api";
import type { Prisma } from "@prisma/client";

// GET /api/posts?page=1&limit=10&q=&category=&tag=&status=
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const page = Math.max(1, Number(sp.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(sp.get("limit")) || 10));
  const q = sp.get("q");
  const where: Prisma.PostWhereInput = {
    // Drafts are only visible to authenticated callers
    status: isAdmin(req) && sp.get("status") === "DRAFT" ? "DRAFT" : "PUBLISHED",
    ...(sp.get("category") && { category: sp.get("category")! }),
    ...(sp.get("tag") && { tags: { has: sp.get("tag")! } }),
    ...(q && { OR: [
      { title: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
    ] }),
  };
  const [items, total] = await Promise.all([
    db.post.findMany({ where, orderBy: { publishedAt: "desc" }, skip: (page - 1) * limit, take: limit,
      omit: { content: true } }),
    db.post.count({ where }),
  ]);
  return NextResponse.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return fail(401, "Missing or invalid token");
  const parsed = postInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(400, "Invalid post", parsed.error.flatten());
  const d = parsed.data;
  const slug = d.slug ? slugify(d.slug) : slugify(d.title);
  if (await db.post.findUnique({ where: { slug } })) return fail(409, `Slug "${slug}" already exists`);
  const post = await db.post.create({
    data: { ...d, slug, publishedAt: d.status === "PUBLISHED" ? new Date() : null },
  });
  return NextResponse.json(post, { status: 201 });
}
