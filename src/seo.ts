import { blogPosts, type BlogPost } from "./blogData.ts";
import {
  collections,
  faqs,
  getProductPath,
  legalPages,
  products,
  siteData,
  type Collection,
  type Product,
} from "./siteData.ts";

type EnvLike = {
  VITE_SITE_URL?: string;
  VERCEL_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
};

type ImportMetaWithEnv = ImportMeta & {
  env?: EnvLike;
};

export type SchemaNode = Record<string, unknown>;

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type SeoRouteEntry = {
  path: string;
  title: string;
  description: string;
  image?: string;
  openGraphType?: "website" | "article";
  noindex?: boolean;
  schema?: SchemaNode[];
};

const env = (import.meta as ImportMetaWithEnv | undefined)?.env;
const processEnv = (
  globalThis as typeof globalThis & {
    process?: {
      env?: {
        VITE_SITE_URL?: string;
        VERCEL_URL?: string;
        VERCEL_PROJECT_PRODUCTION_URL?: string;
      };
    };
  }
).process?.env;
const browserOrigin =
  typeof window !== "undefined" && window.location.origin ? window.location.origin : undefined;

const resolvedSiteOrigin =
  env?.VITE_SITE_URL ??
  processEnv?.VITE_SITE_URL ??
  (processEnv?.VERCEL_URL ? `https://${processEnv.VERCEL_URL}` : undefined) ??
  (processEnv?.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${processEnv.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined) ??
  browserOrigin ??
  "https://example.invalid";

export const siteOrigin = resolvedSiteOrigin.replace(/\/$/, "");
export const siteName = siteData.brand.name;
export const siteLocale = "en_GB";
export const siteDescription = siteData.brand.subheading;
export const defaultThemeColor = "#08110d";
export const defaultSocialImage = siteData.brand.socialImage;

const absoluteUrlPattern = /^https?:\/\//i;

export const normalisePath = (value: string) => {
  if (!value) return "/";
  if (absoluteUrlPattern.test(value)) {
    const url = new URL(value);
    return url.pathname === "" ? "/" : url.pathname.replace(/\/+$/, "") || "/";
  }

  const prefixed = value.startsWith("/") ? value : `/${value}`;
  return prefixed === "/" ? prefixed : prefixed.replace(/\/+$/, "");
};

export const toAbsoluteUrl = (value: string) => {
  if (absoluteUrlPattern.test(value)) {
    return value;
  }

  return `${siteOrigin}${normalisePath(value)}`;
};

const toSocialUrl = (network: "instagram" | "facebook" | "tiktok", handle: string) => {
  const cleaned = handle.replace(/^@/, "");

  switch (network) {
    case "instagram":
      return `https://www.instagram.com/${cleaned}/`;
    case "facebook":
      return `https://www.facebook.com/${cleaned}`;
    case "tiktok":
      return `https://www.tiktok.com/@${cleaned}`;
    default:
      return handle;
  }
};

export const buildCanonicalUrl = (path: string) => toAbsoluteUrl(path);

export const buildOrganizationSchema = (): SchemaNode => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteOrigin}#organization`,
  name: siteName,
  url: siteOrigin,
  description: siteDescription,
  logo: toAbsoluteUrl(siteData.brand.logo),
  email: siteData.contact.email,
  telephone: siteData.contact.phone,
  sameAs: [
    toSocialUrl("instagram", siteData.contact.instagram),
    toSocialUrl("facebook", siteData.contact.facebook),
    toSocialUrl("tiktok", siteData.contact.tiktok),
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: siteData.contact.email,
      telephone: siteData.contact.phone,
      areaServed: "GB",
      availableLanguage: ["en-GB"],
    },
  ],
});

export const buildWebsiteSchema = (): SchemaNode => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteOrigin}#website`,
  url: siteOrigin,
  name: siteName,
  description: siteDescription,
  inLanguage: "en-GB",
  publisher: {
    "@id": `${siteOrigin}#organization`,
  },
});

