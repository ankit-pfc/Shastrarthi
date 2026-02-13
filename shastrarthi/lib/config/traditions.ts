export interface Tradition {
    slug: string;
    name: string;
    description: string;
}

export const TRADITIONS: Tradition[] = [
    {
        slug: "vedanta",
        name: "Vedanta",
        description: "The ultimate inquiry into Reality (Brahman). From the forest-wisdom of the Upanishads to the rigorous logic of the Brahma Sutras, Vedanta asks the single most important question: 'Who am I?'",
    },
    {
        slug: "yoga",
        name: "Yoga",
        description: "The science of inner silence. Far more than physical postures, Yoga provides a precise map to still the fluctuations of the mind (Chitta Vritti Nirodha) and rest in your true nature.",
    },
    {
        slug: "tantra",
        name: "Tantra",
        description: "The path of radical acceptance. Tantra sees the world not as an illusion to be escaped, but as the divine play (Lila) of Consciousness to be embraced, turning every experience into a gateway to the Sacred.",
    },
    {
        slug: "bhakti",
        name: "Bhakti",
        description: "The path of the heart. Bhakti transforms raw emotion into divine love (Prema). Whether through song, service, or surrender, it dissolves the ego in the sweetness of the Beloved.",
    },
    {
        slug: "nyaya",
        name: "Nyaya",
        description: "The sword of logic. Nyaya provides the intellectual tools to distinguish truth from falsehood, offering the rigorous epistemological foundation upon which all other Indian philosophies stand.",
    },
    {
        slug: "samkhya",
        name: "Samkhya",
        description: "The enumeration of reality. Samkhya dissects existence into Spirit (Purusha) and Nature (Prakriti), offering the metaphysical blueprint for understanding the machinery of your own experience.",
    },
];
