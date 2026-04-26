import { useDeferredValue, useState, type SyntheticEvent } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { blogPosts } from "./blogData";
import { featuredProducts, getProductsForCollection, siteData } from "./siteData";
import { EmptyState, PageMeta, ProductCard, SectionHeading, Surface } from "./ui";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildJournalHubSchema,
  buildWebPageSchema,
} from "./seo";

type JournalDestination = {
  eyebrow: string;
  label: string;
  href: string;
  collectionHandle?: string;
};

const journalCategories = ["All", ...new Set(blogPosts.map((post) => post.category))];
const journalThemeCount = journalCategories.length - 1;

const journalCategoryDestinations: Record<string, JournalDestination> = {
  "Tea Rituals": {
    eyebrow: "Herbal tea rituals",
    label: "Shop herbal teas",
    href: "/collections/herbal-teas",
    collectionHandle: "herbal-teas",
  },
  "Sea Moss": {
    eyebrow: "Mineral wellness",
    label: "Shop sea moss",
    href: "/collections/mineral-wellness",
    collectionHandle: "mineral-wellness",
  },
  "Oils and Rituals": {
    eyebrow: "Botanical oils",
    label: "Shop botanical oils",
    href: "/collections/botanical-oils",
    collectionHandle: "botanical-oils",
  },
  "Hair and Scalp Care": {
    eyebrow: "Hair and scalp care",
    label: "Shop hair and scalp care",
    href: "/collections/hair-scalp-care",
    collectionHandle: "hair-scalp-care",
  },
  "Hair and Skin Care": {
    eyebrow: "Daily self-care",
    label: "Shop natural self-care",
    href: "/collections/natural-self-care",
    collectionHandle: "natural-self-care",
  },
  "Natural Self-Care": {
    eyebrow: "Natural self-care",
    label: "Shop natural self-care",
    href: "/collections/natural-self-care",
    collectionHandle: "natural-self-care",
  },
  "Brand and Rituals": {
    eyebrow: "Wild Botanix edit",
    label: "Shop the full collection",
    href: "/shop",
  },
};

const getJournalDestination = (category: string) =>
  journalCategoryDestinations[category] ?? {
    eyebrow: "Wild Botanix edit",
    label: "Shop the full collection",
    href: "/shop",
  };

const getJournalEditProducts = (category: string) => {
  const destination = getJournalDestination(category);

  if (!destination.collectionHandle) {
    return featuredProducts.slice(0, 4);
  }

  return getProductsForCollection(destination.collectionHandle).slice(0, 4);
};

function JournalCard({
  post,
  featured = false,
}: {
  post: (typeof blogPosts)[number];
  featured?: boolean;
}) {
  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;

    if (image.dataset.fallbackApplied === "true") {
      return;
    }

    image.dataset.fallbackApplied = "true";
    image.src = siteData.brand.heroImage;
  };

  return (
    <Link className={`journal-entry ${featured ? "journal-entry--featured" : ""}`.trim()} to={`/journal/${post.slug}`}>
      <div className="journal-entry__body">
        <div className="journal-entry__meta">
          <span>{post.category}</span>
          <span>{post.readTime}</span>
        </div>
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
        <span className="journal-entry__cta">
          Read article <ArrowRight size={16} />
        </span>
      </div>
      <div className="journal-entry__visual">
        <div className="journal-entry__media-shell">
          <img
            className="journal-entry__media-image"
            src={post.heroImage}
            alt={post.title}
            loading="lazy"
            onError={handleImageError}
          />
        </div>
      </div>
    </Link>
  );
}

