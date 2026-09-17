"use client";

import { useEffect, useState } from "react";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  deadline: string;
};

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOpportunities() {
      const res = await fetch("/api/opportunities");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setOpportunities(data.opportunities);
      setLoading(false);
    }

    fetchOpportunities();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Available Opportunities
        </h1>

        {opportunities.length === 0 && (
          <p className="text-gray-600">No opportunities available yet.</p>
        )}

        <div className="space-y-4">
          {opportunities.map((opp) => (
            <a
              key={opp.id}
              href={`/opportunities/${opp.id}`}
              className="block rounded-lg bg-white p-6 shadow hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {opp.title}
              </h2>
              <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                {opp.description}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Deadline: {new Date(opp.deadline).toLocaleDateString()}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}