import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/server-supabase";

export type AuthContext = Awaited<ReturnType<typeof requireUser>>;

type AuthenticatedHandler<TContext = unknown> = (
    request: NextRequest,
    context: TContext,
    auth: AuthContext
) => Promise<Response>;

export function withAuth<TContext = unknown>(handler: AuthenticatedHandler<TContext>) {
    return async (request: NextRequest | Request, context?: TContext): Promise<Response> => {
        try {
            const auth = await requireUser();
            return await handler(request as NextRequest, (context ?? ({} as TContext)), auth);
        } catch (error) {
            if (error instanceof Error && error.message === "UNAUTHORIZED") {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            console.error("Authenticated route handler failed:", error);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    };
}
