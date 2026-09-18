"use client";

import { useEffect, useState } from "react";

type Opportunity = { id: string; title: string };

type MentorRequest = {
  id: string;
  status: string;
  mentor: { name: string };
  essays: {
    id: string;
    content: string;
    feedback: string | null;
    opportunity: { title: string };
  }[];
};

export default function MyMentorshipsPage() {
  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
    const [drafts, setDrafts] = useState<Record<string, { opportunityId: string; content: string }>>({});
  const [message, setMessage] = useState("");

  async function fetchRequests() {
    const res = await fetch("/api/mentorship-requests");
    const data = await res.json();
    setRequests(data.requests || []);
    setLoading(false);
  }

  async function fetchOpportunities() {
    const res = await fetch("/api/opportunities");
    const data = await res.json();
    setOpportunities(data.opportunities || []);
  }

  useEffect(() => {
    fetchRequests();
    fetchOpportunities();
  }, []);

  function updateDraft(
    requestId: string,
    field: "opportunityId" | "content",
    value: string
  ) {
    setDrafts({
      ...drafts,
      [requestId]: {
        opportunityId: drafts[requestId]?.opportunityId || "",
        content: drafts[requestId]?.content || "",
        [field]: value,
      },
    });
  }

  async function handleSubmitEssay(requestId: string) {
    const draft = drafts[requestId];
    if (!draft?.opportunityId || !draft?.content) {
      setMessage("Please select an opportunity and write your essay.");
      return;
    }

    const res = await fetch("/api/essays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestId,
        opportunityId: draft.opportunityId,
        content: draft.content,
      }),
    });

    if (res.ok) {
      setMessage("Essay submitted!");
      fetchRequests();
    } else {
      const data = await res.json();
      setMessage(data.error || "Something went wrong.");
    }
  }

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;

  const accepted = requests.filter((r) => r.status === "ACCEPTED");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          My Mentorships
        </h1>

        {message && <p className="mb-4 text-sm text-green-700">{message}</p>}

        {accepted.length === 0 && (
          <p className="text-gray-600">
            No accepted mentorships yet. Request one from the Mentors page.
          </p>
        )}

        <div className="space-y-6">
          {accepted.map((req) => (
            <div key={req.id} className="rounded-lg bg-white p-6 shadow">
              <h2 className="font-semibold text-gray-900">
                Mentor: {req.mentor.name}
              </h2>

              {req.essays.length > 0 && (
                <div className="mt-3 space-y-3">
                  {req.essays.map((essay) => (
                    <div key={essay.id} className="rounded bg-gray-50 p-3">
                      <p className="text-xs font-medium text-orange-700">
                        For: {essay.opportunity.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-700">
                        <strong>Your essay:</strong> {essay.content}
                      </p>
                      <p className="mt-2 text-sm">
                        <strong>Mentor feedback:</strong>{" "}
                        {essay.feedback || (
                          <span className="text-gray-400">
                            Awaiting feedback...
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 border-t pt-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Submit an essay for a specific opportunity
                </label>
                <select
                  value={drafts[req.id]?.opportunityId || ""}
                  onChange={(e) =>
                    updateDraft(req.id, "opportunityId", e.target.value)
                  }
                  className="mb-2 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">-- Select an opportunity --</option>
                  {opportunities.map((opp) => (
                    <option key={opp.id} value={opp.id}>
                      {opp.title}
                    </option>
                  ))}
                </select>
                <textarea
                  rows={4}
                  placeholder="Paste your essay here for review..."
                  value={drafts[req.id]?.content || ""}
                  onChange={(e) =>
                    updateDraft(req.id, "content", e.target.value)
                  }
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                />
                <button
                  onClick={() => handleSubmitEssay(req.id)}
                  className="mt-2 rounded bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  Submit Essay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}