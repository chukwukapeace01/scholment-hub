"use client";

import { useEffect, useState } from "react";

type Saved = {
  id: string;
  opportunity: {
    id: string;
    title: string;
    description: string;
    deadline: string;
  };
};

export default function SavedOpportunitiesPage() {
  const [saved, setSaved] = useState<Saved[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      const res = await fetch("/api/saved-opportunities");
      const data = await res.json();
      setSaved(data.saved || []);
      setLoading(false);
    }
    fetchSaved();
  }, []);

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Saved Opportunities
        </h1>

        {saved.length === 0 && (
          <p className="text-gray-600">
            You haven&apos;t saved any opportunities yet.
          </p>
        )}

        <div className="space-y-4">
          {saved.map((s) => (
            <a
              key={s.id}
              href={`/opportunities/${s.opportunity.id}`}
              className="block rounded-lg bg-white p-6 shadow hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {s.opportunity.title}
              </h2>
              <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                {s.opportunity.description}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Deadline:{" "}
                {new Date(s.opportunity.deadline).toLocaleDateString()}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}