export const buildWebPageSchema = ({
  path,
  title,
  description,
  image,
  type = "WebPage",
}: {
  path: string;
  title: string;
  description: string;
  image?: string;
  type?:
    | "WebPage"
    | "CollectionPage"
    | "AboutPage"
    | "ContactPage"
    | "CheckoutPage"
    | "FAQPage";
}): SchemaNode => ({
  "@context": "https://schema.org",
  "@type": type,
  "@id": `${buildCanonicalUrl(path)}#webpage`,
  url: buildCanonicalUrl(path),
  name: title,
  description,
  inLanguage: "en-GB",
  isPartOf: {
    "@id": `${siteOrigin}#website`,
  },
  about: {
    "@id": `${siteOrigin}#organization`,
  },
  primaryImageOfPage: image
    ? {
        "@type": "ImageObject",
        url: toAbsoluteUrl(image),
      }
    : undefined,
});

export const buildBreadcrumbSchema = (items: BreadcrumbItem[]): SchemaNode => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: buildCanonicalUrl(item.path),
  })),
});

export const buildItemListSchema = ({
  path,
  title,
  items,
}: {
  path: string;
  title: string;
  items: Array<{ name: string; path: string }>;
}): SchemaNode => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${buildCanonicalUrl(path)}#itemlist`,
  name: title,
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    url: buildCanonicalUrl(item.path),
  })),
});

const buildOfferAvailability = (available: boolean) =>
  available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";

export const buildProductSchema = (product: Product): SchemaNode => {
  const priceLow = Math.min(...product.variants.map((variant) => variant.price));
  const priceHigh = Math.max(...product.variants.map((variant) => variant.price));
  const productUrl = buildCanonicalUrl(getProductPath(product));

  const offer =
    product.variants.length > 1
      ? {
          "@type": "AggregateOffer",
          priceCurrency: "GBP",
          lowPrice: priceLow.toFixed(2),
          highPrice: priceHigh.toFixed(2),
          offerCount: product.variants.length,
          availability: buildOfferAvailability(product.available),
          url: productUrl,
        }
      : {
          "@type": "Offer",
          priceCurrency: "GBP",
          price: priceLow.toFixed(2),
          availability: buildOfferAvailability(product.available),
          itemCondition: "https://schema.org/NewCondition",
          url: productUrl,
          seller: {
            "@id": `${siteOrigin}#organization`,
          },
        };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    url: productUrl,
    name: product.cardTitle,
    description: product.summary,
    image: product.images.map((image) => toAbsoluteUrl(image)),
    brand: {
      "@type": "Brand",
      name: siteName,
    },
    category:
      collections.find((collection) => collection.handle === product.primaryCollection)?.title ??
      "Wild Botanix",
    offers: offer,
  };
};

export const buildCollectionSchema = (collection: Collection): SchemaNode[] => {
  const path = `/collections/${collection.handle}`;
  const collectionProducts = products.filter((product) =>
    product.collections.includes(collection.handle),
  );

  return [
    buildWebPageSchema({
      path,
      title: collection.heroHeading,
      description: collection.description,
      image: collection.image,
      type: "CollectionPage",
    }),
    buildItemListSchema({
      path,
      title: `${collection.title} products`,
      items: collectionProducts.map((product) => ({
        name: product.cardTitle,
        path: getProductPath(product),
      })),
    }),
  ];
};

export const buildArticleSchema = (post: BlogPost): SchemaNode => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${buildCanonicalUrl(`/journal/${post.slug}`)}#article`,
  mainEntityOfPage: buildCanonicalUrl(`/journal/${post.slug}`),
  headline: post.title,
  description: post.excerpt,
  image: [toAbsoluteUrl(post.heroImage)],
  articleSection: post.category,
  author: {
    "@id": `${siteOrigin}#organization`,
  },
  publisher: {
    "@id": `${siteOrigin}#organization`,
  },
  inLanguage: "en-GB",
});

