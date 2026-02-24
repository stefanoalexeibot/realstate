import { verifyAdminStatus } from "@/lib/auth-utils";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await verifyAdminStatus();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: 401 });
        }

        const { id } = params;
        const supabase = createAdminClient();

        // 1. Get the owner to check for auth_id
        const { data: owner, error: fetchError } = await supabase
            .from("re_propietarios")
            .select("auth_id")
            .eq("id", id)
            .single();

        if (fetchError) throw fetchError;

        // 2. Delete from re_propietarios
        const { error: deleteError } = await supabase
            .from("re_propietarios")
            .delete()
            .eq("id", id);

        if (deleteError) throw deleteError;

        // Note: We don't automatically delete the Auth User to avoid accidental data loss 
        // and because it usually requires higher privileges/different service client flow.
        // The link is broken and the portal access is effectively revoked by deleting the record.

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Error deleting owner:", error);
        return NextResponse.json(
            { error: "Error al eliminar el propietario" },
            { status: 500 }
        );
    }
}
