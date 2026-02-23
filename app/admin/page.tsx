"use client";

import Link from "next/link";

function Card({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <h2 className="text-lg font-semibold text-black">{title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{description}</p>
      <div className="mt-4 text-sm font-medium text-zinc-900">
        Go →
      </div>
    </Link>
  );
}

export default function AdminHomePage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto w-full max-w-4xl p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-black">
            Cabbage Admin
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Manage pricing and drivers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card
            title="Pricing"
            description="Adjust base price, per-mile rate, per-minute rate, and minimum fare."
            href="/admin/pricing"
          />

          <Card
            title="Drivers"
            description="View driver details, availability, and contact information."
            href="/admin/drivers"
          />
        </div>
      </div>
    </div>
  );
}