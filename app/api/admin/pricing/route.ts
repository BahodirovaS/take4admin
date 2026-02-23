import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";
import { isValidAdminToken } from "../../../../lib/adminAuth";

export async function PUT(req: Request) {
  const token = req.headers.get("x-admin-token");
  if (!isValidAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const now = new Date().toISOString();

  const { error } = await supabaseServer
    .from("pricing_current")
    .update({
      base_price: body.basePrice,
      per_mile_rate: body.perMileRate,
      per_minute_rate: body.perMinuteRate,
      minimum_price: body.minimumPrice,
      fixed_pickup_time_minutes: body.fixedPickupTime,
      updated_at: now,
    })
    .eq("id", 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}