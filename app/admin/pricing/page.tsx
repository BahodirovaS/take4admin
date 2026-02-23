"use client";

import { useEffect, useMemo, useState } from "react";

type Pricing = {
    basePrice: number;
    perMileRate: number;
    perMinuteRate: number;
    minimumPrice: number;
    fixedPickupTime: number;
};

function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-800">{label}</label>
            {children}
            {hint && <p className="text-xs text-zinc-500">{hint}</p>}
        </div>
    );
}

export default function PricingAdminPage() {
    const [token, setToken] = useState("");
    const [showToken, setShowToken] = useState(false);

    const [pricing, setPricing] = useState<Pricing | null>(null);
    const [status, setStatus] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            const res = await fetch("/api/pricing/current");
            const data = await res.json();
            setPricing(data);
        };
        load();
    }, []);

    const preview = useMemo(() => {
        if (!pricing) return null;

        // quick “typical ride” preview (optional)
        const exampleMiles = 3.2;
        const exampleMinutes = 12;
        const est =
            pricing.basePrice +
            pricing.perMileRate * exampleMiles +
            pricing.perMinuteRate * exampleMinutes;

        const total = Math.max(est, pricing.minimumPrice);
        return { total, exampleMiles, exampleMinutes };
    }, [pricing]);

    const save = async () => {
        if (!pricing) return;
        setStatus("");
        setSaving(true);

        try {
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
            setTimeout(() => setStatus(""), 1500);
        } catch (e: any) {
            setStatus(`Error: ${e?.message ?? "Request failed"}`);
        } finally {
            setSaving(false);
        }
    };

    if (!pricing) return <div className="p-6">Loading…</div>;

    const inputBase =
        "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-inner outline-none " +
        "text-zinc-900 placeholder:text-zinc-500 focus:border-[#3f7564] focus:ring-2 focus:ring-[#3f7564]/20";
    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="mx-auto w-full max-w-4xl p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-black">
                        Cabbage Admin
                    </h1>
                    <p className="text-sm text-zinc-800">Pricing</p>
                </div>

                {/* Token */}
                <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <div className="p-5">
                        <Field
                            label="Admin Token"
                        >
                            <div className="flex gap-2">
                                <input
                                    type={showToken ? "text" : "password"}
                                    className={`${inputBase} font-mono`}
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="Paste ADMIN_TOKEN here"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowToken((v) => !v)}
                                    className="rounded-xl border border-[#3f7564] text-[#3f7564] bg-white px-3 py-2 text-sm font-medium hover:bg-[#3f7564] hover:text-white transition-colors"
                                >
                                    {showToken ? "Hide" : "Show"}
                                </button>
                            </div>
                        </Field>
                    </div>
                </div>

                {/* Pricing form */}
                <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <div className="p-5 space-y-5">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field label="Base Price" hint="Flat fee added to every ride.">
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-zinc-700">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={`${inputBase} pl-7`}
                                        value={pricing.basePrice}
                                        onChange={(e) =>
                                            setPricing({ ...pricing, basePrice: Number(e.target.value) })
                                        }
                                    />
                                </div>
                            </Field>

                            {/* <Field label="Minimum Price" hint="Total charge will never be below this.">
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-zinc-700">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={`${inputBase} pl-7`}
                                        value={pricing.minimumPrice}
                                        onChange={(e) =>
                                            setPricing({ ...pricing, minimumPrice: Number(e.target.value) })
                                        }
                                    />
                                </div>
                            </Field> */}

                            <Field label="Per Mile Rate" hint="Applied to distance-driven miles.">
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-zinc-700">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={`${inputBase} pl-7`}
                                        value={pricing.perMileRate}
                                        onChange={(e) =>
                                            setPricing({ ...pricing, perMileRate: Number(e.target.value) })
                                        }
                                    />
                                </div>
                            </Field>

                            <Field label="Per Minute Rate" hint="Applied to ride duration minutes.">
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-zinc-700">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={`${inputBase} pl-7`}
                                        value={pricing.perMinuteRate}
                                        onChange={(e) =>
                                            setPricing({ ...pricing, perMinuteRate: Number(e.target.value) })
                                        }
                                    />
                                </div>
                            </Field>

                            {/* <div className="md:col-span-2">
                                <Field
                                    label="Fixed Pickup Time (minutes)"
                                    hint="Used in your fare calc as the baseline pickup time estimate."
                                >
                                    <input
                                        type="number"
                                        step="1"
                                        className={inputBase}
                                        value={pricing.fixedPickupTime}
                                        onChange={(e) =>
                                            setPricing({
                                                ...pricing,
                                                fixedPickupTime: Number(e.target.value),
                                            })
                                        }
                                    />
                                </Field>
                            </div> */}
                        </div>

                        {/* Optional preview */}
                        {preview && (
                            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                                <div className="font-medium text-zinc-900">Quick preview</div>
                                <div className="mt-1">
                                    Example ride ({preview.exampleMiles} mi, {preview.exampleMinutes} min) ≈{" "}
                                    <span className="font-semibold">
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        }).format(preview.total)}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <button
                                onClick={save}
                                disabled={!token || saving}
                                className={[
                                    "rounded-xl px-4 py-2 text-sm font-medium",
                                    !token || saving
                                        ? "bg-zinc-200 text-zinc-500"
                                        : "bg-[#3f7564] text-white hover:bg-[#2f5a4d]",
                                ].join(" ")}
                            >
                                {saving ? "Saving…" : "Save Pricing"}
                            </button>

                            {status && (
                                <div className="text-sm text-zinc-700">{status}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}