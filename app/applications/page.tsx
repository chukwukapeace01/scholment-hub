"use client";

import { useEffect, useState } from "react";

type Application = {
  id: string;
  status: string;
  opportunity: { title: string; deadline: string };
};

const statusLabels: Record<string, string> = {
  APPLIED: "Applied",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

const statusColors: Record<string, string> = {
  APPLIED: "bg-blue-100 text-blue-700",
  INTERVIEW_SCHEDULED: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchApplications() {
    const res = await fetch("/api/applications");
    const data = await res.json();
    setApplications(data.applications || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          My Applications
        </h1>

        {applications.length === 0 && (
          <p className="text-gray-600">
            You haven&apos;t tracked any applications yet. Visit an
            opportunity&apos;s details page to start tracking one.
          </p>
        )}

        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="rounded-lg bg-white p-6 shadow">
              <h2 className="font-semibold text-gray-900">
                {app.opportunity.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Deadline:{" "}
                {new Date(app.opportunity.deadline).toLocaleDateString()}
              </p>
              <span
                className={`mt-2 inline-block rounded px-2 py-1 text-xs font-medium ${
                  statusColors[app.status]
                }`}
              >
                {statusLabels[app.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}