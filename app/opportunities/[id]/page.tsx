"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  organization: { name: string };
};

const statusOptions = [
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEW_SCHEDULED", label: "Interview Scheduled" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
];

export default function OpportunityDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("APPLIED");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function fetchOpportunity() {
      const res = await fetch(`/api/opportunities/${params.id}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setOpportunity(data.opportunity);
      setLoading(false);
    }

    async function checkSaved() {
      const res = await fetch("/api/saved-opportunities");
      if (!res.ok) return;
      const data = await res.json();
      const alreadySaved = data.saved.some(
        (s: { opportunity: { id: string } }) => s.opportunity.id === params.id
      );
      setIsSaved(alreadySaved);
    }

    fetchOpportunity();
    if (session?.user.role === "STUDENT") {
      checkSaved();
    }
  }, [params.id, session]);

  async function handleTrack() {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: params.id, status }),
    });

    setMessage(res.ok ? "Application tracked!" : "Something went wrong.");
  }

  async function handleToggleSave() {
    const res = await fetch("/api/saved-opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: params.id }),
    });

    if (res.ok) {
      const data = await res.json();
      setIsSaved(data.saved);
    }
  }

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!opportunity) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {opportunity.title}
          </h1>
          {session?.user.role === "STUDENT" && (
            <button
              onClick={handleToggleSave}
              className={`rounded border px-3 py-1.5 text-sm font-medium ${
                isSaved
                  ? "border-orange-600 bg-orange-50 text-orange-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {isSaved ? "★ Saved" : "☆ Save"}
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Posted by {opportunity.organization.name}
        </p>
        <p className="mt-4 whitespace-pre-wrap text-gray-700">
          {opportunity.description}
        </p>
        <p className="mt-4 text-sm font-medium text-gray-600">
          Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
        </p>

        {session?.user.role === "STUDENT" && (
          <div className="mt-6 border-t pt-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Track your application status
            </label>
            <p className="mb-2 text-xs text-gray-500">
              ScholMent Hub doesn&apos;t submit applications for you — apply
              directly with the provider, then track your progress here.
            </p>
            <div className="flex gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2 text-sm"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleTrack}
                className="rounded bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
              >
                Save Status
              </button>
            </div>
            {message && (
              <p className="mt-2 text-sm text-green-700">{message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}