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
  const [tab, setTab] = useState<"PENDING" | "APPROVED">("PENDING");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchOpportunities() {
    setLoading(true);
    const res = await fetch(`/api/admin/opportunities?status=${tab}`);
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
  }, [tab]);

  async function handleDecision(id: string, status: "APPROVED" | "REJECTED") {
    await fetch(`/api/admin/opportunities/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOpportunities();
  }

  async function handleWithdraw(id: string) {
    const confirmed = confirm(
      "Withdraw this opportunity? Students will no longer be able to see it."
    );
    if (!confirmed) return;

    await fetch(`/api/admin/opportunities/${id}`, { method: "DELETE" });
    fetchOpportunities();
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Manage Opportunities
        </h1>

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setTab("PENDING")}
            className={`rounded px-4 py-2 text-sm font-medium ${
              tab === "PENDING"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setTab("APPROVED")}
            className={`rounded px-4 py-2 text-sm font-medium ${
              tab === "APPROVED"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Approved (Live)
          </button>
        </div>

        {loading && <p className="text-gray-600">Loading...</p>}

        {!loading && opportunities.length === 0 && (
          <p className="text-gray-600">Nothing here.</p>
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
                {tab === "PENDING" && (
                  <>
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
                  </>
                )}
                {tab === "APPROVED" && (
                  <button
                    onClick={() => handleWithdraw(opp.id)}
                    className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}