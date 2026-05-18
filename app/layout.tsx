import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/layout/top-nav";
import { Footer } from "@/components/layout/footer";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { unstable_cache } from "next/cache";

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

const getSiteSettings = unstable_cache(
  async () => {
    try {
      const docRef = doc(db, 'settings', 'site');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (e) {
      console.error("Failed to fetch settings on server", e);
    }
    return null;
  },
  ['site-settings'],
  { revalidate: 3600 } // Cache for 1 hour
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased flex flex-col h-screen bg-white text-black overflow-hidden relative font-sans`}>
        <main className="flex flex-1 overflow-hidden">
          <section className="flex-1 overflow-y-auto flex flex-col">
            <TopNav initialSettings={settings} />
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
