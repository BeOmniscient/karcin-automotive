import type { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/globals.css";
import { Layout } from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Karcin Automotive — Luxury Auto Brokerage</title>
        <meta
          name="description"
          content="Karcin Automotive is an independent auto brokerage and concierge service. We help you find lease, finance, purchase and trade-in opportunities through trusted licensed dealership partners."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
