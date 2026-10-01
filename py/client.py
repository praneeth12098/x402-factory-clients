"""Minimal client for x402-factory.com (free routes; bring your own
x402-capable session for paid routes — this client never touches keys).
Requires: requests.
"""
from __future__ import annotations

from typing import Any, Optional

import requests


class X402FactoryClient:
    def __init__(self, base_url: str = "https://x402-factory.com", session: Optional[requests.Session] = None):
        self.base_url = base_url.rstrip("/")
        self.session = session or requests.Session()

    def get(self, path: str, params: Optional[dict[str, Any]] = None) -> dict[str, Any]:
        r = self.session.get(self.base_url + path, params=params, timeout=30)
        if r.status_code == 402:
            raise RuntimeError(
                f"Payment required for {path} — use an x402-capable client for paid routes; "
                "the 402 body lists price and payTo."
            )
        r.raise_for_status()
        return r.json()

    # Free proof surfaces
    def verification_scores(self, **params: Any) -> dict[str, Any]:
        return self.get("/v1/verification/scores", params)

    def edge_calibration(self) -> dict[str, Any]:
        return self.get("/v1/edge/calibration")

    def venue_calibration(self, **params: Any) -> dict[str, Any]:
        return self.get("/v1/calibration/venues", params)

    def probability_delayed(self, slug: str) -> dict[str, Any]:
        return self.get(f"/v1/probability-delayed/{slug}")

    def changes(self, probe_path: str, since: Optional[str] = None) -> dict[str, Any]:
        return self.get(probe_path, {"since": since} if since else None)


if __name__ == "__main__":
    c = X402FactoryClient()
    scores = c.verification_scores()
    blend = [s for s in scores["data"]["scores"] if s["segment"] == "nws-blend"]
    print(f"verification cells: {len(scores['data']['scores'])} (blend: {len(blend)})")
