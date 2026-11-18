import { NextResponse } from "next/server";
import { z } from "zod";

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const isAdmin = (req: Request) =>
  !!process.env.ADMIN_TOKEN && req.headers.get("authorization") === `Bearer ${process.env.ADMIN_TOKEN}`;

export const fail = (status: number, message: string, details?: unknown) =>
  NextResponse.json({ error: { message, details } }, { status });

export const postInput = z.object({
  title: z.string().min(3).max(160),
  slug: z.string().min(3).max(160).optional(),
  excerpt: z.string().min(10).max(300),
  content: z.string().min(1),
  coverImage: z.string().url().nullish(),
  category: z.string().min(2).max(40).default("General"),
  tags: z.array(z.string().min(1).max(30)).max(10).default([]),
  author: z.string().min(2).max(60).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});
export const postUpdate = postInput.partial();
