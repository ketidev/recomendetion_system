
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
    "travel",
    "savings",
    "shopping",
    "cashback",
    "salary",
    "student"
]

product_features = products[FEATURES].to_numpy()

rating_matrix = interactions.pivot_table(
    index="customer_id",
    columns="product_id",
    values="rating",
    fill_value=0
)

product_ids = rating_matrix.columns.tolist()

aligned_products = products.set_index("product_id").loc[product_ids]
product_features = aligned_products[FEATURES].to_numpy()

def content_based_recommendations(customer_id):

    user_ratings = rating_matrix.loc[customer_id].to_numpy()

    if user_ratings.sum() == 0:
        return np.zeros(len(product_ids))

    profile = user_ratings @ product_features

    scores = cosine_similarity(
        profile.reshape(1, -1),
        product_features
    )[0]

    return scores

user_similarity = cosine_similarity(rating_matrix)

np.fill_diagonal(user_similarity, 0)


def collaborative_recommendations(customer_id, n_neighbors=20):

    user_index = rating_matrix.index.get_loc(customer_id)

    similarities = user_similarity[user_index]

    neighbor_indices = np.argsort(similarities)[::-1][:n_neighbors]

    neighbor_similarities = similarities[neighbor_indices]

    neighbor_ratings = rating_matrix.iloc[neighbor_indices].to_numpy()

    weighted_scores = neighbor_similarities @ neighbor_ratings

    rated_mask = (neighbor_ratings > 0).astype(float)

    denominators = neighbor_similarities @ rated_mask

    scores = np.divide(
        weighted_scores,
        denominators,
        out=np.zeros(len(product_ids), dtype=float),
        where=denominators > 0
    )

    return scores / 5.0

def recommend_products(customer_id, top_n=5):

    if customer_id not in rating_matrix.index:
        raise ValueError(f"Unknown customer: {customer_id}")

    content_scores = content_based_recommendations(customer_id)

    collaborative_scores = collaborative_recommendations(customer_id)

    hybrid_scores = (
        0.6 * content_scores +
        0.4 * collaborative_scores
    )

    user_ratings = rating_matrix.loc[customer_id]

    interacted_products = set(
        user_ratings[user_ratings > 0].index
    )

    recommendations = []

    for index, product_id in enumerate(product_ids):

        if product_id in interacted_products:
            continue

        recommendations.append({
            "product_id": product_id,
            "content_score": content_scores[index],
            "collaborative_score": collaborative_scores[index],
            "hybrid_score": hybrid_scores[index]
        })

    results = pd.DataFrame(recommendations)

    if results.empty:
        return results

    results = results.sort_values(
        "hybrid_score",
        ascending=False
    ).head(top_n)

    results = results.merge(
        products[["product_id", "product_name", "category"]],
        on="product_id"
    )

    return results[
        [
            "product_id",
            "product_name",
            "category",
            "content_score",
            "collaborative_score",
            "hybrid_score"
        ]
    ].reset_index(drop=True)


if __name__ == "__main__":

    customer_id = "C0001"

    print(f"\nRecommendations for {customer_id}:\n")

    recommendations = recommend_products(
        customer_id=customer_id,
        top_n=5
    )

    print(recommendations.to_string(index=False))
