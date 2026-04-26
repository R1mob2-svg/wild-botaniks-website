import rawProducts from "./data/source-products.json" with { type: "json" };
import rawPages from "./data/source-pages.json" with { type: "json" };

type SourceVariant = {
  id: number;
  title: string;
  price: string;
  compare_at_price: string | null;
  available: boolean;
};

type SourceImage = {
  src: string;
  alt?: string | null;
};

type SourceProduct = {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  tags: string[] | string;
  variants: SourceVariant[];
  images: SourceImage[];
};

type SourcePages = {
  about: {
    title: string;
    url: string;
    body: string;
  };
  contact: {
    title: string;
    url: string;
    email: string;
    secondaryEmail?: string;
    phone: string;
    hours: string;
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  collections: Array<{ title: string; handle: string }>;
  blogs: Array<{ title: string; handle: string; articleUrl: string }>;
};

type CuratedProductCopy = {
  cardTitle?: string;
  summary: string;
  description: string[];
  ingredients: string[];
  ritual: string[];
  highlights: string[];
  collections: string[];
};

export type ProductVariant = {
  id: number;
  title: string;
  price: number;
  compareAtPrice: number | null;
  available: boolean;
};

export type Product = {
  id: number;
  handle: string;
  slug: string;
  title: string;
  cardTitle: string;
  summary: string;
  description: string[];
  ingredients: string[];
  highlights: string[];
  ritual: string[];
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  priceFrom: number;
  compareAtFrom: number | null;
  available: boolean;
  collections: string[];
  primaryCollection: string;
};

export type Collection = {
  handle: string;
  title: string;
  eyebrow: string;
  description: string;
  heroHeading: string;
  heroCopy: string;
  image: string;
};

export type LegalPage = {
  slug: string;
  title: string;
  intro: string;
  sections: Array<{
    heading: string;
    body: string[];
  }>;
};

const sourceProducts = rawProducts as SourceProduct[];
const sourcePages = rawPages as SourcePages;

const toNumber = (value: string | null | undefined) => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normaliseTags = (value: string[] | string) => {
  if (Array.isArray(value)) return value.filter(Boolean);

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const formatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export const formatCurrency = (value: number) => formatter.format(value);

const productSlugOverrides: Record<string, string> = {
  "untitled-9mar_10-27": "lime-flower-herbal-tea",
  "untitled-8mar_16-50": "focus-flow-herbal-tea",
  "untitled-27feb_02-36": "wildcrafted-irish-sea-moss-gel",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const looksLikePlaceholderHandle = (value: string) =>
  /^untitled-\d/.test(value) || /^product-\d+/i.test(value);

const getProductSlug = (product: SourceProduct, copy: CuratedProductCopy) =>
  productSlugOverrides[product.handle] ??
  (looksLikePlaceholderHandle(product.handle)
    ? slugify(copy.cardTitle ?? product.title)
    : product.handle);

const curatedProducts: Record<string, CuratedProductCopy> = {
  "untitled-9mar_10-27": {
    cardTitle: "Lime Flower Herbal Tea",
    summary:
      "A delicate lime blossom infusion with a soft floral aroma and an easy, caffeine-free finish.",
    description: [
      "Wild Botanix Lime Flower Herbal Tea is a simple single-herb infusion built for slower daily rituals and a lighter botanical cup.",
      "A beautiful choice for evening wind-downs or any moment that calls for a softer, lighter cup.",
    ],
    ingredients: ["100% lime flower (lime blossom)"],
    ritual: [
      "Steep 1 tea bag in freshly boiled water for 8-10 minutes.",
      "Enjoy as a gentle daytime or evening ritual.",
      "20 tea bags, net weight 40g.",
    ],
    highlights: ["Single-herb infusion", "Light floral profile", "Naturally caffeine free"],
    collections: ["herbal-teas"],
  },
  "wild-botanix-dandelion-burdock-lemongrass-herbal-tea-botanical-blend-20-bags": {
    cardTitle: "Dandelion, Burdock & Lemongrass Tea",
    summary:
      "An earthy, citrus-lifted botanical blend with grounding depth and a fresher finish.",
    description: [
      "This tea pairs dandelion leaf, burdock root and lemongrass for a cup that feels rooted, fresh and slightly brighter than a classic herbal blend.",
      "It suits customers who want a more layered infusion without losing the natural Wild Botanix feel.",
    ],
    ingredients: ["Organic dandelion leaf", "Organic burdock root", "Organic lemongrass"],
    ritual: [
      "Use 1 tea bag per cup and brew for 8-10 minutes.",
      "Ideal for slower morning or afternoon tea routines.",
      "20 tea bags, net weight 40g.",
    ],
    highlights: ["Balanced herbal blend", "Earthy with citrus lift", "Plant-based and caffeine free"],
    collections: ["herbal-teas"],
  },
  "wild-botanix-raspberry-leaf-herbal-tea-organic-botanical-infusion-20-tea-bags": {
    cardTitle: "Raspberry Leaf Herbal Tea",
    summary:
      "A mellow botanical tea with soft earthiness, natural simplicity and a smooth daily brew.",
    description: [
      "Wild Botanix Raspberry Leaf Herbal Tea is a mellow single-botanical infusion with an earthy, easy-drinking character.",
      "It suits daily cups, quiet pauses and anyone who prefers a simple, grounded brew.",
    ],
    ingredients: ["Organic raspberry leaf (Rubus idaeus)"],
    ritual: [
      "Add 1 tea bag to freshly boiled water.",
      "Steep for 8-10 minutes and enjoy 1-2 cups as part of a calmer routine.",
      "20 tea bags, net weight 40g.",
    ],
    highlights: ["Single botanical ingredient", "Smooth everyday brew", "Organic and vegan friendly"],
    collections: ["herbal-teas"],
  },
  "wild-botanix-breathe-botanical-herbal-tea-mullein-eucalyptus-blend-20-tea-bags": {
    cardTitle: "Breathe Botanical Herbal Tea",
    summary:
      "A clean mullein and eucalyptus blend with fresher herbal notes and a softer aromatic finish.",
    description: [
      "This blend is built around botanical freshness, pairing mullein leaf and eucalyptus for a lighter herbal tea experience.",
      "It is a good choice when you want a fresher cup that still feels gentle and easy to enjoy.",
    ],
    ingredients: ["Organic mullein leaf", "Organic eucalyptus leaf"],
    ritual: [
      "Steep 1 tea bag in freshly boiled water for 8-10 minutes.",
      "Best enjoyed as a refreshing cup during calmer parts of the day.",
      "20 tea bags, net weight 40g.",
    ],
    highlights: ["Refreshing botanical blend", "Clean aromatic profile", "Organic and caffeine free"],
    collections: ["herbal-teas"],
  },
  "wild-botanix-immune-support-herbal-tea-elderberry-ginger-echinacea-organic-botanical-blend-20-tea-bags": {
    cardTitle: "Immune Support Herbal Tea",
    summary:
      "A warming elderberry, ginger and echinacea blend designed for richer daily tea rituals.",
    description: [
      "One of the fuller blends in the range, this tea combines elderberry, ginger and echinacea for a richer, more warming cup.",
      "Ideal for cooler days or evenings when you want something deeper and more comforting.",
    ],
    ingredients: ["Organic elderberry", "Organic ginger root", "Organic echinacea"],
    ritual: [
      "Steep 1 tea bag in freshly boiled water for 8-10 minutes.",
      "A richer, more comforting tea style suited to colder days and evening routines.",
      "20 tea bags, net weight 40g.",
    ],
    highlights: ["Warming botanical profile", "Fruity and gently spiced", "Organic, plant-based blend"],
    collections: ["herbal-teas"],
  },
  "untitled-8mar_16-50": {
    cardTitle: "Focus Flow Herbal Tea",
    summary:
      "A thoughtful blend of gotu kola, lemon balm and ginger with a bright, calmer finish.",
    description: [
      "Focus Flow extends the tea range into a more modern ritual space: still botanical, still grounded, but framed around a clearer daily rhythm.",
      "It is well suited to mid-morning resets or slower afternoons when you want a brighter botanical cup.",
    ],
    ingredients: ["Gotu kola", "Lemon balm", "Ginger"],
    ritual: [
      "Brew 1 tea bag in freshly boiled water for 8-10 minutes.",
      "Well suited to mid-morning resets or slower afternoon tea rituals.",
      "20 tea bags per pack.",
    ],
    highlights: ["Bright botanical blend", "Calm everyday ritual", "Fresh ginger lift"],
    collections: ["herbal-teas"],
  },
  "wild-botanix-unrefined-virgin-coconut-oil-organic-cold-pressed-250ml": {
    cardTitle: "Unrefined Virgin Coconut Oil",
    summary:
      "Organic cold-pressed coconut oil for cooking, scalp rituals and everyday moisture care.",
    description: [
      "A versatile cupboard staple that moves easily from cooking to scalp rituals and richer skin care.",
      "Keep it close for everyday meals, dry ends or any moment that calls for a little extra moisture.",
    ],
    ingredients: ["100% organic Cocos Nucifera (coconut) oil"],
    ritual: [
      "Use in cooking or baking as desired.",
      "Apply to skin or hair as a richer moisture step.",
      "250ml jar. Oil naturally solidifies below 24 degrees C.",
    ],
    highlights: ["Organic cold-pressed oil", "For hair, skin and cooking", "Unrefined and versatile"],
    collections: ["botanical-oils", "natural-self-care"],
  },
  "wild-botanix-ghanaian-black-soap-bar-60g-traditional-african-cleanser": {
    cardTitle: "Ghanaian Black Soap Bar",
    summary:
      "A traditional African cleanser for face, body and hair with a simple, grounded feel.",
    description: [
      "A traditional cleanser that brings heritage, simplicity and versatility to everyday self-care.",
      "Use it as part of a face, body or hair routine when you want a more grounded cleanse.",
    ],
    ingredients: ["Traditionally crafted Ghanaian black soap", "Naturally derived cleansing ingredients"],
    ritual: [
      "Lather with water and use on face, body or hair as required.",
      "Rinse thoroughly and follow with a moisturising ritual.",
      "100g bar.",
    ],
    highlights: ["Traditional cleanser", "Face, body and hair use", "Grounded daily self-care"],
    collections: ["natural-self-care"],
  },
  "miracle-spray": {
    cardTitle: "Miracle Spray",
    summary:
      "A lightweight botanical hair mist with clove, nettle, rosemary and marshmallow root.",
    description: [
      "Miracle Spray sits at the heart of the brand's haircare offer, with a daily-use format that feels genuinely useful and easy to understand.",
      "Easy to use through the week, it fits naturally into daily scalp care without leaving a heavy finish.",
    ],
    ingredients: [
      "Clove infusion",
      "Jamaican stinging nettle",
      "Rosemary",
      "Marshmallow root",
      "Calendula",
      "Leucidal Liquid",
      "Rosemary CO2 extract",
    ],
    ritual: [
      "Shake well and mist onto scalp and hair daily or as needed.",
      "Massage gently into the scalp for best results.",
      "Leave in without rinsing. 100ml bottle.",
    ],
    highlights: ["Daily scalp mist", "Lightweight non-greasy feel", "Clove-led botanical blend"],
    collections: ["hair-scalp-care", "natural-self-care"],
  },
  "untitled-27feb_02-36": {
    cardTitle: "Wildcrafted Irish Sea Moss Gel",
    summary:
      "A mineral-rich sea moss gel blended with key lime and dates for a smoother daily ritual.",
    description: [
      "A smoother sea moss gel made for easy use in drinks, breakfast bowls and everyday routines.",
      "Key lime and dates give it a more rounded flavour profile and an easy place in the pantry.",
    ],
    ingredients: ["Wildcrafted Irish sea moss", "Organic fresh key limes", "Organic dates"],
    ritual: [
      "Blend into smoothies or juices.",
      "Stir into soups, stews or wider wellness routines as preferred.",
      "380ml jar.",
    ],
    highlights: ["Mineral-rich gel", "Key lime and date blend", "Easy daily-use format"],
    collections: ["mineral-wellness"],
  },
  "organic-jamaican-soursop-leaves-premium-dried-leaves-for-wellness-30-pack-50g-100g-250g": {
    cardTitle: "Organic Jamaican Soursop Leaves",
    summary:
      "Premium dried soursop leaves for infusions, wellness cupboards and slower herbal routines.",
    description: [
      "This product broadens the tea and herb offer with a more traditional dried-leaf format and multiple sizes.",
      "Ideal for customers who enjoy traditional dried-leaf infusions and want the flexibility of multiple pack sizes.",
    ],
    ingredients: ["100% organic dried soursop leaves"],
    ritual: [
      "Rinse and soak leaves before simmering for an infusion.",
      "Serve plain or with lime or honey to taste.",
      "Available in 30-leaf, 50g, 100g and 250g options.",
    ],
    highlights: ["Loose botanical format", "Multiple pack sizes", "Designed for infusions"],
    collections: ["herbal-teas"],
  },
  "herbal-hair-growth-serum": {
    cardTitle: "Herbal Hair Growth Serum",
    summary:
      "A handcrafted serum built around rich oils and infused botanicals for scalp and hair rituals.",
    description: [
      "A rich botanical serum made for scalp and hair rituals, blending nourishing oils with infused herbs.",
      "Best suited to massage routines, overnight treatments and moments when your hair needs extra care.",
    ],
    ingredients: [
      "Cold-pressed castor oil",
      "Batana oil",
      "Cold-pressed coconut oil",
      "Saw palmetto",
      "Stinging nettle",
      "Pygeum bark",
      "Clove",
      "Calendula",
    ],
    ritual: [
      "Apply a few drops directly to the scalp and massage for 2-3 minutes.",
      "Leave for 30 minutes or overnight, then rinse with a mild shampoo.",
      "Use 2-4 times weekly. 50ml UV-protected dropper bottle.",
    ],
    highlights: ["Handcrafted oil serum", "Scalp ritual focus", "For all hair types"],
    collections: ["hair-scalp-care", "botanical-oils"],
  },
  "cold-pressed-batana-oil": {
    cardTitle: "Cold-Pressed Batana Oil",
    summary:
      "A pure batana oil staple for richly nourishing hair and skin rituals, offered in multiple sizes.",
    description: [
      "Batana oil is one of the signature staples in the Wild Botanix range, loved for richer hair and skin rituals.",
      "Keep it close for intensive moisture care, deeper hair treatments and dry-skin moments that need something nourishing.",
    ],
    ingredients: ["100% cold-pressed batana oil"],
    ritual: [
      "Warm a small amount between the hands and apply through hair or onto dry skin.",
      "Use as an intensive moisture ritual or as a richer finishing step.",
      "Available in 60ml, 120ml and 240ml sizes.",
    ],
    highlights: ["Hero haircare oil", "Rich moisture ritual", "Multiple size options"],
    collections: ["hair-scalp-care", "botanical-oils"],
  },
};

const collectionDefinitions: Record<string, Omit<Collection, "image">> = {
  "herbal-teas": {
    handle: "herbal-teas",
    title: "Herbal Teas",
    eyebrow: "Botanical Tea Collection",
    description:
      "Single-herb infusions and richer botanical blends for slower mornings and calmer evening wind-downs.",
    heroHeading: "Herbal teas for slower mornings and calmer evening rituals",
    heroCopy:
      "Browse organic single-herb infusions and fuller botanical blends chosen to make everyday tea moments feel grounded, warm and easy to return to.",
  },
  "hair-scalp-care": {
    handle: "hair-scalp-care",
    title: "Hair & Scalp Care",
    eyebrow: "Targeted Botanical Care",
    description:
      "Plant-led scalp care, mists and richer oil rituals designed to nourish everyday hair routines.",
    heroHeading: "Scalp and hair care rooted in plant-led rituals",
    heroCopy:
      "From daily scalp mists to richer oils and treatments, this collection brings together the essentials for softer, more cared-for hair routines.",
  },
  "botanical-oils": {
    handle: "botanical-oils",
    title: "Botanical Oils",
    eyebrow: "Oils & Moisture Rituals",
    description:
      "Deeply nourishing oils for scalp, skin and daily care, from richer batana rituals to everyday moisture.",
    heroHeading: "Nourishing oils for hair, skin and everyday care",
    heroCopy:
      "From batana oil to everyday coconut oil, this collection brings together richer moisture rituals for hair, skin and home routines.",
  },
  "natural-self-care": {
    handle: "natural-self-care",
    title: "Natural Self-Care",
    eyebrow: "Body & Ritual Care",
    description:
      "Everyday botanical care products chosen for grounded self-care, gentle cleansing and daily comfort.",
    heroHeading: "Plant-led self-care for everyday rituals",
    heroCopy:
      "Explore gentle cleansers, botanical staples and easy daily-care essentials designed to fit real routines.",
  },
  "mineral-wellness": {
    handle: "mineral-wellness",
    title: "Mineral Wellness",
    eyebrow: "Sea Moss & Mineral Rituals",
    description:
      "Mineral-rich wellness staples created to fit neatly into smoothies, meals and thoughtful daily routines.",
    heroHeading: "Sea moss and mineral wellness made simple",
    heroCopy:
      "Discover sea moss and mineral-rich essentials that feel easy to use, easy to understand and easy to keep in your routine.",
  },
};

const sourceImageFor = (handle: string) =>
  sourceProducts.find((product) => product.handle === handle)?.images?.[0]?.src ??
  "/branding/wild-botaniks-logo.png";

export const collections: Collection[] = [
  {
    ...collectionDefinitions["herbal-teas"],
    image: sourceImageFor(
      "wild-botanix-immune-support-herbal-tea-elderberry-ginger-echinacea-organic-botanical-blend-20-tea-bags",
    ),
  },
  {
    ...collectionDefinitions["hair-scalp-care"],
    image: sourceImageFor("herbal-hair-growth-serum"),
  },
  {
    ...collectionDefinitions["botanical-oils"],
    image: sourceImageFor("cold-pressed-batana-oil"),
  },
  {
    ...collectionDefinitions["natural-self-care"],
    image: sourceImageFor("wild-botanix-ghanaian-black-soap-bar-60g-traditional-african-cleanser"),
  },
  {
    ...collectionDefinitions["mineral-wellness"],
    image: sourceImageFor("untitled-27feb_02-36"),
  },
];

const fallbackCopy = (product: SourceProduct): CuratedProductCopy => ({
  cardTitle: product.title,
  summary: "A Wild Botanix wellness staple for plant-led daily rituals.",
  description: [
    "A Wild Botanix product created to fit naturally into thoughtful, plant-led routines.",
    "Use the ingredients, highlights and ritual notes below to choose the option that suits you best.",
  ],
  ingredients: ["Please check the product label for the most up-to-date ingredient list."],
  ritual: ["Please follow the product label for the most up-to-date usage guidance."],
  highlights: normaliseTags(product.tags).slice(0, 3),
  collections: ["natural-self-care"],
});

export const products: Product[] = sourceProducts
  .map((product) => {
    const copy = curatedProducts[product.handle] ?? fallbackCopy(product);
    const variants = product.variants.map((variant) => ({
      id: variant.id,
      title: variant.title,
      price: toNumber(variant.price) ?? 0,
      compareAtPrice: toNumber(variant.compare_at_price),
      available: variant.available,
    }));

    const prices = variants.map((variant) => variant.price);
    const compareAtPrices = variants
      .map((variant) => variant.compareAtPrice)
      .filter((value): value is number => value !== null);

    return {
      id: product.id,
      handle: product.handle,
      slug: getProductSlug(product, copy),
      title: product.title,
      cardTitle: copy.cardTitle ?? product.title,
      summary: copy.summary,
      description: copy.description,
      ingredients: copy.ingredients,
      highlights: copy.highlights,
      ritual: copy.ritual,
      images: product.images.map((image) => image.src),
      variants,
      tags: normaliseTags(product.tags),
      priceFrom: Math.min(...prices),
      compareAtFrom: compareAtPrices.length > 0 ? Math.min(...compareAtPrices) : null,
      available: variants.some((variant) => variant.available),
      collections: copy.collections,
      primaryCollection: copy.collections[0],
    };
  })
  .sort((left, right) => left.cardTitle.localeCompare(right.cardTitle));

export const getProductByHandle = (handle: string) =>
  products.find((product) => product.slug === handle || product.handle === handle);

export const getProductPath = (product: Pick<Product, "slug">) => `/products/${product.slug}`;

export const getCollectionByHandle = (handle: string) =>
  collections.find((collection) => collection.handle === handle);

export const getProductsForCollection = (handle: string) =>
  products.filter((product) => product.collections.includes(handle));

export const featuredProductHandles = [
  "cold-pressed-batana-oil",
  "herbal-hair-growth-serum",
  "untitled-27feb_02-36",
  "wild-botanix-immune-support-herbal-tea-elderberry-ginger-echinacea-organic-botanical-blend-20-tea-bags",
];

export const featuredProducts = featuredProductHandles
  .map((handle) => getProductByHandle(handle))
  .filter((product): product is Product => Boolean(product));

export const homeCollectionHandles = [
  "herbal-teas",
  "hair-scalp-care",
  "botanical-oils",
  "natural-self-care",
];

export const trustPoints = [
  {
    title: "Free UK delivery over GBP 50",
    body: "A little extra ease when you're restocking teas, oils or self-care favourites.",
  },
  {
    title: "Herbal teas for everyday rituals",
    body: "From lighter floral infusions to fuller blends, every cup is chosen for slower mornings and calmer evenings.",
  },
  {
    title: "Sea moss, batana oil & scalp care",
    body: "Mineral-rich staples and targeted botanical care sit alongside the teas to support a wider daily wellness routine.",
  },
  {
    title: "Plant-led self-care",
    body: "Thoughtful essentials for hair, body and home routines, all rooted in a calm botanical point of view.",
  },
];

export const trustBadges = [
  "Premium botanical wellness",
  "Free UK delivery over GBP 50",
  "Herbal teas, sea moss & oils",
  "Plant-led daily rituals",
];

export const sourceProofCards = [
  {
    title: "Rooted in real rituals",
    body:
      "Explore a considered edit of herbal teas, sea moss, botanical oils and self-care essentials chosen for calmer daily routines.",
    href: "/collections",
    cta: "Explore collections",
  },
  {
    title: `${products.length} products to explore`,
    body: `From single-herb teas to batana oil and sea moss, the range is arranged across ${collections.length} easy-to-shop collections.`,
    href: "/shop",
    cta: "Shop all products",
  },
  {
    title: "A calmer path to checkout",
    body:
      "Move from collections to product details and on to your basket in a clear, comfortable shopping flow.",
    href: "/checkout",
    cta: "View checkout",
  },
];

export const ritualSteps = [
  {
    title: "Choose your ritual",
    body: "Start with herbal teas, sea moss, scalp care or self-care essentials and shop by what suits your day.",
  },
  {
    title: "Learn before you buy",
    body: "Each product page brings together ingredients, key highlights and ritual notes so you can choose with confidence.",
  },
  {
    title: "Build your basket",
    body: "Add your favourites, review your order and move toward checkout in a calm, easy flow.",
  },
];

export const collectionExperienceRows = [
  {
    handle: "herbal-teas",
    eyebrow: "Tea rituals",
    title: "Botanical teas arranged around the moments you actually reach for them.",
    body:
      "From lighter floral cups to fuller blends, the tea range is easy to browse by mood, flavour and daily rhythm.",
  },
  {
    handle: "hair-scalp-care",
    eyebrow: "Hair growth and scalp care",
    title: "Hair and scalp care that feels clear, nourishing and easy to trust.",
    body:
      "Serums, sprays and richer botanical treatments are gathered into one calm collection for everyday hair rituals.",
  },
  {
    handle: "botanical-oils",
    eyebrow: "Oils and moisture rituals",
    title: "Rich oils given the space they need to shine in a daily routine.",
    body:
      "Batana oil and other moisture staples are easy to discover when you want richer care for hair, skin or both.",
  },
  {
    handle: "natural-self-care",
    eyebrow: "Body and ritual care",
    title: "Self-care essentials that feel curated, grounded and useful.",
    body:
      "Everyday botanical care products are grouped so you can move from gentle cleansing to richer moisture care without the clutter.",
  },
];

export const ritualJourney = [
  {
    step: "01",
    eyebrow: "Discover",
    title: "Start with the ritual that fits your day.",
    body:
      "Browse by herbal teas, sea moss, oils, self-care or scalp rituals before you narrow down to individual products.",
    image: "/branding/wild-botaniks-hero-apr25.webp",
  },
  {
    step: "02",
    eyebrow: "Learn",
    title: "See the ingredients, highlights and usage notes at a glance.",
    body:
      "Product pages bring together the details that matter most, so it is easier to decide what belongs in your routine.",
    image: sourceImageFor("cold-pressed-batana-oil"),
  },
  {
    step: "03",
    eyebrow: "Checkout",
    title: "Move from basket to checkout with less friction.",
    body:
      "Saved details, clear next steps and a simple order summary help the final stage feel calm and easy to follow.",
    image: sourceImageFor("miracle-spray"),
  },
];

export const audienceHighlights = {
  whoItsFor: [
    "Tea drinkers building calmer routines around organic herbs and warming botanical blends.",
    "Customers looking for sea moss, botanical oils and targeted hair & scalp care rooted in plant-led ingredients.",
    "Anyone who wants natural self-care woven easily into morning starts, evening wind-downs and everyday rituals.",
  ],
  whatYouGet: [
    "Herbal teas, mineral wellness and botanical rituals arranged into clear, easy-to-shop collections.",
    "Plant-led hair, scalp and self-care essentials chosen for grounded daily care.",
    "A Wild Botanix range designed to feel warm, grounded and ready for daily use.",
  ],
};

export const brandPrinciples = [
  {
    title: "Herbal teas for quieter moments",
    body:
      "Organic herbal blends and single-herb infusions are made for slower mornings, evening wind-downs and everyday calm.",
  },
  {
    title: "Sea moss, oils and scalp rituals",
    body:
      "Mineral wellness, batana oil and targeted botanical care bring richer support to hair, scalp and skin rituals.",
  },
  {
    title: "Natural self-care, rooted in plants",
    body:
      "Gentle soaps, nourishing oils and daily care essentials make it easy to build a grounded routine around plant-led ingredients.",
  },
];

export type ForestEditorialIconKey =
  | "leaf"
  | "waves"
  | "droplets"
  | "flower"
  | "cup"
  | "shield";

export const forestEditorialFeatureGroups = [
  {
    eyebrow: "Tea rituals",
    items: [
      {
        icon: "leaf" as const,
        title: "Herbal teas",
        body:
          "Organic herbal blends crafted to support calm, focus and everyday wellness, perfect for slower mornings and mindful moments.",
        notes: ["Calm", "Clarity", "Balance"],
      },
      {
        icon: "waves" as const,
        title: "Sea moss",
        body:
          "A mineral-rich staple that fits easily into smoothies, breakfast bowls and everyday kitchen rituals.",
        notes: ["Mineral-rich", "Kitchen-friendly", "Everyday use"],
      },
    ],
  },
  {
    eyebrow: "Hair & scalp rituals",
    items: [
      {
        icon: "droplets" as const,
        title: "Oils & treatments",
        body:
          "Botanical oils and targeted treatments that help nourish roots, soften strands and bring back natural shine.",
        notes: ["Nourish", "Smooth", "Restore"],
      },
      {
        icon: "flower" as const,
        title: "Scalp care",
        body:
          "Soothing, plant-led formulas created to comfort the scalp and keep your hair routine feeling balanced.",
        notes: ["Soothe", "Balance", "Refresh"],
      },
    ],
  },
];

export const forestEditorialValues = [
  {
    icon: "leaf" as const,
    title: "Plant-led ingredients",
    body:
      "We use organic herbs, botanical extracts and mineral-rich sea moss in everyday routines designed to feel grounded and gentle.",
  },
  {
    icon: "shield" as const,
    title: "Sustainable wellness",
    body:
      "Responsibly sourced, small-batch formulas that bring care to people, routines and the planet.",
  },
  {
    icon: "cup" as const,
    title: "Rituals that fit your day",
    body:
      "From morning teas to evening wind-downs, small rituals create calm, clarity and a steadier daily rhythm.",
  },
  {
    icon: "flower" as const,
    title: "Thoughtful everyday care",
    body:
      "Plant-led formulas and grounded routines that feel easy to use, easy to trust and easy to revisit.",
  },
];

export const forestEditorialChecklist = [
  "Herbal teas and botanical blends curated for calm, clarity and balance.",
  "Sea moss and mineral wellness for smoothies, breakfast bowls and thoughtful daily routines.",
  "Hair and scalp care rooted in nature for softer, more cared-for rituals.",
  "Plant-led self-care essentials for daily rituals that feel good.",
];

export const faqs = [
  {
    question: "What can I shop at Wild Botanix?",
    answer:
      "Wild Botanix brings together herbal teas, sea moss, batana oil, hair and scalp care, botanical oils and everyday self-care essentials in one calm, easy-to-browse collection.",
  },
  {
    question: "How do I choose the right ritual for me?",
    answer:
      "Start with the collection that matches your routine, whether that is a slower tea moment, mineral-rich wellness, nourishing oils or targeted scalp care. Product pages then guide you through ingredients, highlights and ritual notes.",
  },
  {
    question: "Do you offer free UK delivery?",
    answer:
      "Yes. Wild Botanix offers free UK delivery on orders over GBP 50.",
  },
  {
    question: "Can I create an account for faster checkout?",
    answer:
      "Yes. You can create an account to save your delivery details, manage your information and keep future orders easier to review.",
  },
];

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Privacy",
    intro:
      "Your privacy matters. This page explains the information Wild Botanix may collect when you shop, create an account or get in touch.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "Wild Botanix may collect contact details, delivery information and order history when you place an order or create an account.",
          "If you choose to hear from the brand, your marketing preferences should be kept separate from order updates and support messages.",
        ],
      },
      {
        heading: "How it is used",
        body: [
          "Information is used to process orders, answer enquiries, manage returns and make shopping easier the next time you visit.",
          "Marketing messages should only be sent when you have chosen to receive them.",
        ],
      },
      {
        heading: "Keeping information safe",
        body: [
          "Customer information should be handled carefully and only used for order fulfilment, support and essential store communication.",
        ],
      },
    ],
  },
  {
    slug: "shipping",
    title: "Shipping & Delivery",
    intro:
      "Find clear information on delivery options, order updates and UK shipping expectations.",
    sections: [
      {
        heading: "Delivery scope",
        body: [
          "Wild Botanix serves UK shoppers with delivery information designed to stay simple and easy to follow.",
          "Free UK delivery over GBP 50 is available across the store.",
        ],
      },
      {
        heading: "Order handling",
        body: [
          "Customers should receive clear order confirmation, dispatch updates and a simpler path to contact support if anything needs attention.",
        ],
      },
      {
        heading: "Need help with an order?",
        body: [
          "If you need help with delivery, contact the team using the details on the contact page and include your order number where possible.",
        ],
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns",
    intro:
      "Returns are framed in plain, customer-friendly language so the policy feels trustworthy rather than buried.",
    sections: [
      {
        heading: "Returns process",
        body: [
          "If something is not right, contact the team with your order number and the reason for your return so they can help as quickly as possible.",
          "Items should be returned in line with the brand's returns guidance and in suitable condition.",
        ],
      },
      {
        heading: "Support route",
        body: [
          `For returns or order questions, contact ${sourcePages.contact.email} or call ${sourcePages.contact.phone}.`,
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    intro:
      "These terms explain how Wild Botanix orders, products and customer responsibilities are handled.",
    sections: [
      {
        heading: "Store use",
        body: [
          "Customers can browse the collection, create an account and place orders through the Wild Botanix store.",
          "Product information should remain accurate, commercially clear and free from unsupported health claims.",
        ],
      },
      {
        heading: "Ordering & availability",
        body: [
          "Prices, availability and delivery details should be shown as clearly as possible at the point of purchase.",
          "If anything changes after an order is placed, the customer should be contacted using the details provided at checkout.",
        ],
      },
    ],
  },
];

export const journalSpotlight = {
  title: "The Power of Cold-Pressed Batana Oil",
  eyebrow: "Batana oil spotlight",
  summary:
    "Batana oil stands out as one of the brand's signature rituals, with rich texture and a clear place in hair and skin care routines.",
  href: sourcePages.blogs[0]?.articleUrl ?? "#",
};

export const siteData = {
  brand: {
    name: "Wild Botanix UK",
    tagline: "Rooted in Nature. Designed for You.",
    headline: "Botanical wellness rituals for calmer hair, body and everyday care.",
    subheading:
      "Discover herbal teas, sea moss, batana oil and natural self-care essentials for calmer daily rituals.",
    logo: "/branding/wild-botaniks-logo.png",
    heroImage: "/branding/wild-botaniks-hero-apr25.webp",
    socialImage: "/branding/wild-botaniks-hero-apr25.png",
    forestSectionImage: "/branding/wild-botaniks-forest-path.webp",
  },
  about: {
    title: sourcePages.about.title,
    intro:
      "Wild Botanix Limited brings together nature and wellness in a premium collection of herbal teas, sea moss, botanical oils and natural self-care essentials.",
    story: [
      "Founded by childhood friends with a shared love of holistic living, Wild Botanix brings nature and wellness together in one thoughtful collection.",
      "From herbal teas and mineral-rich sea moss to batana oil, scalp care and gentle self-care, the range is built around products people can return to every day.",
      "Each product is chosen to help slow the pace, support simple rituals and bring a little more care to mornings, evenings and everything in between.",
    ],
    values: [
      {
        title: "Botanical quality",
        body: "Thoughtfully chosen herbs, oils and plant-led ingredients sit at the heart of every Wild Botanix ritual.",
      },
      {
        title: "Everyday rituals",
        body: "Products are designed to fit real mornings, evening wind-downs and daily self-care moments.",
      },
      {
        title: "Care in every detail",
        body: "From tea blends to scalp treatments, each collection is chosen to feel grounded, gentle and easy to trust.",
      },
    ],
  },
  contact: {
    title: sourcePages.contact.title,
    email: sourcePages.contact.email,
    secondaryEmail: sourcePages.contact.secondaryEmail,
    phone: sourcePages.contact.phone,
    hours: sourcePages.contact.hours,
    instagram: sourcePages.contact.instagram,
    facebook: sourcePages.contact.facebook,
    tiktok: sourcePages.contact.tiktok,
  },
};
