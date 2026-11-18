import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const posts = [
  ["From napkin sketch to first users", "Founders", "How to cut an idea down to the one thing a first user can try this week."],
  ["Prototype before you plan", "Building", "A clickable prototype answers more questions than a ten-page spec."],
  ["What we look for in a launch checklist", "Launch", "The unglamorous steps that separate a demo from a product."],
];
async function main() {
  for (const [title, category, excerpt] of posts) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await db.post.upsert({
      where: { slug }, update: {},
      create: { title, slug, category, excerpt, tags: [category.toLowerCase()], status: "PUBLISHED", publishedAt: new Date(),
        content: `## ${title}\n\n${excerpt}\n\nReplace this seed text with real content via the API.` },
    });
  }
}
main().finally(() => db.$disconnect());
