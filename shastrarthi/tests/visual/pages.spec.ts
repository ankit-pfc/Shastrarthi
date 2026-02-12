import { test, expect } from "@playwright/test";

test("landing page visual baseline", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveScreenshot("landing-page.png", { fullPage: true });
});

test("app dashboard visual baseline", async ({ page }) => {
    await page.goto("/app");
    await expect(page).toHaveScreenshot("app-dashboard.png", { fullPage: true });
});

test("discover visual baseline", async ({ page }) => {
    await page.goto("/app/discover");
    await expect(page).toHaveScreenshot("app-discover.png", { fullPage: true });
});

test("reader visual baseline", async ({ page }) => {
    await page.goto("/app/reader/bhagavad-gita-chapter-2");
    await expect(page).toHaveScreenshot("app-reader.png", { fullPage: true });
});
