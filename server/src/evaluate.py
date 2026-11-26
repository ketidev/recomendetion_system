
import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.metrics.pairwise import cosine_similarity

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"

customers = pd.read_csv(DATA_DIR / "customers.csv")
products = pd.read_csv(DATA_DIR / "products.csv")
interactions = pd.read_csv(DATA_DIR / "interactions.csv")

FEATURES = [
    "travel", "savings", "shopping",
    "cashback", "salary", "student"
]

test = interactions.groupby(
    "customer_id", group_keys=False
).sample(frac=0.2, random_state=42)

train = interactions.drop(test.index)

customer_ids = customers["customer_id"].tolist()
product_ids = products["product_id"].tolist()

train_matrix = (
    train.pivot_table(
        index="customer_id",
        columns="product_id",
        values="rating",
        fill_value=0
    )
    .reindex(
        index=customer_ids,
        columns=product_ids,
        fill_value=0
    )
)

ratings = train_matrix.to_numpy()

product_features = (
    products.set_index("product_id")
    .reindex(product_ids)[FEATURES]
    .to_numpy()
)

customer_profiles = ratings @ product_features

content_scores = cosine_similarity(
    customer_profiles,
    product_features
)

similarity = cosine_similarity(ratings)

np.fill_diagonal(similarity, 0)

weighted_ratings = similarity @ ratings

rated_mask = (ratings > 0).astype(float)

weight_sum = similarity @ rated_mask

collab_predictions = np.divide(
    weighted_ratings,
    weight_sum,
    out=np.zeros_like(weighted_ratings),
    where=weight_sum != 0
)

collab_scores = collab_predictions / 5

hybrid_scores = (
    0.6 * content_scores +
    0.4 * collab_scores
)

def evaluate(scores, method_name, k=5):

    precisions = []
    recalls = []
    hits = []

    for i, customer_id in enumerate(customer_ids):

        seen_products = set(
            train[
                train["customer_id"] == customer_id
            ]["product_id"]
        )

        actual_products = set(
            test[
                test["customer_id"] == customer_id
            ]["product_id"]
        )

        customer_scores = scores[i].copy()

        for j, product_id in enumerate(product_ids):
            if product_id in seen_products:
                customer_scores[j] = -np.inf

        top_indices = np.argsort(
            customer_scores
        )[::-1][:k]

        recommended = {
            product_ids[j] for j in top_indices
        }

        relevant = recommended.intersection(
            actual_products
        )

        precision = len(relevant) / len(recommended)
        recall = len(relevant) / len(actual_products)
        hit = int(len(relevant) > 0)

        precisions.append(precision)
        recalls.append(recall)
        hits.append(hit)

    return {
        "Method": method_name,
        "Precision@5": np.mean(precisions),
        "Recall@5": np.mean(recalls),
        "Hit Rate@5": np.mean(hits)
    }

results = pd.DataFrame([
    evaluate(content_scores, "Content-Based"),
    evaluate(collab_scores, "Collaborative"),
    evaluate(hybrid_scores, "Hybrid")
])

print("\nModel Evaluation Results:")
print(results.to_string(index=False))

results.to_csv(
    DATA_DIR / "evaluation_results.csv",
    index=False
)

print("\nEvaluation completed successfully!")
