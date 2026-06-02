#!/usr/bin/env node
/**
 * Provision (or re-provision) the OUTBOUND Karcin receptionist "Ava (Outbound)" on Retell.
 *
 * Same pattern as scripts/provision-retell.mjs, but reads voice-ai/retell-agent-outbound.json
 * and tracks its own RETELL_OUTBOUND_LLM_ID for in-place updates.
 *
 * Create:
 *   RETELL_API_KEY=key_xxx BASE_URL=https://www.karcinauto.com node scripts/provision-retell-outbound.mjs
 *
 * Update (refresh prompt + functions, keep the agent):
 *   RETELL_API_KEY=key_xxx RETELL_OUTBOUND_LLM_ID=llm_xxx BASE_URL=https://www.karcinauto.com node scripts/provision-retell-outbound.mjs
 *
 * Save the printed agent_id/llm_id as RETELL_OUTBOUND_AGENT_ID / RETELL_OUTBOUND_LLM_ID.
 * The agent_id is what /api/retell/place-call uses to launch calls.
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
  console.error("Missing/invalid BASE_URL. Must be your public https deployment, e.g. https://www.karcinauto.com");
  process.exit(1);
}

const spec = JSON.parse(
  readFileSync(join(__dirname, "..", "voice-ai", "retell-agent-outbound.json"), "utf8").replaceAll("{{BASE_URL}}", BASE_URL)
);

const transfer = spec.general_tools.find((t) => t.type === "transfer_call");
if (transfer && String(transfer?.transfer_destination?.number || "").includes("5555555555")) {
  console.warn("⚠️  transfer_to_human still uses a placeholder number — edit voice-ai/retell-agent-outbound.json before going live.");
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

// Agent-level settings (not LLM) — pulled from the spec, applied on create + update.
function pickAgentSettings(s) {
  const keys = [
    "pronunciation_dictionary",
    "end_call_after_silence_ms",
    "reminder_trigger_ms",
    "reminder_max_count",
    "interruption_sensitivity",
    "responsiveness",
    "voice_speed",
    "voice_temperature"
  ];
  const out = {};
  for (const k of keys) if (s[k] !== undefined) out[k] = s[k];
  return out;
}

const main = async () => {
  const existingLlm = process.env.RETELL_OUTBOUND_LLM_ID;

  if (existingLlm) {
    console.log(`Updating existing OUTBOUND Retell LLM ${existingLlm}…`);
    await call(`/update-retell-llm/${existingLlm}`, {
      general_prompt: spec.general_prompt,
      begin_message: spec.begin_message,
      general_tools: spec.general_tools
    }, "PATCH");
    const agentSettings = pickAgentSettings(spec);
    if (process.env.RETELL_OUTBOUND_AGENT_ID && Object.keys(agentSettings).length) {
      console.log(`Updating agent ${process.env.RETELL_OUTBOUND_AGENT_ID} (settings: ${Object.keys(agentSettings).join(", ")})…`);
      await call(`/update-agent/${process.env.RETELL_OUTBOUND_AGENT_ID}`, agentSettings, "PATCH");
    }
    console.log("\n✅ Updated in place. Outbound prompt + functions + agent settings refreshed.");
    return;
  }

  console.log("Creating OUTBOUND Retell LLM…");
  const llm = await call("/create-retell-llm", {
    general_prompt: spec.general_prompt,
    begin_message: spec.begin_message,
    general_tools: spec.general_tools
  });
  console.log("  llm_id:", llm.llm_id);

  console.log("Creating OUTBOUND agent…");
  const agent = await call("/create-agent", {
    response_engine: { type: "retell-llm", llm_id: llm.llm_id },
    voice_id: spec.voice_id,
    language: spec.language,
    agent_name: spec.agent_name,
    ...pickAgentSettings(spec)
  });

  console.log("\n✅ Provisioned OUTBOUND Ava.");
  console.log("  agent_id:", agent.agent_id);
  console.log("  llm_id:  ", llm.llm_id);
  console.log("\nSave these:  RETELL_OUTBOUND_AGENT_ID and RETELL_OUTBOUND_LLM_ID");
  console.log("To place calls you also need a Retell-registered RETELL_FROM_NUMBER (outbound caller ID).");
};

main();
