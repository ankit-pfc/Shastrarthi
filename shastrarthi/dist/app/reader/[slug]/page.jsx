import { redirect } from "next/navigation";
export default function LegacyReaderRedirect({ params }) {
    redirect(`/app/reader/${params.slug}`);
}
