"use client";

import { useEffect, useState } from "react";

type MentorRequest = {
  id: string;
  status: string;
  mentor: { name: string };
  essays: { id: string; content: string; feedback: string | null }[];
};

export default function MyMentorshipsPage() {
  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [essayDrafts, setEssayDrafts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function fetchRequests() {
    const res = await fetch("/api/mentorship-requests");
    const data = await res.json();
    setRequests(data.requests || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function handleSubmitEssay(requestId: string) {
    const content = essayDrafts[requestId];
    if (!content) return;

    const res = await fetch("/api/essays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, content }),
    });

    if (res.ok) {
      setMessage("Essay submitted!");
      setEssayDrafts({ ...essayDrafts, [requestId]: "" });
      fetchRequests();
    } else {
      setMessage("Something went wrong.");
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

              {req.essays.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {req.essays.map((essay) => (
                    <div key={essay.id} className="rounded bg-gray-50 p-3">
                      <p className="text-sm text-gray-700">
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
              ) : (
                <div className="mt-3">
                  <textarea
                    rows={4}
                    placeholder="Paste your essay here for review..."
                    value={essayDrafts[req.id] || ""}
                    onChange={(e) =>
                      setEssayDrafts({
                        ...essayDrafts,
                        [req.id]: e.target.value,
                      })
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
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}