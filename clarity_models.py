"""ClarityRx financial models and data frameworks.

This module provides:
- Subscription growth and revenue model (5-year monthly, multiple scenarios)
- Unit economics, LTV, payback period, sensitivity analysis
- Market sizing and penetration analysis
- Cohort retention and LTV curves
- Simple app data model example and personalization logic for sleep dosing

Usage: run as a script to see example tables and charts, or import specific
functions into a notebook.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from dataclasses import dataclass

plt.style.use("seaborn-v0_8")


# ---------------------------------------------------------------------------
# Global assumptions
# ---------------------------------------------------------------------------

N_MONTHS = 60
MONTHS = np.arange(1, N_MONTHS + 1)


@dataclass
class Scenario:
    name: str
    price: float
    gross_margin: float
    new_subs_start: float
    new_subs_end: float
    retention_scale: float
    cac: float


SCENARIOS = {
    "conservative": Scenario(
        name="conservative",
        price=60.0,
        gross_margin=0.60,
        new_subs_start=50,
        new_subs_end=500,
        retention_scale=0.9,
        cac=200.0,
    ),
    "base": Scenario(
        name="base",
        price=70.0,
        gross_margin=0.65,
        new_subs_start=100,
        new_subs_end=1500,
        retention_scale=1.0,
        cac=150.0,
    ),
    "aggressive": Scenario(
        name="aggressive",
        price=80.0,
        gross_margin=0.70,
        new_subs_start=200,
        new_subs_end=4000,
        retention_scale=1.1,
        cac=100.0,
    ),
}

DISCOUNT_RATE_ANNUAL = 0.10
DISCOUNT_RATE_MONTHLY = (1 + DISCOUNT_RATE_ANNUAL) ** (1 / 12) - 1
FIXED_OVERHEAD = 50_000.0


# ---------------------------------------------------------------------------
# Retention curves and acquisition profiles
# ---------------------------------------------------------------------------


def build_base_retention_curve(max_months: int = N_MONTHS) -> np.ndarray:
    """Baseline retention curve for a cohort over time.

    Waypoints (approximate):
    - Month 1: 0.75
    - Month 3: 0.60
    - Month 6: 0.50
    - Month 12: 0.40
    Then linearly decays to 0.20 by month 60.
    Index 0 corresponds to signup month (retention=1.0).
    """

    points = np.array(
        [
            [0, 1.00],
            [1, 0.75],
            [3, 0.60],
            [6, 0.50],
            [12, 0.40],
            [60, 0.20],
        ],
        dtype=float,
    )

    x = points[:, 0]
    y = points[:, 1]
    months = np.arange(0, max_months)
    base_ret = np.interp(months, x, y)
    return np.clip(base_ret, 0.0, 1.0)


BASE_RETENTION = build_base_retention_curve(N_MONTHS)


def get_scenario_retention_curve(scale: float) -> np.ndarray:
    ret = BASE_RETENTION * scale
    return np.clip(ret, 0.0, 1.0)


def build_new_subs_profile(start: float, end: float) -> np.ndarray:
    """Simple non-hockey-stick acquisition: linear ramp over horizon."""

    return np.linspace(start, end, N_MONTHS)


# ---------------------------------------------------------------------------
# Subscription growth and revenue model
# ---------------------------------------------------------------------------


def simulate_subscriptions():
    """Cohort-based monthly model for all scenarios.

    Returns
    -------
    results : dict[str, pd.DataFrame]
        Per-scenario monthly metrics.
    cohort_tensors : dict[str, np.ndarray]
        active[month, cohort_month] matrices per scenario.
    """

    results: dict[str, pd.DataFrame] = {}
    cohort_tensors: dict[str, np.ndarray] = {}

    for name, sc in SCENARIOS.items():
        retention = get_scenario_retention_curve(sc.retention_scale)
        new_subs = build_new_subs_profile(sc.new_subs_start, sc.new_subs_end)

        active = np.zeros((N_MONTHS, N_MONTHS))
        for c in range(N_MONTHS):
            size = new_subs[c]
            months_since = np.arange(0, N_MONTHS - c)
            cohort_ret = retention[months_since]
            active[c:, c] = size * cohort_ret

        active_subs = active.sum(axis=1)
        mrr = active_subs * sc.price
        revenue = mrr
        cumulative_revenue = revenue.cumsum()
        cumulative_subscribers = new_subs.cumsum()

        df = pd.DataFrame(
            {
                "month": MONTHS,
                "new_subscribers": new_subs,
                "active_subscribers": active_subs,
                "MRR": mrr,
                "total_revenue": revenue,
                "cumulative_revenue": cumulative_revenue,
                "cumulative_subscribers": cumulative_subscribers,
            }
        )
        results[name] = df
        cohort_tensors[name] = active

    return results, cohort_tensors


# ---------------------------------------------------------------------------
# Unit economics, LTV, payback, sensitivity
# ---------------------------------------------------------------------------


def compute_per_subscriber_ltv(price: float, gross_margin: float, retention_curve: np.ndarray) -> float:
    """Discounted LTV over N_MONTHS for a single acquired subscriber."""

    margin_per_month = price * gross_margin
    months = np.arange(len(retention_curve))
    discounts = 1 / ((1 + DISCOUNT_RATE_MONTHLY) ** months)
    cashflows = margin_per_month * retention_curve * discounts
    return float(cashflows.sum())


def compute_payback_period(price: float, gross_margin: float, retention_curve: np.ndarray, cac: float) -> int | None:
    """Earliest month where cumulative margin >= CAC, or None if not reached."""

    margin_per_month = price * gross_margin
    cashflows = margin_per_month * retention_curve
    cum = cashflows.cumsum()
    idx = np.where(cum >= cac)[0]
    if len(idx) == 0:
        return None
    return int(idx[0] + 1)


def unit_economics_summary() -> pd.DataFrame:
    rows = []
    for name, sc in SCENARIOS.items():
        retention = get_scenario_retention_curve(sc.retention_scale)
        ltv = compute_per_subscriber_ltv(sc.price, sc.gross_margin, retention)
        payback = compute_payback_period(sc.price, sc.gross_margin, retention, sc.cac)
        ltv_cac = ltv / sc.cac
        margin_per_sub = sc.price * sc.gross_margin
        subs_to_break_even = FIXED_OVERHEAD / margin_per_sub

        rows.append(
            {
                "scenario": name,
                "price": sc.price,
                "gross_margin": sc.gross_margin,
                "CAC": sc.cac,
                "LTV": ltv,
                "LTV_to_CAC": ltv_cac,
                "payback_month": payback,
                "subs_to_break_even": subs_to_break_even,
            }
        )

    return pd.DataFrame(rows)


def ltv_sensitivity(price: float, gm: float, base_retention: np.ndarray, cac: float) -> pd.DataFrame:
    """LTV/CAC sensitivity to CAC +50% and retention -5% (approx)."""

    cac_multipliers = [1.0, 1.5]
    retention_scales = [1.0, 0.95]
    data = []

    for cm in cac_multipliers:
        for rs in retention_scales:
            ret = np.clip(base_retention * rs, 0, 1)
            ltv = compute_per_subscriber_ltv(price, gm, ret)
            cac_adj = cac * cm
            data.append(
                {
                    "CAC_mult": cm,
                    "retention_scale": rs,
                    "LTV_CAC": ltv / cac_adj,
                }
            )

    df = pd.DataFrame(data)
    return df.pivot(index="retention_scale", columns="CAC_mult", values="LTV_CAC")


# ---------------------------------------------------------------------------
# Market sizing & penetration
# ---------------------------------------------------------------------------

CA_50_75_POP = 4_000_000  # assumption; replace with actual demographic data
TAM_INTERESTED_FRAC = 0.30
SAM_PILL_FRAC = 0.50


def market_funnel(price: float) -> tuple[pd.DataFrame, float, float]:
    tam = CA_50_75_POP * TAM_INTERESTED_FRAC
    sam = tam * SAM_PILL_FRAC

    capture_rates = [0.005, 0.01]  # 0.5%, 1%
    rows = []
    for cr in capture_rates:
        target_users = CA_50_75_POP * cr
        annual_revenue = target_users * price * 12
        rows.append(
            {
                "capture_rate_of_50_75": cr,
                "subscribers_year5": target_users,
                "annual_revenue_year5": annual_revenue,
            }
        )

    return pd.DataFrame(rows), tam, sam


# ---------------------------------------------------------------------------
# Cohort retention & LTV (synthetic)
# ---------------------------------------------------------------------------


def simulate_cohorts(num_cohorts: int = 12, cohort_size: int = 100) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Generate synthetic cohort retention and 12m LTV curves."""

    base_scenario = SCENARIOS["base"]
    base_ret = get_scenario_retention_curve(base_scenario.retention_scale)

    records = []
    ltv_records = []

    for c in range(num_cohorts):
        noise = np.random.normal(loc=1.0, scale=0.03, size=N_MONTHS)
        ret_curve = np.clip(base_ret * noise, 0, 1)

        for age in range(12):
            records.append(
                {
                    "cohort_month": c + 1,
                    "age_month": age + 1,
                    "retention": ret_curve[age],
                }
            )

        ltv_12 = compute_per_subscriber_ltv(
            base_scenario.price, base_scenario.gross_margin, ret_curve[:12]
        )
        ltv_records.append({"cohort_month": c + 1, "LTV_12m": ltv_12})

    return pd.DataFrame(records), pd.DataFrame(ltv_records)


