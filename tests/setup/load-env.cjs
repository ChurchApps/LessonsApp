const path = require("path");
const { loadEnvConfig } = require("@next/env");

const ROOT = path.resolve(__dirname, "..", "..");
loadEnvConfig(ROOT, true);
