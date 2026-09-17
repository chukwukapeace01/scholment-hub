"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewOpportunityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Submit a New Opportunity
        </h1>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded bg-green-50 p-3 text-sm text-green-700">
            Opportunity submitted successfully! Awaiting administrator
            approval. Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Application Deadline
            </label>
            <input
              type="date"
              name="deadline"
              required
              value={formData.deadline}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-orange-600 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Opportunity"}
          </button>
        </form>
      </div>
    </div>
  );
}