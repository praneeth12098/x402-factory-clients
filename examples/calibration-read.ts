/** Free: what the calibration gate currently admits and withholds — the
 * platform publishes its own "not good enough yet" list with reasons. */
import { X402FactoryClient } from "../ts/client.js";

const c = new X402FactoryClient();
const { data } = await c.edgeCalibration() as { data: { current_model_version: string; classes: Array<{ market_class: string; n_resolved: number; allowlisted: boolean; reason: string }> } };
console.log(`model: ${data.current_model_version}`);
for (const cls of data.classes) {
  console.log(`${cls.allowlisted ? "SELLING" : "WITHHELD"} ${cls.market_class} (n=${cls.n_resolved}) — ${cls.reason}`);
}
