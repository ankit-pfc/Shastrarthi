import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GuruSelector from "./GuruSelector";
import { GURU_PERSONAS } from "@/lib/config/prompts";

describe("GuruSelector", () => {
    it("renders the selected persona", () => {
        render(<GuruSelector selectedPersona="default" onPersonaChange={() => { }} />);
        expect(screen.getByText("Swami Vivekananda")).toBeDefined();
    });

    it("opens dropdown on click", () => {
        render(<GuruSelector selectedPersona="default" onPersonaChange={() => { }} />);
        const button = screen.getByLabelText("Select guru persona");
        fireEvent.click(button);

        // check if other personas are visible
        // We have 4 personas: default, yoga, advaita, tantra (checked from previous view)
        // Let's check for one of them
        const options = screen.getAllByRole("button");
        expect(options.length).toBeGreaterThan(1);
    });

    it("calls onPersonaChange when an option is selected", () => {
        const handleChange = vi.fn();
        render(<GuruSelector selectedPersona="default" onPersonaChange={handleChange} />);

        const button = screen.getByLabelText("Select guru persona");
        fireEvent.click(button);

        const krishnaOption = screen.getByText("Shri Krishna");
        fireEvent.click(krishnaOption);

        expect(handleChange).toHaveBeenCalledWith("yoga"); // Assuming yoga is the key for Krishna
    });
});
