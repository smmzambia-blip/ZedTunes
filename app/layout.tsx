import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TopNav } from "@/components/layout/top-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { RightPanel } from "@/components/layout/right-panel";
import { MusicPlayer } from "@/components/player/music-player";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ZedTunes",
  description: "Zambia's hottest music platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen bg-[#0a0a0a] text-white overflow-hidden relative font-sans`}>
        <TopNav />
        <main className="flex flex-1 overflow-hidden">
          <Sidebar />
          <section className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col gap-10 pb-24">
            {children}
          </section>
          <RightPanel />
        </main>
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MusicPlayer />
        </div>
      </body>
    </html>
  );
}