export const buildJournalHubSchema = (): SchemaNode[] => [
  buildWebPageSchema({
    path: "/journal",
    title: "Journal stories for calmer, better-chosen rituals.",
    description:
      "Explore Wild Botanix journal articles covering herbal teas, sea moss, batana oil, botanical oils and natural self-care routines.",
    image: blogPosts[0]?.heroImage ?? defaultSocialImage,
  }),
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${buildCanonicalUrl("/journal")}#blog`,
    url: buildCanonicalUrl("/journal"),
    name: `${siteName} Journal`,
    description:
      "Wild Botanix journal stories exploring herbal teas, botanical ingredients, sea moss, hair and scalp care, and grounded daily rituals.",
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: buildCanonicalUrl(`/journal/${post.slug}`),
    })),
  },
];

export const buildFAQSchema = (): SchemaNode => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const getGlobalSeoSchema = () => [buildOrganizationSchema(), buildWebsiteSchema()];

export const getHomeSeoSchema = (): SchemaNode[] => [
  buildWebPageSchema({
    path: "/",
    title: "Premium Botanical Wellness",
    description:
      "Wild Botanix UK brings together herbal teas, sea moss, batana oil and natural self-care for calmer daily rituals.",
    image: siteData.brand.socialImage,
  }),
  buildItemListSchema({
    path: "/collections",
    title: "Wild Botanix collections",
    items: collections.map((collection) => ({
      name: collection.title,
      path: `/collections/${collection.handle}`,
    })),
  }),
];

