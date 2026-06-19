import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();

  if (!payload.name || !payload.contact || !payload.interestPack || !payload.priceRange || payload.consent !== true) {
    return NextResponse.json(
      { ok: false, error: "Required fields are missing." },
      { status: 400 },
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseSecretKey);

  const { error } = await supabase.from("leads").insert({
    name: payload.name,
    contact: payload.contact,
    interest_pack: payload.interestPack,
    interest_pack_label: payload.interestPackLabel,
    price_range: payload.priceRange,
    items: payload.items ?? [],
    concern: payload.concern ?? "",
    consent: payload.consent,
    recommended_pack: payload.recommendedPack,
    recommended_pack_label: payload.recommendedPackLabel,
    diagnosis_answers: payload.diagnosisAnswers ?? {},
    source: "gg-landing-v0.1",
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}