
import { useEffect, useState } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CreditCard,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import StatCard from "../components/StatCard";

import { useAppData } from "../context/AppContext";
import { api } from "../services/api";

import type {
  PopularityItem,
  SegmentItem,
} from "../types";

// Colors used in the customer segment chart
const COLORS = [
  "#28599b",
  "#7d91c9",
  "#a9b9d9",
  "#d6dfed",
];

export default function DashboardPage() {
  const {
    customers,
    products,
    loading,
    error,
    refresh,
    apiOnline,
  } = useAppData();

  const [segments, setSegments] = useState<SegmentItem[]>([]);
  const [popular, setPopular] = useState<PopularityItem[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [segmentsData, popularityData] = await Promise.all([
          api.segments(),
          api.popularity(),
        ]);

        setSegments(segmentsData.segments);
        setPopular(popularityData.products.slice(0, 4));
      } catch {
        setSegments([]);
        setPopular([]);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    void loadAnalytics();
  }, []);

  // Calculate interactions across the displayed popular products
  const interactions = popular.reduce(
    (total, product) =>
      total + Number(product.interaction_count || 0),
    0
  );

  return (
    <div className="space-y-6">

      {/* Hero Section */}

      <section className="relative overflow-hidden rounded-[26px] bg-[#183b73] px-6 py-7 text-white sm:px-8 sm:py-8">

        <div className="absolute -right-10 -top-24 h-72 w-72 rounded-full border-[38px] border-white/[.045]" />

        <div className="absolute -bottom-32 right-44 h-64 w-64 rounded-full border-[35px] border-white/[.045]" />

        <div className="relative z-10 max-w-xl">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-blue-100">
            <Sparkles size={12} />
            Intelligent recommendations
          </div>

          <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-[30px]">
            Turn customer insights
            <br className="hidden sm:block" />
            into meaningful connections.
          </h2>

          <p className="mt-3 max-w-md text-xs leading-6 text-blue-100/75 sm:text-sm">
            Explore customer preferences, understand product engagement,
            and surface relevant banking products with a hybrid
            recommendation approach.
          </p>

          <Link
            to="/recommendations"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#183b73] transition hover:bg-blue-50"
          >
            Explore recommendations
            <ArrowRight size={15} />
          </Link>

        </div>

        {/* Hero Illustration */}

        <div className="absolute bottom-0 right-8 hidden h-[88%] w-[34%] items-end justify-center lg:flex">

          <div className="relative mb-5 flex h-40 w-40 items-center justify-center rounded-full border border-white/15 bg-white/[.07]">

            <div className="absolute h-28 w-28 rounded-full border border-white/20" />

            <div className="absolute h-16 w-16 rounded-full bg-white/10" />

            <Sparkles size={34} className="relative text-blue-100" />

            <span className="absolute -right-5 top-5 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-[10px] font-semibold">
              Hybrid AI
            </span>

            <span className="absolute -bottom-1 -left-8 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-[10px] font-semibold">
              Customer 360°
            </span>

          </div>

        </div>

      </section>

      {/* Backend Connection Status */}

      {!apiOnline && (
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center">

          <div>
            <p className="text-xs font-bold text-amber-900">
              Backend connection unavailable
            </p>

            <p className="mt-1 text-[11px] text-amber-800">
              {error || "Start your FastAPI server at http://127.0.0.1:8000."}
            </p>
          </div>

          <button
            onClick={() => void refresh()}
            className="rounded-lg bg-amber-900 px-3 py-2 text-[11px] font-semibold text-white"
          >
            Try again
          </button>

        </div>
      )}

      {/* Dashboard Content */}

      {loading ? (
        <Loading label="Loading your workspace..." />
      ) : (
        <>

          {/* Summary Cards */}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              label="Total customers"
              value={customers.length.toLocaleString()}
              helper="Customer profiles in your dataset"
              icon={Users}
              tone="blue"
            />

            <StatCard
              label="Banking products"
              value={products.length.toString()}
              helper="Available products in catalogue"
              icon={Wallet}
              tone="violet"
            />

            <StatCard
              label="Customer segments"
              value={segments.length.toString()}
              helper="Distinct customer groups"
              icon={BarChart3}
              tone="mint"
            />

            <StatCard
              label="Popular product signals"
              value={interactions.toLocaleString()}
              helper="Interactions across top products shown"
              icon={CreditCard}
              tone="amber"
            />

          </section>

          {/* Analytics Section */}

          <section className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">

            {/* Customer Segments */}

            <div className="card-shadow rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h3 className="font-display text-sm font-extrabold text-slate-900">
                    Customer segments
                  </h3>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Distribution across your customer base
                  </p>
                </div>

                <Link
                  to="/analytics"
                  className="text-[11px] font-bold text-blue-700"
                >
                  View analytics
                  <ArrowUpRight size={13} className="inline" />
                </Link>

              </div>

              {analyticsLoading ? (
                <Loading />
              ) : segments.length > 0 ? (

                <div className="flex flex-col items-center gap-5 sm:flex-row">

                  {/* Pie Chart */}

                  <div className="h-[210px] w-full max-w-[230px]">

                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>

                        <Pie
                          data={segments}
                          dataKey="customer_count"
                          nameKey="segment"
                          innerRadius={62}
                          outerRadius={91}
                          paddingAngle={4}
                          stroke="none"
                        >
                          {segments.map((segment, index) => (
                            <Cell
                              key={segment.segment}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          formatter={(value: number) =>
                            value.toLocaleString()
                          }
                        />

                      </PieChart>
                    </ResponsiveContainer>

                  </div>

                  {/* Segment Legend */}

                  <div className="w-full space-y-4">

                    {segments.map((segment, index) => (
                      <div key={segment.segment}>

                        <div className="mb-1.5 flex items-center justify-between text-xs">

                          <span className="flex items-center gap-2 font-semibold text-slate-600">

                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                background: COLORS[index % COLORS.length],
                              }}
                            />

                            {segment.segment}

                          </span>

                          <span className="font-bold text-slate-800">
                            {segment.customer_count.toLocaleString()}
                          </span>

                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">

                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${segment.percentage || 0}%`,
                              background: COLORS[index % COLORS.length],
                            }}
                          />

                        </div>

                        <p className="mt-1 text-right text-[10px] text-slate-400">
                          {Number(segment.percentage || 0).toFixed(1)}%
                        </p>

                      </div>
                    ))}

                  </div>

                </div>

              ) : (
                <EmptyState
                  title="Segment data not available"
                  description="Check that the analytics endpoint is available."
                />
              )}

            </div>

            {/* Popular Products */}

            <div className="card-shadow rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h3 className="font-display text-sm font-extrabold text-slate-900">
                    Popular products
                  </h3>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Ranked by customer interactions
                  </p>
                </div>

                <Link
                  to="/products"
                  className="text-[11px] font-bold text-blue-700"
                >
                  All products
                  <ArrowUpRight size={13} className="inline" />
                </Link>

              </div>

              {analyticsLoading ? (
                <Loading />
              ) : popular.length > 0 ? (

                <div className="space-y-4">

                  {popular.map((product, index) => (
                    <div
                      key={product.product_id}
                      className="flex items-center gap-3"
                    >

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          [
                            "bg-blue-50 text-blue-700",
                            "bg-violet-50 text-violet-700",
                            "bg-emerald-50 text-emerald-700",
                            "bg-amber-50 text-amber-700",
                          ][index]
                        }`}
                      >
                        <CreditCard size={17} />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-xs font-bold text-slate-700">
                          {product.product_name}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {product.category} · {product.interaction_count} interactions
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-xs font-bold text-slate-800">
                          {product.average_rating == null
                            ? "—"
                            : Number(product.average_rating).toFixed(1)}
                        </p>

                        <p className="text-[9px] text-slate-400">
                          Avg. rating
                        </p>

                      </div>

                    </div>
                  ))}

                </div>

              ) : (
                <EmptyState title="No popularity data" />
              )}

            </div>

          </section>

          {/* Recommendations Call to Action */}

          <section className="flex flex-col justify-between gap-3 rounded-2xl border border-blue-100 bg-[#eef4ff] p-5 sm:flex-row sm:items-center">

            <div>
              <p className="text-xs font-bold text-[#234b83]">
                Ready to find the next best product?
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Choose a customer and generate a personalized recommendation list.
              </p>
            </div>

            <Link
              to="/recommendations"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#214b86] px-4 py-2.5 text-[11px] font-bold text-white hover:bg-[#173c70]"
            >
              Generate recommendations
              <ArrowRight size={14} />
            </Link>

          </section>

        </>
      )}

      {/* Footer */}

      <p className="text-center text-[10px] text-slate-400">
        Demo environment · Synthetic data for educational and portfolio purposes
      </p>

    </div>
  );
}
