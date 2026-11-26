
import os
from pathlib import Path

import pandas as pd
import psycopg
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL ვერ მოიძებნა .env ფაილში")

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

customers = pd.read_csv(DATA_DIR / "customers.csv")
products = pd.read_csv(DATA_DIR / "products.csv")
interactions = pd.read_csv(DATA_DIR / "interactions.csv")

def load_data():
    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:

            cur.executemany(
                """
                INSERT INTO public.customers
                (customer_id, age, segment, income_band)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (customer_id) DO UPDATE SET
                    age = EXCLUDED.age,
                    segment = EXCLUDED.segment,
                    income_band = EXCLUDED.income_band
                """,
                customers[
                    ["customer_id", "age", "segment", "income_band"]
                ].itertuples(index=False, name=None)
            )

            cur.executemany(
                """
                INSERT INTO public.products
                (product_id, product_name, category,
                 travel, savings, shopping, cashback, salary, student)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (product_id) DO UPDATE SET
                    product_name = EXCLUDED.product_name,
                    category = EXCLUDED.category,
                    travel = EXCLUDED.travel,
                    savings = EXCLUDED.savings,
                    shopping = EXCLUDED.shopping,
                    cashback = EXCLUDED.cashback,
                    salary = EXCLUDED.salary,
                    student = EXCLUDED.student
                """,
                products[
                    [
                        "product_id", "product_name", "category",
                        "travel", "savings", "shopping",
                        "cashback", "salary", "student"
                    ]
                ].itertuples(index=False, name=None)
            )

            cur.executemany(
                """
                INSERT INTO public.interactions
                (customer_id, product_id, rating)
                VALUES (%s, %s, %s)
                ON CONFLICT (customer_id, product_id) DO UPDATE SET
                    rating = EXCLUDED.rating
                """,
                interactions[
                    ["customer_id", "product_id", "rating"]
                ].itertuples(index=False, name=None)
            )

    print("Data successfully uploaded to Supabase!")
    print(f"Customers: {len(customers)}")
    print(f"Products: {len(products)}")
    print(f"Interactions: {len(interactions)}")


if __name__ == "__main__":
    load_data()
