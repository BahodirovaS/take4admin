"use client";

import { useState } from "react";

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

export default function DriversAdminPage() {
  const [token, setToken] = useState("");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [status, setStatus] = useState("");

  const loadDrivers = async () => {
    setStatus("Loading...");

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
    setStatus("");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Cabbage Admin — Drivers</h1>

      <div className="max-w-md space-y-2">
        <label className="text-sm font-medium">Admin Token</label>
        <input
          className="border rounded px-3 py-2 w-full"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste ADMIN_TOKEN here"
        />

        <button
          onClick={loadDrivers}
          className="rounded bg-black text-white px-4 py-2"
        >
          Load Drivers
        </button>

        {status && <div className="text-sm">{status}</div>}
      </div>

      <div className="overflow-auto">
        <table className="min-w-[1000px] border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Driver</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Last Ping</th>
              <th className="py-2 pr-4">Lat</th>
              <th className="py-2 pr-4">Lng</th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((d) => (
              <tr key={d.driver_id} className="border-b">
                <td className="py-2 pr-4">
                  <div className="font-medium">{d.name ?? "(no name)"}</div>
                  <div className="text-xs opacity-70">{d.driver_id}</div>
                </td>

                <td className="py-2 pr-4">{d.email ?? "-"}</td>
                <td className="py-2 pr-4">{d.status}</td>

                <td className="py-2 pr-4">
                  {d.last_ping_at
                    ? new Date(d.last_ping_at).toLocaleString()
                    : "-"}
                </td>

                <td className="py-2 pr-4">
                  {typeof d.last_lat === "number" ? d.last_lat.toFixed(5) : "-"}
                </td>

                <td className="py-2 pr-4">
                  {typeof d.last_lng === "number" ? d.last_lng.toFixed(5) : "-"}
                </td>
              </tr>
            ))}

            {drivers.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 opacity-70">
                  No drivers yet. Once the driver app starts pinging, they’ll appear here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}