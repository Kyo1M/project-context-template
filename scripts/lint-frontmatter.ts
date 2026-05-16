#!/usr/bin/env tsx
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import matter from "gray-matter";
import { parse as parseYaml } from "yaml";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");

const VALID_TYPES = [
  "minutes",
  "decision",
  "memo",
  "wiki",
  "task",
  "deliverable",
  "exploration",
  "topic",
] as const;

const VALID_STATUSES = [
  "draft",
  "active",
  "superseded",
  "archived",
  "done",
  "cancelled",
] as const;

const REQUIRED_FIELDS = ["type", "title", "date", "status"] as const;

const FILENAME_RE = /^(\d{8})_([a-z0-9]+(?:-[a-z0-9]+)*)\.(md|html)$/;

const CONTENT_DIRS = ["docs", "tasks"];

const EXEMPT_FILES = new Set([
  "docs/wiki/index.md",
]);

type Issue = { file: string; message: string };

const issues: Issue[] = [];

function record(file: string, message: string) {
  issues.push({ file, message });
}

function extractHtmlFrontmatter(source: string): unknown | null {
  const match = source.match(/^<!--\s*\n---\n([\s\S]*?)\n---\s*\n-->/);
  if (!match) return null;
  try {
    return parseYaml(match[1]);
  } catch (err) {
    return { __parseError: (err as Error).message };
  }
}

function isPlaceholderDate(value: unknown): boolean {
  return typeof value === "string" && value.includes("{{");
}

function validateFrontmatter(file: string, fm: Record<string, unknown>) {
  if ((fm as { __parseError?: string }).__parseError) {
    record(file, `frontmatter YAML parse error: ${(fm as { __parseError: string }).__parseError}`);
    return;
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in fm) || fm[field] === null || fm[field] === undefined || fm[field] === "") {
      record(file, `missing required frontmatter field: ${field}`);
    }
  }

  if (fm.type !== undefined && !VALID_TYPES.includes(fm.type as (typeof VALID_TYPES)[number])) {
    record(file, `invalid type: ${String(fm.type)}. allowed: ${VALID_TYPES.join(", ")}`);
  }

  if (fm.status !== undefined && !VALID_STATUSES.includes(fm.status as (typeof VALID_STATUSES)[number])) {
    record(file, `invalid status: ${String(fm.status)}. allowed: ${VALID_STATUSES.join(", ")}`);
  }

  if (fm.date !== undefined && !isPlaceholderDate(fm.date)) {
    const dateStr = String(fm.date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      record(file, `date must be YYYY-MM-DD format: got ${dateStr}`);
    }
  }

  for (const arrayField of ["topics", "tags", "derived_from", "related"]) {
    if (arrayField in fm && !Array.isArray(fm[arrayField])) {
      record(file, `${arrayField} must be an array`);
    }
  }
}

function validateFilename(file: string) {
  const basename = path.basename(file);
  if (basename === "index.md" || basename === ".gitkeep") return;
  if (!FILENAME_RE.test(basename)) {
    record(file, `filename must match yyyymmdd_<kebab-slug>.{md,html}: got ${basename}`);
  }
}

async function lintFile(absPath: string) {
  const relPath = path.relative(repoRoot, absPath).replace(/\\/g, "/");
  if (EXEMPT_FILES.has(relPath)) return;

  const source = await fs.readFile(absPath, "utf8");
  const ext = path.extname(absPath);

  let fm: Record<string, unknown> | null = null;

  if (ext === ".md") {
    const parsed = matter(source);
    if (Object.keys(parsed.data).length === 0) {
      record(relPath, "no frontmatter detected");
      return;
    }
    fm = parsed.data;
  } else if (ext === ".html") {
    const result = extractHtmlFrontmatter(source);
    if (result === null) {
      record(relPath, "no HTML-comment frontmatter detected (<!-- --- ... --- -->)");
      return;
    }
    fm = result as Record<string, unknown>;
  } else {
    return;
  }

  validateFrontmatter(relPath, fm);
  validateFilename(relPath);
}

async function main() {
  const patterns = CONTENT_DIRS.map((dir) => `${dir}/**/*.{md,html}`);
  const files = await fg(patterns, {
    cwd: repoRoot,
    absolute: true,
    ignore: ["**/.gitkeep"],
  });

  if (files.length === 0) {
    console.log("no content files yet — nothing to lint.");
    return;
  }

  for (const file of files) {
    await lintFile(file);
  }

  if (issues.length > 0) {
    console.error(`\n${issues.length} issue(s) found:\n`);
    for (const issue of issues) {
      console.error(`  ${issue.file}: ${issue.message}`);
    }
    process.exit(1);
  }

  console.log(`OK — ${files.length} file(s) passed frontmatter lint.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
