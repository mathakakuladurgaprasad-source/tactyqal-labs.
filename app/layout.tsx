import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: "Tactyqal Labs: your teen’s app, built in 8 weeks", template: "%s | Tactyqal Labs" },
  description: "One-on-one mentoring that takes teens from idea to a launched full-stack app in 8 weeks, with no coding required.",
};

const nav = [["Stories", "/#stories"], ["Why us", "/#why"], ["Pricing", "/#pricing"], ["FAQ", "/#faq"], ["Blog", "/blog"]];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-5">
          <Link href="/" className="font-display text-xl font-bold">Tactyqal Labs</Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
            {nav.map(([l, h]) => <Link key={l} href={h} className="hidden sm:inline">{l}</Link>)}
            <Link href="/#contact" className="rounded-full bg-ink px-4 py-1.5 text-paper">Book a consultation</Link>
          </nav>
        </header>
        {children}
        <footer className="mx-auto mt-24 max-w-6xl border-t border-ink/15 px-6 py-8 text-sm text-slate">
          © {new Date().getFullYear()} Tactyqal Labs
        </footer>
      </body>
    </html>
  );
}