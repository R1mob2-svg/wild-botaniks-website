import { useEffect, useRef, useState, type CSSProperties, type PropsWithChildren } from "react";
import { ArrowRight, Leaf, Menu, ShoppingBag, User, X } from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  collections,
  formatCurrency,
  getProductPath,
  siteData,
  type Collection,
  type Product,
} from "./siteData";
import {
  buildCanonicalUrl,
  defaultSocialImage,
  defaultThemeColor,
  getGlobalSeoSchema,
  siteLocale,
  siteName,
  toAbsoluteUrl,
  type SchemaNode,
} from "./seo";
import { useStore } from "./store";

export function PageMeta({
  title,
  description,
  canonicalPath,
  image = defaultSocialImage,
  openGraphType = "website",
  noindex = false,
  schema = [],
}: {
  title: string;
  description: string;
  canonicalPath?: string;
  image?: string;
  openGraphType?: "website" | "article";
  noindex?: boolean;
  schema?: SchemaNode[];
}) {
  const location = useLocation();

  useEffect(() => {
    const upsertMetaTag = (attribute: "name" | "property", key: string, content: string) => {
      let meta = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    const upsertLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        document.head.appendChild(link);
      }

      link.setAttribute("href", href);
    };

    const upsertStructuredData = (data: SchemaNode[]) => {
      const scriptId = "seo-structured-data";
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }

      script.textContent = JSON.stringify(data);
    };

    const currentPath = canonicalPath ?? `${location.pathname}${location.search || ""}`;
    const canonicalUrl = buildCanonicalUrl(currentPath);
    const resolvedImage = toAbsoluteUrl(image);
    const titleWithBrand = `${title} | ${siteName}`;
    const robotsContent = noindex
      ? "noindex, nofollow, noarchive"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

    document.title = titleWithBrand;
    document.documentElement.lang = "en-GB";

    upsertMetaTag("name", "description", description);
    upsertMetaTag("name", "robots", robotsContent);
    upsertMetaTag("name", "googlebot", robotsContent);
    upsertMetaTag("name", "theme-color", defaultThemeColor);
    upsertMetaTag("property", "og:locale", siteLocale);
    upsertMetaTag("property", "og:site_name", siteName);
    upsertMetaTag("property", "og:type", openGraphType);
    upsertMetaTag("property", "og:title", titleWithBrand);
    upsertMetaTag("property", "og:description", description);
    upsertMetaTag("property", "og:url", canonicalUrl);
    upsertMetaTag("property", "og:image", resolvedImage);
    upsertMetaTag("name", "twitter:card", "summary_large_image");
    upsertMetaTag("name", "twitter:title", titleWithBrand);
    upsertMetaTag("name", "twitter:description", description);
    upsertMetaTag("name", "twitter:image", resolvedImage);
    upsertLinkTag("canonical", canonicalUrl);
    upsertStructuredData([...getGlobalSeoSchema(), ...schema]);
  }, [canonicalPath, description, image, location.pathname, location.search, noindex, openGraphType, schema, title]);

  return null;
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [location.pathname]);

  return null;
}

function RouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const analyticsWindow = window as Window & {
      gtag?: (...args: unknown[]) => void;
    };

    if (typeof analyticsWindow.gtag !== "function") {
      return;
    }

    const path = `${location.pathname}${location.search || ""}`;

    analyticsWindow.gtag("event", "page_view", {
      page_title: document.title,
      page_location: buildCanonicalUrl(path),
      page_path: path,
    });
  }, [location.pathname, location.search]);

  return null;
}

function ScrollParallax() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const update = () => {
      frame = 0;
      root.style.setProperty("--scroll-offset", `${window.scrollY.toFixed(1)}px`);
    };

    const onChange = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);

    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
      root.style.setProperty("--scroll-offset", "0px");
    };
  }, []);

  return null;
}

