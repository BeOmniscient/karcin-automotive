# Karcin Voice AI Receptionist — "Ava"

Inbound voice receptionist for Karcin Automotive, built on the same Retell pattern as the DeNovo "Margaux" hostess. Single-prompt agent: warm, soft-sell, never pushy. Her one non-negotiable job is to collect **first name, last name, and phone** on every call and hand a clean lead to the team.

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
