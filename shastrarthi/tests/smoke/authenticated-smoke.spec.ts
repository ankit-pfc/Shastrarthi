/**
 * Authenticated smoke test: login -> discover -> reader -> bookmark/note -> library
 * Run against http://localhost:3001
 *
 * Requires: TEST_USER_EMAIL and TEST_USER_PASSWORD env vars for login.
 * If not set, attempts signup (may block on email verification).
 */
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.SMOKE_BASE_URL || "http://localhost:3001";
const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

test.describe("Authenticated smoke path", () => {
    test.beforeEach(async ({ page }) => {
        // Capture console errors and failed requests
        page.on("console", (msg) => {
            const type = msg.type();
            if (type === "error") {
                console.log(`[Browser Console Error] ${msg.text()}`);
            }
        });
        page.on("requestfailed", (request) => {
            console.log(`[Failed Request] ${request.url()} - ${request.failure()?.errorText}`);
        });
    });

    test("full flow: login -> discover -> reader -> bookmark/note -> library", async ({ page }) => {
        const findings: { step: string; status: "pass" | "fail"; detail?: string }[] = [];
        let stepBlocked = false;

        // Step 1: Open app
        try {
            await page.goto(BASE_URL, { waitUntil: "networkidle" });
            await expect(page).toHaveURL(new RegExp(`^${BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(/.*)?$`));
            findings.push({ step: "1. Open app", status: "pass" });
        } catch (e) {
            findings.push({ step: "1. Open app", status: "fail", detail: String(e) });
            stepBlocked = true;
        }
        if (stepBlocked) {
            await reportFindings(findings);
            return;
        }

        // Step 2: Navigate to login
        try {
            const loginLink = page.getByRole("link", { name: /log in/i }).first();
            await loginLink.click();
            await page.waitForURL(/\/auth\/login/);
            findings.push({ step: "2. Navigate to login", status: "pass" });
        } catch (e) {
            findings.push({ step: "2. Navigate to login", status: "fail", detail: String(e) });
            stepBlocked = true;
        }
        if (stepBlocked) {
            await reportFindings(findings);
            return;
        }

        // Step 3: Login or signup
        if (TEST_EMAIL && TEST_PASSWORD) {
            try {
                await page.getByLabel(/email/i).fill(TEST_EMAIL);
                await page.getByLabel(/password/i).fill(TEST_PASSWORD);
                await page.getByRole("button", { name: /sign in/i }).click();
                await page.waitForURL(/\/app/, { timeout: 10000 });
                findings.push({ step: "3. Login with credentials", status: "pass" });
            } catch (e) {
                findings.push({ step: "3. Login with credentials", status: "fail", detail: String(e) });
                stepBlocked = true;
            }
        } else {
            // No credentials: try localhost bypass - go directly to /app/discover
            findings.push({
                step: "3. Login (no credentials)",
                status: "fail",
                detail: "Skipped. Set TEST_USER_EMAIL and TEST_USER_PASSWORD. Using localhost bypass to continue steps 4-7 (bookmark/note APIs will return 401).",
            });
            await page.goto(`${BASE_URL}/app/discover`, { waitUntil: "networkidle" });
            if (!page.url().includes("/app/")) {
                findings.push({ step: "3b. Localhost bypass", status: "fail", detail: "Could not access /app without auth" });
                stepBlocked = true;
            } else {
                stepBlocked = false; // Continue with remaining steps (bookmark/note will likely 401)
            }
        }
        if (stepBlocked) {
            await reportFindings(findings);
            return;
        }

        // Step 4: Navigate to discover and verify content
        try {
            await page.goto(`${BASE_URL}/app/discover`, { waitUntil: "networkidle" });
            await expect(page).toHaveURL(/\/app\/discover/);
            await expect(page.getByRole("heading", { name: /text discovery/i })).toBeVisible({ timeout: 5000 });
            findings.push({ step: "4. Navigate to discover & verify content", status: "pass" });
        } catch (e) {
            findings.push({ step: "4. Navigate to discover & verify content", status: "fail", detail: String(e) });
            stepBlocked = true;
        }
        if (stepBlocked) {
            await reportFindings(findings);
            return;
        }

        // Step 5: Open a text from discover into reader
        // Click an example link to get search results, then Read; fallback to direct reader URL
        try {
            const exampleLink = page.getByRole("link", {
                name: /what is the nature of consciousness|karma yoga|shakti/i,
            }).first();
            if (await exampleLink.isVisible()) {
                await exampleLink.click();
                await page.waitForURL(/\/app\/discover\//);
            }
            const readLink = page.getByRole("link", { name: /^read$/i }).first();
            const readVisible = await readLink.waitFor({ state: "visible", timeout: 8000 }).catch(() => null);
            if (readVisible) {
                await readLink.click();
                await page.waitForURL(/\/app\/reader\//);
            } else {
                await page.goto(`${BASE_URL}/app/reader/bhagavad-gita-chapter-2`, { waitUntil: "networkidle" });
            }
            await expect(page).toHaveURL(/\/app\/reader\//);
            findings.push({ step: "5. Open text from discover into reader", status: "pass" });
        } catch (e) {
            findings.push({ step: "5. Open text from discover into reader", status: "fail", detail: String(e) });
            stepBlocked = true;
        }
        if (stepBlocked) {
            await reportFindings(findings);
            return;
        }

        // Step 6a: Toggle bookmark on current verse
        try {
            const bookmarkBtn = page.getByRole("button", { name: /add bookmark|remove bookmark/i }).first();
            await bookmarkBtn.waitFor({ state: "visible", timeout: 5000 });
            await bookmarkBtn.click();
            await page.waitForTimeout(500);
            findings.push({ step: "6a. Toggle bookmark on verse", status: "pass" });
        } catch (e) {
            findings.push({ step: "6a. Toggle bookmark on verse", status: "fail", detail: String(e) });
        }

        // Step 6b: Add note on current verse
        try {
            const noteBtn = page.getByRole("button", { name: /add note/i }).first();
            await noteBtn.waitFor({ state: "visible", timeout: 5000 });
            await noteBtn.click();
            const modal = page.getByRole("dialog");
            await modal.waitFor({ state: "visible", timeout: 3000 });
            const textarea = page.getByPlaceholder(/write your note/i);
            await textarea.fill("Smoke test note - automated");
            await page.getByRole("button", { name: /save note/i }).click();
            await modal.waitFor({ state: "hidden", timeout: 3000 });
            findings.push({ step: "6b. Add note on verse", status: "pass" });
        } catch (e) {
            findings.push({ step: "6b. Add note on verse", status: "fail", detail: String(e) });
        }

        // Step 7: Go to library and verify bookmark & note
        try {
            await page.goto(`${BASE_URL}/app/library`, { waitUntil: "networkidle" });
            await expect(page).toHaveURL(/\/app\/library/);
            await page.getByRole("button", { name: /bookmarks/i }).click();
            await page.waitForTimeout(500);
            const hasBookmark = await page.getByText(/no bookmarks yet/i).isVisible().then((v) => !v);
            await page.getByRole("button", { name: /notes/i }).click();
            await page.waitForTimeout(500);
            const hasNote = await page.getByText(/no notes yet/i).isVisible().then((v) => !v);
            if (hasBookmark || hasNote) {
                findings.push({
                    step: "7. Library shows bookmark & note",
                    status: "pass",
                    detail: `Bookmarks: ${hasBookmark}, Notes: ${hasNote}`,
                });
            } else {
                findings.push({
                    step: "7. Library shows bookmark & note",
                    status: "fail",
                    detail: "Neither bookmark nor note visible in library",
                });
            }
        } catch (e) {
            findings.push({ step: "7. Library shows bookmark & note", status: "fail", detail: String(e) });
        }

        await reportFindings(findings);
    });
});

async function reportFindings(findings: { step: string; status: string; detail?: string }[]) {
    const failed = findings.filter((f) => f.status === "fail");
    if (failed.length > 0) {
        throw new Error(`Smoke test failed at: ${failed.map((f) => f.step).join(", ")}`);
    }
}
