import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Poppins, Lora, Inter, Outfit } from "next/font/google";
import "./globals.css";
import { siteConfig, schemaMarkup } from "@/lib/seoConfig";
import Script from "next/script";
import LayoutWrapper from "../components/LayoutWrapper";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: "The Wooden Space - Buy Premium Solid Wood Furniture Online in India",
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "The Wooden Space" }],
  creator: "The Wooden Space",
  publisher: "The Wooden Space",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  icons: {
    icon: [
      { url: "/logo.jpg", sizes: "any" },
      { url: "/woodenspace.png", sizes: "180x180", type: "image/png" }
    ],
    apple: "/logo.jpg",
    shortcut: "/logo.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.siteUrl,
    siteName: "The Wooden Space",
    title: "The Wooden Space - Premium Solid Wood Furniture Online in India",
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.siteUrl}/woodenspace.png`,
        width: 1200,
        height: 630,
        alt: "The Wooden Space - Premium Wooden Furniture",
        type: "image/png",
        secureUrl: `${siteConfig.siteUrl}/woodenspace.png`,
      },
      {
        url: `${siteConfig.siteUrl}/hero.png`,
        width: 1200,
        height: 600,
        alt: "The Wooden Space - Premium Wooden Furniture",
        type: "image/png",
      },
      {
        url: `${siteConfig.siteUrl}/logo.jpg`,
        width: 400,
        height: 400,
        alt: "The Wooden Space Logo",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@woodenspace",
    creator: "@woodenspace",
    title: "The Wooden Space - Premium Wooden Furniture Online",
    description: siteConfig.description,
    images: [`${siteConfig.siteUrl}/woodenspace.png`, `${siteConfig.siteUrl}/hero.png`, `${siteConfig.siteUrl}/logo.jpg`],
  },
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  formatDetection: {
    email: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "The Wooden Space",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon & Icons */}
        <link rel="icon" href="/logo.jpg" sizes="any" />
        <link rel="icon" type="image/png" href="/woodenspace.png" sizes="180x180" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <link rel="shortcut icon" href="/logo.jpg" type="image/jpeg" />
        
        {/* Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#D4AF37" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="The Wooden Space" />
        <meta name="msapplication-TileColor" content="#D4AF37" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="D&L Furnitech" />
        <meta name="contact" content="+91 85628 75794" />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>

        {/* Organization Schema */}
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaMarkup.organization),
          }}
        />

        {/* Local Business Schema */}
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaMarkup.localBusiness),
          }}
        />

        {/* Website Schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "D&L Furnitech",
              "description": siteConfig.description,
              "url": siteConfig.siteUrl,
              "image": `${siteConfig.siteUrl}/logo.jpg`,
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${siteConfig.siteUrl}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${poppins.variable} ${outfit.variable} ${inter.variable} ${lora.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
