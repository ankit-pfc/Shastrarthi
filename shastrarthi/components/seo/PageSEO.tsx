import JsonLd from "@/components/seo/JsonLd";

interface PageSEOProps {
    schemas?: Array<Record<string, unknown>>;
}

export default function PageSEO({ schemas = [] }: PageSEOProps) {
    if (!schemas.length) return null;

    return (
        <>
            {schemas.map((schema, index) => (
                <JsonLd key={index} data={schema} />
            ))}
        </>
    );
}
