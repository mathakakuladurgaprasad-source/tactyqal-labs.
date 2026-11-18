# Tactyqal Labs: homepage redesign + blog backend

Next.js 15 (App Router), Tailwind v4, Prisma, PostgreSQL (Supabase), Zod.

## Run locally
```bash
npm install
cp .env.example .env      # add DATABASE_URL and ADMIN_TOKEN
npm run db:push && npm run db:seed
npm run dev
```

## Blog API
Reads are public. Writes need `Authorization: Bearer $ADMIN_TOKEN`.

| Method | Path | Notes |
|---|---|---|
| GET | `/api/posts` | `page, limit, q, category, tag`; `status=DRAFT` needs auth |
| POST | `/api/posts` | validated with Zod; slug auto-generated; 409 on duplicate |
| GET | `/api/posts/:slugOrId` | drafts hidden unless authed |
| PUT | `/api/posts/:id` | partial update |
| DELETE | `/api/posts/:id` | 204 |

Errors: `{ "error": { "message", "details" } }`.

```bash
curl -X POST localhost:3000/api/posts -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","excerpt":"First post from the new API","content":"## Hi","status":"PUBLISHED"}'
```

## Migrating from WordPress
Fetch `https://<wp-site>/wp-json/wp/v2/posts?per_page=100&_embed`, map `title.rendered`, `slug`,
`excerpt.rendered`, `content.rendered` (convert HTML to Markdown), `date` to `publishedAt`, then upsert by slug.
Keep the same slugs and add 301 redirects so SEO is preserved.

## Deploy
Vercel + Supabase. Set `DATABASE_URL`, `ADMIN_TOKEN`, `NEXT_PUBLIC_SITE_URL`.
