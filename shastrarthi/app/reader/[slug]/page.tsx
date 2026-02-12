import { redirect } from "next/navigation";

interface LegacyReaderRedirectProps {
    params: { slug: string };
}

export default function LegacyReaderRedirect({ params }: LegacyReaderRedirectProps) {
    redirect(`/app/reader/${params.slug}`);
}
