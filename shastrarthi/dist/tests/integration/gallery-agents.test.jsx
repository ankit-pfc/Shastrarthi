import { render, screen } from "@testing-library/react";
import GalleryPage from "@/app/(app)/app/gallery/page";
describe("Guru Gallery agents", () => {
    it("shows updated F3 agents and hides removed legacy agents", () => {
        render(<GalleryPage />);
        expect(screen.getByText("Advaita Scholar")).toBeInTheDocument();
        expect(screen.getByText("Yoga Guide")).toBeInTheDocument();
        expect(screen.getByText("Sanskrit Etymologist")).toBeInTheDocument();
        expect(screen.getByText("Tantra Guide")).toBeInTheDocument();
        expect(screen.getByText("Sanatan Guide")).toBeInTheDocument();
        expect(screen.queryByText("Comparative Traditions")).not.toBeInTheDocument();
        expect(screen.queryByText("Practice Advisor")).not.toBeInTheDocument();
    });
    it("links each card to chat with agent key", () => {
        render(<GalleryPage />);
        const links = screen.getAllByRole("link", { name: "Start Chat" });
        const hrefs = links.map((link) => link.getAttribute("href"));
        expect(links).toHaveLength(5);
        expect(hrefs).toEqual([
            "/app/chat?agent=advaita",
            "/app/chat?agent=yoga",
            "/app/chat?agent=etymology",
            "/app/chat?agent=tantra",
            "/app/chat?agent=sanatan",
        ]);
    });
});
