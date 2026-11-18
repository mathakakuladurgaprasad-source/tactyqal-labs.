import Link from "next/link";
import { db } from "@/lib/db";

export const revalidate = 300;

const BOOK = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3JlaCrNitoPs8Bdr-FUP0cRfFI-MopSIH2azaPNDpRk56h6drYLbXSh-mDc9sfEZAQUKGdsUXs?gv=true";
const IMG = "https://www.tactyqal.com/application/assets/img/apps/";

const weeks = [
  { w: "Weeks 1–2", t: "Ideation and market research", x: 30, y: 250 },
  { w: "Weeks 3–4", t: "Design and prototyping", x: 140, y: 150 },
  { w: "Weeks 5–6", t: "Full-stack development", x: 250, y: 190 },
  { w: "Weeks 7–8", t: "Launch and marketing", x: 370, y: 50 },
];

const stories = [
  { name: "KrishiDrishti", img: "krishidrishti1.png", text: "AI soil analysis and crop recommendations for local farmers in India." },
  { name: "Elenor Vegan Handbags", img: "elenor1.png", text: "Corporate gifting platform started by a 16-year-old. ₹9,000 in the first week." },
  { name: "One Last Chapter", img: "olc1.png", text: "Book subscription for kids, started by a 13-year-old. ₹1,00,000 a month." },
  { name: "Paws of Promise", img: "pop1.png", text: "Virtual pet adoption that connects pet lovers with shelter animals." },
  { name: "AudioNova", img: "audionova1.png", text: "An AI music and video production company." },
  { name: "Converza", img: "converza1.png", text: "A Spanish learning app with Luna, a friendly AI language bot." },
];

const why = [
  ["One-on-one mentoring", "Every student gets a dedicated expert. No group classes."],
  ["A real app, no coding needed", "Students build with modern no-code tools and platforms."],
  ["An edge in university applications", "A launched product and real results stand out."],
  ["Revenue, grants and media", "Students learn to launch and earn from their own app."],
  ["Pitching skills", "Pitch, present and launch on Product Hunt."],
  ["Support after the program", "Alumni community and guidance once the 8 weeks end."],
];

const tools = ["Startup Idea Generator", "Fundability Assessment", "Team Evaluation Tool", "Pitch Deck Analyzer",
  "Top 10 Traits for Business Success", "Cofounder Compatibility Test", "Problem-Solution Fit", "Landing Page Assessment"];

const faqs = [
  ["What if my teen has no coding experience?", "That’s fine. The program is built for beginners, and students use no-code tools with step-by-step guidance."],
  ["How much time does it take?", "About 2–3 hours a week: one hour of live mentoring plus independent work."],
  ["What kind of apps do students build?", "AI tools, e-commerce, subscriptions and social-good projects. We help each student pick an idea that excites them."],
  ["Can my teen earn real revenue?", "Yes. Several students have earned revenue, won grants and received media coverage."],
  ["What support continues after the program?", "An alumni community and ongoing guidance, even after the 8 weeks."],
];

async function latestPosts() {
  try {
    return await db.post.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 3, omit: { content: true } });
  } catch { return []; }
}

const h2 = "text-3xl font-bold md:text-4xl";
const wrap = "mx-auto max-w-6xl px-6";

