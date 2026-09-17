"use client";

import { useEffect, useState } from "react";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  organization: { name: string; email: string };
};

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchOpportunities() {
    setLoading(true);
    const res = await fetch("/api/admin/opportunities");
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
  }, []);

  async function handleDecision(id: string, status: "APPROVED" | "REJECTED") {
    const res = await fetch(`/api/admin/opportunities/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setOpportunities((prev) => prev.filter((opp) => opp.id !== id));
    }
  }

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
          Pending Opportunities
        </h1>

        {opportunities.length === 0 && (
          <p className="text-gray-600">No opportunities awaiting review.</p>
        )}

        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div key={opp.id} className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-semibold text-gray-900">
                {opp.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Submitted by {opp.organization.name} ({opp.organization.email})
              </p>
              <p className="mt-3 text-sm text-gray-700">{opp.description}</p>
              <p className="mt-2 text-sm text-gray-500">
                Deadline: {new Date(opp.deadline).toLocaleDateString()}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleDecision(opp.id, "APPROVED")}
                  className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(opp.id, "REJECTED")}
                  className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}