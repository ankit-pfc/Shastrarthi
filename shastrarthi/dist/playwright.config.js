import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
    testDir: "./tests/visual",
    fullyParallel: true,
    retries: 0,
    use: {
        baseURL: "http://127.0.0.1:3000",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        extraHTTPHeaders: {
            "x-e2e-auth": "1",
        },
    },
    projects: [
        {
            name: "chromium",
            use: Object.assign({}, devices["Desktop Chrome"]),
        },
    ],
    webServer: {
        command: "npm run dev",
        url: "http://127.0.0.1:3000",
        reuseExistingServer: true,
        env: {
            E2E_AUTH_BYPASS: "1",
        },
    },
});
