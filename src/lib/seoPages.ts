/**
 * Programmatic SEO content engine (data-driven, static).
 *
 * One data file -> one template (src/pages/[slug].tsx) -> static pages + JSON-LD schema
 * + generated sitemap. Mirrors a competitor's local-SEO taxonomy (geo + topic + vehicle)
 * but the COPY IS EDUCATIONAL ONLY — no advertised payments, "zero down", "bad credit",
 * or approval/lease-arranging claims (gated on the NJ Leasing Dealer license + Reg M
 * disclosures per the auto board). Keep it that way until legal clears the money pages.
 */

export type FAQ = { q: string; a: string };
export type Section = { heading: string; body: string };
export type SeoPage = {
  slug: string;
  category: "location" | "guide" | "vehicle";
  title: string;
  h1: string;
  metaDescription: string;
  intro: string;
  sections: Section[];
  faqs: FAQ[];
};

const BRAND = "Karcin Automotive";
const DISCLAIMER =
  "Karcin Automotive is an independent automotive concierge and brokerage. All vehicle availability, pricing, and approvals are provided through licensed dealership and lender partners and are subject to credit approval and current manufacturer programs.";

// --- Geo footprint (Little Falls NJ + surrounding metro) ---
const TOWNS = [
  "Little Falls", "Montclair", "Clifton", "Wayne", "Totowa", "Woodland Park",
  "Cedar Grove", "Verona", "West Caldwell", "Fairfield", "Nutley", "Bloomfield",
  "Montville", "Caldwell", "Passaic", "Paterson",
];

function locationPage(town: string): SeoPage {
  const slug = `car-leasing-${town.toLowerCase().replace(/\s+/g, "-")}-nj`;
  return {
    slug,
    category: "location",
    title: `Car Leasing in ${town}, NJ | Concierge Auto Broker | ${BRAND}`,
    h1: `Car Leasing in ${town}, New Jersey`,
    metaDescription: `Looking to lease a car in ${town}, NJ? ${BRAND} is a concierge auto broker that helps ${town} drivers find the right lease and handles the legwork. Request a personalized quote.`,
    intro: `Leasing a vehicle in ${town} shouldn't mean a weekend lost at a dealership. ${BRAND} works as your personal auto broker — we learn what you're looking for, do the back-and-forth with dealer partners for you, and bring you clear options. Drivers across ${town} and the surrounding area use us to make leasing simple.`,
    sections: [
      { heading: `Why ${town} drivers use a broker`, body: `A broker works for you, not the dealership. Instead of visiting multiple showrooms in and around ${town}, you tell us the vehicle, budget range, and timing that fit your life, and we organize the search. You stay in control; we remove the friction.` },
      { heading: "How the process works", body: "Start with a quick conversation — by phone, text, or our online form. We confirm what matters to you (vehicle type, must-haves, timeline), then coordinate with licensed dealer partners and bring you options to compare. When something fits, we help you move forward cleanly." },
      { heading: "Available around the clock", body: `Our team and our AI assistant, Ava, respond fast — including evenings and weekends — so a ${town} driver never waits days for a callback. Call or text us anytime at (973) 218-4898.` },
    ],
    faqs: [
      { q: `Do you serve ${town}, NJ?`, a: `Yes. ${BRAND} helps drivers throughout ${town} and the surrounding northern New Jersey area with concierge vehicle leasing.` },
      { q: "What does a car broker cost me?", a: "We'll always be transparent about how the process works. Reach out for details on your specific situation — every request is personalized." },
      { q: "Can you help if I'm still deciding on a vehicle?", a: "Absolutely. Many people start with only a general idea. We help you narrow it down based on how you drive and what you need." },
    ],
  };
}

