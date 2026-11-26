
import { Search, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { useAppData } from "../context/AppContext";

import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";

export default function CustomersPage() {
  const {
    customers,
    loading,
    error,
    refresh,
  } = useAppData();

  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("All segments");

  // Get unique customer segments
  const segments = useMemo(() => {
    const uniqueSegments = Array.from(
      new Set(customers.map((customer) => customer.segment))
    );

    return ["All segments", ...uniqueSegments];
  }, [customers]);

  // Filter customers by ID and segment
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.customer_id
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesSegment =
      segment === "All segments" || customer.segment === segment;

    return matchesSearch && matchesSegment;
  });

  return (
    <div className="space-y-5">

      {/* Summary Cards */}

      <section className="grid gap-4 sm:grid-cols-3">

        <div className="card-shadow rounded-2xl border border-slate-200/80 bg-white p-5">
          <p className="text-xs font-semibold text-slate-400">
            Total customers
          </p>

          <p className="mt-2 font-display text-2xl font-extrabold text-slate-900">
            {customers.length.toLocaleString()}
          </p>
        </div>

        <div className="card-shadow rounded-2xl border border-slate-200/80 bg-white p-5">
          <p className="text-xs font-semibold text-slate-400">
            Customer segments
          </p>

          <p className="mt-2 font-display text-2xl font-extrabold text-slate-900">
            {Math.max(0, segments.length - 1)}
          </p>
        </div>

        <div className="card-shadow rounded-2xl border border-slate-200/80 bg-white p-5">
          <p className="text-xs font-semibold text-slate-400">
            Visible records
          </p>

          <p className="mt-2 font-display text-2xl font-extrabold text-slate-900">
            {filteredCustomers.length.toLocaleString()}
          </p>
        </div>

      </section>

      {/* Customer Directory */}

      <section className="card-shadow overflow-hidden rounded-2xl border border-slate-200/80 bg-white">

        {/* Header and Filters */}

        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">

          <div>
            <h2 className="font-display text-sm font-extrabold text-slate-900">
              Customer directory
            </h2>

            <p className="mt-1 text-[11px] text-slate-400">
              Browse synthetic customer profiles
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">

            {/* Search Input */}

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3">
              <Search size={14} className="text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customer ID"
                className="w-full py-2.5 text-xs outline-none sm:w-40"
              />
            </div>

            {/* Segment Filter */}

            <select
              value={segment}
              onChange={(event) => setSegment(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600 outline-none"
            >
              {segments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

          </div>
        </div>

        {/* Loading State */}

        {loading ? (
          <Loading />
        ) : error ? (
          <div className="p-5">
            <EmptyState
              title="Could not load customers"
              description={error}
              onRetry={() => void refresh()}
            />
          </div>
        ) : filteredCustomers.length > 0 ? (

          /* Customers Table */

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">

              <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Age</th>
                  <th className="px-5 py-3">Segment</th>
                  <th className="px-5 py-3">Income band</th>
                  <th className="px-5 py-3">Profile status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.slice(0, 100).map((customer) => (
                  <tr
                    key={customer.customer_id}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-700">
                          <Users size={14} />
                        </div>

                        <span className="text-xs font-bold text-slate-700">
                          {customer.customer_id}
                        </span>

                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-xs text-slate-600">
                      {customer.age}
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
                        {customer.segment}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-xs text-slate-600">
                      {customer.income_band}
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

            {/* Results Information */}

            <div className="border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400">
              Showing {Math.min(filteredCustomers.length, 100)} of{" "}
              {filteredCustomers.length} matching customers
            </div>

          </div>

        ) : (

          /* Empty State */

          <div className="p-5">
            <EmptyState
              title="No matching customers"
              description="Try changing your search or segment filter."
            />
          </div>

        )}

      </section>

    </div>
  );
}
