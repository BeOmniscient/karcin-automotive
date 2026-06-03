import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import { HiOutlinePhone } from "react-icons/hi";
import { SEO_PAGES, getSeoPage, SEO_DISCLAIMER, type SeoPage } from "@/lib/seoPages";
import { PHONE_TEL, PHONE_DISPLAY } from "@/lib/site";

const SITE = "https://www.karcinauto.com";

export default function ProgrammaticPage({ page }: { page: SeoPage }) {
  const url = `${SITE}/${page.slug}`;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "AutomotiveBusiness",
      name: "Karcin Automotive",
      url,
      telephone: "+19732184898",
      areaServed: "Northern New Jersey",
      description: page.metaDescription,
      address: { "@type": "PostalAddress", addressLocality: "Little Falls", addressRegion: "NJ", postalCode: "07424", addressCountry: "US" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: page.h1, item: url },
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <article className="container-page py-16 md:py-24">
        <nav className="text-xs uppercase tracking-widest text-neutral-dark/50">
          <Link href="/" className="hover:text-primary">Home</Link> &middot; {page.category}
        </nav>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-neutral-dark md:text-5xl">{page.h1}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-dark/75">{page.intro}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/vehicle-request" className="btn-primary">Request a Quote</Link>
          <a href={PHONE_TEL} className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/5">
            <HiOutlinePhone className="h-4 w-4" /> Call or text {PHONE_DISPLAY}
          </a>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          <div className="space-y-10 md:col-span-2">
            {page.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-display text-2xl text-neutral-dark">{s.heading}</h2>
                <p className="mt-3 leading-relaxed text-neutral-dark/75">{s.body}</p>
              </section>
            ))}

            <section>
              <h2 className="font-display text-2xl text-neutral-dark">Frequently asked questions</h2>
              <dl className="mt-4 space-y-5">
                {page.faqs.map((f) => (
                  <div key={f.q}>
                    <dt className="font-semibold text-neutral-dark">{f.q}</dt>
                    <dd className="mt-1 leading-relaxed text-neutral-dark/70">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <aside className="md:col-span-1">
            <div className="sticky top-28 rounded-xl border-[2px] border-accent bg-highlight p-6">
              <p className="font-display text-xl text-neutral-dark">Let&rsquo;s make it easy.</p>
              <p className="mt-2 text-sm text-neutral-dark/70">Tell us what you&rsquo;re looking for and we&rsquo;ll bring you organized options — fast.</p>
              <Link href="/vehicle-request" className="btn-primary mt-4 w-full text-center">Start Your Request</Link>
              <a href={PHONE_TEL} className="mt-3 block text-center text-sm font-semibold text-primary">or call/text {PHONE_DISPLAY}</a>
            </div>
          </aside>
        </div>

        <p className="mt-16 max-w-3xl text-xs leading-relaxed text-neutral-dark/45">{SEO_DISCLAIMER}</p>
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: SEO_PAGES.map((p) => ({ params: { slug: p.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const page = getSeoPage(String(params?.slug));
  if (!page) return { notFound: true };
  return { props: { page } };
};
