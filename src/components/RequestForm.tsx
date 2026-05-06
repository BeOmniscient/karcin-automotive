import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { submitVehicleRequest, type VehicleRequestPayload } from "@/lib/ghlIntegration";
import { trackEvent } from "@/lib/analytics";

type FormState = "idle" | "submitting" | "success" | "error";

const inputBase =
  "w-full rounded-lg border border-neutral-dark/15 bg-highlight px-4 py-3 text-sm text-neutral-dark placeholder:text-neutral-dark/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
const labelBase = "block text-xs font-medium uppercase tracking-widest text-neutral-dark/70";

export function RequestForm({ embedded = false }: { embedded?: boolean }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehicleRequestPayload>({
    defaultValues: {
      preferredContact: "email",
      intent: "unsure",
      condition: "either",
      consentCalls: false,
      consentTexts: false,
      consentEmails: true,
    },
  });

  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: VehicleRequestPayload) => {
    setState("submitting");
    setErrorMessage(null);
    const result = await submitVehicleRequest(data);
    if (result.ok) {
      setState("success");
      trackEvent("vehicle_request_submitted", { intent: data.intent });
      reset();
      return;
    }
    setState("error");
    setErrorMessage(result.error);
  };

  return (
    <section
      className={
        embedded
          ? ""
          : "container-page py-20 md:py-28"
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="rounded-xl2 border border-neutral-dark/10 bg-highlight p-8 shadow-card md:p-12"
      >
        {!embedded && (
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Vehicle Request</p>
            <h2 className="mt-4 section-heading">Tell us what you&rsquo;re looking for.</h2>
            <p className="mt-5 body-lg">
              Share a few details and we&rsquo;ll connect you with dealer-backed options.
              Your information is used only to assist with your search.
            </p>
          </div>
        )}

        {state === "success" ? (
          <div className="mt-8 rounded-xl bg-primary/10 p-6 text-center">
            <p className="font-display text-2xl text-neutral-dark">
              Thanks — we&rsquo;ve received your request.
            </p>
            <p className="mt-2 text-sm text-neutral-dark/70">
              A Karcin concierge will be in touch shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-10 grid gap-5 md:grid-cols-2"
            noValidate
          >
            <Field label="First name" error={errors.firstName?.message}>
              <input
                className={inputBase}
                placeholder="Jane"
                aria-invalid={!!errors.firstName}
                {...register("firstName", { required: "Required" })}
              />
            </Field>
            <Field label="Last name" error={errors.lastName?.message}>
              <input
                className={inputBase}
                placeholder="Doe"
                aria-invalid={!!errors.lastName}
                {...register("lastName", { required: "Required" })}
              />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input
                type="email"
                className={inputBase}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                {...register("email", {
                  required: "Required",
                  pattern: { value: /.+@.+\..+/, message: "Enter a valid email" },
                })}
              />
            </Field>
            <Field label="Phone" error={errors.phone?.message}>
              <input
                type="tel"
                className={inputBase}
                placeholder="(555) 555-5555"
                aria-invalid={!!errors.phone}
                {...register("phone", { required: "Required" })}
              />
            </Field>

            <Field label="Preferred contact">
              <select className={inputBase} {...register("preferredContact")}>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="text">Text</option>
              </select>
            </Field>
            <Field label="Looking to">
              <select className={inputBase} {...register("intent")}>
                <option value="lease">Lease</option>
                <option value="finance">Finance</option>
                <option value="buy">Buy</option>
                <option value="unsure">Not sure yet</option>
              </select>
            </Field>

            <Field label="New / pre-owned">
              <select className={inputBase} {...register("condition")}>
                <option value="new">New</option>
                <option value="pre-owned">Pre-owned</option>
                <option value="either">Either</option>
              </select>
            </Field>
            <Field label="Vehicle type">
              <input
                className={inputBase}
                placeholder="SUV, sedan, truck…"
                {...register("vehicleType")}
              />
            </Field>

            <Field label="Make / model preference">
              <input
                className={inputBase}
                placeholder="e.g. BMW X5"
                {...register("makeModel")}
              />
            </Field>
            <Field label="Budget range">
              <input
                className={inputBase}
                placeholder="$ / month or total"
                {...register("budgetRange")}
              />
            </Field>

            <Field label="Down payment">
              <input
                className={inputBase}
                placeholder="Optional"
                {...register("downPayment")}
              />
            </Field>
            <Field label="Current lease end date">
              <input
                type="date"
                className={inputBase}
                {...register("leaseEndDate")}
              />
            </Field>

            <Field label="Current vehicle">
              <input
                className={inputBase}
                placeholder="Year / make / model"
                {...register("currentVehicle")}
              />
            </Field>
            <Field label="Credit range">
              <select className={inputBase} {...register("creditRange")}>
                <option value="">Select…</option>
                <option value="excellent">Excellent (740+)</option>
                <option value="good">Good (700-739)</option>
                <option value="fair">Fair (640-699)</option>
                <option value="building">Building (&lt;640)</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </Field>

            <Field label="Timeline">
              <select className={inputBase} {...register("timeline")}>
                <option value="">Select…</option>
                <option value="immediately">Immediately</option>
                <option value="1-month">Within 1 month</option>
                <option value="3-months">Within 3 months</option>
                <option value="exploring">Just exploring</option>
              </select>
            </Field>
            <Field label="Trade-in?">
              <label className="mt-1 flex items-center gap-2 text-sm text-neutral-dark/80">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-dark/30 text-primary"
                  {...register("hasTradeIn")}
                />
                Yes, I have a vehicle to trade in
              </label>
            </Field>

            <Field label="Notes" className="md:col-span-2">
              <textarea
                className={`${inputBase} min-h-[120px]`}
                placeholder="Anything else we should know?"
                {...register("notes")}
              />
            </Field>

            <fieldset className="md:col-span-2 rounded-xl border border-neutral-dark/10 bg-secondary/60 p-5">
              <legend className="px-2 text-xs font-medium uppercase tracking-widest text-neutral-dark/70">
                Communication consent
              </legend>
              <p className="text-xs leading-relaxed text-neutral-dark/70">
                We obtain explicit consent for each channel. You can opt out at any time.
                Msg &amp; data rates may apply. Consent is not required to engage our service.
              </p>
              <div className="mt-3 flex flex-col gap-2 text-sm text-neutral-dark/85">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-dark/30 text-primary"
                    {...register("consentEmails")}
                  />
                  I consent to receive emails about my vehicle search.
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-dark/30 text-primary"
                    {...register("consentTexts")}
                  />
                  I consent to receive text messages about my vehicle search.
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-dark/30 text-primary"
                    {...register("consentCalls")}
                  />
                  I consent to receive phone calls about my vehicle search.
                </label>
              </div>
            </fieldset>

            <div className="md:col-span-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-neutral-dark/60">
                By submitting, you agree to our Privacy Policy and Terms of Service.
              </p>
              <button
                type="submit"
                disabled={state === "submitting"}
                className="btn-primary disabled:opacity-60"
              >
                {state === "submitting" ? "Submitting…" : "Submit Request"}
              </button>
            </div>

            {state === "error" && errorMessage && (
              <p className="md:col-span-2 text-sm text-primary">{errorMessage}</p>
            )}
          </form>
        )}
      </motion.div>
    </section>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <span className={labelBase}>{label}</span>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-1 text-xs text-primary">{error}</p>}
    </div>
  );
}
