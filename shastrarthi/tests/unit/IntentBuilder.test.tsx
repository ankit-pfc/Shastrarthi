import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import IntentBuilder from "@/components/landing/IntentBuilder";

const { pushMock } = vi.hoisted(() => ({
    pushMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

describe("IntentBuilder", () => {
    beforeEach(() => {
        pushMock.mockReset();
    });

    it("uses item value in generated query params", () => {
        render(<IntentBuilder routePrefix="/app/discover" />);

        fireEvent.click(screen.getByRole("button", { name: /learn a philosophy/i }));
        fireEvent.click(screen.getByRole("button", { name: /continue/i }));

        expect(pushMock).toHaveBeenCalledWith("/app/discover?goal=learn-philosophy");
    });
});
