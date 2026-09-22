"use client";

import { useEffect, useState } from "react";

type Resource = {
  id: string;
  title: string;
  description: string;
  link: string;
};

export default function ManageLearningResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
  });
  const [error, setError] = useState("");

  async function fetchResources() {
    const res = await fetch("/api/learning-resources");
    const data = await res.json();
    setResources(data.resources || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchResources();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/learning-resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      return;
    }

    setFormData({ title: "", description: "", link: "" });
    fetchResources();
  }

  async function handleDelete(id: string) {
    const confirmed = confirm("Remove this resource?");
    if (!confirmed) return;

    await fetch(`/api/learning-resources/${id}`, { method: "DELETE" });
    fetchResources();
  }

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Manage Learning Resources
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-3 rounded-lg bg-white p-6 shadow"
        >
          <h2 className="font-semibold text-gray-900">Add New Resource</h2>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <input
            type="text"
            name="title"
            placeholder="Title (e.g. CV Writing Guide)"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
          <textarea
            name="description"
            placeholder="Short description"
            required
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="url"
            name="link"
            placeholder="https://..."
            required
            value={formData.link}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
          >
            Add Resource
          </button>
        </form>

        <div className="space-y-3">
          {resources.map((r) => (
            <div
              key={r.id}
              className="flex items-start justify-between rounded-lg bg-white p-4 shadow"
            >
              <div>
                <h3 className="font-medium text-gray-900">{r.title}</h3>
                <p className="text-sm text-gray-600">{r.description}</p>
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange-600 hover:underline"
                >
                  {r.link}
                </a>
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}