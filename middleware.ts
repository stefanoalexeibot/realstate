import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({ request });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase env vars in middleware");
      return supabaseResponse;
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    const path = request.nextUrl.pathname;

    // ── Admin routes ──────────────────────────────────
    if (path.startsWith("/admin") && path !== "/admin/login") {
      if (!user) return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (path === "/admin/login" && user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // ── Portal routes (propietarios) ─────────────────
    if (path.startsWith("/portal") && path !== "/portal/login") {
      if (!user) return NextResponse.redirect(new URL("/portal/login", request.url));
    }
    if (path === "/portal/login" && user) {
      const { data: prop } = await supabase
        .from("re_propietarios")
        .select("id")
        .eq("auth_id", user.id)
        .maybeSingle();
      if (prop) return NextResponse.redirect(new URL("/portal", request.url));
    }

    // ── Universal Login Redirect ──────────────────
    if (path === "/login" && user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin" || profile?.role === "agent") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        return NextResponse.redirect(new URL("/portal", request.url));
      }
    }

    return supabaseResponse;
  } catch (error) {
    console.error("Middleware error:", error);
    // On error, let the request through rather than crashing
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/login"],
};
