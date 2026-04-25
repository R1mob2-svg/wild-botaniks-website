import rawProducts from "./data/source-products.json";
import rawPages from "./data/source-pages.json";

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

const curatedProducts: Record<string, CuratedProductCopy> = {
  "untitled-9mar_10-27": {
    cardTitle: "Lime Flower Herbal Tea",
    summary:
      "A delicate lime blossom infusion with a soft floral aroma and an easy, caffeine-free finish.",
    description: [
      "Wild Botanix Lime Flower Herbal Tea is a simple single-herb infusion built for slower daily rituals and a lighter botanical cup.",
      "The rebuild keeps the live product intact while presenting it with cleaner premium copy and a stronger storefront rhythm.",
    ],
    ingredients: ["100% lime flower (lime blossom)"],
    ritual: [
      "Steep 1 tea bag in freshly boiled water for 8â€“10 minutes.",
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
      "Use 1 tea bag per cup and brew for 8â€“10 minutes.",
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
      "Wild Botanix Raspberry Leaf Herbal Tea keeps the source site's single-botanical simplicity while giving it a more premium storefront presentation.",
      "It reads best as a grounded, everyday tea ritual rather than another crowded template listing.",
    ],
    ingredients: ["Organic raspberry leaf (Rubus idaeus)"],
    ritual: [
      "Add 1 tea bag to freshly boiled water.",
      "Steep for 8â€“10 minutes and enjoy 1â€“2 cups as part of a calmer routine.",
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
      "The rebuild preserves the live product intent while stripping away the cluttered presentation around it.",
    ],
    ingredients: ["Organic mullein leaf", "Organic eucalyptus leaf"],
    ritual: [
      "Steep 1 tea bag in freshly boiled water for 8â€“10 minutes.",
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
      "The live catalogue positions this as one of the fuller, warmer teas in the Wild Botanix range, and that product intent is preserved here.",
      "The new presentation gives it stronger hierarchy, cleaner visual trust and a more premium shopping flow.",
    ],
    ingredients: ["Organic elderberry", "Organic ginger root", "Organic echinacea"],
    ritual: [
      "Steep 1 tea bag in freshly boiled water for 8â€“10 minutes.",
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
      "It fits the Wild Botanix brand best when presented as a neat premium tea rather than a cluttered product wall item.",
    ],
    ingredients: ["Gotu kola", "Lemon balm", "Ginger"],
    ritual: [
      "Brew 1 tea bag in freshly boiled water for 8â€“10 minutes.",
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
      "This is one of the most versatile products in the catalogue, bridging botanical self-care with pantry-friendly use.",
      "The rebuild frames it as a clean dual-use staple with better hierarchy and a more premium product story.",
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
      "A traditional African cleanser for face, body and hair, presented with clearer premium structure.",
    description: [
      "Wild Botanix Ghanaian Black Soap adds heritage and cleansing simplicity to the catalogue in a way the current site does not frame strongly enough.",
      "The new site gives it better visual trust, stronger grouping and cleaner purchase cues.",
    ],
    ingredients: ["Traditionally crafted Ghanaian black soap", "Naturally derived cleansing ingredients"],
    ritual: [
      "Lather with water and use on face, body or hair as required.",
      "Rinse thoroughly and follow with a moisturising ritual.",
      "100g bar.",
    ],
    highlights: ["Traditional cleanser", "Face, body and hair use", "Cleaner self-care category fit"],
    collections: ["natural-self-care"],
  },
  "miracle-spray": {
    cardTitle: "Miracle Spray",
    summary:
      "A lightweight botanical hair mist with clove, nettle, rosemary and marshmallow root.",
    description: [
      "Miracle Spray sits at the heart of the brand's haircare offer, with a daily-use format that feels genuinely useful and easy to understand.",
      "The rebuild positions it as a premium routine product rather than another marketplace-style listing.",
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
      "Sea moss is one of the clearest commercial anchors in the Wild Botanix range, and it deserves a sharper, more premium product experience.",
      "This rebuild preserves the ingredients and everyday usage intent while giving the product a much stronger storefront presence.",
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
      "The rebuild cleans up the sizing story and gives the product a stronger place inside the catalogue.",
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
      "The product name and intent are preserved from the live site, while the new experience reframes it with stronger trust, cleaner content and better ecommerce presentation.",
      "It works best as a hero product within the hair and scalp care collection.",
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
      "Batana oil is one of the clearest hero products in the Wild Botanix range and a key commercial anchor for the rebuild.",
      "The new site gives it better prominence, stronger trust framing and a much more premium product page experience.",
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
      "Single-herb infusions and more layered botanical blends, rebuilt into a cleaner tea experience.",
    heroHeading: "Tea rituals with calmer structure and better taste signals",
    heroCopy:
      "The live catalogue has the right tea products but weak presentation. This rebuild turns that offer into a more premium, easier-to-browse collection.",
  },
  "hair-scalp-care": {
    handle: "hair-scalp-care",
    title: "Hair & Scalp Care",
    eyebrow: "Targeted Botanical Care",
    description:
      "A tighter, more premium grouping of the brand's botanical haircare staples, from mists to richer oil rituals.",
    heroHeading: "Haircare that feels custom-built, not template-led",
    heroCopy:
      "This collection preserves the live product range while giving it stronger imagery, cleaner hierarchy and more confident product pages.",
  },
  "botanical-oils": {
    handle: "botanical-oils",
    title: "Botanical Oils",
    eyebrow: "Oils & Moisture Rituals",
    description:
      "Deeply nourishing oils for scalp, skin and daily care, presented with a sharper premium feel.",
    heroHeading: "Rich oils, reorganised properly",
    heroCopy:
      "From batana oil to dual-use coconut oil, this rebuild gives the oil category stronger positioning and a more elegant purchase flow.",
  },
  "natural-self-care": {
    handle: "natural-self-care",
    title: "Natural Self-Care",
    eyebrow: "Body & Ritual Care",
    description:
      "Everyday botanical care products with a cleaner feel, better grouping and less template clutter.",
    heroHeading: "Self-care without the generic theme feel",
    heroCopy:
      "We preserve the live range while replacing weak hierarchy with premium cards, cleaner spacing and stronger trust cues.",
  },
  "mineral-wellness": {
    handle: "mineral-wellness",
    title: "Mineral Wellness",
    eyebrow: "Sea Moss & Mineral Rituals",
    description:
      "Mineral-led wellness products presented with more clarity, cleaner storytelling and stronger purchase flow.",
    heroHeading: "Simple mineral wellness, elevated",
    heroCopy:
      "The mineral category is currently under-framed. The rebuild gives it proper editorial weight and a more premium ecommerce treatment.",
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
  summary: "Premium botanical product preserved from the live Wild Botanix source catalogue.",
  description: [
    "This product is preserved from the live Wild Botanix catalogue.",
    "The rebuild keeps the business offer intact while improving the structure and storefront quality around it.",
  ],
  ingredients: ["See live source catalogue for the current ingredient breakdown."],
  ritual: ["Refer to the live source product for additional usage notes."],
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
  products.find((product) => product.handle === handle);

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
    body: "Preserved from the live Wild Botanix commerce offer and surfaced more clearly throughout the rebuilt shop.",
  },
  {
    title: "Real ecommerce structure",
    body: "Account, cart and checkout flows are treated as first-class customer surfaces rather than afterthoughts.",
  },
  {
    title: "Premium botanical positioning",
    body: "Lighter palettes, cleaner composition and calmer hierarchy replace the weak template feel of the current store.",
  },
  {
    title: "Catalogue preserved, execution replaced",
    body: "The products and core business information stay rooted in the live site while the storefront is rebuilt properly.",
  },
];

export const ritualSteps = [
  {
    title: "Choose a collection",
    body: "Move through tea rituals, oils, self-care and mineral wellness without getting dumped into a cluttered product wall.",
  },
  {
    title: "Explore the product story",
    body: "Each product page keeps the real offer intact while presenting ingredients, ritual notes and purchase actions more cleanly.",
  },
  {
    title: "Checkout with confidence",
    body: "Cart, account and checkout surfaces are already structured for a future payment integration instead of being left vague.",
  },
];

export const faqs = [
  {
    question: "Are the products on this rebuild based on the live Wild Botanix store?",
    answer:
      "Yes. The catalogue, product names, prices and core intent come from the live Wild Botanix source site. The rebuild improves design, structure and shopping flow around that source of truth.",
  },
  {
    question: "Is checkout live?",
    answer:
      "This replacement build is integration-ready. The checkout flow is structured honestly for a future live payment handoff, but production payment wiring still needs to be connected before launch.",
  },
  {
    question: "Can customers create accounts and save details?",
    answer:
      "Yes. The experience includes account creation, sign-in, a customer area and saved address handling so the user-facing commerce journey is already mapped properly.",
  },
  {
    question: "How has the catalogue been improved?",
    answer:
      "The live site's products are preserved, but the structure is cleaner: stronger collections, better product cards, clearer navigation and more premium editorial rhythm throughout.",
  },
];

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Privacy",
    intro:
      "This rebuilt Wild Botanix experience keeps privacy information easy to scan and ready for final legal review before production launch.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "Customer account and checkout flows collect the standard information required to fulfil orders, support customers and manage the shopping experience.",
          "That includes contact details, shipping information and order history when a customer creates an account.",
        ],
      },
      {
        heading: "How it is used",
        body: [
          "Information is used to process orders, provide customer support, manage returns and improve the store experience.",
          "Marketing communication should always remain opt-in and clearly separated from transactional messages.",
        ],
      },
      {
        heading: "Launch note",
        body: [
          "Final production legal wording should be reviewed against the live policy source before go-live.",
        ],
      },
    ],
  },
  {
    slug: "shipping",
    title: "Shipping & Delivery",
    intro:
      "Delivery information is presented more cleanly in the rebuild, while the operational details remain ready for final review.",
    sections: [
      {
        heading: "Delivery scope",
        body: [
          "Wild Botanix currently presents itself as a UK-serving brand, and this rebuild keeps the customer journey centred around a clean UK-first delivery experience.",
          "Free UK delivery over GBP 50 is preserved as a core trust message from the live store.",
        ],
      },
      {
        heading: "Order handling",
        body: [
          "Customers should receive clear order confirmation, dispatch updates and a simpler path to contact support if anything needs attention.",
        ],
      },
      {
        heading: "Launch note",
        body: [
          "Specific dispatch windows and carrier commitments should be confirmed with the business before launch.",
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
          "Customers should be able to contact support with their order number and reason for return so requests can be handled quickly and clearly.",
          "Return eligibility, product condition requirements and refund timing should be stated in the final approved policy copy before production.",
        ],
      },
      {
        heading: "Support route",
        body: [
          `Current support contact surfaced from the live store: ${sourcePages.contact.email} and ${sourcePages.contact.phone}.`,
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    intro:
      "Core trading terms, fulfilment expectations and customer responsibilities sit here in a cleaner, easier-to-read format.",
    sections: [
      {
        heading: "Store use",
        body: [
          "Customers can browse the catalogue, create accounts and place orders through a cleaner ecommerce flow built around the Wild Botanix product range.",
          "Product information should remain accurate, commercially clear and free from unsupported health claims.",
        ],
      },
      {
        heading: "Commercial clarity",
        body: [
          "Pricing, availability, delivery and returns information should remain visible at the point customers need it rather than hidden in theme-style footer clutter.",
        ],
      },
      {
        heading: "Launch note",
        body: [
          "Final terms should be legally reviewed before launch so the production site reflects the business's preferred wording.",
        ],
      },
    ],
  },
];

export const journalSpotlight = {
  title: "The Power of Cold-Pressed Batana Oil",
  eyebrow: "From the Source Blog",
  summary:
    "The live site already uses batana oil as a signature product story. In the rebuild, that editorial thread becomes a proper brand-building cue instead of a buried side-note.",
  href: sourcePages.blogs[0]?.articleUrl ?? "#",
};

export const siteData = {
  brand: {
    name: "Wild Botanix UK",
    tagline: "Rooted in Nature. Designed for You.",
    headline: "Botanical wellness rituals for calmer hair, body and everyday care.",
    subheading:
      "Discover herbal teas, sea moss, batana oil and natural self-care essentials arranged into a cleaner, more atmospheric shopping experience.",
    logo: "/branding/wild-botaniks-logo.png",
    heroImage: "/branding/wild-botaniks-hero-fullscene.png",
  },
  about: {
    title: sourcePages.about.title,
    intro: sourcePages.about.body,
    story: [
      "Wild Botanix Limited brings together herbal teas, sea moss, batana oil, botanical haircare and natural self-care under one wellness-led brand.",
      "The live store already has the right ingredients for a serious ecommerce brand: a recognisable product range, a clear botanical theme and a more premium aspiration than the current template execution communicates.",
      "This rebuild keeps the business and products intact while replacing weak hierarchy, cluttered navigation and low-end theme feel with something cleaner, calmer and more commercially credible.",
    ],
    values: [
      {
        title: "Botanical quality",
        body: "Products stay rooted in plant-led rituals, clearer ingredient framing and natural daily care.",
      },
      {
        title: "Premium structure",
        body: "Collections, product cards and page hierarchy are rebuilt to feel custom-composed rather than theme-dumped.",
      },
      {
        title: "Commercial honesty",
        body: "Account, cart and checkout flows are shown properly as user-facing commerce surfaces, ready for production integration.",
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
