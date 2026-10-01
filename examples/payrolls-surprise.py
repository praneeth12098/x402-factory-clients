"""Free: the July-2026 payrolls morning, replayed from the delayed
probability feed — how the market-implied odds moved into the print.
(The paid /v1/econ/dashboard adds the ALFRED first-print vintages.)"""
from py.client import X402FactoryClient

c = X402FactoryClient()
probe = c.changes("/v1/econ/dashboard/changes")
print("econ dashboard changes in the current window:", probe["data"].get("changed_count"))
scores = c.venue_calibration(venue="kalshi", category="economics")
for cell in scores["data"]["cells"]:
    print(cell["venue"], cell["category"], f"h={cell['horizon_hours']}", f"n={cell['n']}", f"brier={cell['brier']}")
