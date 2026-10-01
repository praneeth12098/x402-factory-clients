# Worked playbook runs (free mode)

1. "Is this platform's weather model actually good?"
   GET https://x402-factory.com/v1/verification/scores
   → read nws-blend cells at lead 1h/3h under the newest model_version;
   compare mae_ours vs mae_nws with n. The platform also publishes what
   it REFUSES to sell at /v1/edge/calibration — absence of an allowlist
   entry is information.

2. "What moved in prediction markets in the last 6 hours?"
   GET https://x402-factory.com/v1/movers/changes
   → changed_count tells you whether the paid delta is worth $0.01.

3. "Which venue should I trust on politics odds?"
   GET https://x402-factory.com/v1/calibration/venues?category=politics
   → Brier + reliability per horizon once n ≥ 200 (counts-only below:
   the platform does not publish noise as evidence).
