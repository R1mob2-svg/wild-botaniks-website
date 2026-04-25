import { useDeferredValue, useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { blogPosts } from "./blogData";
import {
  collections,
  faqs,
  featuredProducts,
  formatCurrency,
  getCollectionByHandle,
  getProductByHandle,
  getProductsForCollection,
  homeCollectionHandles,
  legalPages,
  products,
  ritualSteps,
  siteData,
  trustPoints,
  type Product,
} from "./siteData";
import { useStore } from "./store";
import {
  CollectionCard,
  EmptyState,
  PageMeta,
  PriceStack,
  ProductCard,
  QuantityControl,
  SectionHeading,
  Surface,
} from "./ui";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

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

export function HomePage() {
  const homeCollections = homeCollectionHandles
    .map((handle) => getCollectionByHandle(handle))
    .filter((collection): collection is NonNullable<typeof collection> => Boolean(collection));
  const featuredJournalPost = blogPosts[0];
  const supportingJournalPosts = blogPosts.slice(1, 4);

  return (
    <>
      <PageMeta
        title="Premium Botanical Wellness"
        description="Wild Botanix UK pairs herbal teas, sea moss, batana oil and natural self-care in a calmer, more premium botanical storefront."
      />

      <section className="hero">
        <div
          className="hero__media"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(8, 16, 13, 0.54) 0%, rgba(8, 16, 13, 0.34) 26%, rgba(8, 16, 13, 0.12) 54%, rgba(8, 16, 13, 0.06) 100%), url(${siteData.brand.heroImage})`,
          }}
        />

        <div className="container hero__content">
          <div className="hero__copy">
            <p className="eyebrow hero__eyebrow">Wild Botanix UK</p>
            <h1 className="hero__title">
              <span className="hero__title-main">Natural Herbal Wellness,</span>
              <span className="hero__title-accent">Beautifully Elevated</span>
            </h1>
            <p className="hero__lede">
              Discover premium botanical self-care, herbal rituals, and nature-led wellness from
              Wild Botanix UK.
            </p>

            <div className="hero__actions">
              <Link className="button" to="/shop">
                Explore the collection <ArrowRight size={16} />
              </Link>
              <Link className="button button--ghost" to="/about">
                Discover the brand
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container trust-grid">
          {trustPoints.map((point) => (
            <Surface key={point.title}>
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </Surface>
          ))}
        </div>
      </section>

      <section className="section section--accent">
        <div className="container story-band">
          <div>
            <p className="eyebrow">Rooted in nature</p>
            <h2>Made for slower rituals, cleaner routines and calmer shopping.</h2>
          </div>
          <p>
            Wild Botanix is built around botanical wellness, herbal teas, sea moss, batana oil,
            haircare and natural self-care. This version gives those themes a darker, more
            atmospheric presentation with cleaner hierarchy and a more premium flow from browsing
            to basket.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="image-heading image-heading--center">
            <SectionHeading
              eyebrow="Collections"
              title="A stronger category structure for real browsing"
              body="The live product range is preserved, but the experience now routes customers through cleaner, more premium collection entry points."
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

      <section className="section">
        <div className="container editorial-grid">
          <Surface className="editorial-copy">
            <p className="eyebrow">Slow down. Tune in.</p>
            <h2>Wellness is a ritual, not a rush.</h2>
            <p>
              Wild Botanix works best when the shop feels editorial, measured and composed. The new
              structure gives the brand room to breathe, with cleaner collection routing, stronger
              product stories and calmer conversion cues.
            </p>
            <Link className="button button--ghost" to="/collections/herbal-teas">
              Explore tea rituals
            </Link>
          </Surface>

          <div className="ritual-cards">
            {ritualSteps.map((step) => (
              <Surface key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </Surface>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--mist">
        <div className="container">
          <div className="image-heading">
            <SectionHeading
              eyebrow="Featured products"
              title="Naturally loved, neatly presented"
              body="Instead of dumping products into a generic wall, the homepage highlights a tighter product edit with stronger card hierarchy and cleaner purchase cues."
            />
          </div>
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.handle} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container commerce-strip__cards">
          <Surface>
            <ShieldCheck size={24} />
            <h3>Customer accounts</h3>
            <p>Sign up, sign in, edit details and manage saved delivery information.</p>
          </Surface>
          <Surface>
            <Truck size={24} />
            <h3>Clean cart and checkout</h3>
            <p>Customers move through a clearer basket and delivery flow without awkward theme clutter.</p>
          </Surface>
          <Surface>
            <CreditCard size={24} />
            <h3>Payment-ready handoff</h3>
            <p>The structure is honest about integration status while already preparing for production checkout wiring.</p>
          </Surface>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="image-heading">
            <SectionHeading
              eyebrow="Journal"
              title="An editorial layer that now feels intentional"
              body="The journal now supports the shop with calmer botanical storytelling, clearer rituals and a more considered content rhythm."
            />
          </div>

          <div className="journal-showcase">
            <Link className="journal-showcase__feature" to={`/journal/${featuredJournalPost.slug}`}>
              <div className="journal-showcase__feature-copy">
                <div className="journal-showcase__meta">
                  <span>{featuredJournalPost.category}</span>
                  <span>{featuredJournalPost.readTime}</span>
                </div>
                <h3>{featuredJournalPost.title}</h3>
                <p>{featuredJournalPost.excerpt}</p>
                <span>
                  Read feature <ArrowRight size={16} />
                </span>
              </div>
              <div className="journal-showcase__feature-media">
                <div className="journal-showcase__feature-image">
                  <img
                    src={featuredJournalPost.heroImage}
                    alt={featuredJournalPost.title}
                    loading="lazy"
                  />
                </div>
              </div>
            </Link>

            <div className="journal-showcase__stack">
              {supportingJournalPosts.map((post) => (
                <Link className="journal-showcase__mini" key={post.slug} to={`/journal/${post.slug}`}>
                  <div>
                    <p className="eyebrow">{post.category}</p>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                  <span>{post.readTime}</span>
                </Link>
              ))}

              <Link className="button button--ghost" to="/journal">
                Explore all 20 journal articles <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
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
        description="Browse the full Wild Botanix product catalogue with cleaner filters, stronger product cards and a more premium ecommerce structure."
      />
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">All products</p>
          <h1>Premium botanical products, reorganised properly.</h1>
          <p>
            The full live Wild Botanix range sits here in a cleaner, more conversion-focused shop
            experience with stronger cards, better filtering and clearer page hierarchy.
          </p>
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
              {filteredProducts.map((product) => (
                <ProductCard key={product.handle} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No products match that filter"
              body="Try adjusting your collection or search terms to explore the Wild Botanix catalogue."
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
        description="Explore Wild Botanix by cleaner collection groups, from herbal teas and mineral wellness to hair and scalp care."
      />
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Collections</p>
          <h1>A calmer route into the catalogue.</h1>
          <p>
            The live store structure is cleaned up here into stronger entry points that feel more
            premium and easier to browse across desktop and mobile.
          </p>
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

  return (
    <>
      <PageMeta title={collection.title} description={collection.description} />
      <section className="page-hero page-hero--with-media">
        <div className="container page-hero__split">
          <div>
            <p className="eyebrow">{collection.eyebrow}</p>
            <h1>{collection.heroHeading}</h1>
            <p>{collection.heroCopy}</p>
          </div>
          <div className="page-hero__media-card">
            <img src={collection.image} alt={collection.title} />
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container product-grid">
          {collectionProducts.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

export function ProductPage() {
  const { handle = "" } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const product = getProductByHandle(handle);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setSelectedVariantId(product?.variants[0]?.id ?? null);
  }, [product]);

  if (!product) {
    return <NotFoundPage />;
  }

  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0];
  const relatedProducts = products
    .filter(
      (candidate) =>
        candidate.handle !== product.handle &&
        candidate.collections.some((collectionHandle) =>
          product.collections.includes(collectionHandle),
        ),
    )
    .slice(0, 4);

  const handleAddToCart = () => addToCart(product, selectedVariant, quantity);

  return (
    <>
      <PageMeta title={product.cardTitle} description={product.summary} />

      <section className="section section--tight">
        <div className="container breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop">Shop</Link>
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
              <img src={product.images[selectedImage]} alt={product.cardTitle} />
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
                    <img src={image} alt={`${product.cardTitle} ${index + 1}`} />
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
            {product.cardTitle !== product.title ? (
              <p className="product-summary__source-title">Source product name: {product.title}</p>
            ) : null}
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
              <QuantityControl value={quantity} onChange={setQuantity} />
              <button className="button" type="button" disabled={!product.available} onClick={handleAddToCart}>
                {product.available ? "Add to cart" : "Sold out"}
              </button>
              <button
                className="button button--ghost"
                type="button"
                disabled={!product.available}
                onClick={() => {
                  handleAddToCart();
                  navigate("/checkout");
                }}
              >
                Buy now
              </button>
            </div>

            <Surface className="product-summary__trust">
              <div>
                <Truck size={18} />
                <span>Free UK delivery over GBP 50</span>
              </div>
              <div>
                <ShieldCheck size={18} />
                <span>Account, cart and checkout-ready flow</span>
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
            body="Other products from nearby Wild Botanix categories, surfaced more tastefully than a generic recommendation strip."
          />
          <div className="product-grid">
            {relatedProducts.map((related) => (
              <ProductCard key={related.handle} product={related} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageMeta
        title="About"
        description="Learn how Wild Botanix is positioned in the rebuild: botanical wellness, premium self-care and a cleaner ecommerce structure."
      />
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">About Wild Botanix</p>
          <h1>Botanical wellness with stronger premium execution.</h1>
          <p>{siteData.about.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="container editorial-grid">
          <Surface className="editorial-copy">
            <SectionHeading
              eyebrow="Brand positioning"
              title="The business stays. The execution changes."
              body="Wild Botanix already had a recognisable product set and a real point of view. The rebuild keeps those truths intact while dramatically improving the storefront experience."
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
        description="Contact Wild Botanix through a cleaner, more trustworthy support page with email, phone, socials and a guided contact form."
      />
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1>Support, questions and order help in one cleaner place.</h1>
          <p>
            The live site splits this information awkwardly. The rebuild brings contact details,
            support timing and customer messaging into one clearer page.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <Surface>
            <Mail size={20} />
            <h3>Email</h3>
            <p>{siteData.contact.email}</p>
            <p>{siteData.contact.secondaryEmail}</p>
          </Surface>
          <Surface>
            <Phone size={20} />
            <h3>Phone</h3>
            <p>{siteData.contact.phone}</p>
            <p>{siteData.contact.hours}</p>
          </Surface>
          <Surface>
            <MapPin size={20} />
            <h3>Socials</h3>
            <p>Instagram {siteData.contact.instagram}</p>
            <p>Facebook {siteData.contact.facebook}</p>
            <p>TikTok {siteData.contact.tiktok}</p>
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
                  <input required placeholder="Your full name" />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input required type="email" placeholder="you@example.com" />
                </label>
                <label className="field">
                  <span>Order or enquiry type</span>
                  <select defaultValue="general">
                    <option value="general">General enquiry</option>
                    <option value="order">Order support</option>
                    <option value="wholesale">Wholesale</option>
                  </select>
                </label>
                <label className="field field--full">
                  <span>Message</span>
                  <textarea required rows={6} placeholder="Tell us how we can help." />
                </label>
                <button className="button" type="submit">
                  Send enquiry
                </button>
              </form>
            ) : (
              <EmptyState
                title="Message ready"
                body="This form is structured and styled as part of the replacement build. Wire it to your production inbox or CRM when you're ready to launch."
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
  const { customer, register, saveAddress, signIn, signOut, updateCustomer } = useStore();
  const [message, setMessage] = useState("");

  if (customer) {
    return (
      <>
        <PageMeta
          title="Account"
          description="Manage your Wild Botanix account, saved address and demo order history."
        />
        <section className="page-hero">
          <div className="container">
            <p className="eyebrow">Account</p>
            <h1>Welcome back, {customer.firstName}.</h1>
            <p>
              This rebuilt account area gives customers a proper place to manage details, saved
              addresses and order history.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container account-grid">
            <Surface>
              <h2>Profile</h2>
              <form
                className="form-grid"
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  updateCustomer({
                    firstName: String(formData.get("firstName") ?? customer.firstName),
                    lastName: String(formData.get("lastName") ?? customer.lastName),
                    phone: String(formData.get("phone") ?? customer.phone),
                    marketingOptIn: formData.get("marketing") === "on",
                  });
                  setMessage("Account details updated.");
                }}
              >
                <label className="field">
                  <span>First name</span>
                  <input defaultValue={customer.firstName} name="firstName" />
                </label>
                <label className="field">
                  <span>Last name</span>
                  <input defaultValue={customer.lastName} name="lastName" />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input defaultValue={customer.email} disabled />
                </label>
                <label className="field">
                  <span>Phone</span>
                  <input defaultValue={customer.phone} name="phone" />
                </label>
                <label className="checkbox-field field--full">
                  <input defaultChecked={customer.marketingOptIn} name="marketing" type="checkbox" />
                  <span>Receive updates and launch offers</span>
                </label>
                <div className="button-row">
                  <button className="button" type="submit">
                    Save changes
                  </button>
                  <button className="button button--ghost" type="button" onClick={signOut}>
                    Sign out
                  </button>
                </div>
              </form>
            </Surface>

            <Surface>
              <h2>Saved delivery details</h2>
              <form
                className="form-grid"
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  saveAddress({
                    label: String(formData.get("label") ?? "Home"),
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    line1: String(formData.get("line1") ?? ""),
                    line2: String(formData.get("line2") ?? ""),
                    city: String(formData.get("city") ?? ""),
                    postcode: String(formData.get("postcode") ?? ""),
                    country: String(formData.get("country") ?? "United Kingdom"),
                  });
                  setMessage("Saved delivery details updated.");
                }}
              >
                <label className="field">
                  <span>Address label</span>
                  <input defaultValue={customer.savedAddress?.label ?? "Home"} name="label" />
                </label>
                <label className="field">
                  <span>Address line 1</span>
                  <input defaultValue={customer.savedAddress?.line1 ?? ""} name="line1" />
                </label>
                <label className="field">
                  <span>Address line 2</span>
                  <input defaultValue={customer.savedAddress?.line2 ?? ""} name="line2" />
                </label>
                <label className="field">
                  <span>Town / city</span>
                  <input defaultValue={customer.savedAddress?.city ?? ""} name="city" />
                </label>
                <label className="field">
                  <span>Postcode</span>
                  <input defaultValue={customer.savedAddress?.postcode ?? ""} name="postcode" />
                </label>
                <label className="field">
                  <span>Country</span>
                  <input defaultValue={customer.savedAddress?.country ?? "United Kingdom"} name="country" />
                </label>
                <button className="button" type="submit">
                  Save address
                </button>
              </form>
            </Surface>
          </div>

          <div className="container">
            {message ? <p className="inline-message">{message}</p> : null}
          </div>
        </section>

        <section className="section section--mist">
          <div className="container">
            <SectionHeading
              eyebrow="Orders"
              title="Recent demo order history"
              body="The customer area is already structured to store order history once checkout is connected for production."
            />
            {customer.orders.length > 0 ? (
              <div className="account-orders">
                {customer.orders.map((order) => (
                  <Surface key={order.id}>
                    <div className="order-card__top">
                      <div>
                        <p className="eyebrow">{order.id}</p>
                        <h3>{formatDate(order.placedAt)}</h3>
                      </div>
                      <strong>{order.status}</strong>
                    </div>
                    <p>{order.items.length} item(s)</p>
                    <PriceStack price={order.total} compareAt={null} compact />
                  </Surface>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No demo orders yet"
                body="Place an order through the checkout flow to see it appear here."
                cta={{ label: "Go to shop", href: "/shop" }}
              />
            )}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Account"
        description="Create a Wild Botanix account or sign in to manage saved details and orders."
      />
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Account</p>
          <h1>A proper customer account surface, not an afterthought.</h1>
          <p>
            The rebuilt experience treats sign-up, sign-in and saved customer details as genuine
            ecommerce flows so the site feels commercially ready.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container auth-grid">
          <Surface>
            <h2>Sign in</h2>
            <form
              className="form-grid"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const response = signIn(
                  String(formData.get("email") ?? ""),
                  String(formData.get("password") ?? ""),
                );
                setMessage(response.message);
              }}
            >
              <label className="field">
                <span>Email</span>
                <input name="email" type="email" required placeholder="you@example.com" />
              </label>
              <label className="field">
                <span>Password</span>
                <input name="password" type="password" required placeholder="Enter your password" />
              </label>
              <button className="button" type="submit">
                Sign in
              </button>
            </form>
          </Surface>

          <Surface>
            <h2>Create account</h2>
            <form
              className="form-grid"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const response = register({
                  firstName: String(formData.get("firstName") ?? ""),
                  lastName: String(formData.get("lastName") ?? ""),
                  email: String(formData.get("email") ?? ""),
                  phone: String(formData.get("phone") ?? ""),
                  password: String(formData.get("password") ?? ""),
                  marketingOptIn: formData.get("marketing") === "on",
                });
                setMessage(response.message);
              }}
            >
              <label className="field">
                <span>First name</span>
                <input name="firstName" required />
              </label>
              <label className="field">
                <span>Last name</span>
                <input name="lastName" required />
              </label>
              <label className="field">
                <span>Email</span>
                <input name="email" type="email" required />
              </label>
              <label className="field">
                <span>Phone</span>
                <input name="phone" />
              </label>
              <label className="field field--full">
                <span>Password</span>
                <input name="password" type="password" required />
              </label>
              <label className="checkbox-field field--full">
                <input name="marketing" type="checkbox" />
                <span>Keep me updated on launches and offers</span>
              </label>
              <button className="button" type="submit">
                Create account
              </button>
            </form>
          </Surface>
        </div>

        <div className="container">
          {message ? <p className="inline-message">{message}</p> : null}
        </div>
      </section>
    </>
  );
}

export function CartPage() {
  const { cartItems, removeFromCart, subtotal, updateQuantity } = useStore();

  return (
    <>
      <PageMeta
        title="Cart"
        description="Review the Wild Botanix basket with cleaner layout, quantity controls and a clearer path to checkout."
      />
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Cart</p>
          <h1>A cleaner, premium-ready basket experience.</h1>
          <p>
            The rebuilt cart is structured as a proper ecommerce step with room for upsells,
            shipping clarity and customer confidence.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container cart-layout">
          {cartItems.length > 0 ? (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <Surface className="cart-item" key={item.key}>
                    <img src={item.image} alt={item.title} />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.variantTitle}</p>
                      <PriceStack price={item.price} compareAt={null} compact />
                    </div>
                    <QuantityControl value={item.quantity} onChange={(value) => updateQuantity(item.key, value)} />
                    <button className="text-button" type="button" onClick={() => removeFromCart(item.key)}>
                      Remove
                    </button>
                  </Surface>
                ))}
              </div>

              <Surface className="cart-summary">
                <h2>Order summary</h2>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
                <div className="summary-row">
                  <span>Delivery</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="summary-row">
                  <span>Free UK delivery</span>
                  <span>Orders over GBP 50</span>
                </div>
                <Link className="button" to="/checkout">
                  Continue to checkout
                </Link>
                <Link className="button button--ghost" to="/shop">
                  Continue shopping
                </Link>
              </Surface>
            </>
          ) : (
            <EmptyState
              title="Your cart is empty"
              body="Browse the rebuilt Wild Botanix catalogue and add products to see the basket flow in action."
              cta={{ label: "Shop products", href: "/shop" }}
            />
          )}
        </div>
      </section>
    </>
  );
}

export function CheckoutPage() {
  const { cartItems, customer, placeDemoOrder, subtotal } = useStore();
  const [orderId, setOrderId] = useState("");

  if (cartItems.length === 0 && !orderId) {
    return (
      <>
        <PageMeta title="Checkout" description="Wild Botanix checkout handoff preparation." />
        <section className="section">
          <div className="container">
            <EmptyState
              title="Your checkout is waiting for products"
              body="Add a few Wild Botanix products to the cart first, then return here to test the full purchase flow."
              cta={{ label: "Go to shop", href: "/shop" }}
            />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Checkout"
        description="A cleaner checkout preparation flow for Wild Botanix, ready for future payment integration."
      />
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Checkout</p>
          <h1>Structured honestly for live integration.</h1>
          <p>
            This checkout flow is ready for a future payment handoff while already giving customers
            a cleaner delivery and confirmation experience.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container checkout-layout">
          <Surface>
            <h2>Delivery details</h2>
            {!orderId ? (
              <form
                className="form-grid"
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  const nextOrderId = placeDemoOrder({
                    shippingAddress: {
                      label: "Checkout",
                      firstName: String(formData.get("firstName") ?? ""),
                      lastName: String(formData.get("lastName") ?? ""),
                      line1: String(formData.get("line1") ?? ""),
                      line2: String(formData.get("line2") ?? ""),
                      city: String(formData.get("city") ?? ""),
                      postcode: String(formData.get("postcode") ?? ""),
                      country: String(formData.get("country") ?? "United Kingdom"),
                    },
                  });
                  setOrderId(nextOrderId);
                }}
              >
                <label className="field">
                  <span>Email</span>
                  <input defaultValue={customer?.email ?? ""} required type="email" />
                </label>
                <label className="field">
                  <span>Phone</span>
                  <input defaultValue={customer?.phone ?? ""} />
                </label>
                <label className="field">
                  <span>First name</span>
                  <input defaultValue={customer?.savedAddress?.firstName ?? customer?.firstName ?? ""} name="firstName" required />
                </label>
                <label className="field">
                  <span>Last name</span>
                  <input defaultValue={customer?.savedAddress?.lastName ?? customer?.lastName ?? ""} name="lastName" required />
                </label>
                <label className="field field--full">
                  <span>Address line 1</span>
                  <input defaultValue={customer?.savedAddress?.line1 ?? ""} name="line1" required />
                </label>
                <label className="field field--full">
                  <span>Address line 2</span>
                  <input defaultValue={customer?.savedAddress?.line2 ?? ""} name="line2" />
                </label>
                <label className="field">
                  <span>Town / city</span>
                  <input defaultValue={customer?.savedAddress?.city ?? ""} name="city" required />
                </label>
                <label className="field">
                  <span>Postcode</span>
                  <input defaultValue={customer?.savedAddress?.postcode ?? ""} name="postcode" required />
                </label>
                <label className="field">
                  <span>Country</span>
                  <input defaultValue={customer?.savedAddress?.country ?? "United Kingdom"} name="country" required />
                </label>
                <label className="field">
                  <span>Delivery speed</span>
                  <select defaultValue="standard">
                    <option value="standard">Standard UK delivery</option>
                    <option value="express">Express UK delivery</option>
                  </select>
                </label>
                <button className="button" type="submit">
                  Place demo order
                </button>
              </form>
            ) : (
              <EmptyState
                title={`Order ${orderId} created`}
                body="The cart, account and checkout surfaces are now connected. The next production step is wiring this handoff to the live payment and fulfilment layer."
                cta={{ label: "View account", href: "/account" }}
              />
            )}
          </Surface>

          <Surface className="cart-summary">
            <h2>Order summary</h2>
            {cartItems.map((item) => (
              <div className="checkout-item" key={item.key}>
                <span>
                  {item.title} x {item.quantity}
                </span>
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
              </div>
            ))}
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Payment handoff</span>
              <span>Ready for integration</span>
            </div>
            <div className="pill-row pill-row--wrap">
              <span className="pill">Apple Pay ready</span>
              <span className="pill">Card payment ready</span>
              <span className="pill">Shop Pay ready</span>
            </div>
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
      <PageMeta title={page.title} description={page.intro} />
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
        description="The page you were looking for does not exist in the Wild Botanix rebuild."
      />
      <section className="section">
        <div className="container">
          <EmptyState
            title="That page doesn't exist"
            body="Head back to the homepage or continue browsing the rebuilt Wild Botanix catalogue."
            cta={{ label: "Return home", href: "/" }}
          />
        </div>
      </section>
    </>
  );
}
