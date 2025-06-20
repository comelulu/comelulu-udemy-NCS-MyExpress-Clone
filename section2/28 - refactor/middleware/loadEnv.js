const path = require("path");
const fs = require("fs");

function loadEnv(file = ".env") {
  try {
    const envPath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(envPath)) return;

    const content = fs.readFileSync(envPath, "utf-8");
    content.split("\n").forEach((line) => {
      const cleanLine = line.trim();
      if (!cleanLine || cleanLine.startsWith("#")) return;

      const [key, ...vals] = cleanLine.split("=");
      const value = vals
        .join("=")
        .trim()
        .replace(/^['"]|['"]$/g, "");
      if (!process.env[key]) process.env[key] = value;
    });
    console.log(`✅ Environment variables loaded from ${file}`);
  } catch (err) {
    console.error(`❌ Failed to load env file: ${err.message}`);
  }
}

module.exports = loadEnv;
