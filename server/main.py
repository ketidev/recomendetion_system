from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    customers,
    products,
    recommendations,
    analytics
)

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


@app.get("/")
def home():
    return {
        "message": "Banking Product Recommendation API is running!"
    }

app.include_router(customers.router)
app.include_router(products.router)
app.include_router(recommendations.router)
app.include_router(analytics.router)
