/**
 * Lease lifecycle / pull-ahead engine (pure scheduling logic).
 *
 * Diane's retention clock, keyed off the lease-end date (the master clock) plus optional
 * lease-start and mileage. Given a contact's lease data + what's already been sent, returns
 * the single highest-priority action that's due today — or null. Channel 'sms' = Ava texts;
 * channel 'human' = flag Mike for a personal call. Copy is concierge + compliant (no payment
 * claims). Pure + deterministic so it unit-tests without GHL.
 */

export type LifecycleChannel = "sms" | "human";
export type LifecycleAction = {
  key: string;              // stable id, also the GHL "lc:<key>" sent-tag
  stage: string;            // human-readable
  channel: LifecycleChannel;
  message: string;          // SMS body (sms) or internal note (human)
  tag?: string;             // extra GHL tag to apply (e.g. for human routing)
};

export type LeaseData = {
  firstName?: string;
  leaseEndDate?: string;     // YYYY-MM-DD
  leaseStartDate?: string;   // YYYY-MM-DD (optional)
  annualMileage?: number;    // allowance
  currentMileage?: number;
  alreadySent?: Set<string>; // keys already actioned (from GHL tags "lc:<key>")
};

const DAY = 86_400_000;

function daysBetween(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / DAY);
}
function parse(d?: string): Date | null {
  if (!d || !/^\d{4}-\d{2}-\d{2}/.test(d)) return null;
  const dt = new Date(d.slice(0, 10) + "T12:00:00");
  return isNaN(dt.getTime()) ? null : dt;
}
function name(f?: string): string {
  return (f || "there").trim();
}

/** All candidate actions for a contact today, highest priority first. */
function candidates(lease: LeaseData, today: Date): LifecycleAction[] {
  const out: LifecycleAction[] = [];
  const first = name(lease.firstName);
  const end = parse(lease.leaseEndDate);
  const start = parse(lease.leaseStartDate);

  if (end) {
    const dte = daysBetween(end, today); // days until lease end
    if (dte > 0 && dte <= 30) {
      out.push({ key: "close_30", stage: "Lease-end < 30 days — logistics close", channel: "sms",
        message: `Hi ${first}, it's Ava at Karcin. We're inside 30 days on your lease — let's get your next one lined up before turn-in so you're never without a car. Want me to have the team finalize options?` });
    } else if (dte > 30 && dte <= 60) {
      out.push({ key: "personal_60", stage: "Lease-end 60 days — Mike's personal call", channel: "human",
        message: `Pull-ahead window: ${first}'s lease ends in ~${dte} days. Personal call due (human, named, warm).`, tag: "Needs Human: Pull-Ahead Call" });
    } else if (dte > 60 && dte <= 90) {
      out.push({ key: "return_prep_90", stage: "Lease-end 90 days — return prep + pull-ahead", channel: "sms",
        message: `Hi ${first}, Ava at Karcin — you're about 90 days from lease-end. A little prep now (tires, wheels, small dings) can save you at turn-in. Want me to walk you through it and line up your next vehicle?` });
    } else if (dte > 90 && dte <= 120) {
      out.push({ key: "pull_ahead_120", stage: "Lease-end 120 days — plant the flag", channel: "sms",
        message: `Hi ${first}, it's Ava at Karcin. Your lease is getting close to the end and you've got a few good options coming up. Want me to put together what's next so you're never without a car? No rush at all.` });
    }
  }

  // Mileage over-pace (needs allowance + current + start)
  if (lease.annualMileage && lease.currentMileage && start) {
    const monthsIn = Math.max(1, daysBetween(today, start) / 30.4);
    const expected = (lease.annualMileage / 12) * monthsIn;
    if (lease.currentMileage > expected * 1.15) {
      out.push({ key: "mileage_overpace", stage: "Mileage over-pace — early pull-ahead", channel: "sms",
        message: `Hi ${first}, Ava at Karcin — looks like you may be pacing over your mileage allowance. If you'd like, we can look at getting you into something new early so you don't hit overage. Want me to check your options?` });
    }
  }

  // First-payment + mid-lease check-ins (need start)
  if (start) {
    const dsi = daysBetween(today, start); // days since lease start
    if (dsi >= 28 && dsi <= 45) {
      out.push({ key: "first_payment_30", stage: "First-payment check-in", channel: "sms",
        message: `Hi ${first}, Ava at Karcin checking in — did your first payment go through okay? Anything you need on the new vehicle?` });
    }
    if (dsi >= 360 && dsi <= 400) {
      out.push({ key: "mid_lease_365", stage: "Mid-lease check-in", channel: "sms",
        message: `Hi ${first}, Ava at Karcin — just checking in a year in. How's the vehicle treating you? Anything we can help with?` });
    }
  }

  return out;
}

/** The single highest-priority action that's due and not already sent (or null). */
export function nextLifecycleAction(lease: LeaseData, today: Date = new Date()): LifecycleAction | null {
  const sent = lease.alreadySent ?? new Set<string>();
  for (const a of candidates(lease, today)) {
    if (!sent.has(a.key)) return a;
  }
  return null;
}

/** GHL custom fields the engine reads — create these in the location. */
export const LIFECYCLE_FIELDS = [
  { name: "Lease End Date", dataType: "DATE", fieldKey: "lease_end_date" },
  { name: "Lease Start Date", dataType: "DATE", fieldKey: "lease_start_date" },
  { name: "Annual Mileage Allowance", dataType: "NUMERICAL", fieldKey: "annual_mileage_allowance" },
  { name: "Current Mileage", dataType: "NUMERICAL", fieldKey: "current_mileage" },
];
