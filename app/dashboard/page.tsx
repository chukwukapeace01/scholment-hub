import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { name, role } = session.user;

  const roleLabels: Record<string, string> = {
    STUDENT: "Student",
    MENTOR: "Mentor",
    ORGANIZATION: "Organization",
    ADMIN: "Administrator",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-6 shadow">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {name}
            </h1>
            <p className="text-sm text-gray-600">
              Role: {roleLabels[role] || role}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          {role === "STUDENT" && (
            <p className="text-gray-700">
              Student dashboard — search opportunities, track applications,
              and manage mentorship requests here.
            </p>
          )}
          {role === "MENTOR" && (
            <p className="text-gray-700">
              Mentor dashboard — review mentorship requests, essays, and
              provide feedback here.
            </p>
          )}
          {role === "ORGANIZATION" && (
            <p className="text-gray-700">
              Organization dashboard — submit and manage opportunities here.
            </p>
          )}
          {role === "ADMIN" && (
            <p className="text-gray-700">
              Administrator dashboard — approve opportunities and manage
              users here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}