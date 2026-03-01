import type { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";
import { siteConfig } from "@/lib/seoConfig";

export const dynamic = "force-dynamic";

type SearchParams =
  | { [key: string]: string | string[] | undefined }
  | Promise<{ [key: string]: string | string[] | undefined }>;

interface ApiProduct {
  _id?: string;
  id?: string | number;
  name?: string;
  productName?: string;
  description?: string;
  fullDescription?: string;
  shortDescription?: string;
  image?: string;
  images?: string[];
  productImage?: string[];
  slug?: string;
  productSlug?: string;
  price?: number;
  productPrice?: number | string;
}

function toSingle(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "https://dandlfurnitech-services.vercel.app/api";
}

async function getProductFromQuery(searchParams: SearchParams) {
  const resolvedParams = await searchParams;
  const slug = toSingle(resolvedParams?.product);
  const id = toSingle(resolvedParams?.id);

  if (!slug && !id) {
    return { product: null as ApiProduct | null, slug: undefined, id: undefined };
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/products`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return { product: null as ApiProduct | null, slug, id };
    }

    const json = await response.json();
    const products: ApiProduct[] = Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.products)
        ? json.products
        : [];

    const product = products.find((p) => {
      const productSlug = p.slug || p.productSlug || p.name?.toLowerCase().replace(/\s+/g, "-");
      const productId = String(p._id || p.id || "");

      if (slug && productSlug === slug) return true;
      if (id && productId === id) return true;
      return false;
    }) || null;

    return { product, slug, id };
  } catch {
    return { product: null as ApiProduct | null, slug, id };
  }
}

function toAbsoluteImageUrl(image: string | undefined): string {
  if (!image) return `${siteConfig.siteUrl}/woodenspace.png`;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("//")) return `https:${image}`;
  if (image.startsWith("/")) return `${siteConfig.siteUrl}${image}`;
  return `${siteConfig.siteUrl}/${image}`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { product, slug, id } = await getProductFromQuery(searchParams);

  if (!product) {
    return {
      title: "Product - The Wooden Space",
      description: siteConfig.description,
      alternates: {
        canonical: `${siteConfig.siteUrl}/product`,
      },
    };
  }

  const name = product.name || product.productName || "Product";
  const description =
    product.description || product.fullDescription || product.shortDescription || siteConfig.description;
  const price =
    typeof product.price === "number"
      ? product.price
      : typeof product.productPrice === "number"
        ? product.productPrice
        : typeof product.productPrice === "string"
          ? Number(product.productPrice)
          : undefined;
  const primaryImage = product.images?.[0] || product.productImage?.[0] || product.image;
  const imageUrl = toAbsoluteImageUrl(primaryImage);
  const canonical = `${siteConfig.siteUrl}/product?${
    slug ? `product=${encodeURIComponent(slug)}` : `id=${encodeURIComponent(id || "")}`
  }`;
  const shortDescription = description.slice(0, 160);

  return {
    title: `${name} | The Wooden Space`,
    description: shortDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "The Wooden Space",
      title: name,
      description: shortDescription,
      images: [
        {
          url: imageUrl,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: shortDescription,
      images: [imageUrl],
    },
    other: price ? { "product:price:amount": String(price), "product:price:currency": "INR" } : undefined,
  };
}

export default function ProductPage() {
  return <ProductPageClient />;
}
