"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  organization: { name: string };
};

export default function OpportunityDetailPage() {
  const params = useParams();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    fetchOpportunity();
  }, [params.id]);

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!opportunity) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-gray-900">
          {opportunity.title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Posted by {opportunity.organization.name}
        </p>
        <p className="mt-4 whitespace-pre-wrap text-gray-700">
          {opportunity.description}
        </p>
        <p className="mt-4 text-sm font-medium text-gray-600">
          Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}