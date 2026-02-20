import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const REC_FACTOR: Record<string, number> = {
  "1": 0.88, "2": 0.95, "3": 1.0, "4": 1.08, "5+": 1.16,
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const zona      = searchParams.get("zona") ?? "";
  const m2        = Number(searchParams.get("m2") ?? "0");
  const recamaras = searchParams.get("recamaras") ?? "3";

  if (!zona || m2 < 20) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  const supabase = createClient();

  // Try exact zona first, then fallback to full catalog
  let { data: props } = await supabase
    .from("re_properties")
    .select("price, area_m2")
    .eq("status", "active")
    .eq("operation_type", "venta")
    .ilike("neighborhood", `%${zona.split(" ")[0]}%`)
    .gt("area_m2", 0)
    .gt("price", 0);

  // Fallback: use all active sale properties
  if (!props || props.length < 2) {
    const { data: all } = await supabase
      .from("re_properties")
      .select("price, area_m2")
      .eq("status", "active")
      .eq("operation_type", "venta")
      .gt("area_m2", 0)
      .gt("price", 0);
    props = all;
  }

  const comps = props?.length ?? 0;

  // Weighted average price per m²
  let pricePerM2 = 45_000; // safe MX default (MXN/m²)
  if (props && props.length > 0) {
    const totalPrice = props.reduce((s, p) => s + p.price, 0);
    const totalM2    = props.reduce((s, p) => s + p.area_m2, 0);
    pricePerM2 = totalM2 > 0 ? totalPrice / totalM2 : pricePerM2;
  }

  const factor   = REC_FACTOR[recamaras] ?? 1.0;
  const estimate = Math.round((pricePerM2 * m2 * factor) / 10_000) * 10_000;
  const low      = Math.round(estimate * 0.88 / 10_000) * 10_000;
  const high     = Math.round(estimate * 1.12 / 10_000) * 10_000;

  return NextResponse.json({ estimate, low, high, comps, zona });
}
