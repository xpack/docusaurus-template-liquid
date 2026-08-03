#!/usr/bin/env node

/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2024-2026 Liviu Ionescu. All rights reserved.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose is hereby granted, under the terms of the MIT license.
 *
 * If a copy of the license was not distributed with this file, it can be
 * obtained from https://opensource.org/licenses/mit.
 */

// ----------------------------------------------------------------------------
// Generates a new dated blog post announcing a release, from the liquid
// templates in the consuming project's `website/blog/_templates` folder,
// optionally embedding downloaded binary release SHA-256 checksums.
// Invoked via the consuming project's `generate-website-blog-post` npm
// script (in `website/package.json`).

import { execFileSync } from "child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { globSync } from "glob";
import { Liquid } from "liquidjs";

// ----------------------------------------------------------------------------

// Note: `process.argv[1]` is not resolved through symlinks (unlike
// `fileURLToPath(import.meta.url)`), matching bash `$0` behaviour. See the
// equivalent comment in `generate-website-commons.mjs`.
const scriptPath = path.resolve(process.argv[1]);
const scriptName = path.basename(scriptPath);
const scriptFolderPath = path.dirname(scriptPath);

// Runs as
// .../website/node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-blog-post.mjs
const nodeModulesFolderPath = path.dirname(
  path.dirname(path.dirname(scriptFolderPath)),
);
const npmHelperMaintenanceScriptsPath = path.join(
  nodeModulesFolderPath,
  "@xpack",
  "npm-packages-helper",
  "maintenance-scripts",
);

const { parseOptions, computeContext, downloadBinaries } = await import(
  pathToFileURL(
    path.join(npmHelperMaintenanceScriptsPath, "scripts-helper.mjs"),
  ).href
);

// ----------------------------------------------------------------------------

// Formats a date as `YYYY-MM-DD`, matching bash's `date '+%Y-%m-%d'`.
const formatDateYYYYMMDD = (date) => {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// Reads and concatenates the content of all `*.sha` files in a folder,
// replacing the bash `cat "${folder}"/*.sha` invocations. Returns an
// empty string if the folder, or any matching file, does not exist.
const readShaFilesConcatenated = (folderPath) => {
  const shaFiles = existsSync(folderPath)
    ? globSync("*.sha", { cwd: folderPath }).sort()
    : [];
  return shaFiles
    .map((shaFile) => readFileSync(path.join(folderPath, shaFile), "utf8"))
    .join("");
};

// Mirrors the bash `sed -e 's|$|\n|' | sed -e 's|  |\n|'` pipeline: each
// "<hash>  <name>" line becomes "<hash>\n<name>\n\n" (verified empirically
// against macOS sed, since `\n`-in-replacement semantics can differ
// between sed implementations).
const formatShaEntries = (shaConcatenated) =>
  shaConcatenated
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => {
      const index = line.indexOf("  ");
      return index < 0
        ? `${line}\n\n`
        : `${line.slice(0, index)}\n${line.slice(index + 2)}\n\n`;
    })
    .join("");

// ----------------------------------------------------------------------------

const argv = process.argv.slice(2);

// Parse --dry-run, --xpack, --xpack-dev-tools, --micro-os-plus. Note:
// unlike `generate-website-commons.mjs`, the original bash script neither
// validates the category option nor checks `do_dry_run` anywhere, so
// neither is replicated here.
const options = parseOptions(argv);

// The script is invoked via the following website npm script:
// "generate-website-blog-post": "node node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-blog-post.mjs --micro-os-plus"
const currentFolderPath = path.dirname(
  path.dirname(path.dirname(path.dirname(scriptFolderPath))),
);

let websiteFolderPath;
let projectFolderPath;

if (path.basename(currentFolderPath) === "website") {
  websiteFolderPath = currentFolderPath;
  projectFolderPath = path.dirname(currentFolderPath);
} else {
  console.log("Not called from the website folder");
  process.exit(1);
}

// ----------------------------------------------------------------------------

// Process package.json files and leave results in the context object.
const context = computeContext({
  projectFolderPath,
  websiteFolderPath,
  options,
});

// ----------------------------------------------------------------------------

console.log();

const version = context.xpackVersion || context.releaseVersion;

const postRelativeFilePath = `blog/${formatDateYYYYMMDD(new Date())}-${context.topConfig.permalinkName}-v${version.replace(/\./g, "-")}-released.mdx`;
const postFilePath = path.join(websiteFolderPath, postRelativeFilePath);

// Note: the bash "already there" guard is disabled (commented out) in
// the original script, so it is intentionally omitted here too.

const xpackBinariesFolderPath = path.join(
  process.env.HOME ?? "",
  "Downloads",
  "xpack-binaries",
  context.topConfig.permalinkName,
);

if (context.isXpackBinary) {
  downloadBinaries(context, xpackBinariesFolderPath);

  console.log();
  execFileSync("ls", ["-lL", xpackBinariesFolderPath], { stdio: "inherit" });

  console.log();
  process.stdout.write(readShaFilesConcatenated(xpackBinariesFolderPath));
}

// ----------------------------------------------------------------------------

rmSync(postFilePath, { force: true });
writeFileSync(postFilePath, "");

const blogTemplatesFolderPath = path.join(
  websiteFolderPath,
  "blog",
  "_templates",
);
const engine = new Liquid({
  root: [blogTemplatesFolderPath],
  partials: [blogTemplatesFolderPath],
  extname: ".liquid",
  strictFilters: true,
  strictVariables: true,
  lenientIf: true,
});

// Reads the template content directly (as the liquidjs CLI does for its
// `@path` template option), rather than renderFileSync()/Loader.lookup().
const renderTemplate = (templateName) =>
  engine.parseAndRenderSync(
    readFileSync(path.join(blogTemplatesFolderPath, templateName), "utf8"),
    context,
  );

const part1TemplatePath = path.join(
  blogTemplatesFolderPath,
  "blog-post-release-part-1-liquid.mdx",
);
const singleTemplatePath = path.join(
  blogTemplatesFolderPath,
  "blog-post-release-liquid.mdx",
);

if (existsSync(part1TemplatePath)) {
  console.log(`liquidjs -> ${postRelativeFilePath}`);

  const shaEntries = formatShaEntries(
    readShaFilesConcatenated(xpackBinariesFolderPath),
  );

  const content =
    renderTemplate("blog-post-release-part-1-liquid.mdx") +
    "\n" +
    "```txt\n" +
    shaEntries +
    "```\n" +
    renderTemplate("blog-post-release-part-2-liquid.mdx");

  writeFileSync(postFilePath, content);
} else if (existsSync(singleTemplatePath)) {
  console.log(`liquidjs -> ${postRelativeFilePath}`);

  writeFileSync(postFilePath, renderTemplate("blog-post-release-liquid.mdx"));
} else {
  console.log("No template found");
  process.exit(1);
}

console.log("Don't forget to manually solve the TODO action point!");

console.log();
console.log(`'${scriptName}' done`);

process.exit(0);

// ----------------------------------------------------------------------------
