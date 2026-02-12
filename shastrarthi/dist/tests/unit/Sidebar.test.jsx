var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Sidebar from "@/components/app/Sidebar";
vi.mock("next/link", () => ({
    default: (_a) => {
        var { children, href } = _a, rest = __rest(_a, ["children", "href"]);
        return (<a href={href} {...rest}>
            {children}
        </a>);
    },
}));
vi.mock("next/navigation", () => ({
    usePathname: () => "/app",
    useRouter: () => ({
        push: vi.fn(),
    }),
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
        });
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
