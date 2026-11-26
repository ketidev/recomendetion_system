
from fastapi import APIRouter

from app.database import get_connection

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.get("/")
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
