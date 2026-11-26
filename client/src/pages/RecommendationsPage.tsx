
import { useState } from "react";

import {
  ArrowDownUp,
  CheckCircle2,
  CircleHelp,
  Sparkles,
  UserRound,
} from "lucide-react";

import { useAppData } from "../context/AppContext";
import { api } from "../services/api";

import type { Recommendation } from "../types";

import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";

// Displays an individual recommendation score
function ScoreBar({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: string;
}) {
  const percentage = score * 100;

  return (
    <div>
      <div className="mb-1 flex justify-between text-[10px]">

        <span className="font-medium text-slate-500">
          {label}
        </span>

        <span className="font-bold text-slate-700">
          {percentage.toFixed(1)}%
        </span>

      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  const { customers } = useAppData();

  const [customerId, setCustomerId] = useState("C0001");
  const [topN, setTopN] = useState(5);

  const [results, setResults] = useState<Recommendation[]>([]);
  const [searchedId, setSearchedId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generate recommendations for the selected customer
  const generateRecommendations = async () => {
    if (!customerId.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const data = await api.recommendations(
        customerId.trim(),
        topN
      );

      setResults(data.recommendations);
      setSearchedId(data.customer_id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate recommendations"
      );
    } finally {
      setLoading(false);
    }
  };

  // Find the customer whose recommendations were generated
  const selectedCustomer = customers.find(
    (customer) => customer.customer_id === searchedId
  );

  return (
    <div className="space-y-6">

      {/* Recommendation Configuration */}

      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-[#f0f5ff] via-white to-[#f7f4ff] p-5 sm:p-7">

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          {/* Section Introduction */}

          <div className="max-w-lg">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 shadow-sm">
              <Sparkles size={12} />
              Hybrid recommendation engine
            </div>

            <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
              Find the right fit for every customer.
            </h2>

            <p className="mt-2 text-xs leading-6 text-slate-500">
              Combine customer interests with patterns from similar
              customers to surface relevant products.
            </p>

          </div>

          {/* Recommendation Form */}

          <div className="grid w-full gap-3 sm:grid-cols-[1fr_120px_auto] lg:max-w-[570px]">

            {/* Customer Selection */}

            <label className="block">

              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Customer ID
              </span>

              <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3">

                <UserRound size={15} className="text-slate-400" />

                <input
                  list="customer-ids"
                  value={customerId}
                  onChange={(event) => setCustomerId(event.target.value)}
                  placeholder="e.g. C0001"
                  className="w-full bg-transparent px-2 py-3 text-xs font-semibold text-slate-700 outline-none"
                />

                <datalist id="customer-ids">
                  {customers.map((customer) => (
                    <option
                      key={customer.customer_id}
                      value={customer.customer_id}
                    />
                  ))}
                </datalist>

              </div>

            </label>

            {/* Number of Recommendations */}

            <label>

              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Top results
              </span>

              <select
                value={topN}
                onChange={(event) => setTopN(Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value={3}>Top 3</option>
                <option value={5}>Top 5</option>
                <option value={8}>Top 8</option>
              </select>

            </label>

            {/* Generate Button */}

            <button
              onClick={() => void generateRecommendations()}
              disabled={loading}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#214b86] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#173c70] disabled:opacity-60"
            >
              <Sparkles size={14} />
              Generate
            </button>

          </div>

        </div>

      </section>

      {/* Error Message */}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
          {error}
        </div>
      )}

      {/* Loading State */}

      {loading && (
        <Loading label="Finding relevant products..." />
      )}

      {/* Recommendation Results */}

      {!loading && results.length > 0 && (
        <>

          {/* Results Header */}

          <div className="flex flex-wrap items-center justify-between gap-2">

            <div>
              <h3 className="font-display text-base font-extrabold text-slate-900">
                Recommended for {searchedId}
              </h3>

              <p className="mt-1 text-[11px] text-slate-400">
                {selectedCustomer
                  ? `${selectedCustomer.segment} · ${selectedCustomer.income_band} income · Age ${selectedCustomer.age}`
                  : "Personalized product matches"}
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
              <CheckCircle2 size={12} className="mr-1 inline" />
              {results.length} matches found
            </span>

          </div>

          {/* Recommendation Cards */}

          <section className="grid gap-4 lg:grid-cols-2">

            {results.map((item, index) => (
              <article
                key={item.product_id}
                className="card-shadow rounded-2xl border border-slate-200/80 bg-white p-5"
              >

                {/* Product Information */}

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf3ff] text-[#28599b]">
                      <span className="font-display text-sm font-extrabold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div>
                      <p className="font-display text-sm font-extrabold text-slate-900">
                        {item.product_name}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {item.product_id} · {item.category}
                      </p>
                    </div>

                  </div>

                  {/* Hybrid Score */}

                  <div className="rounded-xl bg-[#edf3ff] px-3 py-2 text-right">

                    <p className="font-display text-lg font-extrabold text-[#24549a]">
                      {(item.hybrid_score * 100).toFixed(1)}%
                    </p>

                    <p className="text-[9px] font-bold uppercase tracking-wider text-blue-500">
                      Hybrid score
                    </p>

                  </div>

                </div>

                {/* Individual Recommendation Scores */}

                <div className="mt-6 space-y-3">

                  <ScoreBar
                    label="Content-based"
                    score={item.content_score}
                    color="#557fc0"
                  />

                  <ScoreBar
                    label="Collaborative"
                    score={item.collaborative_score}
                    color="#8b78c8"
                  />

                </div>

                {/* Recommendation Ranking Information */}

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-400">

                  <span className="inline-flex items-center gap-1">
                    <CircleHelp size={12} />
                    Relative ranking score, not purchase probability
                  </span>

                  <span className="font-bold text-slate-500">
                    Rank #{index + 1}
                  </span>

                </div>

              </article>
            ))}

          </section>

        </>
      )}

      {/* Initial / Empty State */}

      {!loading && !error && results.length === 0 && (
        <EmptyState
          title="Ready to generate recommendations?"
          description="Select a customer ID and generate a personalized list. Previously interacted products are excluded by the recommendation algorithm."
        />
      )}

      {/* Recommendation Methodology */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-[11px] leading-5 text-slate-500">

        <ArrowDownUp size={14} className="mr-2 inline text-slate-400" />

        The hybrid score combines Content-Based (60%) and Collaborative
        Filtering (40%). Scores are used to rank products and should not
        be interpreted as purchase probabilities.

      </div>

    </div>
  );
}