// --- Educational guides (no payment/credit trigger terms) ---
const GUIDES: SeoPage[] = [
  {
    slug: "how-car-leasing-works",
    category: "guide",
    title: `How Car Leasing Works — A Plain-English Guide | ${BRAND}`,
    h1: "How Car Leasing Works",
    metaDescription: "A clear, no-jargon explanation of how leasing a car actually works — terms, mileage, and what to expect — from the concierge team at Karcin Automotive.",
    intro: "Leasing is simply paying for the use of a vehicle over a set period instead of buying it outright. This guide explains the moving parts in plain English so you can decide with confidence.",
    sections: [
      { heading: "The basics", body: "With a lease, you choose a term (commonly 24 to 39 months) and an annual mileage allowance. You use the vehicle during the term and return it at the end, or explore other options. Your monthly cost reflects the vehicle, the term, the mileage, and current manufacturer programs." },
      { heading: "What affects your lease", body: "Several factors shape a lease: the vehicle and trim, the lease term, your annual mileage, and the manufacturer's current programs — which change month to month. Because programs move, we always confirm the latest before sharing options." },
      { heading: "How a broker makes it easier", body: "Rather than negotiating alone, you have a concierge who organizes the search, explains the terms, and coordinates with dealer partners — so you understand every number before you decide." },
    ],
    faqs: [
      { q: "What happens at the end of a lease?", a: "You typically return the vehicle. We help you plan ahead so the lease-end is smooth and predictable, with no surprises." },
      { q: "How many miles should I choose?", a: "It depends on how you drive. We help you pick an allowance that matches your real-world usage so you're not over- or under-buying miles." },
    ],
  },
  {
    slug: "auto-broker-vs-dealership-nj",
    category: "guide",
    title: `Auto Broker vs. Dealership in NJ — What's the Difference? | ${BRAND}`,
    h1: "Auto Broker vs. Dealership in New Jersey",
    metaDescription: "What's the difference between using an auto broker and going straight to a dealership in NJ? Here's a clear comparison from Karcin Automotive.",
    intro: "Both can get you into a vehicle — but the experience is very different. Here's how an auto broker compares to walking into a dealership in New Jersey.",
    sections: [
      { heading: "Who they work for", body: "A dealership represents its own inventory and goals. A broker works on your behalf — organizing the search, explaining options, and coordinating with dealer partners so the process is built around you." },
      { heading: "The experience", body: "At a dealership you often repeat your story to different people and spend hours on site. With a concierge broker, you have one point of contact who already knows what you want and handles the back-and-forth for you." },
      { heading: "When a broker shines", body: "If your time is valuable, you dislike the showroom dance, or you simply want someone to organize it all, a broker fits well. You stay in control of the decision while we carry the workload." },
    ],
    faqs: [
      { q: "Is a broker more expensive?", a: "Not inherently. We're transparent about how it works — reach out and we'll walk you through your specific situation." },
      { q: "Do I still choose the vehicle?", a: "Always. You make every decision. We bring you organized options and clear information to choose from." },
    ],
  },
  {
    slug: "lease-return-process-nj",
    category: "guide",
    title: `The Lease Return Process in NJ, Explained | ${BRAND}`,
    h1: "The Lease Return Process, Explained",
    metaDescription: "Returning a leased car in New Jersey? Here's what to expect at lease-end and how to avoid surprises — a clear guide from Karcin Automotive.",
    intro: "Lease-end doesn't have to be stressful. Knowing what to expect — and preparing a little in advance — keeps the return smooth and predictable.",
    sections: [
      { heading: "What to expect at lease-end", body: "As your lease winds down, the vehicle is reviewed against the lease's standard for normal wear. Planning ahead lets you address small items early instead of being surprised at turn-in." },
      { heading: "Avoiding surprises", body: "Common end-of-lease items include tires, minor curb rash on wheels, and small dents. Many of these can be handled affordably ahead of time. We help you understand what's worth addressing and what isn't." },
      { heading: "Planning your next move", body: "Lease-end is also a natural moment to plan what's next. We reach out well before your return date so you always have a plan and never end up without a vehicle." },
    ],
    faqs: [
      { q: "When should I start planning my lease return?", a: "We recommend starting about 90 to 120 days out. We'll reach out proactively so you have plenty of time." },
      { q: "What counts as normal wear?", a: "Each lease defines it, but minor wear is expected. We help you understand your specific terms before turn-in." },
    ],
  },
  {
    slug: "leasing-a-car-for-your-business-nj",
    category: "guide",
    title: `Leasing a Car for Your Business in NJ | ${BRAND}`,
    h1: "Leasing a Vehicle for Your Business",
    metaDescription: "Thinking about leasing a vehicle under your business in New Jersey? Here's a plain-English overview — and how Karcin Automotive makes it simple.",
    intro: "Many New Jersey business owners and professionals lease vehicles through their business. Here's a general overview of how it works — always confirm specifics with your tax advisor.",
    sections: [
      { heading: "Why businesses lease", body: "Leasing can simplify how a business puts a vehicle on the road, with predictable terms and a straightforward refresh cycle. The right structure depends on your business and goals." },
      { heading: "What to have ready", body: "Business leasing generally involves some documentation about the business. We help you understand what's typically needed and coordinate the process so it's not a paperwork headache." },
      { heading: "Talk to your advisor", body: "Tax treatment varies by situation. We focus on making the vehicle side simple; your accountant or tax advisor should confirm what's right for your business." },
    ],
    faqs: [
      { q: "Can you help me lease under my business name?", a: "Yes — we help coordinate business leasing with our dealer partners. Reach out and we'll walk through what's involved." },
      { q: "Will leasing save my business money?", a: "That depends on your specific situation and tax picture — your tax advisor is the right person to confirm. We make the vehicle process easy." },
    ],
  },
  {
    slug: "what-is-an-auto-broker",
    category: "guide",
    title: `What Is an Auto Broker? | ${BRAND}`,
    h1: "What Is an Auto Broker?",
    metaDescription: "What does an auto broker actually do, and how can one help you? A simple explanation from Karcin Automotive, your concierge auto broker in NJ.",
    intro: "An auto broker is your personal advocate in the vehicle process — someone who works for you to organize the search, explain the options, and handle the legwork.",
    sections: [
      { heading: "What a broker does", body: "Instead of shopping alone, you have a concierge who learns your needs, coordinates with licensed dealer partners, and brings you clear, organized options to compare on your schedule." },
      { heading: "How it helps you", body: "You save time, skip the showroom marathon, and make decisions with someone in your corner who explains every step. You stay fully in control; we carry the workload." },
    ],
    faqs: [
      { q: "Is Karcin a dealership?", a: `No. ${BRAND} is an independent concierge and brokerage that works on your behalf and coordinates with licensed dealer partners.` },
      { q: "How do I start?", a: "Call or text (973) 218-4898, or fill out our quick request form. We'll take it from there." },
    ],
  },
];

