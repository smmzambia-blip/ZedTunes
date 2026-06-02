import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/layout/top-nav";
import { Footer } from "@/components/layout/footer";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import { getCached, setCached } from "@/lib/cache";
import { FALLBACK_SETTINGS } from "@/lib/fallbackData";
import { UnderConstructionGuard } from "@/components/layout/under-construction-guard";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings?.siteName || "ZedTunes",
    description: settings?.siteBio || "Download Zed Latest Music",
    verification: {
      google: "_04GK_zgHd1ozBiScxbR6ddB9hzSbdFIGb70TwMGTWo",
    },
    icons: settings?.logoBase64 ? {
      icon: settings.logoBase64,
      apple: settings.logoBase64,
    } : undefined
  };
}

async function getSiteSettings() {
  const cacheKey = 'site-settings';
  const cached = getCached<Record<string, string>>(cacheKey);
  if (cached) return cached;

  try {
    const docRef = doc(db, 'settings', 'site');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setCached(cacheKey, data);
      return data;
    }
  } catch (e) {
    console.warn("Could not load settings from Firestore: " + (e instanceof Error ? e.message : String(e)));
  }
  return FALLBACK_SETTINGS;
}

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
            <TopNav initialSettings={{ siteName: settings?.siteName, siteBio: settings?.siteBio, logoBase64: settings?.logoBase64 }} />
            <div className="p-4 sm:p-8 flex flex-col gap-10 flex-1">
              <UnderConstructionGuard>
                {children}
              </UnderConstructionGuard>
            </div>
            <Footer />
          </section>
        </main>
      </body>
    </html>
  );
}
