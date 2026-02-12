export function getTopicStructuredData(topic, siteUrl) {
    const topicUrl = `${siteUrl}/topics/${topic.slug}`;
    const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Topics",
                item: `${siteUrl}/topics`,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: topic.name,
                item: topicUrl,
            },
        ],
    };
    const collectionPage = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: topic.name,
        description: topic.description || undefined,
        url: topicUrl,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": topicUrl,
        },
        // potential for more properties like about, hasPart, etc.
    };
    return Object.assign(Object.assign({}, collectionPage), breadcrumb);
}
