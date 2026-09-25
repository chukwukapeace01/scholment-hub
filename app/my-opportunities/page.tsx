"use client";

import { useEffect, useState } from "react";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  category: string | null;
  country: string | null;
  status: string;
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function MyOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    category: "",
    country: "",
  });
  const [message, setMessage] = useState("");

  async function fetchOpportunities() {
    const res = await fetch("/api/opportunities");
    const data = await res.json();
    setOpportunities(data.opportunities || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchOpportunities();
  }, []);

  function startEdit(opp: Opportunity) {
    setEditingId(opp.id);
    setFormData({
      title: opp.title,
      description: opp.description,
      deadline: opp.deadline.slice(0, 10),
      category: opp.category || "",
      country: opp.country || "",
    });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleUpdate(id: string) {
    const res = await fetch(`/api/opportunities/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage("Updated! It's back under review before going live again.");
      setEditingId(null);
      fetchOpportunities();
    } else {
      setMessage("Something went wrong.");
    }
  }

  async function handleWithdraw(id: string) {
    const confirmed = confirm(
      "Withdraw this opportunity? It will be removed permanently."
    );
    if (!confirmed) return;

    await fetch(`/api/opportunities/${id}`, { method: "DELETE" });
    fetchOpportunities();
  }

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          My Opportunities
        </h1>

        {message && <p className="mb-4 text-sm text-green-700">{message}</p>}

        {opportunities.length === 0 && (
          <p className="text-gray-600">
            You haven&apos;t submitted any opportunities yet.
          </p>
        )}

        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div key={opp.id} className="rounded-lg bg-white p-6 shadow">
              {editingId === opp.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="rounded border border-gray-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="rounded border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(opp.id)}
                      className="rounded bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {opp.title}
                    </h2>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        statusColors[opp.status]
                      }`}
                    >
                      {opp.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">
                    {opp.description}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Deadline:{" "}
                    {new Date(opp.deadline).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => startEdit(opp)}
                      className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleWithdraw(opp.id)}
                      className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                    >
                      Withdraw
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}