import { createClient } from "@supabase/supabase-js";
import type { HistoryEntity, HistoryRelation, HistoryTimeline } from "../lib/supabase";
import axios from "axios";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for seeding

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

interface SeedHistoryEntity extends Omit<HistoryEntity, 'id' | 'created_at' | 'updated_at'> {}
interface SeedHistoryRelation extends Omit<HistoryRelation, 'id' | 'created_at'> {}
interface SeedHistoryTimeline extends Omit<HistoryTimeline, 'id' | 'created_at'> {}

// A simplified example of literature taxonomy from the plan
const literatureSeedData: SeedHistoryEntity[] = [
  {
    slug: "ramayana",
    entity_type: "literature",
    title: "Ramayana",
    summary: "One of the two major Sanskrit epics of ancient India.",
    content_md: "The Ramayana is an ancient Indian epic poem which narrates the life of Rama, the legendary prince of Kosala Kingdom.",
    period_label: "5th to 4th century BCE",
    tags: ["epic", "itihasa", "sanskrit"],
    is_published: true,
  },
  {
    slug: "mahabharata",
    entity_type: "literature",
    title: "Mahabharata",
    summary: "One of the two major Sanskrit epics of ancient India.",
    content_md: "The Mahabharata is one of the two major Sanskrit epic poems of ancient India, the other being the Ramayana.",
    period_label: "4th century BCE to 4th century CE",
    tags: ["epic", "itihasa", "sanskrit"],
    is_published: true,
  },
  {
    slug: "bhagavad-gita",
    entity_type: "literature",
    title: "Bhagavad Gita",
    subtitle: "The Song of God",
    summary: "A 700-verse Hindu scripture that is part of the Hindu epic Mahabharata.",
    content_md: "The Bhagavad Gita, often referred to as the Gita, is a 700-verse Hindu scripture that is part of the Hindu epic Mahabharata.",
    period_label: "2nd century BCE to 2nd century CE",
    tags: ["philosophy", "yoga", "vedanta"],
    is_published: true,
  },
  {
    slug: "advaita-vedanta",
    entity_type: "literature_category", // Or a custom type for categories
    title: "Advaita Vedanta",
    summary: "A school of Hindu philosophy and religious practice.",
    content_md: "Advaita Vedanta is a school of Hindu philosophy and religious practice, and one of the most classic Indian paths to spiritual realization.",
    is_published: true,
  }
];

const relationsSeedData: Omit<SeedHistoryRelation, 'from_entity_id' | 'to_entity_id'>[] = [
  { relation_type: "part_of", description: "embedded in" }, // Bhagavad Gita part of Mahabharata
  { relation_type: "category", description: "category for" }, // Advaita Vedanta is a category
];

const timelineSeedData: SeedHistoryTimeline[] = [
  {
    slug: "major-epics",
    title: "Major Indian Epics Timeline",
    description: "Key events and literature from the Ramayana and Mahabharata periods.",
    entity_ids: [], // Will be populated dynamically
  },
];

async function seedEntities(entities: SeedHistoryEntity[]) {
  console.log("Starting history entity seeding...");
  for (const entityData of entities) {
    const { data: existing, error: existingError } = await supabase
      .from("history_entities")
      .select("id")
      .eq("slug", entityData.slug)
      .single();

    if (existing) {
      console.log(`Entity \"${entityData.title}\" (${entityData.slug}) already exists, skipping.`);
      continue;
    }

    const { data, error } = await supabase
      .from("history_entities")
      .insert(entityData)
      .select()
      .single();

    if (error) {
      console.error(`Error inserting entity \"${entityData.title}\":`, error);
    } else {
      console.log(`Successfully inserted entity: \"${data.title}\" (${data.id})`);
    }
  }
  console.log("History entity seeding complete.");
}

async function seedRelations() {
  console.log("Starting history relations seeding...");
  // Fetch IDs for entities to establish relations
  const { data: entities, error: fetchError } = await supabase.from("history_entities").select("id, slug");
  if (fetchError) {
    console.error("Error fetching entities for relations:", fetchError);
    return;
  }
  const entityMap = new Map<string, string>();
  entities.forEach(e => entityMap.set(e.slug, e.id));

  const relationsToInsert: (SeedHistoryRelation & { fromSlug: string; toSlug: string })[] = [
    { fromSlug: "bhagavad-gita", toSlug: "mahabharata", relation_type: "part_of", description: "embedded in" },
    // Add other relations here
  ];

  for (const relData of relationsToInsert) {
    const from_entity_id = entityMap.get(relData.fromSlug);
    const to_entity_id = entityMap.get(relData.toSlug);

    if (from_entity_id && to_entity_id) {
      const { data, error } = await supabase.from("history_relations").insert({
        from_entity_id,
        to_entity_id,
        relation_type: relData.relation_type,
        description: relData.description,
      }).select().single();

      if (error) {
        console.error(`Error inserting relation for ${relData.fromSlug} -> ${relData.toSlug}:`, error);
      } else {
        console.log(`Successfully inserted relation: ${relData.fromSlug} -> ${relData.toSlug}`);
      }
    } else {
      console.warn(`Could not find IDs for relation: ${relData.fromSlug} -> ${relData.toSlug}`);
    }
  }
  console.log("History relations seeding complete.");
}

async function seedTimelines() {
  console.log("Starting history timelines seeding...");
  // Fetch IDs for entities to include in timelines
  const { data: entities, error: fetchError } = await supabase.from("history_entities").select("id, slug");
  if (fetchError) {
    console.error("Error fetching entities for timelines:", fetchError);
    return;
  }
  const entityMap = new Map<string, string>();
  entities.forEach(e => entityMap.set(e.slug, e.id));

  const timelinesToInsert: (SeedHistoryTimeline & { slugs: string[] })[] = [
    {
      slug: "major-epics",
      title: "Major Indian Epics Timeline",
      description: "Key events and literature from the Ramayana and Mahabharata periods.",
      slugs: ["ramayana", "mahabharata", "bhagavad-gita"],
      entity_ids: [],
    },
  ];

  for (const timelineData of timelinesToInsert) {
    const entity_ids = timelineData.slugs.map(slug => entityMap.get(slug)).filter(Boolean) as string[];

    const { data: existing, error: existingError } = await supabase
      .from("history_timelines")
      .select("id")
      .eq("slug", timelineData.slug)
      .single();

    if (existing) {
      console.log(`Timeline \"${timelineData.title}\" (${timelineData.slug}) already exists, skipping.`);
      continue;
    }

    const { data, error } = await supabase.from("history_timelines").insert({
      slug: timelineData.slug,
      title: timelineData.title,
      description: timelineData.description,
      entity_ids: entity_ids,
    }).select().single();

    if (error) {
      console.error(`Error inserting timeline \"${timelineData.title}\":`, error);
    } else {
      console.log(`Successfully inserted timeline: \"${data.title}\" (${data.id})`);
    }
  }
  console.log("History timelines seeding complete.");
}

async function seed() {
  await seedEntities(literatureSeedData);
  await seedRelations();
  await seedTimelines();
  console.log("All history seeding complete.");
}

seed();