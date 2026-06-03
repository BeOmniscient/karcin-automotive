import { useState } from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { HiOutlinePhone, HiOutlineClock, HiOutlineShieldCheck, HiOutlineSparkles } from "react-icons/hi";
import { trackEvent } from "@/lib/analytics";
import { PHONE_TEL, PHONE_DISPLAY } from "@/lib/site";

type QuickQuote = {
  firstName: string;
  lastName: string;
  phone: string;
  vehicle: string;
  timeline: string;
};

const input =
  "w-full rounded-lg border border-neutral-dark/15 bg-highlight px-4 py-3 text-sm text-neutral-dark placeholder:text-neutral-dark/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export default function LeaseQuotePage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<QuickQuote>();
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const onSubmit = async (data: QuickQuote) => {
    setState("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName || "(quick quote)",
          phone: data.phone,
          email: "",
          preferredContact: "phone",
          intent: "lease",
          condition: "either",
          makeModel: data.vehicle,
          timeline: data.timeline,
          consentCalls: true,
          consentTexts: true,
          consentEmails: false,
          notes: "Quick-quote landing page.",
        }),
      });
      const r = await res.json().catch(() => ({}));
      if (res.ok && r.ok) {
        trackEvent("quick_quote_submitted", { vehicle: data.vehicle });
        setState("success");
        reset();
      } else setState("error");
    } catch {
      setState("error");
    }
  };

  return (
    <>
      <Head>
        <title>Get a Personalized Lease Quote — Fast | Karcin Automotive</title>
        <meta name="description" content="Tell us the vehicle you want and we'll get to work — fast. Karcin Automotive is your concierge auto broker in NJ. Call or text 24/7." />
        <link rel="canonical" href="https://www.karcinauto.com/lease-quote" />
      </Head>

      <section className="container-page py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          {/* Pitch */}
          <div>
            <p className="eyebrow text-primary">Concierge Auto Broker · NJ</p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-neutral-dark md:text-5xl">
              Tell us the car. We do the rest — fast.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-neutral-dark/75">
              Skip the showroom marathon. Share what you&rsquo;re looking for and our team — plus Ava,
              our AI assistant — gets to work right away with options that actually fit.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                { Icon: HiOutlineClock, t: "Fastest response in the area", d: "We answer in seconds — days, nights, and weekends. No waiting for a callback." },
                { Icon: HiOutlineSparkles, t: "Concierge, not a call center", d: "One point of contact who already knows what you want." },
                { Icon: HiOutlineShieldCheck, t: "No pressure, ever", d: "We bring you organized options. You make every decision." },
              ].map(({ Icon, t, d }) => (
                <li key={t} className="flex gap-3">
                  <Icon className="mt-0.5 h-6 w-6 flex-none text-primary" />
                  <div>
                    <p className="font-semibold text-neutral-dark">{t}</p>
                    <p className="text-sm text-neutral-dark/65">{d}</p>
                  </div>
                </li>
              ))}
            </ul>

            <a href={PHONE_TEL} className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/5">
              <HiOutlinePhone className="h-4 w-4" /> Prefer to talk now? Call or text {PHONE_DISPLAY}
            </a>
          </div>

          {/* Form */}
          <div className="rounded-xl2 border-[2px] border-accent bg-highlight p-8 shadow-card md:p-10">
            {state === "success" ? (
              <div className="py-8 text-center">
                <p className="font-display text-2xl text-neutral-dark">You&rsquo;re in good hands.</p>
                <p className="mt-3 text-sm text-neutral-dark/70">
                  We&rsquo;ve got your request and someone from Karcin will reach out shortly with options
                  that fit what you&rsquo;re looking for.
                </p>
                <a href={PHONE_TEL} className="btn-primary mt-6 inline-block">Or call/text us now</a>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
                <p className="font-display text-2xl text-neutral-dark">Get your quote</p>
                <p className="-mt-2 text-sm text-neutral-dark/60">Takes 20 seconds. No obligation.</p>

                <div className="grid grid-cols-2 gap-4">
                  <input className={input} placeholder="First name" aria-invalid={!!errors.firstName} {...register("firstName", { required: true })} />
                  <input className={input} placeholder="Last name" {...register("lastName")} />
                </div>
                <input className={input} type="tel" placeholder="Mobile number" aria-invalid={!!errors.phone} {...register("phone", { required: true })} />
                <input className={input} placeholder="What vehicle are you interested in? (e.g. BMW X5, or 'an SUV')" {...register("vehicle")} />
                <select className={input} defaultValue="" {...register("timeline")}>
                  <option value="" disabled>When are you looking?</option>
                  <option value="immediately">As soon as possible</option>
                  <option value="1-month">Within a month</option>
                  <option value="3-months">Within a few months</option>
                  <option value="exploring">Just exploring</option>
                </select>

                <button type="submit" disabled={state === "submitting"} className="btn-primary mt-2 w-full disabled:opacity-60">
                  {state === "submitting" ? "Sending…" : "Get My Quote"}
                </button>
                {state === "error" && <p className="text-sm text-primary">Something went wrong — please call or text us at {PHONE_DISPLAY}.</p>}
                <p className="text-center text-xs leading-relaxed text-neutral-dark/45">
                  By submitting, you agree to be contacted about your vehicle search. Subject to credit approval
                  and current manufacturer programs.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