# ---------------------------------------------------------------------------
# Simple personalization example: sleep dosage recommendation
# ---------------------------------------------------------------------------

from datetime import timedelta


def build_sleep_example_data():
    """Create small synthetic tables for one user and sleep dosing."""

    users = pd.DataFrame(
        {
            "user_id": [1],
            "age": [68],
            "gender": ["F"],
            "state": ["CA"],
            "created_at": [pd.Timestamp("2026-01-01")],
            "primary_goal": ["sleep"],
            "experience_level": ["naive"],
        }
    )

    dose_base_time = pd.Timestamp("2026-01-10 22:00")
    dosing_events = []
    for i in range(5):
        dosing_events.append(
            {
                "dose_id": i + 1,
                "user_id": 1,
                "product_type": "sleep_capsule",
                "dose_mg_thc": 2.5,
                "capsules_taken": 1,
                "timestamp": dose_base_time + timedelta(days=i),
            }
        )
    dosing_events = pd.DataFrame(dosing_events)

    sleep_scores = [5, 6, 4, 5, 5]
    symptom_logs = []
    for i, score in enumerate(sleep_scores):
        symptom_logs.append(
            {
                "log_id": i + 1,
                "user_id": 1,
                "related_dose_id": i + 1,
                "symptom_type": "sleep_quality",
                "value": score,
                "timestamp": dose_base_time + timedelta(days=i + 1, hours=8),
            }
        )
    symptom_logs = pd.DataFrame(symptom_logs)

    return users, dosing_events, symptom_logs


