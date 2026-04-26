import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getIndexableSeoRouteEntries, siteOrigin } from "../src/seo.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const lastModified = new Date().toISOString().slice(0, 10);

const sitemapEntries = getIndexableSeoRouteEntries()
  .map((entry) => {
    const url = `${siteOrigin}${entry.path === "/" ? "/" : entry.path}`;
    return [
      "  <url>",
      `    <loc>${url}</loc>`,
      `    <lastmod>${lastModified}</lastmod>`,
      "  </url>",
    ].join("\n");
  })
  .join("\n");

const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  sitemapEntries,
  "</urlset>",
  "",
].join("\n");

const robotsTxt = [
  "User-agent: *",
  "Allow: /",
  "",
  `Sitemap: ${siteOrigin}/sitemap.xml`,
  "",
].join("\n");

await mkdir(publicDir, { recursive: true });
await writeFile(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf8");
await writeFile(path.join(publicDir, "robots.txt"), robotsTxt, "utf8");