// --- Vehicle pages (educational "what to know about leasing the X") ---
const VEHICLES = [
  "BMW X5", "Mercedes-Benz GLE", "Audi Q5", "Toyota RAV4", "Honda CR-V",
  "Lexus RX", "Range Rover Sport", "Tesla Model Y", "BMW 3 Series", "Jeep Grand Cherokee",
];

function vehiclePage(model: string): SeoPage {
  const slug = `lease-${model.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-nj`;
  return {
    slug,
    category: "vehicle",
    title: `Leasing a ${model} in NJ — What to Know | ${BRAND}`,
    h1: `Leasing a ${model} in New Jersey`,
    metaDescription: `Considering a ${model} lease in NJ? Here's what to know — and how Karcin Automotive helps you find the right one. Request a personalized quote.`,
    intro: `The ${model} is a popular choice for New Jersey drivers. If you're considering leasing one, here's a quick overview and how ${BRAND} makes the process simple.`,
    sections: [
      { heading: `Why drivers choose the ${model}`, body: `The ${model} blends the qualities NJ drivers tend to want — comfort, capability, and everyday practicality. The right trim and configuration depend on how you'll use it, which is exactly what we help you sort out.` },
      { heading: `Leasing a ${model} with a concierge`, body: `Rather than chase the ${model} across multiple dealerships, tell us your preferences — color, trim, timing — and we coordinate with dealer partners to bring you organized options. Current programs change monthly, so we always confirm the latest before sharing details.` },
      { heading: "Get a personalized quote", body: `Want real numbers on a ${model}? Request a personalized quote and our team — or Ava, our AI assistant — will follow up quickly with options that fit what you're looking for.` },
    ],
    faqs: [
      { q: `Can you get me a ${model} in a specific color?`, a: `Often, yes — we coordinate with dealer partners to find the configuration you want. Tell us your preferences and we'll do the searching.` },
      { q: `How soon can I lease a ${model}?`, a: "Timing depends on availability and your situation. Reach out and we'll give you a realistic picture quickly." },
    ],
  };
}

export const SEO_PAGES: SeoPage[] = [
  ...TOWNS.map(locationPage),
  ...GUIDES,
  ...VEHICLES.map(vehiclePage),
];

export const SEO_DISCLAIMER = DISCLAIMER;

export function getSeoPage(slug: string): SeoPage | undefined {
  return SEO_PAGES.find((p) => p.slug === slug);
}
export function allSeoSlugs(): string[] {
  return SEO_PAGES.map((p) => p.slug);
}
