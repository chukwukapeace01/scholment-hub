import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-6 py-20 text-center">
      <h1 className="max-w-2xl text-4xl font-bold text-gray-900 sm:text-5xl">
        Access to Scholarships, Mentorship, and Education —{" "}
        <span className="text-orange-600">Made Simple</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-gray-600">
        ScholMent Hub connects young Africans with
        verified scholarships, dedicated mentors, and the support needed to
        turn opportunities into success.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/register"
          className="rounded bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="rounded border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
        >
          Log In
        </Link>
      </div>

      <div className="mt-16 grid max-w-4xl grid-cols-1 gap-8 text-left sm:grid-cols-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            Verified Opportunities
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Search and track scholarships, internships, and grants — all
            reviewed before publishing.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Real Mentorship</h3>
          <p className="mt-2 text-sm text-gray-600">
            Connect with mentors who review your essays and guide your
            application.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            One Place, Start to Finish
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Track applications, get feedback, and access resources — all in
            one platform.
          </p>
        </div>
      </div>
    </div>
  );
}