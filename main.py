import os

import psycopg
from psycopg.rows import dict_row
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from src.recommender import recommend_products

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

app = FastAPI(
    title="Banking Product Recommendation API",
    description="API for personalized banking product recommendations",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database connection
def get_connection():
    if not DATABASE_URL:
        raise HTTPException(
            status_code=500,
            detail="DATABASE_URL is not configured"
        )

    try:
        return psycopg.connect(
            DATABASE_URL,
            row_factory=dict_row
        )
    except psycopg.Error:
        raise HTTPException(
            status_code=500,
            detail="Could not connect to the database"
        )


@app.get("/")
def home():
    return {
        "message": "Banking Product Recommendation API is running!"
    }


# Get customers
@app.get("/customers")
def get_customers(
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0)
):
    with get_connection() as conn:
        customers = conn.execute(
            """
            SELECT customer_id, age, segment, income_band
            FROM public.customers
            ORDER BY customer_id
            LIMIT %s OFFSET %s
            """,
            (limit, offset)
        ).fetchall()

    return {
        "count": len(customers),
        "customers": customers
    }


# Get products
@app.get("/products")
def get_products():
    with get_connection() as conn:
        products = conn.execute(
            """
            SELECT *
            FROM public.products
            ORDER BY product_id
            """
        ).fetchall()

    return {
        "count": len(products),
        "products": products
    }



# Get personalized recommendations
@app.get("/recommendations/{customer_id}")
def get_recommendations(customer_id: str):
    try:
        recommendations = recommend_products(
            customer_id,
            top_n=5
        )

        return {
            "customer_id": customer_id,
            "recommendations": recommendations.to_dict(
                orient="records"
            )
        }

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

@app.get("/analytics/popularity")
def get_product_popularity():
    with get_connection() as conn:
        results = conn.execute(
            """
            SELECT
                p.product_id,
                p.product_name,
                p.category,
                COUNT(i.customer_id) AS interaction_count,
                ROUND(AVG(i.rating)::numeric, 2) AS average_rating
            FROM public.products p
            LEFT JOIN public.interactions i
                ON p.product_id = i.product_id
            GROUP BY
                p.product_id,
                p.product_name,
                p.category
            ORDER BY interaction_count DESC
            """
        ).fetchall()

    return {
        "count": len(results),
        "products": results
    }


@app.get("/analytics/segments")
def get_customer_segments():
    with get_connection() as conn:
        results = conn.execute(
            """
            SELECT
                segment,
                COUNT(*) AS customer_count,
                ROUND(
                    COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (),
                    2
                ) AS percentage
            FROM public.customers
            GROUP BY segment
            ORDER BY customer_count DESC
            """
        ).fetchall()

    return {
        "count": len(results),
        "segments": results
    }