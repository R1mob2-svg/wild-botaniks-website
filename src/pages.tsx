import { useDeferredValue, useEffect, useRef, useState, type SyntheticEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CupSoda,
  ChevronRight,
  Droplets,
  Flower2,
  Leaf,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  UserRound,
  Waves,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { blogPosts } from "./blogData";
import {
  audienceHighlights,
  brandPrinciples,
  collections,
  faqs,
  featuredProducts,
  forestEditorialFeatureGroups,
  formatCurrency,
  getCollectionByHandle,
  getOfficialStoreAccountUrl,
  getOfficialStoreCollectionUrl,
  getOfficialStoreCollectionsUrl,
  getOfficialStoreProductUrl,
  getOfficialStoreSecureStoreUrl,
  getOfficialStoreShopUrl,
  getProductByHandle,
  getProductPath,
  getProductsForCollection,
  homeCollectionHandles,
  legalPages,
  products,
  ritualSteps,
  siteData,
  trustPoints,
  type ForestEditorialIconKey,
  type Product,
} from "./siteData";
import {
  ActionLink,
  CollectionCard,
  EmptyState,
  PageMeta,
  PriceStack,
  ProductCard,
  SectionHeading,
  Surface,
} from "./ui";
import {
  buildBreadcrumbSchema,
  buildCollectionSchema,
  buildFAQSchema,
  buildItemListSchema,
  buildProductSchema,
  buildWebPageSchema,
  getHomeSeoSchema,
} from "./seo";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];

const forestEditorialLowerPoints: Array<{
  icon: ForestEditorialIconKey;
  title: string;
  body: string;
}> = [
  {
    icon: "leaf",
    title: "Plant-led ingredients",
    body: "Organic herbs, botanical extracts and mineral-rich sea moss.",
  },
  {
    icon: "shield",
    title: "Sustainable wellness",
    body: "Responsibly sourced. Small-batch formulas with care for people and the planet.",
  },
  {
    icon: "cup",
    title: "Rituals that fit your day",
    body: "Morning teas to evening wind-downs. Simple rituals for a steadier rhythm.",
  },
];

const forestEditorialLowerBenefits = [
  {
    title: "Calm, clarity & balance",
    body: "Herbal teas and botanical blends curated for calm, clarity and balance.",
  },
  {
    title: "Smooth mornings",
    body: "Sea moss and mineral wellness for smoother mornings and mindful routines.",
  },
  {
    title: "Healthy hair & scalp",
    body: "Plant-led oils and treatments to nourish roots and care for scalp.",
  },
  {
    title: "Everyday self-care",
    body: "Self-care essentials that feel good and support your daily rituals.",
  },
];

const sortProducts = (items: Product[], sort: string) => {
  const copy = [...items];
  switch (sort) {
    case "price-asc":
      return copy.sort((left, right) => left.priceFrom - right.priceFrom);
    case "price-desc":
      return copy.sort((left, right) => right.priceFrom - left.priceFrom);
    case "name-asc":
      return copy.sort((left, right) => left.cardTitle.localeCompare(right.cardTitle));
    default:
      return copy;
  }
};

const forestSectionVariant = "editorial" as const;

const forestIconMap: Record<ForestEditorialIconKey, typeof Leaf> = {
  leaf: Leaf,
  waves: Waves,
  droplets: Droplets,
  flower: Flower2,
  cup: CupSoda,
  shield: ShieldCheck,
};

function ForestEditorialIcon({
  icon,
  size = 26,
}: {
  icon: ForestEditorialIconKey;
  size?: number;
}) {
  const Icon = forestIconMap[icon];

  return <Icon size={size} strokeWidth={1.65} aria-hidden="true" />;
}

function ForestParallaxSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;

      if (!sectionRef.current || !bgRef.current || !overlayRef.current) {
        return;
      }

      if (mediaQuery.matches) {
        bgRef.current.style.transform = "translate3d(0, 0%, 0) scale(1)";
        overlayRef.current.style.opacity = "1";
        overlayRef.current.style.setProperty("--forest-scroll-darken", "0.12");
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const totalTravel = rect.height + viewportHeight;
      const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / totalTravel));
      const isMobile = window.innerWidth <= 780;
      const startY = isMobile ? 1.75 : 2.4;
      const endY = isMobile ? -1.1 : -1.9;
      const startScale = 1;
      const endScale = isMobile ? 1.005 : 1.01;
      const y = startY + (endY - startY) * progress;
      const scale = startScale + (endScale - startScale) * progress;
      const darken = progress * 0.3;

      bgRef.current.style.transform = `translate3d(0, ${y}%, 0) scale(${scale})`;
      overlayRef.current.style.opacity = "1";
      overlayRef.current.style.setProperty("--forest-scroll-darken", darken.toFixed(3));
    };

    const onChange = () => {
      if (frame !== 0) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    mediaQuery.addEventListener?.("change", onChange);

    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
      mediaQuery.removeEventListener?.("change", onChange);

      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const renderCardLayout = () => (
    <>
      <div className="wild-botanix-content-grid">
        <div className="wild-botanix-content-copy">
          <p className="eyebrow">Plant-led rituals</p>
          <h2>Herbal teas, sea moss and botanical care for calmer daily rituals.</h2>
          <p>
            From organic herbal infusions and mineral-rich sea moss to hair and scalp oils,
            botanical self-care and soothing plant-led blends, Wild Botanix brings gentle wellness
            into morning starts, evening wind-downs and everyday routines.
          </p>
          <Link className="button button--ghost" to="/collections">
            Explore botanical rituals <ArrowRight size={16} />
          </Link>
        </div>

        <div className="wild-botanix-content-cards">
          {brandPrinciples.map((principle) => (
            <Surface className="wild-botanix-content-card" key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </Surface>
          ))}
        </div>
      </div>

      <div className="wild-botanix-content-columns">
        <Surface className="wild-botanix-content-card">
          <p className="eyebrow">Who it is for</p>
          <ul className="wild-botanix-content-list">
            {audienceHighlights.whoItsFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Surface>

        <Surface className="wild-botanix-content-card">
          <p className="eyebrow">What you get</p>
          <ul className="wild-botanix-content-list">
            {audienceHighlights.whatYouGet.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Surface>
      </div>
    </>
  );

  const renderEditorialLayout = () => (
    <div className="wild-botanix-editorial">
      <div className="wild-botanix-content-grid wild-botanix-content-grid--editorial">
        <div className="wild-botanix-content-copy wild-botanix-content-copy--editorial">
          <p className="eyebrow">Plant-led rituals</p>
          <h2>Herbal teas, sea moss and botanical care for calmer daily rituals.</h2>
          <div className="wild-botanix-divider" aria-hidden="true">
            <span className="wild-botanix-divider__line" />
            <span className="wild-botanix-divider__icon">
              <ForestEditorialIcon icon="leaf" size={24} />
            </span>
            <span className="wild-botanix-divider__line" />
          </div>
          <p>
            From organic herbal infusions and mineral-rich sea moss to hair and scalp oils,
            botanical self-care and soothing plant-led blends, Wild Botanix brings gentle wellness
            into morning starts, evening wind-downs and everyday routines.
          </p>
          <ActionLink className="wild-botanix-inline-cta" href={getOfficialStoreCollectionsUrl()}>
            <span>Explore botanical rituals</span>
            <ArrowRight size={18} />
          </ActionLink>
        </div>

        <div className="wild-botanix-feature-groups">
          {forestEditorialFeatureGroups.map((group) => (
            <section className="wild-botanix-feature-group" key={group.eyebrow}>
              <p className="eyebrow wild-botanix-feature-group__eyebrow">{group.eyebrow}</p>
              <div className="wild-botanix-feature-grid">
                {group.items.map((item) => (
                  <article className="wild-botanix-feature-item" key={item.title}>
                    <span className="wild-botanix-feature-item__icon">
                      <ForestEditorialIcon icon={item.icon} />
                    </span>
                    <h3>{item.title}</h3>
                    <span className="wild-botanix-feature-item__rule" aria-hidden="true" />
                    <p>{item.body}</p>
                    <ul className="wild-botanix-feature-item__notes" aria-label={`${item.title} highlights`}>
                      {item.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="wild-botanix-lower wild-botanix-lower--reframed">
        <section className="wild-botanix-lower-panel wild-botanix-lower-panel--left">
          <p className="eyebrow wild-botanix-lower__eyebrow">Rooted in nature. Designed for you.</p>
          <span className="wild-botanix-lower-panel__rule" aria-hidden="true" />
          <h3 className="wild-botanix-lower-panel__title">Rituals that restore and nourish.</h3>
          <p className="wild-botanix-lower-panel__intro">
            Thoughtfully crafted plant-led rituals and mineral-rich blends that support calm,
            clarity and everyday balance.
          </p>

          <div className="wild-botanix-lower-points">
            {forestEditorialLowerPoints.map((item) => (
              <article className="wild-botanix-lower-point" key={item.title}>
                <span className="wild-botanix-lower-point__icon">
                  <ForestEditorialIcon icon={item.icon} size={22} />
                </span>
                <div className="wild-botanix-lower-point__copy">
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="wild-botanix-lower-divider" aria-hidden="true">
          <span className="wild-botanix-lower-divider__line" />
          <span className="wild-botanix-lower-divider__icon">
            <ForestEditorialIcon icon="flower" size={24} />
          </span>
          <span className="wild-botanix-lower-divider__line" />
        </div>

        <section className="wild-botanix-lower-panel wild-botanix-lower-panel--right">
          <p className="eyebrow wild-botanix-lower__eyebrow">What you get</p>
          <span className="wild-botanix-lower-panel__rule" aria-hidden="true" />
          <h3 className="wild-botanix-lower-panel__title">Wellness, rooted in nature.</h3>

          <ul className="wild-botanix-lower-benefits">
            {forestEditorialLowerBenefits.map((item) => (
              <li className="wild-botanix-lower-benefit" key={item.title}>
                <span className="wild-botanix-lower-benefit__marker">
                  <CheckCircle2 size={16} strokeWidth={1.9} aria-hidden="true" />
                </span>
                <div className="wild-botanix-lower-benefit__copy">
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="wild-botanix-lower-signoff">
          <p className="wild-botanix-lower-signoff__statement">
            Wild Botanix. Rooted in plants. Made for modern wellness.
          </p>
          <p className="wild-botanix-lower-signoff__micro">
            NOURISH · SMOOTH · RESTORE · SOOTHE · BALANCE · REFRESH
          </p>
        </div>

        <div className="wild-botanix-lower-ribbon" aria-label="Collections and category ribbon">
          COLLECTIONS · HERBAL TEAS · BOTANICAL OILS · EVERYDAY SELF-CARE
        </div>
      </div>
    </div>
  );

  return (
    <section id="wild-botanix-forest-section" ref={sectionRef}>
      <div
        className="wild-botanix-parallax-bg"
        ref={bgRef}
        aria-hidden="true"
      >
        <img
          className="wild-botanix-parallax-image"
          src={siteData.brand.forestSectionImage}
          alt=""
        />
      </div>
      <div className="wild-botanix-parallax-overlay" ref={overlayRef} aria-hidden="true" />

      <div
        className={`container wild-botanix-content-wrapper wild-botanix-content-wrapper--${forestSectionVariant}`.trim()}
      >
        {forestSectionVariant === "editorial" ? renderEditorialLayout() : renderCardLayout()}
      </div>
    </section>
  );
}

function TrustBandSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;

      if (!sectionRef.current || !mediaRef.current) {
        return;
      }

      if (mediaQuery.matches) {
        mediaRef.current.style.transform = "translate3d(0, 0, 0) scale(1)";
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const totalTravel = rect.height + viewportHeight;
      const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / totalTravel));
      const endScale = window.innerWidth <= 780 ? 1.035 : 1.055;
      const scale = 1 + (endScale - 1) * progress;

      mediaRef.current.style.transform = `translate3d(0, 0, 0) scale(${scale.toFixed(3)})`;
    };

    const onChange = () => {
      if (frame !== 0) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    mediaQuery.addEventListener?.("change", onChange);

    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
      mediaQuery.removeEventListener?.("change", onChange);

      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <section
      id="rooted-in-nature-section"
      className="section section--tight trust-band-section"
      ref={sectionRef}
    >
      <div className="trust-band-section__media" ref={mediaRef} aria-hidden="true">
        <img
          className="trust-band-section__image"
          src="/branding/wild-botaniks-trust-band-mountains.webp"
          alt=""
        />
      </div>
      <div className="trust-band-section__overlay" aria-hidden="true" />

      <div className="container trust-band">
        <div className="trust-band__content">
          <div className="trust-band__intro">
            <p className="eyebrow">Rooted in nature</p>
            <h2>Plant-led wellness for calmer daily routines.</h2>
            <p>
              From herbal teas and sea moss to batana oil and scalp care, Wild Botanix brings
              together thoughtful essentials designed to feel grounded, gentle and easy to use.
            </p>
          </div>

          <div className="trust-band__grid">
            {trustPoints.map((point) => (
              <div className="trust-band__item" key={point.title}>
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustToForestDivider() {
  return (
    <div
      id="trust-to-forest-divider"
      className="forest-transition-ribbon"
      aria-label="Botanical categories"
    >
      <div className="container forest-transition-ribbon__inner">
        <span className="forest-transition-ribbon__line" aria-hidden="true" />
        <p className="forest-transition-ribbon__text">
          Organic wellness &middot; Herbal teas &middot; Hair &amp; scalp care &middot; Sea moss
        </p>
        <span className="forest-transition-ribbon__line" aria-hidden="true" />
      </div>
    </div>
  );
}

function SectionInterlude({
  text,
  label,
}: {
  text: string;
  label: string;
}) {
  return (
    <div className="section-interlude" aria-label={label}>
      <div className="container section-interlude__inner">
        <span className="section-interlude__line" aria-hidden="true" />
        <p className="section-interlude__text">{text}</p>
        <span className="section-interlude__line" aria-hidden="true" />
      </div>
    </div>
  );
}

const ribbonItems = [
  { label: "Organic wellness", icon: Leaf },
  { label: "Herbal teas", icon: CupSoda },
  { label: "Hair & scalp care", icon: Flower2 },
  { label: "Sea moss", icon: Waves },
];

const lowerHomeTrustColumns = [
  {
    title: "Official store accounts",
    body: "Sign in and manage your orders through the official Wild Botanix Shopify store.",
    icon: UserRound,
  },
  {
    title: "Secure ordering",
    body: "Stock, checkout and order updates are handled through the official store for a smoother purchase path.",
    icon: Truck,
  },
  {
    title: "Trusted payments",
    body: "Orders move through the official Wild Botanix Shopify store with live payments and customer records.",
    icon: ShieldCheck,
  },
] as const;

function StoreHandoffCard({
  eyebrow,
  title,
  body,
  primaryHref = getOfficialStoreSecureStoreUrl(),
  primaryLabel = "Continue to our secure store",
  secondaryHref = getOfficialStoreShopUrl(),
  secondaryLabel = "View the full product range",
}: {
  eyebrow: string;
  title: string;
  body: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <Surface className="cart-summary">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{body}</p>
      <div className="product-summary__actions">
        <ActionLink className="button" href={primaryHref}>
          {primaryLabel}
        </ActionLink>
        <ActionLink className="button button--ghost" href={secondaryHref}>
          {secondaryLabel}
        </ActionLink>
      </div>
    </Surface>
  );
}

function CategoryRibbon() {
  return (
    <section className="category-ribbon" aria-label="Wild Botanix categories">
      <div className="container">
        <div className="category-ribbon__surface">
          {ribbonItems.map(({ label, icon: Icon }) => (
            <div className="category-ribbon__item" key={label}>
              <Icon size={14} strokeWidth={1.7} aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LowerHomeEditorialSection({ featureImage }: { featureImage: string }) {
  return (
    <section id="lower-home-editorial-section" className="section home-lower-editorial-section">
      <div className="container home-lower-editorial">
        <div className="home-lower-editorial__trust">
          <div className="home-lower-editorial__trust-intro">
            <span className="home-lower-editorial__trust-badge" aria-hidden="true">
              <Leaf size={18} strokeWidth={1.7} />
            </span>
            <h2>Luxury you can trust, naturally</h2>
            <p>
              From your first browse to your final checkout, every detail is designed to feel calm,
              clear, and beautifully reassuring.
            </p>
          </div>

          <div className="home-lower-editorial__trust-panel">
            {lowerHomeTrustColumns.map(({ title, body, icon: Icon }) => (
              <article className="home-lower-editorial__trust-column" key={title}>
                <span className="home-lower-editorial__trust-icon" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.7} />
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="home-lower-editorial__journal-band">
          <div className="home-lower-editorial__journal-copy">
            <p className="eyebrow">Journal</p>
            <h2>
              <span>Stories, rituals</span>
              <span>&amp; botanical wisdom</span>
            </h2>
            <p>
              Thoughtful reads to inspire slow living, self-care, and a deeper connection to
              nature.
            </p>
            <Link className="home-lower-editorial__journal-cta" to="/journal">
              <span>Explore Journal</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="home-lower-editorial__journal-artwork" aria-hidden="true">
            <Leaf size={320} strokeWidth={1.05} />
            <Leaf size={190} strokeWidth={1.15} />
          </div>
        </div>

        <Link className="home-lower-editorial__feature-card" to="/journal">
          <div className="home-lower-editorial__feature-media">
            <div className="home-lower-editorial__feature-image-shell">
              <img src={featureImage} alt="" loading="lazy" />
            </div>
          </div>

          <div className="home-lower-editorial__feature-body">
            <p className="eyebrow">Wellness</p>
            <h3>The ritual of daily reset</h3>
            <p>
              Simple practices and botanicals that help you return to yourself - morning, noon,
              and night.
            </p>
            <span className="home-lower-editorial__feature-cta">
              <span>Read the story</span>
              <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

export function HomePage() {
  const homeCollections = homeCollectionHandles
    .map((handle) => getCollectionByHandle(handle))
    .filter((collection): collection is NonNullable<typeof collection> => Boolean(collection));
  const featuredJournalPost = blogPosts[0];

  return (
    <>
      <PageMeta
        title="Premium Botanical Wellness"
        description="Wild Botanix UK brings together herbal teas, sea moss, batana oil and natural self-care for calmer daily rituals."
        image={siteData.brand.socialImage}
        schema={getHomeSeoSchema()}
      />

      <section className="hero">
        <div className="hero__media-wrapper">
          <img
            className="hero__media-img"
            src={siteData.brand.heroImage}
            alt="Wild Botanix botanical wellness rituals featuring herbal teas and self-care essentials."
            fetchPriority="high"
          />
          <div className="hero__media-overlay" />
          <div className="hero__content">
            <div className="hero__copy">
              <p className="eyebrow hero__eyebrow">Wild Botanix UK</p>
              <h1 className="hero__title">
                <span className="hero__title-main">Natural Herbal Wellness,</span>
                <span className="hero__title-accent">Beautifully Elevated</span>
              </h1>
              <p className="hero__lede">
                Discover herbal teas, sea moss, batana oil and botanical self-care designed for
                calmer daily rituals.
              </p>

              <div className="hero__actions">
                <ActionLink className="button" href={getOfficialStoreShopUrl()}>
                  Shop securely through our official store <ArrowRight size={16} />
                </ActionLink>
                <Link className="button button--ghost hero__brand-link" to="/about">
                  Learn about Wild Botanix
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategoryRibbon />

      <TrustBandSection />

      <TrustToForestDivider />

      <ForestParallaxSection />

      <section className="section section--with-interlude">
        <SectionInterlude
          label="Collections transition"
          text="Collections • Herbal teas • Botanical oils • Everyday self-care"
        />
        <div className="container">
          <div className="image-heading image-heading--center">
            <SectionHeading
              eyebrow="Collections"
              title="Shop by ritual, mood and everyday need"
              body="Find the right collection for slower mornings, mineral-rich kitchen staples, nourishing oils and plant-led self-care."
              align="center"
            />
          </div>
          <div className="collection-grid">
            {homeCollections.map((collection) => (
              <CollectionCard key={collection.handle} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight section--with-interlude">
        <SectionInterlude
          label="Editorial transition"
          text="Slow rituals • Morning tea • Scalp care • Daily balance"
        />
        <div className="container editorial-atmosphere editorial-atmosphere--lounge">
          <div className="editorial-grid editorial-grid--atmospheric">
            <div className="editorial-copy editorial-copy--overlay">
              <p className="eyebrow">Slow down. Tune in.</p>
              <h2>Wellness is a ritual, not a rush.</h2>
              <p>
                From a morning tea to a richer scalp oil or a spoonful of sea moss, Wild Botanix
                is made for routines that feel calm, useful and easy to keep.
              </p>
              <ActionLink className="button button--ghost" href={getOfficialStoreCollectionUrl("herbal-teas")}>
                View the full product range
              </ActionLink>
            </div>

            <div className="ritual-cards">
              {ritualSteps.map((step) => (
                <Surface key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </Surface>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--mist section--with-interlude">
        <SectionInterlude
          label="Featured products transition"
          text="Customer favourites • Bestsellers • Rooted essentials"
        />
        <div className="container">
          <div className="image-heading">
            <SectionHeading
              eyebrow="Featured products"
              title="Customer favourites, chosen with care"
              body="A closer look at some of the Wild Botanix staples shoppers return to for tea rituals, mineral wellness and targeted care."
            />
          </div>
          <div className="product-grid">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.handle} product={product} revealIndex={index} />
            ))}
          </div>
        </div>
      </section>

      <LowerHomeEditorialSection featureImage={featuredJournalPost.heroImage} />
    </>
  );
}

export function ShopPage() {
  const [search, setSearch] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [sort, setSort] = useState("featured");
  const deferredSearch = useDeferredValue(search);

  const filteredProducts = sortProducts(
    products.filter((product) => {
      const matchesCollection =
        selectedCollection === "all" || product.collections.includes(selectedCollection);
      const matchesSearch =
        deferredSearch.trim().length === 0 ||
        `${product.cardTitle} ${product.summary} ${product.tags.join(" ")}`
          .toLowerCase()
          .includes(deferredSearch.trim().toLowerCase());

      return matchesCollection && matchesSearch;
    }),
    sort,
  );

  return (
    <>
      <PageMeta
        title="Shop"
        description="Browse the full Wild Botanix range of herbal teas, sea moss, botanical oils, scalp care and natural self-care."
        image={siteData.brand.socialImage}
        schema={[
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
        ]}
      />
      <section className="page-hero page-hero--shop">
        <div className="container">
          <p className="eyebrow">All products</p>
          <h1>Shop Wild Botanix essentials.</h1>
          <p>
            Browse herbal teas, sea moss, batana oil, scalp care and everyday self-care in one
            calm, easy-to-shop space.
          </p>
          <div className="hero__actions">
            <ActionLink className="button" href={getOfficialStoreShopUrl()}>
              Shop securely through our official store
            </ActionLink>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container filter-toolbar">
          <label className="field">
            <span>Search</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, ingredients or rituals"
            />
          </label>

          <label className="field">
            <span>Sort</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="container pill-row pill-row--wrap">
          <button
            type="button"
            className={`pill-button ${selectedCollection === "all" ? "pill-button--active" : ""}`}
            onClick={() => setSelectedCollection("all")}
          >
            All products
          </button>
          {collections.map((collection) => (
            <button
              key={collection.handle}
              type="button"
              className={`pill-button ${
                selectedCollection === collection.handle ? "pill-button--active" : ""
              }`}
              onClick={() => setSelectedCollection(collection.handle)}
            >
              {collection.title}
            </button>
          ))}
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.handle} product={product} revealIndex={index} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No products match that filter"
              body="Try a different search or browse by collection to find the right ritual for your day."
            />
          )}
        </div>
      </section>
    </>
  );
}

export function CollectionsPage() {
  return (
    <>
      <PageMeta
        title="Collections"
        description="Explore Wild Botanix collections, from herbal teas and mineral wellness to hair, scalp and self-care rituals."
        image={collections[0]?.image ?? siteData.brand.socialImage}
        schema={[
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
            items: collections.map((entry) => ({
              name: entry.title,
              path: `/collections/${entry.handle}`,
            })),
          }),
        ]}
      />
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Collections</p>
          <h1>Explore collections by ritual.</h1>
          <p>
            Shop by what fits your routine, from herbal teas and mineral wellness to nourishing
            oils and natural self-care.
          </p>
          <div className="hero__actions">
            <ActionLink className="button" href={getOfficialStoreCollectionsUrl()}>
              View the full product range
            </ActionLink>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container collection-grid">
          {collections.map((collection) => (
            <CollectionCard key={collection.handle} collection={collection} />
          ))}
        </div>
      </section>
    </>
  );
}

export function CollectionDetailPage() {
  const { handle = "" } = useParams();
  const collection = getCollectionByHandle(handle);

  if (!collection) {
    return <NotFoundPage />;
  }

  const collectionProducts = getProductsForCollection(handle);
  const handleCollectionImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;

    if (image.dataset.fallbackApplied === "true") {
      return;
    }

    image.dataset.fallbackApplied = "true";
    image.src = siteData.brand.socialImage;
  };

  return (
    <>
      <PageMeta
        title={collection.title}
        description={collection.description}
        canonicalPath={`/collections/${collection.handle}`}
        image={collection.image}
        schema={[
          ...buildCollectionSchema(collection),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
            { name: collection.title, path: `/collections/${collection.handle}` },
          ]),
        ]}
      />
      <section className="page-hero page-hero--with-media">
        <div className="container page-hero__split">
          <div>
            <p className="eyebrow">{collection.eyebrow}</p>
            <h1>{collection.heroHeading}</h1>
            <p>{collection.heroCopy}</p>
            <div className="hero__actions">
              <ActionLink className="button" href={getOfficialStoreCollectionUrl(collection.handle)}>
                Continue to our secure store
              </ActionLink>
            </div>
          </div>
          <div className="page-hero__media-card">
            <img src={collection.image} alt={collection.title} onError={handleCollectionImageError} />
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container product-grid">
          {collectionProducts.map((product, index) => (
            <ProductCard key={product.handle} product={product} revealIndex={index} />
          ))}
        </div>
      </section>
    </>
  );
}

function ProductPageView({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    product.variants[0]?.id ?? null,
  );

  const canonicalProductPath = getProductPath(product);
  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0];
  const fallbackProductImage =
    collections.find((collection) => collection.handle === product.primaryCollection)?.image ??
    siteData.brand.socialImage;
  const handleProductImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;

    if (image.dataset.fallbackApplied === "true") {
      return;
    }

    image.dataset.fallbackApplied = "true";
    image.src = fallbackProductImage;
  };
  const relatedProducts = products
    .filter(
      (candidate) =>
        candidate.handle !== product.handle &&
        candidate.collections.some((collectionHandle) =>
          product.collections.includes(collectionHandle),
        ),
    )
    .slice(0, 4);
  const officialProductUrl = getOfficialStoreProductUrl(product);

  return (
    <>
      <PageMeta
        title={product.cardTitle}
        description={product.summary}
        canonicalPath={canonicalProductPath}
        image={product.images[0] ?? siteData.brand.socialImage}
        schema={[
          buildWebPageSchema({
            path: canonicalProductPath,
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
            { name: product.cardTitle, path: canonicalProductPath },
          ]),
        ]}
      />

      <section className="section section--tight">
        <div className="container breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <a href={getOfficialStoreShopUrl()} rel="noopener noreferrer">
            Shop
          </a>
          <ChevronRight size={14} />
          <Link to={`/collections/${product.primaryCollection}`}>
            {collections.find((collection) => collection.handle === product.primaryCollection)?.title ??
              "Collection"}
          </Link>
          <ChevronRight size={14} />
          <span>{product.cardTitle}</span>
        </div>
      </section>

      <section className="section section--product">
        <div className="container product-detail">
          <div className="product-gallery">
            <div className="product-gallery__main">
              <img
                src={product.images[selectedImage]}
                alt={product.cardTitle}
                onError={handleProductImageError}
              />
            </div>
            {product.images.length > 1 ? (
              <div className="product-gallery__thumbs">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    className={selectedImage === index ? "is-active" : ""}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.cardTitle} ${index + 1}`}
                      onError={handleProductImageError}
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="product-summary">
            <p className="eyebrow">
              {collections.find((collection) => collection.handle === product.primaryCollection)?.title}
            </p>
            <h1>{product.cardTitle}</h1>
            <p className="product-summary__copy">{product.summary}</p>
            <PriceStack
              price={selectedVariant.price}
              compareAt={selectedVariant.compareAtPrice ?? product.compareAtFrom}
            />

            <div className="pill-row pill-row--wrap">
              {product.highlights.map((highlight) => (
                <span className="pill" key={highlight}>
                  {highlight}
                </span>
              ))}
            </div>

            {product.variants.length > 1 ? (
              <label className="field">
                <span>Choose size / option</span>
                <select
                  value={selectedVariant.id}
                  onChange={(event) => setSelectedVariantId(Number(event.target.value))}
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.title} - {formatCurrency(variant.price)}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <div className="product-summary__actions">
              <ActionLink className="button" href={officialProductUrl}>
                {product.available ? "Continue to our secure store" : "View on the official store"}
              </ActionLink>
              <ActionLink className="button button--ghost" href={getOfficialStoreShopUrl()}>
                View the full product range
              </ActionLink>
            </div>

            <Surface className="product-summary__trust">
              <div>
                <Truck size={18} />
                <span>Free UK delivery over GBP 50</span>
              </div>
              <div>
                <ShieldCheck size={18} />
                <span>Orders are handled through our official Shopify store</span>
              </div>
            </Surface>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container product-editorial">
          <Surface>
            <h2>Product overview</h2>
            {product.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Surface>

          <Surface>
            <h2>Ingredients</h2>
            <ul className="list">
              {product.ingredients.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Surface>

          <Surface>
            <h2>Ritual notes</h2>
            <ul className="list">
              {product.ritual.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Surface>
        </div>
      </section>

      <section className="section section--mist">
        <div className="container">
          <SectionHeading
            eyebrow="Related products"
            title="Continue the ritual"
            body="Discover more Wild Botanix favourites that complement your daily ritual."
          />
          <div className="product-grid">
            {relatedProducts.map((related, index) => (
              <ProductCard key={related.handle} product={related} revealIndex={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function ProductPage() {
  const { handle = "" } = useParams();
  const navigate = useNavigate();
  const product = getProductByHandle(handle);

  useEffect(() => {
    if (!product || handle === product.slug) {
      return;
    }

    navigate(getProductPath(product), { replace: true });
  }, [handle, navigate, product]);

  if (!product) {
    return <NotFoundPage />;
  }

  return <ProductPageView key={product.handle} product={product} />;
}

export function AboutPage() {
  return (
    <>
      <PageMeta
        title="About"
        description="Learn more about Wild Botanix, a plant-led wellness brand rooted in herbal teas, sea moss, botanical oils and natural self-care."
        image={siteData.brand.socialImage}
        schema={[
          buildWebPageSchema({
            path: "/about",
            title: "Plant-led wellness, chosen with care.",
            description:
              "Learn more about Wild Botanix, a plant-led wellness brand rooted in herbal teas, sea moss, botanical oils and natural self-care.",
            image: siteData.brand.socialImage,
            type: "AboutPage",
          }),
        ]}
      />
      <section className="page-hero page-hero--about">
        <div className="container">
          <p className="eyebrow">About Wild Botanix</p>
          <h1>Plant-led wellness, chosen with care.</h1>
          <p>{siteData.about.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="container editorial-grid">
          <Surface className="editorial-copy">
            <SectionHeading
              eyebrow="Brand positioning"
              title="Rooted in nature, made for everyday rituals."
              body="Wild Botanix brings together herbal teas, sea moss, botanical oils and self-care essentials for people who want daily routines to feel calmer, more thoughtful and grounded."
            />
          </Surface>
          <div className="ritual-cards">
            {siteData.about.story.map((paragraph) => (
              <Surface key={paragraph}>
                <p>{paragraph}</p>
              </Surface>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--mist">
        <div className="container commerce-strip__cards">
          {siteData.about.values.map((value) => (
            <Surface key={value.title}>
              <h3>{value.title}</h3>
              <p>{value.body}</p>
            </Surface>
          ))}
        </div>
      </section>
    </>
  );
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <PageMeta
        title="Contact"
        description="Contact Wild Botanix for product questions, order support and everyday help with herbal teas, sea moss, scalp care and self-care."
        image={siteData.brand.socialImage}
        schema={[
          buildWebPageSchema({
            path: "/contact",
            title: "Contact Wild Botanix",
            description:
              "Contact Wild Botanix for product questions, order support and everyday help with herbal teas, sea moss, scalp care and self-care.",
            image: siteData.brand.socialImage,
            type: "ContactPage",
          }),
          buildFAQSchema(),
        ]}
      />
      <section className="page-hero page-hero--contact">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1>We're here to help with orders, products and everyday questions.</h1>
          <p>
            Whether you need help choosing a ritual, checking an order or finding the right
            product, the Wild Botanix team is easy to reach.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <Surface>
            <Mail size={20} />
            <h3>Email</h3>
            <p>
              <a href={`mailto:${siteData.contact.email}`}>{siteData.contact.email}</a>
            </p>
            {siteData.contact.secondaryEmail ? (
              <p>
                <a href={`mailto:${siteData.contact.secondaryEmail}`}>{siteData.contact.secondaryEmail}</a>
              </p>
            ) : null}
          </Surface>
          <Surface>
            <Phone size={20} />
            <h3>Phone</h3>
            <p>
              <a href={`tel:${siteData.contact.phone}`}>{siteData.contact.phone}</a>
            </p>
            <p>{siteData.contact.hours}</p>
          </Surface>
          <Surface>
            <MapPin size={20} />
            <h3>Socials</h3>
            <p>
              <a href={`https://www.instagram.com/${siteData.contact.instagram.replace(/^@/, "")}/`} rel="noreferrer" target="_blank">
                Instagram {siteData.contact.instagram}
              </a>
            </p>
            <p>
              <a href={`https://www.facebook.com/${siteData.contact.facebook.replace(/^@/, "")}`} rel="noreferrer" target="_blank">
                Facebook {siteData.contact.facebook}
              </a>
            </p>
            <p>
              <a href={`https://www.tiktok.com/@${siteData.contact.tiktok.replace(/^@/, "")}`} rel="noreferrer" target="_blank">
                TikTok {siteData.contact.tiktok}
              </a>
            </p>
          </Surface>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container contact-layout">
          <Surface>
            <h2>Send a message</h2>
            {!submitted ? (
              <form
                className="form-grid"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubmitted(true);
                }}
              >
                <label className="field">
                  <span>Name</span>
                  <input name="name" required placeholder="Your full name" />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input name="email" required type="email" placeholder="you@example.com" />
                </label>
                <label className="field">
                  <span>Order or enquiry type</span>
                  <select name="enquiryType" defaultValue="general">
                    <option value="general">General enquiry</option>
                    <option value="order">Order support</option>
                    <option value="wholesale">Wholesale</option>
                  </select>
                </label>
                <label className="field field--full">
                  <span>Message</span>
                  <textarea name="message" required rows={6} placeholder="Tell us how we can help." />
                </label>
                <button className="button" type="submit">
                  Send enquiry
                </button>
              </form>
            ) : (
              <EmptyState
                title="Thanks for getting in touch"
                body={`For the quickest reply, email ${siteData.contact.email} or call ${siteData.contact.phone}.`}
              />
            )}
          </Surface>

          <Surface>
            <h2>Frequently asked</h2>
            <div className="faq-list">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </Surface>
        </div>
      </section>
    </>
  );
}

export function AccountPage() {
  return (
    <>
      <PageMeta
        title="Account"
        description="Customer accounts and order history are handled through the official Wild Botanix Shopify store."
        noindex
      />
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Account</p>
          <h1>Orders are handled through our official Shopify store.</h1>
          <p>
            Sign in securely through the official Wild Botanix store to review orders, manage your
            details and continue shopping.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container auth-grid">
          <StoreHandoffCard
            eyebrow="Official store access"
            title="Continue to your secure customer account."
            body="Order history, saved details, payments and customer logins live in the official Wild Botanix Shopify store."
            primaryHref={getOfficialStoreAccountUrl()}
            primaryLabel="Continue to our secure store"
          />

          <Surface>
            <h2>What happens next</h2>
            <p>
              Use the official store to sign in, create an account, review past orders and manage
              delivery details in the live customer system.
            </p>
            <p>
              This website remains the brand and content front-end, while orders and customer data
              stay in Shopify.
            </p>
          </Surface>
        </div>
      </section>
    </>
  );
}

export function CartPage() {
  return (
    <>
      <PageMeta
        title="Cart"
        description="Basket review and checkout are handled through the official Wild Botanix Shopify store."
        noindex
      />
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Cart</p>
          <h1>Continue to our secure store to review your basket.</h1>
          <p>
            Orders are handled through our official Shopify store, where live stock, payments and
            order updates are managed.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container cart-layout">
          <StoreHandoffCard
            eyebrow="Secure store checkout"
            title="Review your basket on the official store."
            body="Basket contents, live stock and checkout are handled through the official Wild Botanix Shopify store."
            primaryHref={getOfficialStoreSecureStoreUrl()}
            primaryLabel="Continue to our secure store"
          />

          <Surface>
            <h2>Why the handoff matters</h2>
            <p>
              This front-end site is here to tell the brand story and guide discovery. When you are
              ready to buy, the official store handles the live transaction.
            </p>
          </Surface>
        </div>
      </section>
    </>
  );
}

export function CheckoutPage() {
  return (
    <>
      <PageMeta
        title="Checkout"
        description="Payments and checkout are handled through the official Wild Botanix Shopify store."
        noindex
      />
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Checkout</p>
          <h1>Orders are handled through our official Shopify store.</h1>
          <p>
            Continue to the official Wild Botanix store for live stock, secure payments, delivery
            details and order confirmation.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container checkout-layout">
          <StoreHandoffCard
            eyebrow="Secure checkout"
            title="Continue to our secure store to place your order."
            body="Payments, checkout, delivery details and order confirmation all live in the official Wild Botanix Shopify store."
            primaryHref={getOfficialStoreSecureStoreUrl()}
            primaryLabel="Continue to our secure store"
          />

          <Surface>
            <h2>What is handled there</h2>
            <ul className="list">
              <li>Live product availability and current pricing.</li>
              <li>Secure payments and confirmed checkout.</li>
              <li>Order status, customer details and fulfilment updates.</li>
            </ul>
          </Surface>
        </div>
      </section>
    </>
  );
}

export function LegalPage() {
  const { slug = "" } = useParams();
  const page = legalPages.find((entry) => entry.slug === slug);

  if (!page) {
    return <NotFoundPage />;
  }

  return (
    <>
      <PageMeta
        title={page.title}
        description={page.intro}
        canonicalPath={`/legal/${page.slug}`}
        image={siteData.brand.socialImage}
        schema={[
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
        ]}
      />
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Legal</p>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="container legal-layout">
          {page.sections.map((section) => (
            <Surface key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Surface>
          ))}
        </div>
      </section>
    </>
  );
}

export function NotFoundPage() {
  return (
    <>
      <PageMeta
        title="Page Not Found"
        description="The page you were looking for could not be found."
        noindex
      />
      <section className="section">
        <div className="container">
          <EmptyState
            title="That page doesn't exist"
            body="Head back home or keep browsing herbal teas, sea moss and botanical care."
            cta={{ label: "Return home", href: "/" }}
          />
        </div>
      </section>
    </>
  );
}
