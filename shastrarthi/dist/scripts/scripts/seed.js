"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const env_1 = require("@next/env");
const supabase_js_1 = require("@supabase/supabase-js");
(0, env_1.loadEnvConfig)(process.cwd());
const PLACEHOLDER_MARKERS = [
    "your-project-id",
    "your_supabase_anon_key_here",
    "your_supabase_service_role_key_here",
];
function isPlaceholder(value) {
    if (!value)
        return true;
    const normalized = value.trim().toLowerCase();
    if (!normalized)
        return true;
    return PLACEHOLDER_MARKERS.some((marker) => normalized.includes(marker));
}
async function readEnvFileValue(filePath, key) {
    try {
        const content = await (0, promises_1.readFile)(filePath, "utf-8");
        const line = content
            .split("\n")
            .map((entry) => entry.trim())
            .find((entry) => entry.startsWith(`${key}=`));
        if (!line)
            return undefined;
        const value = line.slice(key.length + 1).trim().replace(/^['"]|['"]$/g, "");
        return value || undefined;
    }
    catch {
        return undefined;
    }
}
async function resolveEnvValue(key) {
    const fromProcess = process.env[key];
    if (!isPlaceholder(fromProcess)) {
        return fromProcess;
    }
    const fromDotEnv = await readEnvFileValue((0, node_path_1.resolve)(process.cwd(), ".env"), key);
    if (!isPlaceholder(fromDotEnv)) {
        return fromDotEnv;
    }
    const fromDotEnvLocal = await readEnvFileValue((0, node_path_1.resolve)(process.cwd(), ".env.local"), key);
    if (!isPlaceholder(fromDotEnvLocal)) {
        return fromDotEnvLocal;
    }
    return undefined;
}
async function main() {
    const supabaseUrl = await resolveEnvValue("NEXT_PUBLIC_SUPABASE_URL");
    const serviceRoleKey = await resolveEnvValue("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    const seedPath = (0, node_path_1.resolve)(process.cwd(), "seed-data", "texts.json");
    const raw = await (0, promises_1.readFile)(seedPath, "utf-8");
    const texts = JSON.parse(raw);
    const supabase = (0, supabase_js_1.createClient)(supabaseUrl, serviceRoleKey);
    for (const text of texts) {
        const { data: insertedText, error: textError } = await supabase
            .from("texts")
            .upsert({
            slug: text.slug,
            title_en: text.title_en,
            title_sa: text.title_sa,
            category: text.category,
            tradition: text.tradition,
            difficulty: text.difficulty,
            description: text.description,
            verse_count: text.verses.length,
        }, { onConflict: "slug" })
            .select("id, slug")
            .single();
        if (textError || !insertedText) {
            throw new Error(`Failed upserting text ${text.slug}: ${textError?.message}`);
        }
        const { error: deleteError } = await supabase
            .from("verses")
            .delete()
            .eq("text_id", insertedText.id);
        if (deleteError) {
            throw new Error(`Failed clearing verses for ${text.slug}: ${deleteError.message}`);
        }
        const verseRows = text.verses.map((verse) => ({
            text_id: insertedText.id,
            ref: verse.ref,
            sanskrit: verse.sanskrit,
            transliteration: verse.transliteration,
            translation_en: verse.translation_en,
            order_index: verse.order_index,
        }));
        if (verseRows.length > 0) {
            const { error: versesError } = await supabase.from("verses").insert(verseRows);
            if (versesError) {
                throw new Error(`Failed inserting verses for ${text.slug}: ${versesError.message}`);
            }
        }
        console.log(`Seeded ${text.slug} (${verseRows.length} verses)`);
    }
    console.log(`Seeding complete: ${texts.length} texts`);
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
