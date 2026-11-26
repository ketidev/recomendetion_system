# Banking Product Recommender – Frontend

A React-based web application for exploring banking products, generating personalized recommendations and visualizing customer and product analytics.

The frontend communicates with a FastAPI backend to retrieve customer data, product information, recommendations and analytics from a Supabase PostgreSQL database.

## Features

- **Dashboard:** Overview of key statistics, customer segments and popular banking products.
- **Recommendations:** Generate personalized banking product recommendations for selected customers.
- **Customers:** Browse, search and filter customer records.
- **Products:** Explore available banking products and their characteristics.
- **Analytics:** Visualize product popularity, customer segments and average ratings using charts.
- **API Integration:** Retrieve data from the FastAPI backend through REST API endpoints.
- **Loading & Error States:** Handle data loading and API errors.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Context API
- Recharts
- Lucide React
- Fetch API

## Getting Started

### Prerequisites

- Node.js
- npm
- Running FastAPI backend

### Installation

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open the application in your browser at:

```text
http://localhost:5173
```

## API Integration

The frontend communicates with the FastAPI backend using the Fetch API.

API requests are organized in `src/services/api.ts`, while shared application data is managed through React Context API.

React Hooks (`useEffect` and `useState`) are used for data fetching, state updates, loading indicators and error handling.

## Notes

This application uses synthetic banking data for demonstration and portfolio purposes.
