import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { db } from "@/lib/db";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 60;

const getPost = (slug: string) => db.post.findFirst({ where: { slug, status: "PUBLISHED" } });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article", images: post.coverImage ? [post.coverImage] : [] },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl px-6 pt-10">
      <p className="text-sm text-slate">{post.category} · {post.author}</p>
      <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">{post.title}</h1>
      <p className="mt-4 text-lg text-slate">{post.excerpt}</p>
      <div className="prose-post mt-8"><ReactMarkdown>{post.content}</ReactMarkdown></div>
    </article>
  );
}
