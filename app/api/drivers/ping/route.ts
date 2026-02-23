import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";

type Body = {
    driverId: string;
    name?: string;
    email?: string;
    phone_number?: string;
    phoneNumber?: string;
    lat?: number;
    lng?: number;
    status?: "offline" | "available" | "on_trip";
};

export async function POST(req: Request) {
    const body = (await req.json()) as Body;

    if (!body.driverId) {
        return NextResponse.json({ error: "driverId is required" }, { status: 400 });
    }

    const now = new Date().toISOString();

    const { error } = await supabaseServer.from("drivers").upsert(
        {
            driver_id: body.driverId,
            name: body.name ?? null,
            email: body.email ?? null,
            phone_number: body.phone_number ?? body.phoneNumber ?? null,
            status: body.status ?? "offline",
            last_lat: body.lat ?? null,
            last_lng: body.lng ?? null,
            last_ping_at: now,
            updated_at: now,
        },
        { onConflict: "driver_id" }
    );

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}