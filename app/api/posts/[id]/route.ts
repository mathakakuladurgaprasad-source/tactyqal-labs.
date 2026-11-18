import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fail, isAdmin, postUpdate, slugify } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

// GET accepts either a slug or an id
export async function GET(req: Request, { params }: Ctx) {
  const { id } = await params;
  const post = await db.post.findFirst({ where: { OR: [{ slug: id }, { id }] } });
  if (!post || (post.status === "DRAFT" && !isAdmin(req))) return fail(404, "Post not found");
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: Ctx) {
  if (!isAdmin(req)) return fail(401, "Missing or invalid token");
  const { id } = await params;
  const parsed = postUpdate.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(400, "Invalid post", parsed.error.flatten());
  const existing = await db.post.findUnique({ where: { id } });
  if (!existing) return fail(404, "Post not found");
  const d = parsed.data;
  const post = await db.post.update({
    where: { id },
    data: {
      ...d,
      ...(d.slug && { slug: slugify(d.slug) }),
      ...(d.status === "PUBLISHED" && !existing.publishedAt && { publishedAt: new Date() }),
    },
  });
  return NextResponse.json(post);
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!isAdmin(req)) return fail(401, "Missing or invalid token");
  const { id } = await params;
  const deleted = await db.post.delete({ where: { id } }).catch(() => null);
  return deleted ? new NextResponse(null, { status: 204 }) : fail(404, "Post not found");
}
