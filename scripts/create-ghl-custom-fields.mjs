#!/usr/bin/env node
/**
 * Create the lease-lifecycle custom fields in GoHighLevel (idempotent-ish — skips by name).
 *
 * Usage:
 *   GHL_API_KEY=pit-xxx GHL_LOCATION_ID=xxx node scripts/create-ghl-custom-fields.mjs
 *
 * Fields: Lease End Date (DATE), Lease Start Date (DATE), Annual Mileage Allowance (NUMERICAL),
 * Current Mileage (NUMERICAL). Read by /api/lifecycle/run.
 */
const GHL = "https://services.leadconnectorhq.com";
const V = "2021-07-28";
const token = process.env.GHL_API_KEY;
const locationId = process.env.GHL_LOCATION_ID;

if (!token || !locationId) {
  console.error("Set GHL_API_KEY and GHL_LOCATION_ID.");
  process.exit(1);
}

const FIELDS = [
  { name: "Lease End Date", dataType: "DATE" },
  { name: "Lease Start Date", dataType: "DATE" },
  { name: "Annual Mileage Allowance", dataType: "NUMERICAL" },
  { name: "Current Mileage", dataType: "NUMERICAL" },
];

const headers = { Authorization: `Bearer ${token}`, Version: V, "Content-Type": "application/json", Accept: "application/json" };

const main = async () => {
  // existing
  const listRes = await fetch(`${GHL}/locations/${locationId}/customFields`, { headers });
  const list = listRes.ok ? (await listRes.json()).customFields ?? [] : [];
  const existing = new Set(list.map((f) => (f.name || "").toLowerCase()));

  for (const f of FIELDS) {
    if (existing.has(f.name.toLowerCase())) {
      console.log(`= exists: ${f.name}`);
      continue;
    }
    const res = await fetch(`${GHL}/locations/${locationId}/customFields`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name: f.name, dataType: f.dataType, model: "contact" }),
    });
    const body = await res.text();
    console.log(res.ok ? `+ created: ${f.name}` : `! failed: ${f.name} (${res.status}) ${body}`);
  }
  console.log("\nDone. Fields read by /api/lifecycle/run via fieldKey (lease_end_date, etc.).");
};

main();
