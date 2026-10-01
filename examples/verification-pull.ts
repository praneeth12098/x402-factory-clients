/** Free: pull the live verification table and print the short-lead blend
 * cells under the current model version — the platform's own report card. */
import { X402FactoryClient } from "../ts/client.js";

const c = new X402FactoryClient();
const { data } = await c.verificationScores() as { data: { scores: Array<{ segment: string; model_version?: string; lead_hours: number; mae_ours: number; mae_nws?: number; n_samples: number }> } };
const versions = new Set(data.scores.map((s) => s.model_version));
const current = [...versions].sort().at(-1);
for (const s of data.scores) {
  if (s.segment !== "nws-blend" || s.model_version !== current || s.lead_hours > 6) continue;
  console.log(`lead ${s.lead_hours}h: ours ${s.mae_ours} vs NWS ${s.mae_nws ?? "—"} (n=${s.n_samples})`);
}
