import type { Metadata, Viewport } from "next";
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
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zedtunez.vercel.app';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ZedTunes';
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Download Latest Zambian Music';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  const title = settings?.siteName || siteName;
  const description = settings?.siteBio || siteDescription;
  const image = settings?.logoBase64 || `${baseUrl}/og-image.png`;
  const keywords = ['Zambian music', 'download music', 'latest songs', 'albums', 'artists', 'ZedTunes', 'Zambia'];

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${title} - Download Latest Zambian Music`,
      template: `%s | ${title}`,
    },
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'ZedTunes Team', url: baseUrl }],
    creator: 'ZedTunes',
    publisher: 'ZedTunes',
    formatDetection: {
      email: false,
      telephone: false,
      address: false,
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: '/apple-icon.png',
      other: [
        {
          rel: 'mask-icon',
          url: '/mask-icon.svg',
          color: '#39FF14',
        },
      ],
    },
    // Open Graph
    openGraph: {
      type: 'website',
      locale: 'en_ZM',
      url: baseUrl,
      siteName: title,
      title: `${title} - Download Latest Zambian Music`,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
        {
          url: image,
          width: 800,
          height: 800,
          alt: title,
          type: 'image/png',
        },
      ],
    },
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Download Latest Zambian Music`,
      description,
      images: [image],
      creator: '@zedtunez',
      site: '@zedtunez',
    },
    // Verification
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '_04GK_zgHd1ozBiScxbR6ddB9hzSbdFIGb70TwMGTWo',
    },
    // Alternate links for multi-language support (future-proof)
    alternates: {
      canonical: baseUrl,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      googleBot: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
  };
}

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
  { revalidate: 3600 }
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://archive.org" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* JSON-LD Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MusicGroup',
              name: settings?.siteName || siteName,
              description,
              url: baseUrl,
              image: settings?.logoBase64 || `${baseUrl}/og-image.png`,
              sameAs: [
                'https://www.facebook.com/zedtunez',
                'https://www.twitter.com/zedtunez',
                'https://www.instagram.com/zedtunez',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+260-XXX-XXXXX',
                contactType: 'Customer Service',
                areaServed: 'ZM',
              },
              geo: {
                '@type': 'Place',
                name: 'Zambia',
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: -13.133897,
                  longitude: 27.849332,
                },
              },
            }),
          }}
        />

        {/* Preload critical assets */}
        <link rel="preload" as="image" href="/icon-192.png" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased flex flex-col h-screen bg-white text-black overflow-hidden relative font-sans`}>
        {/* Skip to main content (accessibility) */}
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>

        <main className="flex flex-1 overflow-hidden" id="main-content">
          <section className="flex-1 overflow-y-auto flex flex-col">
            <TopNav initialSettings={{ siteName: settings?.siteName, siteBio: settings?.siteBio }} />
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