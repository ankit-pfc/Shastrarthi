import type { HistoryEntity, HistoryTimeline, Topic } from "@/lib/supabase";

type StructuredDataMap = Record<string, Record<string, unknown>>;

function formatEntityType(type: string): string {
    return type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getTopicStructuredData(topic: Topic, siteUrl: string): StructuredDataMap {
    const topicUrl = `${siteUrl}/topics/${topic.slug}`;
    return {
        collectionPage: {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: topic.name,
            description: topic.description || undefined,
            url: topicUrl,
            mainEntityOfPage: {
                "@type": "WebPage",
                "@id": topicUrl,
            },
        },
        breadcrumb: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Topics", item: `${siteUrl}/topics` },
                { "@type": "ListItem", position: 2, name: topic.name, item: topicUrl },
            ],
        },
    };
}

export function getHistoryEntityStructuredData(entity: HistoryEntity, siteUrl: string): StructuredDataMap {
    const entityTypeLabel = formatEntityType(entity.entity_type);
    const entityUrl = `${siteUrl}/history/${entity.entity_type}/${entity.slug}`;
    return {
        article: {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: entity.title,
            description: entity.meta_description || entity.summary || undefined,
            articleSection: entityTypeLabel,
            datePublished: entity.created_at,
            dateModified: entity.updated_at,
            inLanguage: "en",
            keywords: entity.keywords || undefined,
            about: entity.tags || undefined,
            mainEntityOfPage: entityUrl,
            url: entityUrl,
            publisher: {
                "@type": "Organization",
                name: "Shastrarthi",
                url: siteUrl,
            },
        },
        breadcrumb: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "History", item: `${siteUrl}/history` },
                { "@type": "ListItem", position: 2, name: entityTypeLabel, item: `${siteUrl}/history/${entity.entity_type}` },
                { "@type": "ListItem", position: 3, name: entity.title, item: entityUrl },
            ],
        },
    };
}

export function getHistoryListStructuredData(type: string, entities: HistoryEntity[], siteUrl: string): StructuredDataMap {
    const typeLabel = formatEntityType(type);
    const listUrl = `${siteUrl}/history/${type}`;
    return {
        collectionPage: {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${typeLabel} History`,
            description: `Browse ${typeLabel.toLowerCase()} across ancient Indian history.`,
            url: listUrl,
            mainEntity: {
                "@type": "ItemList",
                itemListElement: entities.slice(0, 25).map((entity, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `${siteUrl}/history/${entity.entity_type}/${entity.slug}`,
                    name: entity.title,
                })),
            },
        },
        breadcrumb: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "History", item: `${siteUrl}/history` },
                { "@type": "ListItem", position: 2, name: typeLabel, item: listUrl },
            ],
        },
    };
}

export function getTimelineStructuredData(
    timeline: HistoryTimeline,
    entities: HistoryEntity[],
    siteUrl: string
): StructuredDataMap {
    const timelineUrl = `${siteUrl}/history/timelines/${timeline.slug}`;
    return {
        article: {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: timeline.title,
            description: timeline.description || undefined,
            datePublished: timeline.created_at,
            dateModified: timeline.created_at,
            mainEntityOfPage: timelineUrl,
            url: timelineUrl,
            hasPart: entities.slice(0, 30).map((entity) => ({
                "@type": "CreativeWork",
                name: entity.title,
                url: `${siteUrl}/history/${entity.entity_type}/${entity.slug}`,
            })),
        },
        breadcrumb: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "History", item: `${siteUrl}/history` },
                { "@type": "ListItem", position: 2, name: "Timelines", item: `${siteUrl}/history/timelines` },
                { "@type": "ListItem", position: 3, name: timeline.title, item: timelineUrl },
            ],
        },
    };
}