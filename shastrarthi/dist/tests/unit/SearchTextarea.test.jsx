import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SearchTextarea from "@/components/discover/SearchTextarea";
const { pushMock } = vi.hoisted(() => ({
    pushMock: vi.fn(),
}));
vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));
describe("SearchTextarea", () => {
    beforeEach(() => {
        pushMock.mockReset();
    });
    it("pushes encoded query with depth when submitted", () => {
        render(<SearchTextarea initialQuery=""/>);
        fireEvent.change(screen.getByPlaceholderText(/enter your research query/i), {
            target: { value: "Karma yoga basics" },
        });
        fireEvent.click(screen.getByRole("button", { name: /search/i }));
        expect(pushMock).toHaveBeenCalledWith("/app/discover/Karma%20yoga%20basics?depth=deep");
    });
});
