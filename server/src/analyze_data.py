
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "reports" / "figures"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

customers = pd.read_csv(DATA_DIR / "customers.csv")
products = pd.read_csv(DATA_DIR / "products.csv")
interactions = pd.read_csv(DATA_DIR / "interactions.csv")

print("DATASETS LOADED SUCCESSFULLY!")

print("\n--- DATASET SHAPES ---")
print("Customers:", customers.shape)
print("Products:", products.shape)
print("Interactions:", interactions.shape)

print("\n--- CUSTOMERS INFO ---")
customers.info()

print("\n--- MISSING VALUES ---")
print("Customers:\n", customers.isnull().sum())
print("\nProducts:\n", products.isnull().sum())
print("\nInteractions:\n", interactions.isnull().sum())

print("\n--- DUPLICATES ---")
print("Customers:", customers.duplicated().sum())
print("Products:", products.duplicated().sum())
print("Interactions:", interactions.duplicated().sum())

print("\n--- CUSTOMER STATISTICS ---")
print(customers.describe())

print("\n--- INTERACTION STATISTICS ---")
print(interactions["rating"].describe())

product_popularity = (
    interactions.groupby("product_id")
    .size()
    .reset_index(name="interaction_count")
    .merge(products[["product_id", "product_name"]], on="product_id")
    .sort_values("interaction_count", ascending=False)
)

print("\n--- MOST POPULAR PRODUCTS ---")
print(product_popularity)

product_ratings = (
    interactions.groupby("product_id")["rating"]
    .mean()
    .reset_index(name="average_rating")
    .merge(products[["product_id", "product_name"]], on="product_id")
    .sort_values("average_rating", ascending=False)
)

print("\n--- PRODUCT RATINGS ---")
print(product_ratings)

print("\n--- CUSTOMER SEGMENTS ---")
print(customers["segment"].value_counts())

plt.figure(figsize=(10, 5))
sns.barplot(
    data=product_popularity,
    x="product_name",
    y="interaction_count"
)
plt.title("Product Popularity")
plt.xlabel("Banking Products")
plt.ylabel("Number of Interactions")
plt.xticks(rotation=35, ha="right")
plt.tight_layout()
plt.savefig(OUTPUT_DIR / "product_popularity.png")
plt.show()

plt.figure(figsize=(8, 5))
sns.countplot(data=interactions, x="rating")
plt.title("Customer Rating Distribution")
plt.xlabel("Rating")
plt.ylabel("Number of Interactions")
plt.tight_layout()
plt.savefig(OUTPUT_DIR / "rating_distribution.png")
plt.show()

plt.figure(figsize=(8, 5))
sns.countplot(data=customers, x="segment")
plt.title("Customer Segment Distribution")
plt.xlabel("Customer Segment")
plt.ylabel("Number of Customers")
plt.tight_layout()
plt.savefig(OUTPUT_DIR / "customer_segments.png")
plt.show()



print("\n--- CUSTOMER INCOME DISTRIBUTION ---")

income_distribution = customers["income_band"].value_counts()

print(income_distribution)

plt.figure(figsize=(8, 5))
sns.countplot(
    data=customers,
    x="income_band",
    order=["Low", "Medium", "High"]
)
plt.title("Customer Income Distribution")
plt.xlabel("Income Band")
plt.ylabel("Number of Customers")
plt.tight_layout()
plt.savefig(OUTPUT_DIR / "income_distribution.png")
plt.show()


print("\n--- FAVORITE PRODUCT BY CUSTOMER SEGMENT ---")

customer_interactions = (
    interactions
    .merge(customers[["customer_id", "segment"]], on="customer_id")
    .merge(products[["product_id", "product_name"]], on="product_id")
)

segment_preferences = (
    customer_interactions
    .groupby(["segment", "product_name"])
    .agg(
        average_rating=("rating", "mean"),
        interaction_count=("rating", "count")
    )
    .reset_index()
)

favorite_products = segment_preferences.loc[
    segment_preferences.groupby("segment")["average_rating"].idxmax()
]

print(favorite_products.round(2).to_string(index=False))

print("\nEDA COMPLETED SUCCESSFULLY!")
print(f"Charts saved to: {OUTPUT_DIR}")
