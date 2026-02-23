"use client";

import { useMemo, useState } from "react";

type Driver = {
  driver_id: string;
  name: string | null;
  email: string | null;
  is_active: boolean;
  status: string;
  last_ping_at: string | null;
  last_lat: number | null;
  last_lng: number | null;
};

function Badge({
  children,
  tone = "gray",
}: {
  children: React.ReactNode;
  tone?: "gray" | "green" | "yellow" | "red" | "blue";
}) {
  const tones: Record<string, string> = {
    gray: "bg-zinc-100 text-zinc-700 ring-zinc-200",
    green: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    yellow: "bg-amber-100 text-amber-900 ring-amber-200",
    red: "bg-rose-100 text-rose-900 ring-rose-200",
    blue: "bg-sky-100 text-sky-900 ring-sky-200",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        tones[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function statusTone(d: Driver): "green" | "yellow" | "red" | "gray" | "blue" {
  // tweak these mappings to your actual statuses
  const s = (d.status || "").toLowerCase();
  if (d.is_active || s.includes("active") || s.includes("online")) return "green";
  if (s.includes("pending") || s.includes("onboarding")) return "yellow";
  if (s.includes("banned") || s.includes("disabled") || s.includes("offline")) return "red";
  if (s.includes("idle")) return "blue";
  return "gray";
}

function fmtDate(v: string | null) {
  if (!v) return "-";
  const dt = new Date(v);
  if (Number.isNaN(dt.getTime())) return v;
  return dt.toLocaleString();
}

function fmtCoord(v: number | null) {
  return typeof v === "number" ? v.toFixed(5) : "-";
}

export default function DriversAdminPage() {
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return drivers;
    return drivers.filter((d) => {
      return (
        d.driver_id.toLowerCase().includes(q) ||
        (d.name ?? "").toLowerCase().includes(q) ||
        (d.email ?? "").toLowerCase().includes(q) ||
        (d.status ?? "").toLowerCase().includes(q)
      );
    });
  }, [drivers, query]);

  const loadDrivers = async () => {
    setStatus("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/drivers", {
        headers: { "x-admin-token": token },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setStatus(`Error: ${err.error ?? res.statusText}`);
        return;
      }

      const data = await res.json();
      setDrivers(data.drivers ?? []);
    } catch (e: any) {
      setStatus(`Error: ${e?.message ?? "Request failed"}`);
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied ✅");
      setTimeout(() => setStatus(""), 1200);
    } catch {
      setStatus("Could not copy");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto w-full max-w-6xl p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Cabbage Admin</h1>
            <p className="text-sm text-zinc-600">Drivers</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge tone={drivers.length ? "blue" : "gray"}>{drivers.length} total</Badge>
            <Badge tone={filtered.length !== drivers.length ? "yellow" : "gray"}>
              {filtered.length} shown
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="p-5 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-zinc-800">Admin Token</label>
                <div className="flex gap-2">
                  <input
                    type={showToken ? "text" : "password"}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 font-mono text-sm shadow-inner outline-none focus:border-zinc-400"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste ADMIN_TOKEN here"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken((v) => !v)}
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
                  >
                    {showToken ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-xs text-zinc-500">
                  Quick protection for now — we can swap this to Clerk later.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">Search</label>
                <input
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-inner outline-none focus:border-zinc-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="name, email, status, id…"
                />
                <button
                  onClick={loadDrivers}
                  disabled={!token || loading}
                  className={[
                    "w-full rounded-xl px-4 py-2 text-sm font-medium",
                    !token || loading
                      ? "bg-zinc-200 text-zinc-500"
                      : "bg-zinc-900 text-white hover:bg-zinc-800",
                  ].join(" ")}
                >
                  {loading ? "Loading…" : "Load Drivers"}
                </button>
              </div>
            </div>

            {status && (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
                {status}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-auto">
            <table className="min-w-[1050px] w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-zinc-200 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  <th className="py-3 px-4">Driver</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Ping</th>
                  <th className="py-3 px-4">Lat</th>
                  <th className="py-3 px-4">Lng</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {filtered.map((d, idx) => (
                  <tr
                    key={d.driver_id}
                    className={[
                      "border-b border-zinc-100",
                      idx % 2 === 0 ? "bg-white" : "bg-zinc-50/50",
                      "hover:bg-zinc-50",
                    ].join(" ")}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-zinc-900">
                            {d.name ?? "(no name)"}
                          </div>
                          <div className="mt-0.5 flex items-center gap-2">
                            <code className="text-xs text-zinc-600">{d.driver_id}</code>
                            <button
                              className="text-xs text-zinc-500 hover:text-zinc-900"
                              onClick={() => copy(d.driver_id)}
                              type="button"
                            >
                              Copy
                            </button>
                          </div>
                        </div>

                        {d.is_active ? <Badge tone="green">Active</Badge> : <Badge>Inactive</Badge>}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-zinc-800">{d.email ?? "-"}</td>

                    <td className="py-3 px-4">
                      <Badge tone={statusTone(d)}>{d.status || "unknown"}</Badge>
                    </td>

                    <td className="py-3 px-4 text-zinc-800">{fmtDate(d.last_ping_at)}</td>

                    <td className="py-3 px-4 font-mono text-xs text-zinc-700">
                      {fmtCoord(d.last_lat)}
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-zinc-700">
                      {fmtCoord(d.last_lng)}
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 px-4 text-center text-zinc-600">
                      <div className="mx-auto max-w-md space-y-2">
                        <div className="text-base font-medium text-zinc-800">
                          No drivers to show
                        </div>
                        <div className="text-sm">
                          {drivers.length === 0
                            ? "Once the driver app starts pinging, they’ll appear here."
                            : "Try clearing the search filter."}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-zinc-500">
          Tip: add server-side sorting later (by last_ping_at) if this list grows.
        </p>
      </div>
    </div>
  );
}