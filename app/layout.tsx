import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TopNav } from "@/components/layout/top-nav";
import { Footer } from "@/components/layout/footer";
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen bg-white text-black overflow-hidden relative font-sans`}>
        <TopNav />
        <main className="flex flex-1 overflow-hidden">
          <section className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-4 sm:p-8 flex flex-col gap-10 flex-1">
              {children}
            </div>
            <Footer />
          </section>
        </main>
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MusicPlayer />
        </div>
      </body>
    </html>
  );
}
