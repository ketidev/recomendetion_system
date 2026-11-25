
import numpy as np
import pandas as pd
from pathlib import Path

np.random.seed(42)

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

features = [
    "travel",
    "savings",
    "shopping",
    "cashback",
    "salary",
    "student"
]

products = pd.DataFrame([
    ["P01", "Travel Card",       "Card",       1.0, 0.1, 0.2, 0.5, 0.1, 0.0],
    ["P02", "Savings Account",   "Savings",    0.1, 1.0, 0.0, 0.1, 0.4, 0.2],
    ["P03", "Cashback Card",     "Card",       0.2, 0.1, 0.9, 1.0, 0.3, 0.0],
    ["P04", "Student Card",      "Card",       0.1, 0.2, 0.5, 0.3, 0.1, 1.0],
    ["P05", "Salary Account",    "Account",    0.1, 0.5, 0.1, 0.2, 1.0, 0.1],
    ["P06", "Shopping Card",     "Card",       0.1, 0.1, 1.0, 0.7, 0.2, 0.1],
    ["P07", "Premium Travel",    "Premium",    1.0, 0.3, 0.2, 0.5, 0.8, 0.0],
    ["P08", "Flexible Deposit",  "Savings",    0.0, 1.0, 0.1, 0.0, 0.5, 0.1],
], columns=[
    "product_id", "product_name", "category", *features
])

n_customers = 1000

customers = pd.DataFrame({
    "customer_id": [f"C{i:04d}" for i in range(1, n_customers + 1)],
    "age": np.random.randint(18, 66, n_customers),
    "segment": np.random.choice(
        ["Student", "Young Professional", "Professional"],
        n_customers,
        p=[0.25, 0.45, 0.30]
    ),
    "income_band": np.random.choice(
        ["Low", "Medium", "High"],
        n_customers,
        p=[0.3, 0.5, 0.2]
    )
})

preferences = np.random.dirichlet(
    alpha=[1.5, 1.5, 1.5, 1.5, 1.5, 1.5],
    size=n_customers
)

product_features = products[features].to_numpy()

affinity_matrix = preferences @ product_features.T

interactions = []

for i, customer in customers.iterrows():

    scores = affinity_matrix[i]

    probabilities = np.exp(scores * 4)
    probabilities = probabilities / probabilities.sum()

    n_interactions = np.random.randint(3, 7)

    selected_products = np.random.choice(
        len(products),
        size=n_interactions,
        replace=False,
        p=probabilities
    )

    for product_idx in selected_products:

        noise = np.random.normal(0, 0.5)

        rating = int(np.clip(
            round(1 + scores[product_idx] * 4 + noise),
            1,
            5
        ))

        interactions.append({
            "customer_id": customer["customer_id"],
            "product_id": products.iloc[product_idx]["product_id"],
            "rating": rating
        })

interactions = pd.DataFrame(interactions)

customers.to_csv(DATA_DIR / "customers.csv", index=False)
products.to_csv(DATA_DIR / "products.csv", index=False)
interactions.to_csv(DATA_DIR / "interactions.csv", index=False)

print("Datasets generated successfully!")
print(f"Customers: {len(customers)}")
print(f"Products: {len(products)}")
print(f"Interactions: {len(interactions)}")