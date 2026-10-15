# x402-factory clients

Typed clients, worked examples, and an agent skill for
[x402-factory.com](https://x402-factory.com) — 200+ paid data APIs for AI
agents (prediction-market probabilities, weather intelligence, US economic
prints, SEC/EDGAR and recall feeds), sold per-call via the
[x402 protocol](https://docs.x402.org) (HTTP 402 + USDC on Base). No API
keys, no accounts: cents per call from any wallet.

## Judge it before you pay — the free proof surfaces

The platform publishes its own scorecards, free forever:

- **Forecast verification** — every forecast scored against real NWS
  station observations, segmented by lead/region/method/model-version:
  [`/v1/verification/scores`](https://x402-factory.com/v1/verification/scores).
  Under the current model the station blend beats raw NWS at short leads
  (as of 2026-10-15, 90-day window, model runway-oracle-v4.5 across 25
  stations: MAE 0.74 vs 1.13 °C at 1-hour lead, n=1,441; 0.76 vs 1.17 at
  3h; converging to NWS parity by 24h — the decay the method predicts.
  Read the live table for current numbers and n).
- **Model-vs-market calibration gate** — market classes are sold only
  when their own resolved history proves calibrated; the full reliability
  table (and what is currently *withheld*, with reasons) is public:
  [`/v1/edge/calibration`](https://x402-factory.com/v1/edge/calibration).
- **Free delayed feeds and change-probes** on the probability catalog.

## Quickstart (TypeScript)

```ts
import { X402FactoryClient } from "./ts/client.js";
// Free routes need nothing:
const free = new X402FactoryClient();
console.log(await free.verificationScores());
// Paid routes need any funded wallet via @x402/fetch:
import { wrapFetchWithPayment } from "@x402/fetch";
import { privateKeyToAccount } from "viem/accounts";
const paid = new X402FactoryClient({
  fetch: wrapFetchWithPayment(fetch, privateKeyToAccount(process.env.PK as `0x${string}`)),
});
console.log(await paid.get("/v1/econ/dashboard")); // $0.03, settles automatically
```

Python: see [`py/client.py`](py/client.py). Worked examples (free routes
only, run as-is): [`examples/`](examples/).

## MCP

Remote MCP endpoint: `POST https://x402-factory.com/mcp` (streamable HTTP,
stateless JSON). Free and delayed tools return data; paid tools return a
structured `payment_required` pointer with the HTTP route and price — the
mirror is a free funnel, not a paywall bypass. Rate limit: 30 req/min.

## Agent skill

[`skill/`](skill/) packages the catalog as a task-oriented skill:
discovery mode with no wallet (free routes only) and paid mode through
your existing x402 wallet tooling with a per-call cap. MIT-0.

## Honesty contract

Every response carries `meta.sources` and `meta.data_mode`; method labels
are end-to-end truthful (NWS passthrough is labeled as such); skill
claims appear only where measured, with n, on the free proof surfaces.
License: MIT.
