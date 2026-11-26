
from fastapi import APIRouter

from app.database import get_connection

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/popularity")
def get_product_popularity():
    with get_connection() as conn:
        results = conn.execute(
            """
            SELECT
                p.product_id,
                p.product_name,
                p.category,
                COUNT(i.customer_id) AS interaction_count,
                ROUND(
                    AVG(i.rating)::numeric,
                    2
                ) AS average_rating
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


@router.get("/segments")
def get_customer_segments():
    with get_connection() as conn:
        results = conn.execute(
            """
            SELECT
                segment,
                COUNT(*) AS customer_count,
                ROUND(
                    COUNT(*) * 100.0 /
                    SUM(COUNT(*)) OVER (),
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


@router.get("/segment-ratings")
def get_segment_ratings():
    with get_connection() as conn:
        results = conn.execute(
            """
            SELECT
                c.segment,
                COUNT(i.rating) AS interaction_count,
                ROUND(AVG(i.rating)::numeric, 2)
                    AS average_rating
            FROM public.customers c
            INNER JOIN public.interactions i
                ON c.customer_id = i.customer_id
            GROUP BY c.segment
            ORDER BY average_rating DESC
            """
        ).fetchall()

    return {
        "count": len(results),
        "segments": results
    }
