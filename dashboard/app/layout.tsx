import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AirSense | India AQI Dashboard",
  description:
    "Interactive AQI and public-health dashboard for Indian cities built from the AirSense analysis notebook.",
};

const nav = [
  { href: "/", label: "Overview" },
  { href: "/risk", label: "Risk & Action" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              AirSense
              <span className="ml-2 text-sm font-normal text-zinc-500">
                India AQI &amp; public health
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
        <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
          AirSense — built from air-quality monitoring data, not a substitute for
          official public-health guidance.
        </footer>
      </body>
    </html>
  );
}