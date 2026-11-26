# Banking Product Recommendation System

A Python-based banking product recommendation system that analyzes customer profiles, banking products and customer interactions to generate personalized banking product recommendations.

The project demonstrates how data analysis, recommendation algorithms and SQL queries can help identify customer preferences, analyze product popularity and recommend relevant banking products.

**Note:** This project uses synthetic data generated for educational and portfolio purposes. No real customer or banking data is used.

## Technologies & Libraries

- **Python** – Main programming language
- **Pandas** – Data manipulation, processing and analysis
- **NumPy** – Numerical computing and synthetic data generation
- **Scikit-learn** – Recommendation algorithms and cosine similarity
- **Matplotlib** – Data visualization
- **Seaborn** – Statistical data visualization
- **PostgreSQL (Supabase)** – Database for storing and querying project data
- **Psycopg** – PostgreSQL database connection
- **FastAPI** – REST API development
- **Uvicorn** – ASGI server

## Dataset

The project generates three synthetic datasets:

| Dataset      | Description                                     |
| ------------ | ----------------------------------------------- |
| Customers    | 1,000 customer profiles                         |
| Products     | 8 banking products with different features      |
| Interactions | 4,518 customer-product interactions and ratings |

Customer profiles include age, customer segment and income category.

## Key Features

### 1. Synthetic Data Generation

- Generates customer profiles and banking products.
- Simulates customer preferences and product interactions.
- Assigns ratings from 1 to 5.
- Exports generated datasets to CSV files.

### 2. Recommendation System

Implements three recommendation approaches:

- **Content-Based Filtering** – Recommends products based on customer interests and product features.
- **Collaborative Filtering** – Uses similarities between customers and their interaction history.
- **Hybrid Recommendation** – Combines both approaches (60% Content-Based, 40% Collaborative).

Generates personalized Top-N product recommendations and excludes products customers have already interacted with.

### 3. Model Evaluation

Evaluates recommendation performance using:

- Precision@5
- Recall@5
- Hit Rate@5

Compares all three recommendation approaches and exports evaluation results to CSV.

### 4. Exploratory Data Analysis (EDA)

Analyzes customer and product data, including:

- Data quality: missing values and duplicates.
- Customer demographics and income distribution.
- Customer segments.
- Product popularity and average ratings.
- Product ratings across customer segments.

Generates visual reports using Matplotlib and Seaborn.

### 5. Recommendation Explanations

Provides initial feature-based explanations for recommended products, showing relevant product characteristics such as travel, savings and cashback benefits.

### 6. Database Integration

Uses Supabase-hosted PostgreSQL to store and manage project data.

- Loads customers, products and interactions from CSV files into PostgreSQL.
- Uses SQL queries to retrieve and analyze data.
- Supports database-backed recommendation calculations.

## Installation & Usage

### 1. Clone the repository

```bash
git clone https://github.com/ketidev/banking-product-recommender.git
cd banking-product-recommender
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv
```

Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=your_supabase_postgresql_connection_string
```

Use your Supabase PostgreSQL connection string. Do not commit the `.env` file to GitHub.

### 5. Start the FastAPI server

```bash
python -m uvicorn main:app --reload
```

The API will be available at:

`http://127.0.0.1:8000`

Interactive API documentation (Swagger UI):

`http://127.0.0.1:8000/docs`
