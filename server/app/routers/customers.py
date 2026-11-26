
from fastapi import APIRouter, Query

from app.database import get_connection

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.get("/")
def get_customers(
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0)
):
    with get_connection() as conn:
        customers = conn.execute(
            """
            SELECT
                customer_id,
                age,
                segment,
                income_band
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
