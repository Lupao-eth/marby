"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-900 text-white px-4 py-3 mb-4 rounded-md">
      <div className="flex items-center space-x-6">

        {/* BACK BUTTON */}
        <Link
          href="/"
          className="bg-red-600 hover:bg-red-700 transition px-3 py-1 rounded"
        >
          ← Back
        </Link>

        <Link
          href="/manage-places"
          className="hover:text-yellow-300 transition"
        >
          Manage Places
        </Link>

        <Link
          href="/manage-breads"
          className="hover:text-yellow-300 transition"
        >
          Manage Breads
        </Link>
      </div>
    </nav>
  );
}
