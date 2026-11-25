# Banking Product Recommendation System

A Python-based project that analyzes customer profiles, banking products, and customer interactions to generate personalized banking product recommendations.

The project demonstrates how data analysis and machine learning techniques can help identify customer preferences and recommend relevant banking products.

**Note:** This project uses synthetic data generated for educational and portfolio purposes. No real customer or banking data is used.

## Technologies & Libraries

- **Python** – Main programming language
- **Pandas** – Data manipulation, processing, and analysis
- **NumPy** – Numerical computing and synthetic data generation
- **Scikit-learn** – Machine learning techniques and cosine similarity
- **Matplotlib** – Data visualization
- **Seaborn** – Statistical data visualization

## Dataset

The project generates three datasets:

| Dataset      | Description                                     |
| ------------ | ----------------------------------------------- |
| Customers    | 1,000 customer profiles                         |
| Products     | 8 banking products with different features      |
| Interactions | 4,518 customer-product interactions and ratings |

Customer profiles include age, customer segment, and income category.

## Key Features

### 1. Synthetic Data Generation

- Generates customer profiles and banking products.
- Simulates customer preferences and product interactions.
- Assigns ratings from 1 to 5.

### 2. Recommendation System

Implements and compares three recommendation approaches:

- **Content-Based Filtering** – Recommends products based on customer interests and product features.
- **Collaborative Filtering** – Uses similarities between customers and their interaction history.
- **Hybrid Recommendation** – Combines both approaches (60% Content-Based, 40% Collaborative).

Generates personalized Top 5 product recommendations and excludes products customers have already interacted with.

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

Provides initial feature-based explanations for recommended products, showing relevant product characteristics such as travel, savings, and cashback benefits.

````

## Installation & Usage

**1. Clone the repository**

```bash
git clone https://github.com/ketidev/banking-product-recommender.git
cd banking-product-recommender
````

**2. Create and activate a virtual environment**

```bash
python -m venv venv
```

Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

**3. Install dependencies**

```bash
pip install -r requirements.txt
```

**4. Run the project scripts**

```bash
python src/generate_data.py
python src/recommender.py
python src/evaluate.py
python src/explain.py
python src/analyze_data.py
```

## Future Improvements

- Improve recommendation evaluation using positive customer ratings.
- Enhance customer preference analysis and recommendation explanations.
- Integrate PostgreSQL for analytical SQL queries.
- Explore Apache Spark for large-scale data processing.
