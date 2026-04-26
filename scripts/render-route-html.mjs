import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  buildCanonicalUrl,
  defaultSocialImage,
  defaultThemeColor,
  getGlobalSeoSchema,
  getSeoRouteEntries,
  siteLocale,
  siteName,
  toAbsoluteUrl,
} from "../src/seo.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const distIndexPath = path.join(distDir, "index.html");
const distSsrEntryPath = path.join(projectRoot, "dist-ssr", "entry-server.js");

const escapeAttribute = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const stripManagedHeadTags = (html) =>
  [
    /<title>[\s\S]*?<\/title>\s*/gi,
    /<meta[^>]+name="description"[^>]*>\s*/gi,
    /<meta[^>]+name="robots"[^>]*>\s*/gi,
    /<meta[^>]+name="googlebot"[^>]*>\s*/gi,
    /<meta[^>]+name="theme-color"[^>]*>\s*/gi,
    /<meta[^>]+name="twitter:[^"]+"[^>]*>\s*/gi,
    /<meta[^>]+property="og:[^"]+"[^>]*>\s*/gi,
    /<link[^>]+rel="canonical"[^>]*>\s*/gi,
    /<script[^>]+id="seo-structured-data"[\s\S]*?<\/script>\s*/gi,
  ].reduce((output, pattern) => output.replace(pattern, ""), html);

const extractLeadingPreloads = (markup) => {
  const preloadTags = [];
  let remaining = markup.trimStart();

  while (remaining.startsWith("<link")) {
    const match = remaining.match(/^<link\b[^>]*\/>/);

    if (!match) {
      break;
    }

    preloadTags.push(match[0]);
    remaining = remaining.slice(match[0].length).trimStart();
  }

  return {
    preloadTags,
    bodyMarkup: remaining,
  };
};

const buildHeadBlock = (entry) => {
  const title = `${entry.title} | ${siteName}`;
  const canonicalUrl = buildCanonicalUrl(entry.path);
  const imageUrl = toAbsoluteUrl(entry.image ?? defaultSocialImage);
  const robots = entry.noindex
    ? "noindex, nofollow, noarchive"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  const structuredData = JSON.stringify([...getGlobalSeoSchema(), ...(entry.schema ?? [])]);

  return [
    `    <title>${escapeAttribute(title)}</title>`,
    `    <meta name="description" content="${escapeAttribute(entry.description)}" />`,
    `    <meta name="robots" content="${escapeAttribute(robots)}" />`,
    `    <meta name="googlebot" content="${escapeAttribute(robots)}" />`,
    `    <meta name="theme-color" content="${escapeAttribute(defaultThemeColor)}" />`,
    `    <meta property="og:locale" content="${escapeAttribute(siteLocale)}" />`,
    `    <meta property="og:site_name" content="${escapeAttribute(siteName)}" />`,
    `    <meta property="og:type" content="${escapeAttribute(entry.openGraphType ?? "website")}" />`,
    `    <meta property="og:title" content="${escapeAttribute(title)}" />`,
    `    <meta property="og:description" content="${escapeAttribute(entry.description)}" />`,
    `    <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />`,
    `    <meta property="og:image" content="${escapeAttribute(imageUrl)}" />`,
    '    <meta name="twitter:card" content="summary_large_image" />',
    `    <meta name="twitter:title" content="${escapeAttribute(title)}" />`,
    `    <meta name="twitter:description" content="${escapeAttribute(entry.description)}" />`,
    `    <meta name="twitter:image" content="${escapeAttribute(imageUrl)}" />`,
    `    <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />`,
    `    <script id="seo-structured-data" type="application/ld+json">${structuredData}</script>`,
  ].join("\n");
};

const renderRouteHtml = (template, entry, bodyMarkup) => {
  const { preloadTags, bodyMarkup: cleanedBodyMarkup } = extractLeadingPreloads(bodyMarkup);
  const cleaned = stripManagedHeadTags(template).replace(/<html lang="[^"]+"/i, '<html lang="en-GB"');

  return cleaned
    .replace("</head>", `${preloadTags.map((tag) => `    ${tag}`).join("\n")}${preloadTags.length > 0 ? "\n" : ""}${buildHeadBlock(entry)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${cleanedBodyMarkup}</div>`);
};

const writeRouteHtml = async (entry, template, renderRouteBody) => {
  const targetDir =
    entry.path === "/" ? distDir : path.join(distDir, ...entry.path.replace(/^\//, "").split("/"));
  const targetFile =
    entry.path === "/" ? path.join(distDir, "index.html") : path.join(targetDir, "index.html");
  const bodyMarkup = renderRouteBody(entry.path);

  await mkdir(targetDir, { recursive: true });
  await writeFile(targetFile, renderRouteHtml(template, entry, bodyMarkup), "utf8");
};

const template = await readFile(distIndexPath, "utf8");
const routeEntries = getSeoRouteEntries();
const { render: renderRouteBody } = await import(pathToFileURL(distSsrEntryPath).href);

for (const entry of routeEntries) {
  await writeRouteHtml(entry, template, renderRouteBody);
}

const notFoundHtml = renderRouteHtml(template, {
  path: "/404",
  title: "Page Not Found",
  description: "The page you were looking for could not be found.",
  noindex: true,
  openGraphType: "website",
}, renderRouteBody("/404"));

await writeFile(path.join(distDir, "404.html"), notFoundHtml, "utf8");
