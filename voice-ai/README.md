# Karcin Voice AI — "Ava" (Inbound + Outbound)

Two agents, same warm soft-sell persona and the same Retell pattern as DeNovo's "Margaux":
- **Inbound** — answers calls to 973-218-4898. Collects name + phone, captures the lead.
- **Outbound** — proactively calls web inquiries, past customers, and reminders.

This file documents inbound; outbound is in the **[Outbound](#outbound-ava)** section below.

## Inbound Ava

Single-prompt agent: warm, soft-sell, never pushy. Her one non-negotiable job is to collect **first name, last name, and phone** on every call and hand a clean lead to the team.

## Files
| File | What it is |
|---|---|
| `retell-agent.json` | The canonical agent spec — prompt, voice, begin message, and tools (`capture_lead`, `transfer_to_human`, `end_call`). Single source of truth. |
| `../scripts/provision-retell.mjs` | Creates or updates the agent on Retell via the API. |
| `../src/pages/api/retell/capture-lead.ts` | The `capture_lead` webhook — maps Ava's fields onto the website's `VehicleRequestPayload` and pushes to GoHighLevel. Voice leads and web leads land in the same place. |

## How leads flow
Ava collects details → calls `capture_lead` → `POST /api/retell/capture-lead` → `submitVehicleRequest()` → GoHighLevel. (Set `NEXT_PUBLIC_GHL_FORM_WEBHOOK_URL`; with no webhook in dev it no-ops successfully so you can test the call flow.)

## Provision

**Create** (first time):
```bash
RETELL_API_KEY=key_xxx BASE_URL=https://karcinauto.com node scripts/provision-retell.mjs
```
Save the printed `agent_id` and `llm_id` into `.env` as `RETELL_AGENT_ID` / `RETELL_LLM_ID`.

**Update** (refresh prompt/functions without re-creating the agent or losing the phone number):
```bash
RETELL_API_KEY=key_xxx RETELL_LLM_ID=llm_xxx BASE_URL=https://karcinauto.com node scripts/provision-retell.mjs
```

`BASE_URL` must be the public https deployment that hosts `/api/retell/capture-lead` (the script injects it into the function URL).

## Before going live
- [ ] Replace the placeholder transfer number in `retell-agent.json` (`transfer_to_human`) with the real Karcin line.
- [ ] Set `NEXT_PUBLIC_GHL_FORM_WEBHOOK_URL` so leads reach GoHighLevel.
- [ ] Audition the voice (default `11labs-Cimo`) and add pronunciation **Karcin → "KAR-sin"**.
- [ ] Provision against a **TEST** Retell number first; run the test scripts below.
- [ ] Only then attach Karcin's real inbound number.

## Test scripts (run on a test number)
1. **Perfect lead** — "I want to lease an SUV." → Ava qualifies, gets first + last name and phone, calls `capture_lead`, confirms next step.
2. **Exact vehicle** — "I want a Mercedes GLE 350, white on beige." → captures make/model/color, name, phone.
3. **Budget-only** — "I just need the cheapest lease." → captures payment range + openness, name, phone.
4. **Refuses phone, then relents** — declines number → Ava explains value once → caller gives a text number → captured.
5. **Competing quote** — "I have a dealer quote on a Lexus RX, can you beat it?" → captures quote basics, name, phone, offers human review.
6. **Trade-in** — caller has a car to trade → captures current vehicle, flags trade-in, hands off.
7. **EV** — "Do you lease electric?" → asks home-charging, captures interest + contact.
8. **In a hurry** — "I'm rushing, call me about an Escalade." → fast name + phone, marks urgent.
9. **Angry / wants a human** — Ava de-escalates and calls `transfer_to_human`.
10. **Wrong number** — Ava is gracious, doesn't push, ends the call.

For each: confirm name + phone were collected, `capture_lead` fired (lead appears in GHL), and the post-call summary is usable.

## Compliance (baked into the prompt — keep it)
No exact pricing, no inventory claims, no approval guarantees, no legal/credit advice. The begin message discloses the call may be recorded.

---

## Outbound Ava

Proactive calls — Ava dials the customer. Same persona, different conversation: she confirms she reached the right person, identifies herself + Karcin, discloses recording, asks if it's a good time, and **honors opt-outs above everything**. One agent handles every campaign via dynamic variables.

### Files
| File | What it is |
|---|---|
| `retell-agent-outbound.json` | Outbound agent spec. Tools: `save_call_outcome`, `transfer_to_human`, `end_call`. Personalized with `{{first_name}}`, `{{campaign}}`, `{{call_reason}}`, `{{vehicle_interest}}`. |
| `../scripts/provision-retell-outbound.mjs` | Create/update the outbound agent. |
| `../scripts/place-call.mjs` | CLI to place one test call. |
| `../src/pages/api/retell/place-call.ts` | Trigger calls programmatically (website/CRM/cron). Secret-protected. |
| `../src/pages/api/retell/call-outcome.ts` | `save_call_outcome` webhook → GoHighLevel (every disposition, incl. do-not-call). |

### Campaigns (the `campaign` variable)
`web_inquiry` (someone filled the form) · `past_customer` (lease-end re-engagement) · `reminder` (appointment / lease-end / documents) · `general` (warm check-in).

### Provision
```bash
# create:
RETELL_API_KEY=key_xxx BASE_URL=https://www.karcinauto.com node scripts/provision-retell-outbound.mjs
# update in place:
RETELL_API_KEY=key_xxx RETELL_OUTBOUND_LLM_ID=llm_xxx BASE_URL=https://www.karcinauto.com node scripts/provision-retell-outbound.mjs
```
Save the printed IDs as `RETELL_OUTBOUND_AGENT_ID` / `RETELL_OUTBOUND_LLM_ID`.

### Place a call

CLI (testing):
```bash
RETELL_API_KEY=key_xxx RETELL_FROM_NUMBER=+1XXXXXXXXXX RETELL_OUTBOUND_AGENT_ID=agent_xxx \
  node scripts/place-call.mjs --to +12015550144 --first-name Daniel \
  --campaign web_inquiry --reason "You recently asked about a BMW X5 lease." --vehicle "BMW X5"
```

API (website / GHL / cron) — POST with the shared secret:
```bash
curl -X POST https://www.karcinauto.com/api/retell/place-call \
  -H "Content-Type: application/json" -H "x-karcin-secret: $OUTBOUND_TRIGGER_SECRET" \
  -d '{"to":"+12015550144","first_name":"Daniel","campaign":"web_inquiry",
       "call_reason":"You recently asked about a BMW X5 lease.","vehicle_interest":"BMW X5"}'
```
A natural trigger: when the website vehicle-request form submits, also POST here to call the lead back within seconds.

### Needed before placing real calls
- [ ] `RETELL_FROM_NUMBER` — an outbound caller-ID number registered in Retell.
- [ ] `RETELL_OUTBOUND_AGENT_ID` — from provisioning.
- [ ] `OUTBOUND_TRIGGER_SECRET` — set in Vercel + sent by whatever calls `/api/retell/place-call`.
- [ ] `NEXT_PUBLIC_GHL_FORM_WEBHOOK_URL` — so outcomes reach GoHighLevel.

### Compliance (your responsibility)
Outbound calling is regulated. Only call people who've consented (web inquiries, existing customers) and respect calling-hours and do-not-call rules. Ava identifies herself immediately, discloses recording, and instantly honors "stop calling / remove me" by flagging `do_not_call` — but suppression of future calls and consent/timing policy live in your dispatch logic and CRM, not in the agent.
