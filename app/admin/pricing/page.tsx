"use client";

import { useEffect, useState } from "react";

type Pricing = {
  basePrice: number;
  perMileRate: number;
  perMinuteRate: number;
  minimumPrice: number;
  fixedPickupTime: number;
};

export default function PricingAdminPage() {
  const [token, setToken] = useState("");
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/pricing/current");
      const data = await res.json();
      setPricing(data);
    };
    load();
  }, []);

  const save = async () => {
    if (!pricing) return;

    setStatus("Saving...");

    const res = await fetch("/api/admin/pricing", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
      },
      body: JSON.stringify(pricing),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setStatus(`Error: ${err.error ?? res.statusText}`);
      return;
    }

    setStatus("Saved ✅");
  };

  if (!pricing) return <div className="p-6">Loading...</div>;

  const inputClass = "border rounded px-3 py-2 w-full";

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Cabbage Admin — Pricing</h1>

      <div className="space-y-2">
        <label className="text-sm font-medium">Admin Token</label>
        <input
          className={inputClass}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste ADMIN_TOKEN here"
        />
        <p className="text-xs opacity-70">
          (Quick protection for now — we can replace this with Clerk later.)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Base Price</label>
          <input
            type="number"
            step="0.01"
            className={inputClass}
            value={pricing.basePrice}
            onChange={(e) =>
              setPricing({ ...pricing, basePrice: Number(e.target.value) })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">Minimum Price</label>
          <input
            type="number"
            step="0.01"
            className={inputClass}
            value={pricing.minimumPrice}
            onChange={(e) =>
              setPricing({ ...pricing, minimumPrice: Number(e.target.value) })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">Per Mile Rate</label>
          <input
            type="number"
            step="0.01"
            className={inputClass}
            value={pricing.perMileRate}
            onChange={(e) =>
              setPricing({ ...pricing, perMileRate: Number(e.target.value) })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">Per Minute Rate</label>
          <input
            type="number"
            step="0.01"
            className={inputClass}
            value={pricing.perMinuteRate}
            onChange={(e) =>
              setPricing({ ...pricing, perMinuteRate: Number(e.target.value) })
            }
          />
        </div>

        <div className="col-span-2">
          <label className="text-sm font-medium">
            Fixed Pickup Time (minutes)
          </label>
          <input
            type="number"
            step="1"
            className={inputClass}
            value={pricing.fixedPickupTime}
            onChange={(e) =>
              setPricing({
                ...pricing,
                fixedPickupTime: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      <button onClick={save} className="rounded bg-black text-white px-4 py-2">
        Save Pricing
      </button>

      {status && <div className="text-sm">{status}</div>}
    </div>
  );
}