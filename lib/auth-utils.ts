import { createClient } from "./supabase/server";

export type UserRole = "admin" | "agent" | "owner" | null;

/**
 * Verifies if the current user has admin or agent privileges.
 * Used at the beginning of API routes that perform mutations.
 */
export async function verifyAdminStatus() {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { authorized: false, error: "No autenticado" };
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        return { authorized: false, error: "Perfil no encontrado" };
    }

    const isAuthorized = ["admin", "agent"].includes(profile.role);

    return {
        authorized: isAuthorized,
        user,
        role: profile.role as UserRole,
        error: isAuthorized ? null : "No autorizado: se requiere rol de admin o agente"
    };
}

/**
 * Verifies if the current user is the owner of a specific resource or an admin.
 */
export async function verifyOwnerOrAdmin(propietarioId: string) {
    const auth = await verifyAdminStatus();

    // If already an admin/agent, they can manage everything
    if (auth.authorized) return auth;

    // Otherwise, check if they are the specific owner
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { authorized: false, error: "No autenticado" };

    const { data: owner } = await supabase
        .from("re_propietarios")
        .select("id")
        .eq("auth_id", user.id)
        .eq("id", propietarioId)
        .maybeSingle();

    const isOwner = !!owner;

    return {
        authorized: isOwner,
        user,
        role: "owner" as UserRole,
        error: isOwner ? null : "No autorizado: no eres el dueño de este recurso"
    };
}
