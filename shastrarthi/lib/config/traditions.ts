export interface Tradition {
    slug: string;
    name: string;
    description: string;
}

export const TRADITIONS: Tradition[] = [
    {
        slug: "vedanta",
        name: "Vedanta",
        description: "The 'Conclusion of the Vedas', dealing with the ultimate nature of Reality (Brahman) and the Self (Atman). It spans the strict non-dualism of Advaita to the devotion-centered dualism of Dvaita, all grounded in the Prasthana Trayi (Upanishads, Gita, Brahma Sutras).",
    },
    {
        slug: "yoga",
        name: "Yoga",
        description: "A systematic psychology and practice for stilling the fluctuations of the mind (Chitta Vritti Nirodha). Rooted in Patanjali's Sutras, it outlines the Eight Limbs (Ashtanga) leading to Samadhi, or integration.",
    },
    {
        slug: "tantra",
        name: "Tantra",
        description: "A path accepting the manifest world as a play of divine Consciousness and Energy (Shiva-Shakti). Utilizing ritual, mantra, and the body itself, Tantra aims for both liberation (Moksha) and enjoyment (Bhoga) through recognition of the divine in all things.",
    },
    {
        slug: "bhakti",
        name: "Bhakti",
        description: "The path of loving devotion and surrender (Prapatti) to a personal Divinity. From the passionate poetry of the Alvars and Nayanars to the theological systems of the Vaishnava Acharyas, it emphasizes relationship over abstract knowledge.",
    },
    {
        slug: "nyaya",
        name: "Nyaya",
        description: "The school of Logic and Epistemology. Nyaya provides the rigorous tools for critical thinking and debate used by all other Indian systems. It focuses on the Pramanas—the valid means of acquiring correct knowledge.",
    },
    {
        slug: "samkhya",
        name: "Samkhya",
        description: "The dualist philosophy enumerating the cosmic principles. It distinguishes between Pure Consciousness (Purusha) and Material Nature (Prakriti), forming the metaphysical foundation for Yoga and Ayurveda.",
    },
];
