"use client";

import { useEffect, useState } from "react";

type Resource = {
  id: string;
  title: string;
  description: string;
  link: string;
};

export default function LearningResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      const res = await fetch("/api/learning-resources");
      const data = await res.json();
      setResources(data.resources || []);
      setLoading(false);
    }
    fetchResources();
  }, []);

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Learning Resources
        </h1>

        {resources.length === 0 && (
          <p className="text-gray-600">No resources available yet.</p>
        )}

        <div className="space-y-3">
          {resources.map((r) => (
            <a
              key={r.id}
              href={r.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg bg-white p-4 shadow hover:shadow-md transition"
            >
              <h3 className="font-medium text-gray-900">{r.title}</h3>
              <p className="text-sm text-gray-600">{r.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}