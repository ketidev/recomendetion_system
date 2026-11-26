import os
import numpy as np
import pandas as pd
import psycopg

from dotenv import load_dotenv
from psycopg.rows import dict_row
from sklearn.metrics.pairwise import cosine_similarity

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

FEATURES = [
    "travel",
    "savings",
    "shopping",
    "cashback",
    "salary",
    "student"
]


def load_data_from_db():

    if not DATABASE_URL:
        raise ValueError("DATABASE_URL is not configured")

    with psycopg.connect(
        DATABASE_URL,
        row_factory=dict_row
    ) as conn:

        customers = pd.DataFrame(
            conn.execute(
                """
                SELECT customer_id, age, segment, income_band
                FROM public.customers
                ORDER BY customer_id
                """
            ).fetchall()
        )

        products = pd.DataFrame(
            conn.execute(
                """
                SELECT *
                FROM public.products
                ORDER BY product_id
                """
            ).fetchall()
        )

        interactions = pd.DataFrame(
            conn.execute(
                """
                SELECT customer_id, product_id, rating
                FROM public.interactions
                """
            ).fetchall()
        )

    return customers, products, interactions


def build_recommendation_model():

    customers, products, interactions = load_data_from_db()

    if products.empty or interactions.empty:
        raise ValueError("Products or interactions data is empty")

    product_ids = products["product_id"].tolist()

    rating_matrix = (
        interactions.pivot_table(
            index="customer_id",
            columns="product_id",
            values="rating",
            fill_value=0
        )
        .reindex(
            index=customers["customer_id"],
            columns=product_ids,
            fill_value=0
        )
    )

    aligned_products = products.set_index("product_id").loc[product_ids]

    product_features = aligned_products[FEATURES].to_numpy()

    user_similarity = cosine_similarity(rating_matrix)

    np.fill_diagonal(user_similarity, 0)

    return (
        customers,
        products,
        rating_matrix,
        product_features,
        user_similarity,
        product_ids
    )


def content_based_recommendations(
    customer_id,
    rating_matrix,
    product_features
):

    user_ratings = rating_matrix.loc[customer_id].to_numpy()

    if user_ratings.sum() == 0:
        return np.zeros(len(product_features))

    profile = user_ratings @ product_features

    scores = cosine_similarity(
        profile.reshape(1, -1),
        product_features
    )[0]

    return scores


def collaborative_recommendations(
    customer_id,
    rating_matrix,
    user_similarity,
    n_neighbors=20
):

    user_index = rating_matrix.index.get_loc(customer_id)

    similarities = user_similarity[user_index]

    neighbor_indices = np.argsort(similarities)[::-1][:n_neighbors]

    neighbor_similarities = similarities[neighbor_indices]

    neighbor_ratings = rating_matrix.iloc[
        neighbor_indices
    ].to_numpy()

    weighted_scores = neighbor_similarities @ neighbor_ratings

    rated_mask = (neighbor_ratings > 0).astype(float)

    denominators = neighbor_similarities @ rated_mask

    scores = np.divide(
        weighted_scores,
        denominators,
        out=np.zeros(len(rating_matrix.columns)),
        where=denominators > 0
    )

    return scores / 5.0


def recommend_products(customer_id, top_n=5):

    (
        customers,
        products,
        rating_matrix,
        product_features,
        user_similarity,
        product_ids
    ) = build_recommendation_model()

    if customer_id not in rating_matrix.index:
        raise ValueError(f"Unknown customer: {customer_id}")

    content_scores = content_based_recommendations(
        customer_id,
        rating_matrix,
        product_features
    )

    collaborative_scores = collaborative_recommendations(
        customer_id,
        rating_matrix,
        user_similarity
    )

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
            "content_score": float(content_scores[index]),
            "collaborative_score": float(collaborative_scores[index]),
            "hybrid_score": float(hybrid_scores[index])
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

    recommendations = recommend_products("C0001", top_n=5)

    print(recommendations.to_string(index=False))
