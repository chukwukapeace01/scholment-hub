"use client";

import { useEffect, useState } from "react";

type Essay = {
  id: string;
  content: string;
  feedback: string | null;
  request: { student: { name: string } };
};

export default function EssaysReviewPage() {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function fetchEssays() {
    const res = await fetch("/api/essays");
    const data = await res.json();
    setEssays(data.essays || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchEssays();
  }, []);

  async function handleSubmitFeedback(essayId: string) {
    const feedback = drafts[essayId];
    if (!feedback) return;

    const res = await fetch(`/api/essays/${essayId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback }),
    });

    if (res.ok) {
      setMessage("Feedback submitted!");
      fetchEssays();
    } else {
      setMessage("Something went wrong.");
    }
  }

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Essays for Review
        </h1>

        {message && <p className="mb-4 text-sm text-green-700">{message}</p>}

        {essays.length === 0 && (
          <p className="text-gray-600">No essays submitted yet.</p>
        )}

        <div className="space-y-6">
          {essays.map((essay) => (
            <div key={essay.id} className="rounded-lg bg-white p-6 shadow">
              <h2 className="font-semibold text-gray-900">
                From: {essay.request.student.name}
              </h2>
              <p className="mt-2 rounded bg-gray-50 p-3 text-sm text-gray-700">
                {essay.content}
              </p>

              {essay.feedback ? (
                <p className="mt-3 text-sm text-green-700">
                  <strong>Your feedback:</strong> {essay.feedback}
                </p>
              ) : (
                <div className="mt-3">
                  <textarea
                    rows={3}
                    placeholder="Write your feedback..."
                    value={drafts[essay.id] || ""}
                    onChange={(e) =>
                      setDrafts({ ...drafts, [essay.id]: e.target.value })
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSubmitFeedback(essay.id)}
                    className="mt-2 rounded bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                  >
                    Submit Feedback
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