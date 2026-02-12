import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
    testDir: "./tests/smoke",
    fullyParallel: false,
    retries: 0,
    use: {
        baseURL: process.env.SMOKE_BASE_URL || "http://localhost:3001",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "on-first-retry",
    },
    projects: [
        {
            name: "chromium",
            use: Object.assign({}, devices["Desktop Chrome"]),
        },
    ],
    // No webServer - app must already be running
});
