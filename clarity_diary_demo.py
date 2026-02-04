"""ClarityRx diary/history synthetic data demo.

This script generates realistic synthetic dosing history for a single user and
prints a Letterboxd-style "grid" plus some personal stats.

It does NOT hit the database; it's meant as a UX and analytics reference.
"""

from __future__ import annotations

from datetime import datetime, timedelta
import random
from typing import List

import pandas as pd

random.seed(42)


PRODUCTS = [
    {"sku": "CRX-DR-2.5", "name": "Deep Rest Micro", "effect": "sleep"},
    {"sku": "CRX-DR-5", "name": "Deep Rest", "effect": "sleep"},
    {"sku": "CRX-CL-2.5", "name": "Calm Clarity", "effect": "calm"},
    {"sku": "CRX-FC-2.5", "name": "Focus Crisp", "effect": "focus"},
]

TAGS_POOL = [
    "helped sleep",
    "fell asleep faster",
    "woke up at night",
    "felt groggy",
    "perfect dose",
    "too mild",
    "no effect",
    "great for reading",
    "eased joint pain",
]


def generate_synthetic_history(n_events: int = 30) -> pd.DataFrame:
    """Generate 30 doses over ~2 months for a single user.

    Mix of products, ratings, tags, and notes.
    """

    base_date = datetime.now() - timedelta(days=60)
    events = []

    for i in range(n_events):
        day_offset = int(i * (60 / n_events))  # spread across ~60 days
        dt = base_date + timedelta(days=day_offset, hours=random.choice([20, 21, 22]))
        product = random.choices(
            PRODUCTS,
            weights=[0.4, 0.3, 0.2, 0.1],  # favor sleep products
            k=1,
        )[0]

        # Quick rating with slightly higher ratings for sleep products
        if product["effect"] == "sleep":
            rating = random.choices([3, 4, 5], weights=[1, 3, 4])[0]
        else:
            rating = random.choices([2, 3, 4, 5], weights=[1, 3, 3, 1])[0]

        thumbs = "up" if rating >= 4 else ("down" if rating <= 2 else None)
        tags: List[str] = random.sample(TAGS_POOL, k=random.choice([1, 2]))

        if product["sku"] == "CRX-DR-5" and "felt groggy" not in tags and rating <= 4:
            tags.append("felt groggy")

        notes = None
        if rating <= 3 and "no effect" in tags:
            notes = "Felt almost nothing at this dose, might need a bit more."
        elif rating == 5 and "perfect dose" in tags:
            notes = "Great night of sleep, woke up rested without a heavy head."

        events.append(
            {
                "dosing_event_id": i + 1,
                "date": dt.date(),
                "taken_at": dt,
                "product_sku": product["sku"],
                "product_name": product["name"],
                "desired_outcome": product["effect"],
                "quick_rating": rating,
                "thumbs": thumbs,
                "tags": ", ".join(tags),
                "notes": notes,
            }
        )

    df = pd.DataFrame(events).sort_values("taken_at", ascending=False).reset_index(drop=True)
    return df


def render_history_grid(df: pd.DataFrame, limit: int = 20) -> None:
    """Print a Letterboxd-style grid: most recent first.

    Each row: [date] ⭐⭐⭐⭐ Deep Rest (sleep) — tags
    """

    print("\n=== ClarityRx Dose Diary (most recent) ===")
    for _, row in df.head(limit).iterrows():
        stars = "★" * int(row["quick_rating"]) + "☆" * (5 - int(row["quick_rating"]))
        line = f"{row['date']}  {stars}  {row['product_name']} [{row['desired_outcome']}] — {row['tags']}"
        print(line)


def render_stats(df: pd.DataFrame) -> None:
    """Print simple personal stats dashboard."""

    total_doses = len(df)
    avg_rating_by_product = df.groupby("product_name")["quick_rating"].mean().sort_values(ascending=False)

    # Favorite products: highest avg rating with at least 3 uses
    usage_counts = df["product_name"].value_counts()
    favorites = avg_rating_by_product[usage_counts[avg_rating_by_product.index] >= 3]

    # Weekend vs weekday pattern
    df["weekday"] = df["date"].apply(lambda d: d.weekday())
    df["is_weekend"] = df["weekday"].isin([5, 6])
    weekend_avg = df[df["is_weekend"]]["quick_rating"].mean()
    weekday_avg = df[~df["is_weekend"]]["quick_rating"].mean()

    print("\n=== Personal Stats ===")
    print(f"Total doses logged: {total_doses}")
    print("\nAverage rating by product:")
    print(avg_rating_by_product.round(2).to_string())

    if not favorites.empty:
        print("\nFavorite products (3+ uses):")
        print(favorites.round(2).to_string())

    print("\nWeekend vs weekday ratings:")
    print(f"Weekend avg: {weekend_avg:.2f}  |  Weekday avg: {weekday_avg:.2f}")


def main() -> None:  # pragma: no cover
    df = generate_synthetic_history()
    print("\nRaw history table (first 10 rows):")
    print(df.head(10).to_markdown(index=False))

    render_history_grid(df, limit=20)
    render_stats(df)


if __name__ == "__main__":  # pragma: no cover
    main()
