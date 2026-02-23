import { NextResponse } from "next/server";
import { isValidAdminToken } from "../../../../lib/adminAuth";
import { firestoreAdmin } from "../../../../lib/firebaseAdmin";

type DriverRow = {
  driver_id: string;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  availability: "online" | "offline";
  last_seen_at: string | null;
};

function toIso(v: any): string | null {
  if (!v) return null;
  if (typeof v?.toDate === "function") return v.toDate().toISOString();
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "string") return v;
  return null;
}

function pickLastSeen(d: any): string | null {
  return (
    toIso(d.last_location_at) ??
    toIso(d.last_checked) ??
    toIso(d.last_online) ??
    toIso(d.last_offline) ??
    toIso(d.updatedAt) ??
    toIso(d.createdAt) ??
    null
  );
}

function deriveAvailability(d: any): "online" | "offline" {
  const on = d.last_online?.toDate?.() ?? (d.last_online instanceof Date ? d.last_online : null);
  const off = d.last_offline?.toDate?.() ?? (d.last_offline instanceof Date ? d.last_offline : null);

  if (on && off) return on.getTime() >= off.getTime() ? "online" : "offline";
  if (on && !off) return "online";
  if (!on && off) return "offline";

  if (typeof d.status === "boolean") return d.status ? "online" : "offline";

  return "offline";
}

export async function GET(req: Request) {
  const token = req.headers.get("x-admin-token");
  if (!isValidAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snap = await firestoreAdmin.collection("drivers").get();

  const drivers: DriverRow[] = snap.docs.map((docSnap) => {
    const d: any = docSnap.data();

    const fullName = `${d.firstName ?? ""} ${d.lastName ?? ""}`.trim();

    return {
      driver_id: d.clerkId ?? docSnap.id,
      name: fullName || null,
      email: d.email ?? null,
      phone_number: d.phoneNumber ?? null,
      availability: deriveAvailability(d),
      last_seen_at: pickLastSeen(d),
    };
  });

  drivers.sort((a, b) => (b.last_seen_at ?? "").localeCompare(a.last_seen_at ?? ""));

  return NextResponse.json({ drivers });
}