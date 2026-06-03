# Karcin Automotive — Your Action Checklist

_Maintained by Claude. Everything **you / Mike** need to do, grouped by what it unlocks._
_Last updated: 2026-06-03._

---

## 🔴 Unlocks SMS (Ava texting) — A2P 10DLC
- [ ] GHL → **Business Profile**: set **Legal Business Name = `Karcin Automotive, LLC`** + **EIN `26-3764330`** → Save
- [ ] Confirm business email is **info@karcinauto.com** (you typed "karci**auto**.com" — needs the "n")
- [ ] GHL → **Phone System → Register for A2P** → **Standard / EIN** path
- [ ] Paste the campaign content (use case: Customer Care; 3 sample messages; opt-in description) — provided in chat
- _Text number is **973-218-4871** (GHL). Voice stays on **973-218-4898** (Retell)._
- _When approved → tell me and I flip on Ava's SMS auto-replies + test live._

## 🟠 Unlocks the website Chat widget
- [ ] GHL → **Sites → Chat Widget** → create + style the widget
- [ ] Attach **Conversation AI** and paste **`voice-ai/ava-knowledge-base.md`** as the knowledge base
- [ ] Copy the **`data-widget-id`** → send it to me (I set the env var + it goes live site-wide)

## 🟡 Unlocks the lease retention / pull-ahead engine
- [ ] Create 4 GHL **custom fields** (Settings → Custom Fields): **Lease End Date** (date), **Lease Start Date** (date), **Annual Mileage Allowance** (number), **Current Mileage** (number)
  - _(Or add the custom-fields scope to the GHL token and I'll create them via script.)_
- [ ] Tag active lease customers **`Lease Customer`** in GHL so the engine works them
- [ ] When SMS is live → I set `LIFECYCLE_SEND_ENABLED=true` (it's dry-running safely until then)

## 🟢 Unlocks Ava as receptionist + executive assistant (caller-ID)
- [ ] Send me **Mike's cell number** and **your (Shane's) cell number** → so Ava recognizes you on caller ID and switches to assistant mode
- [ ] (For Ava's "answer it herself" brain) provide **`ANTHROPIC_API_KEY`** — also powers SMS replies
- [ ] (Optional) designate a GHL "ops inbox" contact for Ava's filed requests → I set `KARCIN_OPS_CONTACT_ID`

## 🔵 Voice go-live (Retell)
- [ ] Confirm **973-218-4898** is imported/attached in Retell with the inbound agent
- [ ] Set the number's **inbound webhook** to `https://www.karcinauto.com/api/retell/inbound-lookup?key=<RETELL_WEBHOOK_SECRET>` → activates caller-ID recognition
- [ ] Verify a test call still routes to Ava (voice) after any GHL/Twilio changes

## ⚖️ Before any money pages go live (legal — Marc's gate)
- [ ] **NJ Leasing Dealer / Motor Vehicle Lessor license** — map + file the NJMVC application (bond + zoned commercial location + trade-name)
- [ ] **Reg M / CLA disclosure block** drafted before any "zero down" / payment page publishes
- [ ] "Bad credit" page only with "subject to credit approval; not all qualify" language
- [ ] NY/CT customer intake only after those states' registrations
- _Until then: educational pages only (already shipped that way). Build aggressive, publish disciplined._

## 🤝 Mike's relationship / sourcing homework (60–90 days)
- [ ] Build **8–12 dealer-desk relationships** (lease/internet managers) across BMW/MB/Audi + Honda/Toyota
- [ ] Price + pick **one residual/money-factor subscription** (ALG / J.D. Power; RouteOne/Dealertrack once tied to stores)
- [ ] Confirm **one subprime-lease lender** for the "Challenged" credit lane
- [ ] Source local **recon / wheel-repair / detail / turn-in inspection** vendors (Passaic County) for the Lease-End Protection Pass

## 🔐 Security housekeeping (optional but smart)
- [ ] Rotate the **Retell API key** and **GHL token** (both were shared in chat) — I'll swap new values into env

---

### ✅ Already done (for reference)
Voice AI Ava (inbound + outbound) · two-way SMS AI + in-app inbox · GHL CRM unified lead capture + credit prequal + transcript webhook · 31-page SEO content engine (schema + GPTBot) · quick-quote landing page · lease lifecycle engine (dry-run) · Call/Text 24/7 buttons · Ava knowledge base · auto-board strategy + CTO architecture on file.
