import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("pricing_current")
    .select(
      "base_price, per_mile_rate, per_minute_rate, minimum_price, fixed_pickup_time_minutes"
    )
    .eq("id", 1)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "No pricing found" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    basePrice: Number(data.base_price),
    perMileRate: Number(data.per_mile_rate),
    perMinuteRate: Number(data.per_minute_rate),
    minimumPrice: Number(data.minimum_price),
    fixedPickupTime: Number(data.fixed_pickup_time_minutes),
  });
}