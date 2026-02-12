import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import DepthToggle from "@/components/discover/DepthToggle";
describe("DepthToggle", () => {
    it("calls onChange when selecting another mode", () => {
        const onChange = vi.fn();
        render(<DepthToggle value="deep" onChange={onChange}/>);
        fireEvent.click(screen.getByRole("button", { name: /standard/i }));
        expect(onChange).toHaveBeenCalledWith("standard");
    });
});
