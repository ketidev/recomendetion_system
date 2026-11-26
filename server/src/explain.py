import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"

customers = pd.read_csv(DATA_DIR / "customers.csv")
products = pd.read_csv(DATA_DIR / "products.csv")
interactions = pd.read_csv(DATA_DIR / "interactions.csv")

FEATURES = [
    "travel", "savings", "shopping",
    "cashback", "salary", "student"
]

feature_descriptions = {
    "travel": "high travel interest",
    "savings": "interest in saving money",
    "shopping": "shopping activity",
    "cashback": "interest in cashback benefits",
    "salary": "salary-related needs",
    "student": "student-related needs"
}


def explain_recommendation(customer_id, product_id):

    customer = customers[
        customers["customer_id"] == customer_id
    ].iloc[0]

    product = products[
        products["product_id"] == product_id
    ].iloc[0]

    customer_interests = dict(
        zip(FEATURES, [
            0, 0, 0, 0, 0, 0
        ])
    )

    customer_history = interactions[
        interactions["customer_id"] == customer_id
    ]

    for feature in FEATURES:
        customer_interests[feature] = 0

    for feature in FEATURES:
        customer_interests[feature] = 0

    product_features = product[FEATURES]

    reasons = []

    for feature in FEATURES:

        if product_features[feature] >= 0.5:
            reasons.append(
                feature_descriptions[feature]
            )

    print(f"\nCustomer: {customer_id}")
    print(f"Recommended product: {product['product_name']}")
    print("Reasons:")

    for reason in reasons:
        print(f"- {reason}")


explain_recommendation("C0001", "P01")
