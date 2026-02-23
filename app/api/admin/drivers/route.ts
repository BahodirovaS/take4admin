import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";
import { isValidAdminToken } from "../../../../lib/adminAuth";

export async function GET(req: Request) {
  const token = req.headers.get("x-admin-token");
  if (!isValidAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseServer
    .from("drivers")
    .select("driver_id,name,email,is_active,status,last_ping_at,last_lat,last_lng")
    .order("last_ping_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ drivers: data ?? [] });
}

export async function PATCH(req: Request) {
  const token = req.headers.get("x-admin-token");
  if (!isValidAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const driverId = body.driverId as string;
  const isActive = body.isActive as boolean;

  if (!driverId || typeof isActive !== "boolean") {
    return NextResponse.json(
      { error: "driverId and isActive required" },
      { status: 400 }
    );
  }

  const { error } = await supabaseServer
    .from("drivers")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("driver_id", driverId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}