import type { Metadata } from "next";
import { headers } from "next/headers";
import HomePageClient from "./HomePageClient";
import { siteConfig } from "@/lib/seoConfig";

export const dynamic = "force-dynamic";

function getRequestOrigin(h: Headers): string {
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  if (!host) return siteConfig.siteUrl;
  return `${proto}://${host}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const origin = getRequestOrigin(h);
  const ogImage = `${origin}/opengraph-image.png`;

  return {
    title: "The Wooden Space - Buy Premium Solid Wood Furniture Online in India",
    description: siteConfig.description,
    alternates: {
      canonical: `${origin}/`,
    },
    openGraph: {
      type: "website",
      url: `${origin}/`,
      siteName: "The Wooden Space",
      title: "The Wooden Space - Premium Solid Wood Furniture Online in India",
      description: siteConfig.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "The Wooden Space - Premium Wooden Furniture",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "The Wooden Space - Premium Wooden Furniture Online",
      description: siteConfig.description,
      images: [ogImage],
    },
  };
}

export default function HomePage() {
  return <HomePageClient />;
}
