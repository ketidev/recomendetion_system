# Banking Product Recommender System

A data-driven banking product recommendation system that analyzes customer characteristics and interaction history to generate personalized banking product recommendations.

The project explores different recommendation approaches, including Content-Based Filtering, Collaborative Filtering and Hybrid Recommendation, to identify relevant products for individual customers.

It also includes exploratory data analysis, customer segmentation, product popularity analysis, recommendation evaluation and an interactive dashboard for exploring results.

**Note:** This project uses synthetic banking data and is developed for educational and portfolio purposes. It is not based on real customer information.

## Key Features

- **Synthetic Data Generation:** Creates customer profiles, banking products and customer-product interactions for experimentation.
- **Exploratory Data Analysis (EDA):** Analyzes customer demographics, product interactions, ratings and data distributions.
- **Content-Based Filtering:** Recommends products based on customer preferences and product features using cosine similarity.
- **Collaborative Filtering:** Identifies similar customers based on their interaction history to recommend relevant products.
- **Hybrid Recommendation:** Combines Content-Based and Collaborative Filtering scores to generate personalized recommendations.
- **Recommendation Evaluation:** Evaluates recommendation performance using Precision@K, Recall@K and Hit Rate@K.
- **Customer Segmentation:** Analyzes customer groups based on their characteristics and compares their interaction patterns.
- **Product Popularity Analysis:** Identifies popular banking products based on customer interactions.
- **SQL Analytics:** Uses SQL queries to analyze product popularity, customer segments and average ratings.
- **Interactive Dashboard:** Provides a visual interface for exploring customers, products, recommendations and analytical results.

## Recommendation Methodology

The system implements three recommendation approaches:

### 1. Content-Based Filtering

Recommends products based on similarities between customer preferences and product features.

- Uses product feature vectors.
- Applies cosine similarity to measure similarity.
- Ranks products according to their relevance to customer preferences.

### 2. Collaborative Filtering

Uses customer-product interaction history to identify customers with similar behavior.

- Builds a customer-product interaction matrix.
- Calculates customer similarity using cosine similarity.
- Uses similar customers' interactions to generate recommendations.

### 3. Hybrid Recommendation

Combines Content-Based and Collaborative Filtering to leverage both product characteristics and customer behavior.

The current implementation uses the following weighted combination:

`Hybrid Score = 0.6 × Content Score + 0.4 × Collaborative Score`

The final recommendations are ranked by their hybrid scores.

**Note:** Recommendation scores represent relative ranking values, not probabilities of purchase.

## Model Evaluation

Recommendation performance is evaluated using:

- **Precision@K:** Measures the proportion of recommended products that are relevant.
- **Recall@K:** Measures how many relevant products are included in the recommendations.
- **Hit Rate@K:** Measures whether at least one relevant product appears in the top K recommendations.

These metrics are used to compare Content-Based, Collaborative and Hybrid recommendation approaches.

## Analytics

The project includes analytical queries and visualizations to explore:

- Product popularity based on interaction counts.
- Customer distribution across segments.
- Average product ratings across customer segments.
- Customer-product interaction patterns.

## Tech Stack

### Data Science & Machine Learning

- **Python** – Main programming language for data processing and recommendation algorithms.
- **Pandas** – Data manipulation, cleaning and analysis.
- **NumPy** – Numerical operations and matrix calculations.
- **Scikit-learn** – Cosine similarity and machine learning utilities.
- **Matplotlib** – Data visualization.
- **Seaborn** – Statistical data visualization.

### Backend & Database

- **FastAPI** – REST API development.
- **PostgreSQL** – Relational database for storing customers, products and interactions.
- **Supabase** – Hosted PostgreSQL database.
- **Psycopg** – PostgreSQL database connectivity.
- **Python-dotenv** – Environment variable management.

### Frontend

- **React** – User interface development.
- **TypeScript** – Type-safe frontend development.
- **Vite** – Frontend development and build tooling.
- **Tailwind CSS** – UI styling.
- **React Router** – Client-side routing.
- **Context API** – Shared application state management.
- **Recharts** – Data visualization and interactive charts.
- **Lucide React** – Icons.

## Dataset

The project uses a synthetic dataset consisting of:

| Dataset                       | Records |
| ----------------------------- | ------: |
| Customers                     |   1,000 |
| Banking Products              |       8 |
| Customer-Product Interactions |   4,518 |

The dataset contains customer characteristics, product features and interaction ratings.

## Project Architecture

The application consists of three main parts:

- **Data Science Layer:** Data generation, preprocessing, exploratory analysis, recommendation algorithms and model evaluation.
- **Backend Layer:** FastAPI endpoints, database connectivity and SQL-based analytics.
- **Frontend Layer:** Interactive dashboard for exploring recommendations and analytical results.
