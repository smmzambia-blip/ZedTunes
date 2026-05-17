import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/layout/top-nav";
import { Footer } from "@/components/layout/footer";
import { SiteIdentity } from "@/components/layout/site-identity";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ZedTunes",
  description: "Zambia's hottest music platform",
  verification: {
    google: "_04GK_zgHd1ozBiScxbR6ddB9hzSbdFIGb70TwMGTWo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased flex flex-col h-screen bg-white text-black overflow-hidden relative font-sans`}>
        <SiteIdentity />
        <TopNav />
        <main className="flex flex-1 overflow-hidden">
          <section className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-4 sm:p-8 flex flex-col gap-10 flex-1">
              {children}
            </div>
            <Footer />
          </section>
        </main>
      </body>
    </html>
  );
}
