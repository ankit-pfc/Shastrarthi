import { NextResponse } from "next/server";
import { generateSynthesisResponse, isConfigured, resolvePrompt } from "@/lib/learnlm";
import { withAuth } from "@/lib/api-utils";
import { buildRateLimitHeaders, checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getSiteUrl } from "@/lib/site";
import { fetchTextsByIds } from "@/lib/services/texts";
const MAX_TOOL_FIELD_LENGTH = 5000;
const AI_RATE_LIMIT = { windowMs: 60000, maxRequests: 20 };
const MAX_META_DESCRIPTION_LENGTH = 160;
const MAX_SOURCE_QUERY_LENGTH = 8000;
/** Minimum content length (chars) to publish a public pSEO page; avoids thin/error responses */
const MIN_PUBLISH_CONTENT_LENGTH = 300;
/** Normalized source length used for dedupe lookup */
const DEDUPE_SOURCE_NORMALIZE_LENGTH = 500;
function normalizeLanguage(language) {
    const trimmed = (language !== null && language !== void 0 ? language : "").trim();
    return trimmed ? trimmed : "English";
}
function normalizeLevel(level) {
    const valid = new Set(["Simple", "Academic", "Child-friendly"]);
    const trimmed = (level !== null && level !== void 0 ? level : "").trim();
    return valid.has(trimmed) ? trimmed : "Simple";
}
function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}
function derivePageTitle(mode, language, source) {
    const action = mode === "translate" ? "Translation" : "Simplified Meaning";
    const compact = source.replace(/\s+/g, " ").trim().slice(0, 90);
    return `${compact || "Indic passage"} ${action} in ${language}`.trim();
}
function deriveMetaDescription(mode, language, content) {
    const action = mode === "translate" ? "translated" : "simplified";
    const snippet = content.replace(/\s+/g, " ").trim().slice(0, 110);
    return `Read this ${action} Shastra passage in ${language}. ${snippet}`.slice(0, MAX_META_DESCRIPTION_LENGTH);
}
function deriveKeywords(mode, language, source) {
    const firstWords = source
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 6);
    const base = mode === "translate" ? ["translation", "shastra translation"] : ["simplified meaning", "shastra simplifier"];
    return Array.from(new Set([...base, language.toLowerCase(), ...firstWords])).slice(0, 12);
}
/** Normalize source for dedupe: single line, trimmed, limited length */
function normalizeSourceForDedupe(source) {
    return source.replace(/\s+/g, " ").trim().slice(0, DEDUPE_SOURCE_NORMALIZE_LENGTH);
}
/** If a public page already exists for same mode, language, and normalized source, return its slug/url */
async function findExistingPublicPage(supabase, mode, language, normalizedSource) {
    var _a;
    if (!normalizedSource)
        return null;
    const { data } = await supabase
        .from("public_pages")
        .select("slug, title, source_query")
        .eq("mode", mode)
        .eq("language", language)
        .order("created_at", { ascending: false })
        .limit(100);
    const rows = (_a = data) !== null && _a !== void 0 ? _a : [];
    const match = rows.find((row) => {
        var _a;
        const existing = ((_a = row.source_query) !== null && _a !== void 0 ? _a : "").replace(/\s+/g, " ").trim().slice(0, DEDUPE_SOURCE_NORMALIZE_LENGTH);
        return existing === normalizedSource;
    });
    return match ? { slug: match.slug, title: match.title } : null;
}
async function savePublicPage(supabase, input) {
    var _a;
    const title = derivePageTitle(input.mode, input.language, input.sourceQuery);
    const baseSlugParts = [
        input.sourceQuery.slice(0, 60),
        input.mode === "translate" ? "translation" : "meaning",
        input.language,
    ]
        .map((value) => slugify(value))
        .filter(Boolean);
    const baseSlug = baseSlugParts.join("-").slice(0, 120) || "shastra-explanation";
    const metaDescription = deriveMetaDescription(input.mode, input.language, input.content);
    const keywords = deriveKeywords(input.mode, input.language, input.sourceQuery);
    let savedRow = null;
    let slug = baseSlug;
    for (let attempt = 0; attempt < 5; attempt += 1) {
        if (attempt > 0)
            slug = `${baseSlug}-${attempt + 1}`;
        const { data, error } = await supabase
            .from("public_pages")
            .insert({
            slug,
            title,
            content: input.content,
            source_query: input.sourceQuery.slice(0, MAX_SOURCE_QUERY_LENGTH),
            language: input.language,
            mode: input.mode,
            meta_description: metaDescription,
            keywords,
        })
            .select("slug, title")
            .single();
        if (!error && data) {
            savedRow = data;
            break;
        }
        if (!error)
            continue;
        const isDuplicate = error.code === "23505" || String((_a = error.message) !== null && _a !== void 0 ? _a : "").toLowerCase().includes("duplicate");
        if (!isDuplicate) {
            console.error("Persist public page failed:", error);
            break;
        }
    }
    if (!savedRow)
        return null;
    const siteUrl = getSiteUrl();
    return {
        slug: savedRow.slug,
        title: savedRow.title,
        url: `${siteUrl}/explore/${savedRow.slug}`,
    };
}
function readBoundedString(payload, key, maxLength) {
    const value = payload[key];
    if (value == null)
        return { ok: true, value: "" };
    if (typeof value !== "string")
        return { ok: false };
    if (value.length > maxLength)
        return { ok: false };
    return { ok: true, value };
}
export const POST = withAuth(async (request, _context, { user, supabase }) => {
    var _a;
    try {
        const body = await request.json().catch(() => ({}));
        const mode = body === null || body === void 0 ? void 0 : body.mode;
        const payload = ((_a = body === null || body === void 0 ? void 0 : body.payload) !== null && _a !== void 0 ? _a : {});
        if (!mode) {
            return NextResponse.json({ error: "Missing mode" }, { status: 400 });
        }
        const ip = getClientIp(request);
        const rateLimitResult = checkRateLimit(`ai:${user.id}:${ip}`, AI_RATE_LIMIT);
        if (!rateLimitResult.allowed) {
            return NextResponse.json({ error: "Rate limit exceeded. Please try again shortly." }, {
                status: 429,
                headers: Object.assign(Object.assign({}, buildRateLimitHeaders(rateLimitResult)), { "Retry-After": String(rateLimitResult.retryAfterSeconds) }),
            });
        }
        if (!isConfigured()) {
            return NextResponse.json({ error: "AI service is not configured." }, { status: 503 });
        }
        let prompt = "";
        let context = "";
        let promptConfigId = "synthesis";
        let pseoMode = null;
        let pseoLanguage = "English";
        let pseoSourceQuery = "";
        if (mode === "writer_draft") {
            const title = readBoundedString(payload, "title", MAX_TOOL_FIELD_LENGTH);
            const bodyText = readBoundedString(payload, "body", MAX_TOOL_FIELD_LENGTH);
            if (!title.ok || !bodyText.ok) {
                return NextResponse.json({ error: `Payload fields must be strings up to ${MAX_TOOL_FIELD_LENGTH} characters.` }, { status: 400 });
            }
            prompt = `Write a structured draft titled "${title.value || "Untitled"}".`;
            context = `Topic/body notes:\n${bodyText.value}`;
            promptConfigId = "writerDraft";
        }
        else if (mode === "writer_citations") {
            const bodyText = readBoundedString(payload, "body", MAX_TOOL_FIELD_LENGTH);
            if (!bodyText.ok) {
                return NextResponse.json({ error: `Payload fields must be strings up to ${MAX_TOOL_FIELD_LENGTH} characters.` }, { status: 400 });
            }
            prompt = "Insert verse-style citations into the given draft where appropriate.";
            context = bodyText.value;
            promptConfigId = "writerCitations";
        }
        else if (mode === "simplify") {
            const inputText = readBoundedString(payload, "input", MAX_TOOL_FIELD_LENGTH);
            const level = readBoundedString(payload, "level", 40);
            const targetLanguage = readBoundedString(payload, "targetLanguage", 60);
            if (!inputText.ok) {
                return NextResponse.json({ error: `Payload fields must be strings up to ${MAX_TOOL_FIELD_LENGTH} characters.` }, { status: 400 });
            }
            if (!level.ok || !targetLanguage.ok) {
                return NextResponse.json({ error: "Invalid simplify payload." }, { status: 400 });
            }
            const language = normalizeLanguage(targetLanguage.value);
            const simplificationLevel = normalizeLevel(level.value);
            prompt = `Simplify the given passage into ${language} at ${simplificationLevel} level while preserving philosophical meaning.
Return:
- A short heading
- 1 concise explanation paragraph
- 3 bullet points
- Optional glossary (max 3 terms if needed).`;
            context = inputText.value;
            promptConfigId = "simplify";
            pseoMode = "simplify";
            pseoLanguage = language;
            pseoSourceQuery = inputText.value;
        }
        else if (mode === "translate") {
            const inputText = readBoundedString(payload, "input", MAX_TOOL_FIELD_LENGTH);
            const targetLanguage = readBoundedString(payload, "targetLanguage", 60);
            if (!inputText.ok) {
                return NextResponse.json({ error: `Payload fields must be strings up to ${MAX_TOOL_FIELD_LENGTH} characters.` }, { status: 400 });
            }
            if (!targetLanguage.ok) {
                return NextResponse.json({ error: "Invalid translate payload." }, { status: 400 });
            }
            const language = normalizeLanguage(targetLanguage.value);
            prompt = `Translate the given passage into ${language} while preserving meaning.
Return:
- Original line (if provided)
- Direct translation
- Easy explanation in ${language}
- Note on key Sanskrit terms that should remain untranslated, if any.`;
            context = inputText.value;
            promptConfigId = "translate";
            pseoMode = "translate";
            pseoLanguage = language;
            pseoSourceQuery = inputText.value;
        }
        else if (mode === "extract") {
            const question = readBoundedString(payload, "question", MAX_TOOL_FIELD_LENGTH);
            if (!question.ok) {
                return NextResponse.json({ error: `Payload fields must be strings up to ${MAX_TOOL_FIELD_LENGTH} characters.` }, { status: 400 });
            }
            const textIds = payload === null || payload === void 0 ? void 0 : payload.textIds;
            const datasetId = payload === null || payload === void 0 ? void 0 : payload.datasetId;
            let extractionContext = `Question: ${question.value}\n\nSources:`;
            if (textIds && textIds.length > 0) {
                const texts = await fetchTextsByIds(textIds);
                for (const text of texts) {
                    const { data: verses, error: versesError } = await supabase
                        .from("verses")
                        .select("ref, sanskrit, translation_en")
                        .eq("text_id", text.id)
                        .limit(50); // Limit verses per text to avoid excessive context
                    if (!versesError && verses) {
                        extractionContext += `\n\nText: ${text.title_en} (${text.category})`;
                        for (const verse of verses) {
                            extractionContext += `\n- ${verse.ref}: ${verse.translation_en}`;
                            if (verse.sanskrit)
                                extractionContext += ` (Sanskrit: ${verse.sanskrit})`;
                        }
                    }
                    else {
                        console.warn(`Failed to fetch verses for text ${text.id}:`, versesError);
                    }
                }
            }
            if (datasetId) {
                const { data: dataset, error: datasetError } = await supabase
                    .from("extract_datasets")
                    .select("data")
                    .eq("id", datasetId)
                    .eq("user_id", user.id)
                    .single();
                if (!datasetError && dataset && Array.isArray(dataset.data)) {
                    extractionContext += `\n\nUser Uploaded Data (Dataset ID: ${datasetId}):`;
                    for (const item of dataset.data.slice(0, 100)) { // Limit items from dataset
                        extractionContext += `\n- ${JSON.stringify(item)}`;
                    }
                }
                else {
                    console.warn(`Failed to fetch dataset ${datasetId}:`, datasetError);
                }
            }
            if ((textIds === null || textIds === void 0 ? void 0 : textIds.length) === 0 && !datasetId) {
                return NextResponse.json({ error: "At least one text or dataset must be provided for extraction." }, { status: 400 });
            }
            prompt = `Extract concise insights and verse-like references relevant to the user's question from the provided sources.
Return the response as a JSON array of objects, where each object has 'text', 'ref', and 'insight' fields.
Example: [{"text": "Bhagavad Gita", "ref": "2.47", "insight": "Action without fruit-attachment is central."}, {"text": "Yoga Sutras", "ref": "1.12", "insight": "Vairagya balances sustained practice."}]`;
            context = extractionContext;
            promptConfigId = "extract";
        }
        else {
            return NextResponse.json({ error: "Unsupported mode" }, { status: 400 });
        }
        const promptConfig = resolvePrompt(promptConfigId);
        const content = await generateSynthesisResponse(prompt, context, promptConfig);
        let publicPage = null;
        const shouldPublish = pseoMode &&
            pseoSourceQuery.trim() &&
            content.trim() &&
            content.length >= MIN_PUBLISH_CONTENT_LENGTH;
        if (shouldPublish) {
            const normalizedSource = normalizeSourceForDedupe(pseoSourceQuery);
            const existing = await findExistingPublicPage(supabase, pseoMode, pseoLanguage, normalizedSource);
            if (existing) {
                publicPage = {
                    slug: existing.slug,
                    title: existing.title,
                    url: `${getSiteUrl()}/explore/${existing.slug}`,
                };
            }
            else {
                publicPage = await savePublicPage(supabase, {
                    mode: pseoMode,
                    language: pseoLanguage,
                    sourceQuery: pseoSourceQuery,
                    content,
                });
            }
        }
        let parsedContent = [];
        try {
            parsedContent = JSON.parse(content);
            if (!Array.isArray(parsedContent) || !parsedContent.every(item => typeof item.text === 'string' && typeof item.ref === 'string' && typeof item.insight === 'string'))
                ;
        }
        finally { }
    }
    finally { }
}), { throw: , new: Error };
("Invalid JSON format for extracted insights.");
try { }
catch (parseError) {
    console.error("Failed to parse LLM response for extraction:", parseError);
    return NextResponse.json({ error: "Failed to process extraction results from AI." }, { status: 500 });
}
return NextResponse.json({ data: { content: parsedContent, publicPage } }, {
    headers: Object.assign({}, buildRateLimitHeaders(rateLimitResult)),
});
try { }
catch (error) {
    console.error("POST /api/tools failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
;
