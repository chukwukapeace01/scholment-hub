"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (!session) {
    return (
      <nav className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <Link href="/" className="font-bold text-orange-600">
          ScholMent Hub
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/login" className="text-gray-700 hover:text-orange-600">
            Log In
          </Link>
          <Link
            href="/register"
            className="rounded bg-orange-600 px-3 py-1.5 text-white hover:bg-orange-700"
          >
            Register
          </Link>
        </div>
      </nav>
    );
  }

  const role = session.user.role;

  const linksByRole: Record<string, { href: string; label: string }[]> = {
    STUDENT: [
      { href: "/opportunities", label: "Opportunities" },
      { href: "/mentors", label: "Find a Mentor" },
      { href: "/my-mentorships", label: "My Mentorships" },
    ],
    MENTOR: [
      { href: "/mentorship-requests", label: "Requests" },
      { href: "/essays", label: "Review Essays" },
    ],
    ORGANIZATION: [
      { href: "/opportunities/new", label: "Submit Opportunity" },
    ],
    ADMIN: [
      { href: "/admin/opportunities", label: "Manage Opportunities" },
      { href: "/admin/users", label: "Manage Users" },
    ],
  };

  const links = linksByRole[role] || [];

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-4 shadow">
      <Link href="/dashboard" className="font-bold text-orange-600">
        ScholMent Hub
      </Link>
      <div className="flex items-center gap-5 text-sm">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-gray-700 hover:text-orange-600"
          >
            {link.label}
          </Link>
        ))}
        <Link href="/dashboard" className="text-gray-700 hover:text-orange-600">
          Dashboard
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-100"
        >
          Log Out
        </button>
      </div>
    </nav>
  );
}