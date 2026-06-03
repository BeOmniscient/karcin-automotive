import type { GetServerSideProps } from "next";
import { allSeoSlugs } from "@/lib/seoPages";

const SITE = "https://www.karcinauto.com";

const STATIC = [
  "", "how-it-works", "services", "about-mike", "dealer-partners",
  "business", "payments", "faq", "contact", "vehicle-request",
];

function xml(urls: string[]): string {
  const body = urls
    .map((u) => `  <url><loc>${SITE}/${u}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const urls = [...STATIC, ...allSeoSlugs()];
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
  res.write(xml(urls));
  res.end();
  return { props: {} };
};

export default function Sitemap() {
  return null;
}
