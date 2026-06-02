#!/usr/bin/env node
/**
 * Provision (or re-provision) the Karcin Automotive Voice AI receptionist "Ava" on Retell.
 *
 * Mirrors the DeNovo/Margaux build pattern. Reads voice-ai/retell-agent.json, injects your
 * deployed BASE_URL into the custom-function URLs, then creates a Retell LLM + Agent via the
 * Retell API — or, if RETELL_LLM_ID is set, patches the existing LLM in place (keeps the agent
 * and its phone-number binding).
 *
 * Create:
 *   RETELL_API_KEY=key_xxx BASE_URL=https://karcinauto.com node scripts/provision-retell.mjs
 *
 * Update (refresh prompt + functions without re-creating the agent):
 *   RETELL_API_KEY=key_xxx RETELL_LLM_ID=llm_xxx BASE_URL=https://karcinauto.com node scripts/provision-retell.mjs
 *
 * Output: the new agent_id and llm_id. Then in the Retell dashboard, attach a TEST phone number
 * first, run the test scripts in voice-ai/README.md, then go live on the real Karcin line.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const API = "https://api.retellai.com";

const RETELL_API_KEY = process.env.RETELL_API_KEY;
const BASE_URL = process.env.BASE_URL;

if (!RETELL_API_KEY) {
  console.error("Missing RETELL_API_KEY. Get it from Retell → Settings → API Keys.");
  process.exit(1);
}
if (!BASE_URL || !/^https:\/\//.test(BASE_URL)) {
  console.error("Missing/invalid BASE_URL. Must be your public https deployment, e.g. https://karcinauto.com");
  process.exit(1);
}

const spec = JSON.parse(
  readFileSync(join(__dirname, "..", "voice-ai", "retell-agent.json"), "utf8").replaceAll("{{BASE_URL}}", BASE_URL)
);

const transfer = spec.general_tools.find((t) => t.type === "transfer_call");
if (transfer && String(transfer?.transfer_destination?.number || "").includes("5555555555")) {
  console.warn("⚠️  transfer_to_human still uses a placeholder number — edit voice-ai/retell-agent.json with the real Karcin line before going live.");
}

// Post-call webhook (guaranteed end-to-end capture). Carries a secret query param.
const webhookUrl = process.env.RETELL_WEBHOOK_SECRET
  ? `${BASE_URL}/api/retell/webhook?key=${process.env.RETELL_WEBHOOK_SECRET}`
  : null;
if (!webhookUrl) console.warn("⚠️  RETELL_WEBHOOK_SECRET not set — agent will be created WITHOUT the post-call webhook.");

// Agent-level settings (not LLM) — pulled from the spec + webhook, applied on create + update.
function pickAgentSettings(s) {
  const keys = [
    "pronunciation_dictionary",
    "end_call_after_silence_ms",
    "reminder_trigger_ms",
    "reminder_max_count",
    "interruption_sensitivity",
    "responsiveness",
    "voice_speed",
    "voice_temperature",
    "post_call_analysis_data"
  ];
  const out = {};
  for (const k of keys) if (s[k] !== undefined) out[k] = s[k];
  if (webhookUrl) out.webhook_url = webhookUrl;
  return out;
}

async function call(path, body, method = "POST") {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${RETELL_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`Retell ${path} failed (${res.status}): ${text}`);
    process.exit(1);
  }
  return JSON.parse(text);
}

const main = async () => {
  const existingLlm = process.env.RETELL_LLM_ID;

  if (existingLlm) {
    // UPDATE MODE — patch the existing LLM in place (keeps the agent + phone-number binding).
    console.log(`Updating existing Retell LLM ${existingLlm}…`);
    await call(`/update-retell-llm/${existingLlm}`, {
      general_prompt: spec.general_prompt,
      begin_message: spec.begin_message,
      general_tools: spec.general_tools
    }, "PATCH");
    // Agent-level settings (pronunciation, post-call analysis, webhook) live on the agent.
    const agentSettings = pickAgentSettings(spec);
    if (process.env.RETELL_AGENT_ID && Object.keys(agentSettings).length) {
      console.log(`Updating agent ${process.env.RETELL_AGENT_ID} (settings: ${Object.keys(agentSettings).join(", ")})…`);
      await call(`/update-agent/${process.env.RETELL_AGENT_ID}`, agentSettings, "PATCH");
    }
    console.log("\n✅ Updated in place. Prompt + functions + agent settings refreshed; agent and phone number unchanged.");
    return;
  }

  console.log("Creating Retell LLM…");
  const llm = await call("/create-retell-llm", {
    general_prompt: spec.general_prompt,
    begin_message: spec.begin_message,
    general_tools: spec.general_tools
  });
  console.log("  llm_id:", llm.llm_id);

  console.log("Creating agent…");
  const agent = await call("/create-agent", {
    response_engine: { type: "retell-llm", llm_id: llm.llm_id },
    voice_id: spec.voice_id,
    language: spec.language,
    agent_name: spec.agent_name,
    ...pickAgentSettings(spec)
  });

  console.log("\n✅ Provisioned.");
  console.log("  agent_id:", agent.agent_id);
  console.log("  llm_id:  ", llm.llm_id);
  console.log("\nNext: in Retell, attach a TEST phone number to this agent, run the test scripts");
  console.log("in voice-ai/README.md, then go live on the real Karcin number.");
  console.log("Save these for later updates:  RETELL_AGENT_ID and RETELL_LLM_ID.");
};

main();
