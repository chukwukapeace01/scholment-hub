"use client";

import { useEffect, useState } from "react";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  category: string | null;
  country: string | null;
};

const categories = [
  "Scholarship",
  "Internship",
  "Fellowship",
  "Grant",
  "Exchange Programme",
];

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");

  async function fetchOpportunities() {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (country) params.set("country", country);

    const res = await fetch(`/api/opportunities?${params.toString()}`);
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    setOpportunities(data.opportunities);
    setLoading(false);
  }

  useEffect(() => {
    fetchOpportunities();
  }, [category, country]);

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Available Opportunities
        </h1>

        <div className="mb-6 flex flex-wrap gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Filter by country..."
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          />

          {(category || country) && (
            <button
              onClick={() => {
                setCategory("");
                setCountry("");
              }}
              className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Clear Filters
            </button>
          )}
        </div>

        {loading && <p className="text-gray-600">Loading...</p>}

        {!loading && opportunities.length === 0 && (
          <p className="text-gray-600">
            No opportunities match your filters.
          </p>
        )}

        <div className="space-y-4">
          {opportunities.map((opp) => (
            <a
              key={opp.id}
              href={`/opportunities/${opp.id}`}
              className="block rounded-lg bg-white p-6 shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {opp.title}
                </h2>
                {opp.category && (
                  <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                    {opp.category}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                {opp.description}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {opp.country && `${opp.country} · `}
                Deadline: {new Date(opp.deadline).toLocaleDateString()}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}