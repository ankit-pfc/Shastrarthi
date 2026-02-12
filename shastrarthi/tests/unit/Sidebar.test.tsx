import React from "react";
import { render, screen } from "@testing-library/react";
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

describe("Sidebar", () => {
    it("renders core navigation items", () => {
        render(<Sidebar />);

        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("My Library")).toBeInTheDocument();
        expect(screen.getByText("Text Discovery")).toBeInTheDocument();
    });
});
