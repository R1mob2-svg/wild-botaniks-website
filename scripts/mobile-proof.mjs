import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.MOBILE_PROOF_BASE_URL ?? "http://127.0.0.1:4181";
const outDir = path.resolve("receipts", "2026-04-26", "mobile-proof");

const viewports = [
  { name: "phone", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
];

const routes = [
  { slug: "home", path: "/" },
  { slug: "shop", path: "/shop" },
  { slug: "collections", path: "/collections" },
  { slug: "collection-herbal-teas", path: "/collections/herbal-teas" },
  { slug: "product-lime-flower", path: "/products/lime-flower-herbal-tea" },
  { slug: "journal", path: "/journal" },
  {
    slug: "journal-article",
    path: "/journal/how-to-create-a-herbal-tea-ritual-that-feels-luxurious",
  },
  { slug: "about", path: "/about" },
  { slug: "contact", path: "/contact" },
  { slug: "cart", path: "/cart" },
  { slug: "account", path: "/account" },
  { slug: "checkout", path: "/checkout" },
];

const scrollPage = async (page) => {
  await page.evaluate(async () => {
    const step = Math.max(240, Math.round(window.innerHeight * 0.9));
    const maxY = document.documentElement.scrollHeight - window.innerHeight;

    for (let y = 0; y <= maxY; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 70));
    }

    window.scrollTo(0, 0);
    await new Promise((resolve) => window.setTimeout(resolve, 120));
  });
};

const inspectPage = async (page) =>
  page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const doc = document.documentElement;
    const body = document.body;
    const scrollOverflow = Math.max(0, Math.ceil(doc.scrollWidth - viewportWidth));

    const overflowNodes = Array.from(document.querySelectorAll("body *"))
      .map((node) => {
        const element = node;
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          className: element.className || "",
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      })
      .filter((item) => item.width > 0 && (item.left < -1 || item.right - viewportWidth > 1))
      .slice(0, 15);

    const smallTargets = Array.from(
      document.querySelectorAll("a, button, input, select, textarea, summary"),
    )
      .map((node) => {
        const element = node;
        const rect = element.getBoundingClientRect();
        const label =
          element.getAttribute("aria-label") ||
          element.textContent?.trim()?.replace(/\s+/g, " ").slice(0, 60) ||
          element.getAttribute("placeholder") ||
          element.tagName.toLowerCase();

        return {
          tag: element.tagName.toLowerCase(),
          label,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      })
      .filter((item) => item.width > 0 && item.height > 0 && (item.width < 40 || item.height < 40))
      .slice(0, 20);

    return {
      bodyHeight: body.scrollHeight,
      viewportWidth,
      scrollOverflow,
      overflowNodes,
      smallTargets,
    };
  });

await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      colorScheme: "dark",
      locale: "en-GB",
      reducedMotion: "reduce",
    });

    for (const route of routes) {
      const page = await context.newPage();
      const url = `${baseUrl}${route.path}`;

      await page.goto(url, { waitUntil: "networkidle" });
      await scrollPage(page);

      const inspect = await inspectPage(page);
      const shotPath = path.join(outDir, `${route.slug}-${viewport.name}.png`);

      await page.screenshot({ path: shotPath, fullPage: true });

      results.push({
        route: route.path,
        slug: route.slug,
        viewport: viewport.name,
        screenshot: shotPath,
        ...inspect,
      });

      await page.close();
    }

    await context.close();
  }
} finally {
  await browser.close();
}

await fs.writeFile(
  path.join(outDir, "report.json"),
  JSON.stringify(results, null, 2),
  "utf8",
);

console.log(JSON.stringify({ outDir, pages: results.length }, null, 2));
