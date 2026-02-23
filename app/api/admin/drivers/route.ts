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