export const getSeoRouteEntries = (): SeoRouteEntry[] => {
  const topLevel: SeoRouteEntry[] = [
    {
      path: "/",
      title: "Premium Botanical Wellness",
      description:
        "Wild Botanix UK brings together herbal teas, sea moss, batana oil and natural self-care for calmer daily rituals.",
      image: siteData.brand.socialImage,
      openGraphType: "website",
      schema: getHomeSeoSchema(),
    },
    {
      path: "/shop",
      title: "Shop",
      description:
        "Browse the full Wild Botanix range of herbal teas, sea moss, botanical oils, scalp care and natural self-care.",
      image: siteData.brand.socialImage,
      openGraphType: "website",
      schema: [
        buildWebPageSchema({
          path: "/shop",
          title: "Shop Wild Botanix essentials.",
          description:
            "Browse herbal teas, sea moss, batana oil, scalp care and everyday self-care in one calm, easy-to-shop space.",
          image: siteData.brand.socialImage,
          type: "CollectionPage",
        }),
        buildItemListSchema({
          path: "/shop",
          title: "Wild Botanix products",
          items: products.map((product) => ({
            name: product.cardTitle,
            path: getProductPath(product),
          })),
        }),
      ],
    },
    {
      path: "/collections",
      title: "Collections",
      description:
        "Explore Wild Botanix collections, from herbal teas and mineral wellness to hair, scalp and self-care rituals.",
      image: collections[0]?.image ?? siteData.brand.socialImage,
      openGraphType: "website",
      schema: [
        buildWebPageSchema({
          path: "/collections",
          title: "Explore collections by ritual.",
          description:
            "Shop by what fits your routine, from herbal teas and mineral wellness to nourishing oils and natural self-care.",
          image: collections[0]?.image ?? siteData.brand.socialImage,
          type: "CollectionPage",
        }),
        buildItemListSchema({
          path: "/collections",
          title: "Wild Botanix collections",
          items: collections.map((collection) => ({
            name: collection.title,
            path: `/collections/${collection.handle}`,
          })),
        }),
      ],
    },
    {
      path: "/journal",
      title: "Journal",
      description:
        "Explore Wild Botanix journal articles covering herbal teas, sea moss, batana oil, botanical haircare and premium natural self-care rituals.",
      image: blogPosts[0]?.heroImage ?? siteData.brand.socialImage,
      openGraphType: "website",
      schema: buildJournalHubSchema(),
    },
    {
      path: "/about",
      title: "About",
      description:
        "Learn more about Wild Botanix, a plant-led wellness brand rooted in herbal teas, sea moss, botanical oils and natural self-care.",
      image: siteData.brand.socialImage,
      openGraphType: "website",
      schema: [
        buildWebPageSchema({
          path: "/about",
          title: "Plant-led wellness, chosen with care.",
          description:
            "Learn more about Wild Botanix, a plant-led wellness brand rooted in herbal teas, sea moss, botanical oils and natural self-care.",
          image: siteData.brand.socialImage,
          type: "AboutPage",
        }),
      ],
    },
    {
      path: "/contact",
      title: "Contact",
      description:
        "Contact Wild Botanix for product questions, order support and everyday help with herbal teas, sea moss, scalp care and self-care.",
      image: siteData.brand.socialImage,
      openGraphType: "website",
      schema: [
        buildWebPageSchema({
          path: "/contact",
          title: "Contact Wild Botanix",
          description:
            "Contact Wild Botanix for product questions, order support and everyday help with herbal teas, sea moss, scalp care and self-care.",
          image: siteData.brand.socialImage,
          type: "ContactPage",
        }),
        buildFAQSchema(),
      ],
    },
    {
      path: "/account",
      title: "Account",
      description:
        "Customer accounts and order history are handled through the official Wild Botanix Shopify store.",
      image: siteData.brand.socialImage,
      openGraphType: "website",
      noindex: true,
    },
    {
      path: "/cart",
      title: "Cart",
      description:
        "Basket review and checkout are handled through the official Wild Botanix Shopify store.",
      image: siteData.brand.socialImage,
      openGraphType: "website",
      noindex: true,
    },
    {
      path: "/checkout",
      title: "Checkout",
      description:
        "Payments and checkout are handled through the official Wild Botanix Shopify store.",
      image: siteData.brand.socialImage,
      openGraphType: "website",
      noindex: true,
      schema: [
        buildWebPageSchema({
          path: "/checkout",
          title: "Checkout",
          description:
            "Payments and checkout are handled through the official Wild Botanix Shopify store.",
          image: siteData.brand.socialImage,
          type: "CheckoutPage",
        }),
      ],
    },
  ];

  const collectionEntries = collections.map<SeoRouteEntry>((collection) => ({
    path: `/collections/${collection.handle}`,
    title: collection.title,
    description: collection.description,
    image: collection.image,
    openGraphType: "website",
    schema: [
      ...buildCollectionSchema(collection),
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Collections", path: "/collections" },
        { name: collection.title, path: `/collections/${collection.handle}` },
      ]),
    ],
  }));

  const productEntries = products.map<SeoRouteEntry>((product) => ({
    path: getProductPath(product),
    title: product.cardTitle,
    description: product.summary,
    image: product.images[0] ?? siteData.brand.socialImage,
    openGraphType: "website",
    schema: [
      buildWebPageSchema({
        path: getProductPath(product),
        title: product.cardTitle,
        description: product.summary,
        image: product.images[0] ?? siteData.brand.socialImage,
      }),
      buildProductSchema(product),
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
        {
          name:
            collections.find((collection) => collection.handle === product.primaryCollection)?.title ??
            "Collection",
          path: `/collections/${product.primaryCollection}`,
        },
        { name: product.cardTitle, path: getProductPath(product) },
      ]),
    ],
  }));

  const journalEntries = blogPosts.map<SeoRouteEntry>((post) => ({
    path: `/journal/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    image: post.heroImage,
    openGraphType: "article",
    schema: [
      buildWebPageSchema({
        path: `/journal/${post.slug}`,
        title: post.title,
        description: post.excerpt,
        image: post.heroImage,
      }),
      buildArticleSchema(post),
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Journal", path: "/journal" },
        { name: post.title, path: `/journal/${post.slug}` },
      ]),
    ],
  }));

  const legalEntries = legalPages.map<SeoRouteEntry>((page) => ({
    path: `/legal/${page.slug}`,
    title: page.title,
    description: page.intro,
    image: siteData.brand.socialImage,
    openGraphType: "website",
    schema: [
      buildWebPageSchema({
        path: `/legal/${page.slug}`,
        title: page.title,
        description: page.intro,
        image: siteData.brand.socialImage,
      }),
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: page.title, path: `/legal/${page.slug}` },
      ]),
    ],
  }));

  return [...topLevel, ...collectionEntries, ...productEntries, ...journalEntries, ...legalEntries];
};

export const getIndexableSeoRouteEntries = () =>
  getSeoRouteEntries().filter((entry) => !entry.noindex);
