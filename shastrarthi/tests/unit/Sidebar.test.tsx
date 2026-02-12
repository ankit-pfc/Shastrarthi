import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Sidebar from "@/components/app/Sidebar";

vi.mock("next/link", () => ({
    default: ({ children, href, ...rest }: any) => (
        <a href={href} {...rest}>
            {children}
        </a>
    ),
}));

vi.mock("next/navigation", () => ({
    usePathname: () => "/app",
}));

vi.mock("@/lib/supabase", () => ({
    supabase: {
        auth: {
            getUser: vi.fn().mockResolvedValue({
                data: { user: null },
            }),
        },
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    maybeSingle: vi.fn().mockResolvedValue({ data: null }),
                })),
            })),
        })),
    },
}));

describe("Sidebar", () => {
    beforeEach(() => {
        vi.spyOn(global, "fetch").mockResolvedValue({
            ok: true,
            json: async () => ({ data: [] }),
        } as Response);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders core navigation items", async () => {
        render(<Sidebar />);

        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("My Library")).toBeInTheDocument();
        expect(screen.getByText("Text Discovery")).toBeInTheDocument();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/api/chat/threads");
        });
    });
});