export function Layout() {
  const location = useLocation();
  const isHeroHome = location.pathname === "/";

  return (
    <div className="site-frame">
      <ScrollToTop />
      <ScrollParallax />
      <RouteAnalytics />
      <Header isHeroRoute={isHeroHome} />
      <main className={`page-shell ${isHeroHome ? "page-shell--hero-home" : ""}`.trim()}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Header({ isHeroRoute }: { isHeroRoute: boolean }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => !isHeroRoute);
  const headerRef = useRef<HTMLElement | null>(null);
  const { cartCount, customer } = useStore();
  const isSolid = !isHeroRoute || isScrolled || menuOpen;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;

      if (!isHeroRoute) {
        setIsScrolled(true);
        return;
      }

      const y = window.scrollY;

      setIsScrolled((current) => {
        if (current) {
          return y > 18;
        }

        return y > 44;
      });
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

    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);

      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [isHeroRoute]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const header = headerRef.current;

    if (!header) {
      return;
    }

    const root = document.documentElement;
    let frame = 0;

    const measure = () => {
      frame = 0;
      root.style.setProperty(
        "--site-header-offset",
        `${Math.max(0, Math.ceil(header.getBoundingClientRect().bottom))}px`,
      );
    };

    const queueMeasure = () => {
      if (frame !== 0) {
        return;
      }

      frame = window.requestAnimationFrame(measure);
    };

    queueMeasure();

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(queueMeasure) : null;

    observer?.observe(header);
    window.addEventListener("resize", queueMeasure);
    window.addEventListener("scroll", queueMeasure, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", queueMeasure);
      window.removeEventListener("scroll", queueMeasure);

      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [isHeroRoute, isSolid, menuOpen, location.pathname]);

  return (
    <header
      ref={headerRef}
      className={`site-header ${isHeroRoute ? "site-header--hero" : "site-header--static"} ${isSolid ? "site-header--solid" : "site-header--top"} ${menuOpen ? "site-header--menu-open" : ""}`.trim()}
    >
      <div className="container site-header__shell">
        <div className="site-header__inner">
          <Link className="brand-mark" to="/" onClick={() => setMenuOpen(false)}>
            <img src={siteData.brand.logo} alt="Wild Botanix UK" />
          </Link>

          <nav className="site-nav desktop-nav" aria-label="Primary navigation">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/collections">Collections</NavLink>
            <NavLink to="/journal">Journal</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>

          <div className="site-header__actions">
            <Link className="icon-link" to="/account" aria-label="Account">
              <User size={18} />
              <span>{customer ? "Account" : "Sign in"}</span>
            </Link>
            <Link className="cart-link" to="/cart" aria-label="Cart">
              <ShoppingBag size={18} />
              <span>Cart</span>
              {cartCount > 0 ? <strong>{cartCount}</strong> : null}
            </Link>
            <button
              className="menu-toggle"
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <div className={`mobile-nav ${menuOpen ? "mobile-nav--open" : ""}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/shop" onClick={() => setMenuOpen(false)}>
            Shop
          </NavLink>
          <NavLink to="/collections" onClick={() => setMenuOpen(false)}>
            Collections
          </NavLink>
          <NavLink to="/journal" onClick={() => setMenuOpen(false)}>
            Journal
          </NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </NavLink>
          <NavLink to="/account" onClick={() => setMenuOpen(false)}>
            {customer ? "Account" : "Sign in"}
          </NavLink>
          <NavLink to="/cart" onClick={() => setMenuOpen(false)}>
            Cart {cartCount > 0 ? `(${cartCount})` : ""}
          </NavLink>
        </div>
      </div>
    </header>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div className="footer-column">
      <h3>{title}</h3>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link to={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-cta">
        <div>
          <p className="eyebrow">Begin your wellness journey</p>
          <h2>Plant-led wellness for calmer daily rituals.</h2>
        </div>
        <Link className="button button--ghost" to="/shop">
          Shop the collection <ArrowRight size={16} />
        </Link>
      </div>

      <div className="container site-footer__grid">
        <div className="footer-brand">
          <img src={siteData.brand.logo} alt="Wild Botanix UK" />
          <p>
            Herbal teas, sea moss, botanical oils and natural self-care chosen for thoughtful,
            grounded everyday routines.
          </p>
        </div>

        <FooterColumn
          title="Shop"
          links={[
            { label: "All products", href: "/shop" },
            ...collections.slice(0, 4).map((collection) => ({
              label: collection.title,
              href: `/collections/${collection.handle}`,
            })),
          ]}
        />

        <FooterColumn
          title="Company"
          links={[
            { label: "About Us", href: "/about" },
            { label: "Journal", href: "/journal" },
            { label: "Contact", href: "/contact" },
            { label: "Account", href: "/account" },
            { label: "Cart", href: "/cart" },
          ]}
        />

        <FooterColumn
          title="Policies"
          links={[
            { label: "Privacy", href: "/legal/privacy" },
            { label: "Shipping & Delivery", href: "/legal/shipping" },
            { label: "Returns", href: "/legal/returns" },
            { label: "Terms & Conditions", href: "/legal/terms" },
          ]}
        />
      </div>

      <div className="container site-footer__bottom">
        <small>Copyright {year} Wild Botanix UK. Rooted in nature, made for everyday rituals.</small>
      </div>
    </footer>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  body: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

export function Surface({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  return <div className={`surface ${className}`.trim()}>{children}</div>;
}

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link className="collection-card" to={`/collections/${collection.handle}`}>
      <div className="collection-card__body">
        <p className="eyebrow">{collection.eyebrow}</p>
        <h3>{collection.title}</h3>
        <p>{collection.description}</p>
        <span>
          Shop {collection.title} <ArrowRight size={16} />
        </span>
      </div>

      <div className="collection-card__visual">
        <div className="collection-card__media">
          <img src={collection.image} alt={collection.title} loading="lazy" />
        </div>
      </div>
    </Link>
  );
}

export function PriceStack({
  price,
  compareAt,
  compact = false,
}: {
  price: number;
  compareAt: number | null;
  compact?: boolean;
}) {
  return (
    <div className={`price-stack ${compact ? "price-stack--compact" : ""}`}>
      <strong>{formatCurrency(price)}</strong>
      {compareAt ? <span>{formatCurrency(compareAt)}</span> : null}
    </div>
  );
}

export function ProductCard({
  product,
  revealIndex = 0,
}: {
  product: Product;
  revealIndex?: number;
}) {
  const { addToCart } = useStore();
  const hasVariantChoice = product.variants.length > 1;
  const defaultVariant = product.variants[0];
  const cardRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          setIsVisible(true);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <article
      className={`product-card ${isVisible ? "product-card--visible" : ""}`}
      ref={cardRef}
      style={{ ["--reveal-delay" as const]: `${Math.min(revealIndex, 7) * 100}ms` } as CSSProperties}
    >
      <Link className="product-card__image-link" to={getProductPath(product)}>
        <img src={product.images[0]} alt={product.cardTitle} loading="lazy" />
      </Link>

      <div className="product-card__body">
        <p className="product-card__collection">
          {collections.find((collection) => collection.handle === product.primaryCollection)?.title ??
            "Wild Botanix"}
        </p>
        <h3>
          <Link to={getProductPath(product)}>{product.cardTitle}</Link>
        </h3>
        <p>{product.summary}</p>
        <div className="product-card__meta">
          <PriceStack price={product.priceFrom} compareAt={product.compareAtFrom} compact />
          {!product.available ? <span className="pill pill--soldout">Sold out</span> : null}
          <div className="pill-row">
            {product.highlights.slice(0, 2).map((highlight) => (
              <span className="pill" key={highlight}>
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <div className="product-card__actions">
          <Link className="button button--ghost" to={getProductPath(product)}>
            {hasVariantChoice ? "Choose options" : "View product"}
          </Link>
          {!hasVariantChoice && product.available ? (
            <button className="button" type="button" onClick={() => addToCart(product, defaultVariant, 1)}>
              Add to cart
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function EmptyState({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <Surface className="empty-state">
      <Leaf size={26} />
      <h2>{title}</h2>
      <p>{body}</p>
      {cta ? <Link className="button" to={cta.href}>{cta.label}</Link> : null}
    </Surface>
  );
}

export function QuantityControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (nextValue: number) => void;
}) {
  return (
    <div className="quantity-control">
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))}>
        -
      </button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}