export default async function Home() {
  const posts = await latestPosts();
  return (
    <main>
      <section className="blueprint border-y border-ink/10">
        <div className={`${wrap} grid items-center gap-10 py-16 md:grid-cols-[1.1fr_1fr] md:py-24`}>
          <div>
            <h1 className="text-5xl font-extrabold leading-[1.03] md:text-6xl">
              Your teen builds a real app that reaches <span className="bg-marker px-2">real people.</span> In 8 weeks.
            </h1>
            <p className="mt-6 max-w-[52ch] text-lg text-slate">
              One-on-one mentoring takes your teen from idea to a launched full-stack app, with no coding required. More than 100 students mentored so far.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={BOOK} className="rounded-full bg-signal px-6 py-3 font-semibold text-white">Book a free consultation</a>
              <Link href="#stories" className="rounded-full border-2 border-ink px-6 py-3 font-semibold">See what students built</Link>
            </div>
          </div>
          <div>
            <svg viewBox="0 0 400 300" className="w-full" role="img" aria-label="Four stages across eight weeks, from idea to launch">
              <path className="path-draw" d="M30 250 C 80 250, 90 150, 140 150 S 200 190, 250 190 S 330 50, 370 50" fill="none" stroke="#2B4BFF" strokeWidth="4" strokeLinecap="round" />
              {weeks.map((s, i) => (
                <circle key={s.w} cx={s.x} cy={s.y} r={i === 3 ? 11 : 8} fill={i === 3 ? "#FFCF33" : "#12203F"} stroke="#12203F" strokeWidth="3" />
              ))}
            </svg>
            <ol className="mt-2 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {weeks.map((s) => (
                <li key={s.w}><p className="font-bold">{s.w}</p><p className="text-slate">{s.t}</p></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="stories" className={`${wrap} scroll-mt-8 pt-20`}>
        <h2 className={h2}>Real students. Real apps.</h2>
        <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <li key={s.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG + s.img} alt={`${s.name} app screenshot`} loading="lazy"
                className="aspect-[4/3] w-full rounded-xl border border-ink/10 bg-white object-cover object-top" />
              <h3 className="mt-3 text-xl font-bold">{s.name}</h3>
              <p className="mt-1 max-w-[44ch] text-slate">{s.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="why" className={`${wrap} scroll-mt-8 pt-24`}>
        <h2 className={h2}>Why parents choose Tactyqal Labs</h2>
        <dl className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
          {why.map(([t, d]) => (
            <div key={t} className="border-t-4 border-signal pt-3">
              <dt className="text-lg font-bold">{t}</dt>
              <dd className="mt-1 max-w-[50ch] text-slate">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="tools" className={`${wrap} scroll-mt-8 pt-24`}>
        <div className="rounded-2xl bg-ink p-8 text-paper md:p-12">
          <h2 className={h2}>Free tools to get started</h2>
          <p className="mt-3 max-w-[56ch] text-paper/80">Startup assessment tools used by more than 1,000 entrepreneurs.</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {tools.map((t) => <li key={t} className="rounded-full border border-paper/30 px-4 py-1.5 text-sm">{t}</li>)}
          </ul>
        </div>
      </section>

      <section id="pricing" className={`${wrap} scroll-mt-8 pt-24`}>
        <div className="grid gap-8 rounded-2xl border-2 border-ink bg-white p-8 md:grid-cols-[1fr_auto] md:p-12">
          <div>
            <h2 className={h2}>Start your teen’s journey</h2>
            <ul className="mt-5 space-y-1.5 text-slate">
              {["8 weeks of one-on-one mentoring", "Full-stack app development", "Product Hunt launch", "Pitch deck creation", "Marketing strategy", "Ongoing support"].map((i) => <li key={i}>{i}</li>)}
            </ul>
            <p className="mt-5 text-sm text-slate">Only 15 spots available each month. Money-back guarantee.</p>
          </div>
          <div className="flex flex-col justify-center md:text-right">
            <p className="text-slate line-through">₹25,000</p>
            <p className="font-display text-5xl font-extrabold">₹16,000</p>
            <a href={BOOK} className="mt-5 rounded-full bg-signal px-6 py-3 text-center font-semibold text-white">Enroll now</a>
          </div>
        </div>
      </section>

      <section id="faq" className={`${wrap} scroll-mt-8 pt-24`}>
        <h2 className={h2}>Questions parents ask</h2>
        <div className="mt-6 max-w-3xl divide-y divide-ink/15 border-y border-ink/15">
          {faqs.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {q}<span className="text-signal transition-transform group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="mt-2 max-w-[62ch] text-slate">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={`${wrap} pt-24`}>
        <div className="flex items-end justify-between">
          <h2 className={h2}>Learn from industry experts</h2>
          <Link href="/blog" className="font-semibold text-signal underline underline-offset-4">All articles</Link>
        </div>
        {posts.length === 0 ? (
          <p className="mt-6 text-slate">No posts yet. Publish one with POST /api/posts.</p>
        ) : (
          <ul className="mt-6 divide-y divide-ink/15 border-y border-ink/15">
            {posts.map((p) => (
              <li key={p.id}>
                <Link href={`/blog/${p.slug}`} className="block py-5 hover:bg-white/60">
                  <p className="text-sm text-slate">{p.category}</p>
                  <h3 className="text-xl font-bold">{p.title}</h3>
                  <p className="mt-1 max-w-[70ch] text-slate">{p.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="contact" className={`${wrap} scroll-mt-8 pt-24`}>
        <div className="rounded-2xl bg-signal p-8 text-white md:p-12">
          <h2 className={h2}>Ready to start your teen’s success story?</h2>
          <p className="mt-3 max-w-[56ch] text-white/85">We reply within 24 hours, Monday to Saturday, 9am to 7pm.</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            <a href={BOOK} className="rounded-full bg-marker px-6 py-3 font-semibold text-ink">Book a free appointment</a>
            <a href="mailto:tactyqal.labs@gmail.com" className="underline underline-offset-4">tactyqal.labs@gmail.com</a>
            <a href="tel:+919804772106" className="underline underline-offset-4">+91 98047 72106</a>
          </div>
        </div>
      </section>
    </main>
  );
}