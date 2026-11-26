
from fastapi import APIRouter, HTTPException, Query

from src.recommender import recommend_products

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)


@router.get("/{customer_id}")
def get_recommendations(
    customer_id: str,
    top_n: int = Query(default=5, ge=1, le=8)
):
    try:
        recommendations = recommend_products(
            customer_id,
            top_n=top_n
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
