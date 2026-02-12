import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server-supabase";
export function withAuth(handler) {
    return async (request, context) => {
        try {
            const auth = await requireUser();
            return await handler(request, (context !== null && context !== void 0 ? context : {}), auth);
        }
        catch (error) {
            if (error instanceof Error && error.message === "UNAUTHORIZED") {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            console.error("Authenticated route handler failed:", error);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    };
}
