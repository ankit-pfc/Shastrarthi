import { redirect } from "next/navigation";

export default function LegacyDiscoverRedirect() {
    redirect("/app/discover");
}
