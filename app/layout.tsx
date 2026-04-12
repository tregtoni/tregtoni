import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/app/components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = 'https://www.tregtoni.com'
const OG_IMAGE = `${BASE_URL}/og-image.png`

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Tregtoni.com - Blini. Shitni. Tregtoni.',
    template: '%s - Tregtoni.com',
  },
  description: 'Platforma shqiptare për njoftime falas. Bli dhe shit makina, imobiliare, elektronikë dhe shumë më tepër. Njoftime nga Shqipëria, Kosova dhe diaspora shqiptare.',
  keywords: ['tregtoni', 'njoftime', 'shqip', 'makina', 'imobiliare', 'elektronik', 'kosove', 'shqiperi', 'njoftim falas', 'klasifikata'],
  authors: [{ name: 'Tregtoni.com' }],
  creator: 'Tregtoni.com',
  publisher: 'Tregtoni.com',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'sq_AL',
    url: BASE_URL,
    siteName: 'Tregtoni.com',
    title: 'Tregtoni.com - Blini. Shitni. Tregtoni.',
    description: 'Platforma shqiptare për njoftime falas. Bli dhe shit makina, imobiliare, elektronikë dhe shumë më tepër.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Tregtoni.com' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tregtoni.com - Blini. Shitni. Tregtoni.',
    description: 'Platforma shqiptare për njoftime falas.',
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sq"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
