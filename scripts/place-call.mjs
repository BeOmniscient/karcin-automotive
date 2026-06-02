#!/usr/bin/env node
/**
 * Place a single OUTBOUND Ava call from the command line (for testing / one-offs).
 *
 * Calls Retell's create-phone-call directly with dynamic variables. ONLY call numbers you
 * have consent to call — this dials a real phone.
 *
 * Usage:
 *   RETELL_API_KEY=key_xxx RETELL_FROM_NUMBER=+1XXXXXXXXXX RETELL_OUTBOUND_AGENT_ID=agent_xxx \
 *     node scripts/place-call.mjs --to +12015550144 --first-name Daniel \
 *     --campaign web_inquiry --reason "You recently asked about a BMW X5 lease." --vehicle "BMW X5"
 */
const API = "https://api.retellai.com/v2/create-phone-call";

function arg(name, fallback = "") {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const apiKey = process.env.RETELL_API_KEY;
const fromNumber = process.env.RETELL_FROM_NUMBER;
const agentId = process.env.RETELL_OUTBOUND_AGENT_ID;
const to = arg("to");

if (!apiKey || !fromNumber || !agentId) {
  console.error("Set RETELL_API_KEY, RETELL_FROM_NUMBER, and RETELL_OUTBOUND_AGENT_ID.");
  process.exit(1);
}
if (!/^\+\d{10,15}$/.test(to)) {
  console.error("Pass --to in E.164 format, e.g. --to +12015550144");
  process.exit(1);
}

const body = {
  from_number: fromNumber,
  to_number: to,
  override_agent_id: agentId,
  retell_llm_dynamic_variables: {
    first_name: arg("first-name", "there"),
    last_name: arg("last-name", ""),
    campaign: arg("campaign", "general"),
    call_reason: arg("reason", "I wanted to follow up on your interest in a vehicle with Karcin."),
    vehicle_interest: arg("vehicle", "")
  }
};

const res = await fetch(API, {
  method: "POST",
  headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
  body: JSON.stringify(body)
});
const data = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error(`Retell error ${res.status}:`, JSON.stringify(data, null, 2));
  process.exit(1);
}
console.log("✅ Call placed.");
console.log("  call_id:    ", data.call_id);
console.log("  call_status:", data.call_status);
