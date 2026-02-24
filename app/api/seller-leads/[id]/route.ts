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

        const { error } = await supabase
            .from("re_seller_leads")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Error deleting lead:", error);
        return NextResponse.json(
            { error: "Error al eliminar el lead" },
            { status: 500 }
        );
    }
}
