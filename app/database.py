import os

import psycopg
from psycopg.rows import dict_row
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


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
