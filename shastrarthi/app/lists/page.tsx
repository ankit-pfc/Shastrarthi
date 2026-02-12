import { redirect } from "next/navigation";

export default function LegacyListsRedirect() {
    redirect("/app/notebooks");
}
