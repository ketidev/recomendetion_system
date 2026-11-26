
import { useEffect, useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { BarChart3, Star, Users } from "lucide-react";

import { api } from "../services/api";
import type { PopularityItem, SegmentItem } from "../types";

import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";

export default function AnalyticsPage() {
  const [popularity, setPopularity] = useState<PopularityItem[]>([]);
  const [segments, setSegments] = useState<SegmentItem[]>([]);
  const [ratings, setRatings] = useState<SegmentItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    setLoading(true);
    setError("");

    try {
      const [popularityData, segmentsData, ratingsData] =
        await Promise.all([
          api.popularity(),
          api.segments(),
          api.segmentRatings(),
        ]);

      setPopularity(popularityData.products);
      setSegments(segmentsData.segments);
      setRatings(ratingsData.segments);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAnalytics();
  }, []);

  if (loading) {
    return <Loading label="Preparing analytics..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="Analytics could not be loaded"
        description={error}
        onRetry={() => void loadAnalytics()}
      />
    );
  }

  return (
    <div className="space-y-5">

      {/* Summary Cards */}

      <section className="grid gap-4 sm:grid-cols-3">

        <div className="card-shadow rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400">
              Products analyzed
            </p>

            <BarChart3 size={17} className="text-blue-600" />
          </div>

          <p className="mt-3 font-display text-2xl font-extrabold text-slate-900">
            {popularity.length}
          </p>
        </div>

        <div className="card-shadow rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400">
              Customer segments
            </p>

            <Users size={17} className="text-violet-600" />
          </div>

          <p className="mt-3 font-display text-2xl font-extrabold text-slate-900">
            {segments.length}
          </p>
        </div>

        <div className="card-shadow rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400">
              Segment rating groups
            </p>

            <Star size={17} className="text-amber-500" />
          </div>

          <p className="mt-3 font-display text-2xl font-extrabold text-slate-900">
            {ratings.length}
          </p>
        </div>

      </section>

      {/* Charts */}

      <section className="grid gap-5 xl:grid-cols-2">

        {/* Product Popularity Chart */}

        <div className="card-shadow rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="mb-5">
            <h3 className="font-display text-sm font-extrabold text-slate-900">
              Product popularity
            </h3>

            <p className="mt-1 text-[11px] text-slate-400">
              Number of customer interactions by product
            </p>
          </div>

          {popularity.length > 0 ? (
            <div className="h-[290px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={popularity}
                  margin={{
                    top: 5,
                    right: 10,
                    left: -18,
                    bottom: 35,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#edf0f5"
                  />

                  <XAxis
                    dataKey="product_name"
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                    tick={{
                      fontSize: 9,
                      fill: "#8792a5",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: "#8792a5",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="interaction_count"
                    name="Interactions"
                    fill="#4774b7"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Average Rating by Segment Chart */}

        <div className="card-shadow rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="mb-5">
            <h3 className="font-display text-sm font-extrabold text-slate-900">
              Average rating by segment
            </h3>

            <p className="mt-1 text-[11px] text-slate-400">
              Average customer ratings for product interactions
            </p>
          </div>

          {ratings.length > 0 ? (
            <div className="h-[290px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ratings}
                  margin={{
                    top: 5,
                    right: 10,
                    left: -18,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#edf0f5"
                  />

                  <XAxis
                    dataKey="segment"
                    tick={{
                      fontSize: 10,
                      fill: "#8792a5",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[0, 5]}
                    tick={{
                      fontSize: 10,
                      fill: "#8792a5",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="average_rating"
                    name="Average rating"
                    fill="#8a79c6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

      </section>

      {/* Product Performance Table */}

      <section className="card-shadow overflow-hidden rounded-2xl border border-slate-200/80 bg-white">

        <div className="border-b border-slate-100 p-5">
          <h3 className="font-display text-sm font-extrabold text-slate-900">
            Product performance details
          </h3>

          <p className="mt-1 text-[11px] text-slate-400">
            Interaction volume and average customer rating
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">

            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Interactions</th>
                <th className="px-5 py-3">Average rating</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {popularity.map((product) => (
                <tr key={product.product_id}>
                  <td className="px-5 py-3 text-xs font-bold text-slate-700">
                    {product.product_name}
                  </td>

                  <td className="px-5 py-3 text-xs text-slate-500">
                    {product.category}
                  </td>

                  <td className="px-5 py-3 text-xs text-slate-600">
                    {product.interaction_count}
                  </td>

                  <td className="px-5 py-3 text-xs font-bold text-slate-700">
                    {product.average_rating == null
                      ? "—"
                      : Number(product.average_rating).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </section>

      {/* Customer Segment Breakdown */}

      <section className="card-shadow rounded-2xl border border-slate-200/80 bg-white p-5">

        <h3 className="font-display text-sm font-extrabold text-slate-900">
          Customer segment breakdown
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {segments.map((segment) => (
            <div
              key={segment.segment}
              className="rounded-xl bg-slate-50 p-4"
            >
              <p className="text-[11px] font-semibold text-slate-500">
                {segment.segment}
              </p>

              <p className="mt-2 font-display text-xl font-extrabold text-slate-900">
                {segment.customer_count.toLocaleString()}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                {Number(segment.percentage || 0).toFixed(1)}% of customers
              </p>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}