export function JournalPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const deferredSearch = useDeferredValue(search);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      deferredSearch.trim().length === 0 ||
      `${post.title} ${post.excerpt} ${post.intro} ${post.category}`
        .toLowerCase()
        .includes(deferredSearch.trim().toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts[0] ?? blogPosts[0];
  const gridPosts = filteredPosts.filter((post) => post.slug !== featuredPost.slug);

  return (
    <>
      <PageMeta
        title="Journal"
        description="Explore 20 Wild Botanix journal articles covering herbal teas, sea moss, batana oil, botanical haircare and premium natural self-care rituals."
        image={blogPosts[0]?.heroImage}
        schema={buildJournalHubSchema()}
      />

      <section className="page-hero page-hero--journal">
        <div className="container journal-hero">
          <div className="journal-hero__copy">
            <p className="eyebrow">Wild Botanix Journal</p>
            <h1>Journal stories for calmer, better-chosen rituals.</h1>
            <p>
              Explore tea rituals, sea moss guidance, haircare notes and botanical self-care
              stories that make choosing the right products feel easier and more informed.
            </p>

            <div className="hero__highlights journal-hero__stats">
              <span className="hero-chip">20 articles</span>
              <span className="hero-chip">{journalThemeCount} ritual topics</span>
              <span className="hero-chip">Tea, sea moss & self-care</span>
            </div>
          </div>

          <JournalCard post={featuredPost} featured />
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="filter-toolbar filter-toolbar--journal">
            <label className="field">
              <span>Search the journal</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tea rituals, sea moss, batana oil or self-care"
              />
            </label>
          </div>

          <div className="pill-row pill-row--wrap">
            {journalCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`pill-button ${selectedCategory === category ? "pill-button--active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          {filteredPosts.length > 0 ? (
            <div className="journal-grid">
              {gridPosts.map((post) => (
                <JournalCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No journal articles match that search"
              body="Try another keyword or browse a different topic to find the right ritual guide."
              cta={{ label: "View all journal posts", href: "/journal" }}
            />
          )}
        </div>
      </section>
    </>
  );
}

export function JournalPostPage() {
  const { slug = "" } = useParams();
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) {
    return (
      <>
        <PageMeta
          title="Journal Post Not Found"
          description="The Wild Botanix journal article you were looking for could not be found."
          noindex
        />
        <section className="section">
          <div className="container">
            <EmptyState
              title="That journal article does not exist"
              body="Head back to the journal hub to keep exploring Wild Botanix ritual guides and ingredient notes."
              cta={{ label: "Go to journal", href: "/journal" }}
            />
          </div>
        </section>
      </>
    );
  }

  const destination = getJournalDestination(post.category);
  const shopEdit = getJournalEditProducts(post.category);
  const relatedPosts = blogPosts
    .filter((candidate) => candidate.category === post.category && candidate.slug !== post.slug)
    .slice(0, 3);

  const handleHeroImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;

    if (image.dataset.fallbackApplied === "true") {
      return;
    }

    image.dataset.fallbackApplied = "true";
    image.src = siteData.brand.heroImage;
  };

  return (
    <>
      <PageMeta
        title={post.title}
        description={post.excerpt}
        canonicalPath={`/journal/${post.slug}`}
        image={post.heroImage}
        openGraphType="article"
        schema={[
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
        ]}
      />

      <section className="section section--tight">
        <div className="container breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/journal">Journal</Link>
          <ChevronRight size={14} />
          <span>{post.title}</span>
        </div>
      </section>

      <section className="journal-post-hero">
        <div className="container journal-post-hero__content">
          <Surface className="journal-post-hero__panel">
            <p className="eyebrow">{post.category}</p>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>

            <div className="pill-row pill-row--wrap">
              <span className="pill">{post.readTime}</span>
              <span className="pill">{destination.eyebrow}</span>
            </div>
          </Surface>

          <div className="journal-post-hero__visual">
            <div className="journal-post-hero__media-shell">
              <img
                className="journal-post-hero__media-image"
                src={post.heroImage}
                alt={post.title}
                loading="lazy"
                onError={handleHeroImageError}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container journal-post-layout">
          <article className="surface journal-article">
            <p className="journal-article__intro">{post.intro}</p>

            {post.sections.map((section) => (
              <section className="journal-article__section" key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </article>

          <aside className="journal-sidebar">
            <Surface className="journal-callout">
              <p className="eyebrow">{destination.eyebrow}</p>
              <h2>Take the next step from story to shop.</h2>
              <p>{post.cta}</p>
              <Link className="button" to={destination.href}>
                {destination.label} <ArrowRight size={16} />
              </Link>
            </Surface>

            <Surface>
              <h2>Why this matters</h2>
              <p>
                Each article is here to make choosing products and building daily rituals feel
                easier, calmer and more informed.
              </p>
            </Surface>
          </aside>
        </div>
      </section>

      <section className="section section--mist">
        <div className="container">
          <SectionHeading
            eyebrow="Shop the edit"
            title="Products connected to this ritual"
            body="Useful reads should lead naturally to the teas, oils and self-care staples they mention."
          />
          <div className="product-grid">
            {shopEdit.map((product) => (
              <ProductCard key={product.handle} product={product} />
            ))}
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 ? (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Continue reading"
              title="More from this ritual theme"
              body="Explore more Wild Botanix journal pieces that build on the same ingredients, routines and everyday moments."
            />
            <div className="journal-grid">
              {relatedPosts.map((relatedPost) => (
                <JournalCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
