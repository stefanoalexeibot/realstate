import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, name, phone, property_id, temp_password } = await req.json();
    if (!email || !name || !temp_password) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const adminClient = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Create auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password: temp_password,
      email_confirm: true,
    });

    if (authError && !authError.message.includes("already registered")) {
      throw authError;
    }

    const authId = authData?.user?.id;

    // Upsert re_propietarios
    const { data: prop, error: propError } = await adminClient
      .from("re_propietarios")
      .upsert({ email, name, phone: phone || null, auth_id: authId }, { onConflict: "email" })
      .select()
      .single();

    if (propError) throw propError;

    // Link property
    if (property_id && prop?.id) {
      await adminClient
        .from("re_properties")
        .update({ propietario_id: prop.id })
        .eq("id", property_id);
    }

    return NextResponse.json({ ok: true, propietario_id: prop?.id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
