import { createClient } from "@supabase/supabase-js";
import type { Topic } from "../lib/supabase";

// Load environment variables
require('dotenv').config({ path: '../.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for seeding

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

interface SeedTopic extends Omit<Topic, 'id' | 'created_at' | 'updated_at'> {}

const seedTopics: SeedTopic[] = [
  {
    slug: "vedic-literature",
    name: "Vedic Literature",
    description: "The foundational scriptures of Hinduism, comprising the Vedas, Upanishads, and Vedangas.",
    icon: "📖",
    category: "text_group",
    parent_topic_id: null,
    sort_order: 10,
  },
  {
    slug: "rigveda",
    name: "Rigveda",
    description: "The oldest and most important of the Vedas, a collection of hymns.",
    icon: "📚",
    category: "text",
    parent_topic_id: null, // Will be linked to Vedic Literature later
    sort_order: 11,
  },
  {
    slug: "upanishads",
    name: "Upanishads",
    description: "Philosophical texts forming the theoretical basis for Hinduism.",
    icon: "💡",
    category: "text_group",
    parent_topic_id: null, // Will be linked to Vedic Literature later
    sort_order: 12,
  },
  {
    slug: "itihasa",
    name: "Itihasa",
    description: "Epic histories including the Ramayana and Mahabharata.",
    icon: "📜",
    category: "text_group",
    parent_topic_id: null,
    sort_order: 20,
  },
  {
    slug: "mahabharata",
    name: "Mahabharata",
    description: "One of the two major Sanskrit epics of ancient India, including the Bhagavad Gita.",
    icon: "⚔️",
    category: "text",
    parent_topic_id: null, // Will be linked to Itihasa later
    sort_order: 21,
  },
  {
    slug: "bhagavad-gita",
    name: "Bhagavad Gita",
    description: "A 700-verse Hindu scripture that is part of the Hindu epic Mahabharata.",
    icon: "🧘",
    category: "text",
    parent_topic_id: null, // Will be linked to Mahabharata later
    sort_order: 22,
  },
  {
    slug: "puranas",
    name: "Puranas",
    description: "Hindu religious texts, notably narrating the history of the universe.",
    icon: "🕉️",
    category: "text_group",
    parent_topic_id: null,
    sort_order: 30,
  },
  {
    slug: "darshana",
    name: "Darshana",
    description: "Various schools of Indian philosophy.",
    icon: "🧐",
    category: "concept_group",
    parent_topic_id: null,
    sort_order: 40,
  },
  {
    slug: "advaita-vedanta",
    name: "Advaita Vedanta",
    description: "A school of Hindu philosophy and religious practice, and one of the most classic Indian paths to spiritual realization.",
    icon: "✨",
    category: "tradition",
    parent_topic_id: null, // Will be linked to Darshana later
    sort_order: 41,
  },
  {
    slug: "yoga",
    name: "Yoga",
    description: "A group of physical, mental, and spiritual practices or disciplines which originated in ancient India.",
    icon: "🧘‍♀️",
    category: "practice",
    parent_topic_id: null, // Will be linked to Darshana later
    sort_order: 42,
  },
];

async function seed() {
  console.log("Starting topic seeding...");
  const existingTopics = await supabase.from("topics").select("slug");

  for (const topicData of seedTopics) {
    if (existingTopics.data?.some((t) => t.slug === topicData.slug)) {
      console.log(`Topic \"${topicData.name}\" already exists, skipping.`);
      continue;
    }

    const { data, error } = await supabase
      .from("topics")
      .insert(topicData)
      .select()
      .single();

    if (error) {
      console.error(`Error inserting topic \"${topicData.name}\":`, error);
    } else {
      console.log(`Successfully inserted topic: \"${data.name}\"`);
    }
  }

  // After inserting all topics, update parent_topic_id for hierarchy
  console.log("Updating topic hierarchy...");

  const topicMap = new Map<string, string>();
  const { data: allTopics, error: fetchError } = await supabase.from("topics").select("id, slug");
  if (fetchError) {
    console.error("Error fetching all topics for hierarchy update:", fetchError);
    return;
  }
  allTopics.forEach(t => topicMap.set(t.slug, t.id));

  const hierarchyUpdates = [
    { slug: "rigveda", parent: "vedic-literature" },
    { slug: "upanishads", parent: "vedic-literature" },
    { slug: "mahabharata", parent: "itihasa" },
    { slug: "bhagavad-gita", parent: "mahabharata" },
    { slug: "advaita-vedanta", parent: "darshana" },
    { slug: "yoga", parent: "darshana" },
  ];

  for (const update of hierarchyUpdates) {
    const childId = topicMap.get(update.slug);
    const parentId = topicMap.get(update.parent);

    if (childId && parentId) {
      const { error } = await supabase
        .from("topics")
        .update({ parent_topic_id: parentId })
        .eq("id", childId);

      if (error) {
        console.error(`Error updating parent_topic_id for ${update.slug}:`, error);
      } else {
        console.log(`Updated ${update.slug} to have parent ${update.parent}`);
      }
    } else {
      console.warn(`Could not find IDs for hierarchy update: child=${update.slug}, parent=${update.parent}`);
    }
  }

  console.log("Topic seeding complete.");
}

seed();