def recommend_sleep_dose(
    user_id: int,
    product_type: str,
    dosing_events: pd.DataFrame,
    symptom_logs: pd.DataFrame,
    window_days: int = 7,
    n_doses: int = 5,
    min_data_points: int = 3,
    low_thresh: float = 6.0,
    high_thresh: float = 8.0,
    max_dose_mg: float = 10.0,
) -> dict:
    """Rule-based recommendation for sleep capsule dosing."""

    if dosing_events.empty:
        return {"status": "no_data", "reason": "No dosing events."}

    now = dosing_events["timestamp"].max()
    window_start = now - timedelta(days=window_days)

    user_doses = dosing_events[
        (dosing_events["user_id"] == user_id)
        & (dosing_events["product_type"] == product_type)
        & (dosing_events["timestamp"] >= window_start)
    ].sort_values("timestamp").tail(n_doses)

    if user_doses.empty:
        return {"status": "no_data", "reason": "No recent doses in window."}

    dose_ids = user_doses["dose_id"].tolist()
    logs = symptom_logs[
        (symptom_logs["user_id"] == user_id)
        & (symptom_logs["related_dose_id"].isin(dose_ids))
        & (symptom_logs["symptom_type"] == "sleep_quality")
    ]

    if len(logs) < min_data_points:
        return {
            "status": "insufficient_data",
            "reason": f"Only {len(logs)} logs, need {min_data_points}.",
        }

    avg_sleep = float(logs["value"].mean())
    current_dose = float(user_doses["dose_mg_thc"].iloc[-1])

    if avg_sleep < low_thresh:
        new_dose = min(current_dose + 1.0, max_dose_mg)
        action = "increase_dose"
    elif avg_sleep > high_thresh:
        new_dose = current_dose
        action = "maintain_dose"
    else:
        new_dose = current_dose
        action = "maintain_dose"

    return {
        "status": "ok",
        "avg_sleep_quality": avg_sleep,
        "current_dose_mg": current_dose,
        "recommended_dose_mg": new_dose,
        "action": action,
    }


