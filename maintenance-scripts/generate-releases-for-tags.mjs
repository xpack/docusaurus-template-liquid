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
// Generates one blog post per git release tag that does not already have
// one, from the `website/blog/_templates/blog-post-release-liquid.mdx`
// template, with `releaseVersion`/`releaseDate` overridden per tag.
// Invoked via the consuming project's `generate-website-releases-from-tags`
// npm script (in `website/package.json`).

import { existsSync } from "fs";
import { execFileSync } from "child_process";
import path from "path";
import { pathToFileURL } from "url";

// ----------------------------------------------------------------------------

// Note: `process.argv[1]` is not resolved through symlinks (unlike
// `fileURLToPath(import.meta.url)`), matching bash `$0` behaviour. See the
// equivalent comment in `generate-website-commons.mjs`.
const scriptPath = path.resolve(process.argv[1]);
const scriptName = path.basename(scriptPath);
const scriptFolderPath = path.dirname(scriptPath);

// Runs as
// .../website/node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-releases-for-tags.mjs
const nodeModulesFolderPath = path.dirname(
  path.dirname(path.dirname(scriptFolderPath)),
);
const npmHelperMaintenanceScriptsPath = path.join(
  nodeModulesFolderPath,
  "@xpack",
  "npm-packages-helper",
  "maintenance-scripts",
);

const { parseOptions, computeContext, substitute } = await import(
  pathToFileURL(
    path.join(npmHelperMaintenanceScriptsPath, "scripts-helper.mjs"),
  ).href
);

// ----------------------------------------------------------------------------

// Formats a date as `YYYY-MM-DD`, matching bash's
// `date -r <seconds> '+%Y-%m-%d'`.
const formatDateYYYYMMDD = (date) => {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// Formats a date similar to bash's
// `date -r <seconds> '+%Y-%m-%d %H:%M:%S %z'`.
const formatReleaseDate = (date) => {
  const pad = (value) => String(value).padStart(2, "0");
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const offsetHours = pad(Math.floor(Math.abs(offsetMinutes) / 60));
  const offsetRemainder = pad(Math.abs(offsetMinutes) % 60);

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ` +
    `${sign}${offsetHours}${offsetRemainder}`
  );
};

// ----------------------------------------------------------------------------

const argv = process.argv.slice(2);

// Parse --dry-run, --xpack, --xpack-dev-tools, --micro-os-plus. Note: like
// `generate-blog-post.mjs`, the original bash script neither validates the
// category option nor requires an existing `website` folder to be the
// caller's cwd (it derives `website_folder_path` unconditionally instead).
const options = parseOptions(argv);

// Runs as
// .../website/node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-releases-for-tags.mjs
const projectFolderPath = path.dirname(
  path.dirname(path.dirname(path.dirname(path.dirname(scriptFolderPath)))),
);
const websiteFolderPath = path.join(projectFolderPath, "website");

// ----------------------------------------------------------------------------

// Process package.json files and leave results in the context object.
// Note: `websiteFolderPath` is intentionally omitted here, matching the
// bash script, which calls `compute_context` before `website_folder_path`
// is set, so website-specific config (config/website-templates.json etc.)
// is not processed.
const context = computeContext({
  projectFolderPath,
  options,
});

// ----------------------------------------------------------------------------

const processTag = (tag, seconds) => {
  const date = new Date(seconds * 1000);
  const version = tag.replace(/^v/, "");
  const releaseDate = formatReleaseDate(date);

  const postRelativeFilePath = `blog/${formatDateYYYYMMDD(date)}-${context.topConfig.permalinkName}-${tag.replace(/\./g, "-")}-released.mdx`;
  const postAbsoluteFilePath = path.join(
    websiteFolderPath,
    postRelativeFilePath,
  );

  if (existsSync(postAbsoluteFilePath)) {
    console.log(`File '${postRelativeFilePath}' already exists.`);
    return;
  }

  substitute({
    context: { ...context, releaseVersion: version, releaseDate },
    fromAbsoluteFolderPath: path.join(websiteFolderPath, "blog", "_templates"),
    fromRelativeFilePath: "blog-post-release-liquid.mdx",
    toRelativeFilePath: postRelativeFilePath,
    toAbsoluteFilePath: postAbsoluteFilePath,
    // Note: the bash script never sets `substitution_prefix` before
    // reaching the equivalent call, which actually crashes with an
    // "unbound variable" error (under `set -o nounset`) for any tag whose
    // post does not exist yet (verified). An empty prefix is used here
    // instead, matching what the bash code was evidently intended to do.
    substitutionPrefix: "",
    doDryRun: options.doDryRun,
  });
};

// ----------------------------------------------------------------------------

const tagLines = execFileSync(
  "git",
  [
    "for-each-ref",
    "--format=%(refname:short) %(creatordate:format:%s)",
    "refs/tags/*",
  ],
  { cwd: projectFolderPath, encoding: "utf8" },
)
  .split("\n")
  .filter((line) => line.length > 0);

for (const line of tagLines) {
  const [tag, seconds] = line.split(" ");
  processTag(tag, Number(seconds));
}

console.log();
console.log(`'${scriptName} ${argv.join(" ")}' done`);

process.exit(0);

// ----------------------------------------------------------------------------
