"use client";

import { useEffect, useState } from "react";

type Request = {
  id: string;
  status: string;
  student: { name: string; email: string };
};

export default function MentorshipRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRequests() {
    const res = await fetch("/api/mentorship-requests");
    const data = await res.json();
    setRequests(data.requests || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function handleDecision(id: string, status: "ACCEPTED" | "DECLINED") {
    await fetch(`/api/mentorship-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchRequests();
  }

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;

  const pending = requests.filter((r) => r.status === "PENDING");
  const resolved = requests.filter((r) => r.status !== "PENDING");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Mentorship Requests
        </h1>

        {pending.length === 0 && (
          <p className="mb-6 text-gray-600">No pending requests.</p>
        )}

        <div className="space-y-4">
          {pending.map((req) => (
            <div key={req.id} className="rounded-lg bg-white p-6 shadow">
            <h2 className="font-semibold text-gray-900">
                {req.student?.name || "Unknown student"}
            </h2>
            <p className="text-sm text-gray-500">{req.student?.email || ""}</p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleDecision(req.id, "ACCEPTED")}
                  className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDecision(req.id, "DECLINED")}
                  className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>

        {resolved.length > 0 && (
          <>
            <h2 className="mb-3 mt-8 text-lg font-semibold text-gray-900">
              Past Requests
            </h2>
            <div className="space-y-2">
              {resolved.map((req) => (
                <div
                  key={req.id}
                  className="rounded-lg bg-white p-4 text-sm shadow"
                >
                  {req.student.name} —{" "}
                  <span className="font-medium">{req.status}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}