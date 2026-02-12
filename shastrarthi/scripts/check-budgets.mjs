import fs from "node:fs";
import path from "node:path";

const nextDir = path.join(process.cwd(), ".next");
const maxBytes = 1500 * 1024;
const buildIdPath = path.join(nextDir, "BUILD_ID");

if (!fs.existsSync(nextDir)) {
    console.log("No .next build output found. Run `npm run build` first.");
    process.exit(0);
}

if (!fs.existsSync(buildIdPath)) {
    console.log("Production build artifacts not found. Run `npm run build` before perf:check.");
    process.exit(0);
}

let largest = { file: "", size: 0 };

function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            walk(full);
        } else if (name.endsWith(".js") && full.includes(`${path.sep}static${path.sep}chunks${path.sep}app${path.sep}`)) {
            if (stat.size > largest.size) {
                largest = { file: full, size: stat.size };
            }
        }
    }
}

walk(nextDir);

console.log(`Largest JS asset: ${largest.file} (${largest.size} bytes)`);

if (largest.size > maxBytes) {
    console.error(`Bundle budget exceeded: ${largest.size} > ${maxBytes}`);
    process.exit(1);
}

console.log("Bundle budget check passed.");