# ---------------------------------------------------------------------------
# Demo / quick visualization entrypoint
# ---------------------------------------------------------------------------


def main():  # pragma: no cover - convenience demo
    # 1) Subscription model & revenue trajectories
    results, _ = simulate_subscriptions()
    print("\nBase scenario (first 12 months):")
    print(results["base"].head(12).to_markdown(index=False))

    plt.figure(figsize=(10, 6))
    for name, df in results.items():
        plt.plot(df["month"], df["total_revenue"], label=name.capitalize())
    plt.xlabel("Month")
    plt.ylabel("Monthly Revenue (USD)")
    plt.title("ClarityRx: Monthly Revenue Trajectory by Scenario")
    plt.legend()
    plt.tight_layout()
    plt.show()

    # 2) Unit economics dashboard
    print("\nUnit economics summary:")
    ue_df = unit_economics_summary()
    print(ue_df.to_markdown(index=False))

    base_sc = SCENARIOS["base"]
    base_ret = get_scenario_retention_curve(base_sc.retention_scale)
    sens = ltv_sensitivity(base_sc.price, base_sc.gross_margin, base_ret, base_sc.cac)
    print("\nBase scenario LTV/CAC sensitivity:")
    print(sens)

    plt.figure(figsize=(6, 4))
    plt.imshow(sens.values, cmap="RdYlGn", aspect="auto", origin="lower")
    plt.xticks(range(len(sens.columns)), sens.columns, title="CAC multiplier")
    plt.yticks(range(len(sens.index)), sens.index, title="Retention scale")
    plt.colorbar(label="LTV / CAC")
    plt.title("Base Scenario LTV/CAC Sensitivity")
    plt.tight_layout()
    plt.show()

    # 3) Market sizing
    mp_df, tam, sam = market_funnel(price=base_sc.price)
    print(f"\nMarket funnel: TAM={tam:,.0f}, SAM={sam:,.0f}")
    print(mp_df.to_markdown(index=False))

    levels = ["50-75 population", "TAM (interested)", "SAM (pill form)"]
    values = [CA_50_75_POP, tam, sam]

    plt.figure(figsize=(6, 4))
    plt.barh(levels, values, color=["#999", "#66c2a5", "#1b9e77"])
    plt.xlabel("People")
    plt.title("ClarityRx Market Funnel (California, ages 50–75)")
    plt.tight_layout()
    plt.show()

    # 4) Cohort retention & LTV
    retention_df, ltv_df = simulate_cohorts()
    print("\nCohort LTV (12m):")
    print(ltv_df.to_markdown(index=False))

    plt.figure(figsize=(10, 6))
    for c in sorted(retention_df["cohort_month"].unique()):
        subset = retention_df[retention_df["cohort_month"] == c]
        plt.plot(subset["age_month"], subset["retention"], alpha=0.6)
    plt.xlabel("Months since signup")
    plt.ylabel("Retention probability")
    plt.title("Synthetic Cohort Retention Curves (12 cohorts)")
    plt.tight_layout()
    plt.show()

    plt.figure(figsize=(8, 4))
    plt.bar(ltv_df["cohort_month"], ltv_df["LTV_12m"])
    plt.xlabel("Cohort Month")
    plt.ylabel("LTV over 12 months (USD)")
    plt.title("Cohort LTV (12-Month Horizon, Base Scenario)")
    plt.tight_layout()
    plt.show()

    # 5) Personalization demo
    users, dosing_events, symptom_logs = build_sleep_example_data()
    rec = recommend_sleep_dose(
        user_id=1,
        product_type="sleep_capsule",
        dosing_events=dosing_events,
        symptom_logs=symptom_logs,
    )
    print("\nSleep recommendation example:")
    print(rec)


if __name__ == "__main__":  # pragma: no cover
    main()
