import { redirect } from "next/navigation";

export default function ReferencesPageRedirect() {
    redirect("/app/chat?agent=etymology");
}
