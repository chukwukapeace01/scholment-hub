"use client";

import { useEffect, useState } from "react";

type Mentor = {
  id: string;
  name: string;
  email: string;
};

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ id: string; text: string } | null>(
    null
  );

  useEffect(() => {
    async function fetchMentors() {
      const res = await fetch("/api/mentors");
      const data = await res.json();
      setMentors(data.mentors || []);
      setLoading(false);
    }
    fetchMentors();
  }, []);

  async function handleRequest(mentorId: string) {
    const res = await fetch("/api/mentorship-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mentorId }),
    });
    const data = await res.json();

    setMessage({
      id: mentorId,
      text: res.ok ? "Request sent!" : data.error || "Something went wrong.",
    });
  }

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Find a Mentor
        </h1>

        {mentors.length === 0 && (
          <p className="text-gray-600">No mentors available yet.</p>
        )}

        <div className="space-y-4">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="flex items-center justify-between rounded-lg bg-white p-6 shadow"
            >
              <div>
                <h2 className="font-semibold text-gray-900">
                  {mentor.name}
                </h2>
                <p className="text-sm text-gray-500">{mentor.email}</p>
              </div>
              <div className="text-right">
                <button
                  onClick={() => handleRequest(mentor.id)}
                  className="rounded bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  Request Mentorship
                </button>
                {message?.id === mentor.id && (
                  <p className="mt-1 text-xs text-gray-600">{message.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}