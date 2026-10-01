/**
 * Minimal typed client for x402-factory.com. Free routes work with plain
 * fetch; paid routes need a payment-wrapped fetch (e.g. @x402/fetch's
 * wrapFetchWithPayment) — this client never touches keys itself.
 */
export interface Envelope<T = unknown> {
  data: T;
  meta: {
    endpoint: string;
    version: string;
    generated_at: string;
    freshness: string;
    sources: string[];
    request_id: string;
    docs: string;
    data_mode: "live" | "fixture";
  };
}

export interface ClientOptions {
  baseUrl?: string;
  /** Pass a payment-wrapped fetch for paid routes; defaults to global fetch (free routes only). */
  fetch?: typeof fetch;
}

export class X402FactoryClient {
  private baseUrl: string;
  private f: typeof fetch;

  constructor(opts: ClientOptions = {}) {
    this.baseUrl = (opts.baseUrl ?? "https://x402-factory.com").replace(/\/$/, "");
    this.f = opts.fetch ?? fetch;
  }

  async get<T = unknown>(path: string, params?: Record<string, string | number | boolean>): Promise<Envelope<T>> {
    const url = new URL(this.baseUrl + path);
    for (const [k, v] of Object.entries(params ?? {})) url.searchParams.set(k, String(v));
    const res = await this.f(url.toString(), { headers: { accept: "application/json" } });
    if (res.status === 402) {
      throw new Error(
        `Payment required for ${path} — pass a payment-wrapped fetch (see @x402/fetch). ` +
          `The 402 body lists price and payTo.`,
      );
    }
    if (!res.ok) throw new Error(`${path} → HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return (await res.json()) as Envelope<T>;
  }

  // Free proof surfaces
  verificationScores(params?: { variable?: string; region?: string; lead_hours?: number }) {
    return this.get("/v1/verification/scores", params as Record<string, string | number>);
  }
  edgeCalibration() {
    return this.get("/v1/edge/calibration");
  }
  venueCalibration(params?: { venue?: string; category?: string }) {
    return this.get("/v1/calibration/venues", params as Record<string, string>);
  }
  /** Free 1h-delayed probability snapshot. */
  probabilityDelayed(slug: string) {
    return this.get(`/v1/probability-delayed/${encodeURIComponent(slug)}`);
  }
  /** Free change-count probe for a delta feed, e.g. "/v1/movers/changes". */
  changes(probePath: string, since?: string) {
    return this.get(probePath, since ? { since } : undefined);
  }
  /** Machine-readable catalog. */
  async openapi(): Promise<unknown> {
    const res = await this.f(`${this.baseUrl}/openapi.json`);
    return await res.json();
  }
}
