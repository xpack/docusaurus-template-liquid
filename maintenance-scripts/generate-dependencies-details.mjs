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
// Prints, as markdown, a bullet list of npmjs.com links for the consuming
// project's `dependencies` and `devDependencies` (from its `package.json`).
// Invoked via the `generate-dependencies-details` npm script (in
// `website/package.json`); output is meant to be pasted/included manually
// into documentation, not written to a file by this script itself.

import { mkdirSync, readFileSync } from "fs";
import path from "path";

// ----------------------------------------------------------------------------

// Note: `process.argv[1]` is not resolved through symlinks (unlike
// `fileURLToPath(import.meta.url)`), matching bash `$0` behaviour. See the
// equivalent comment in `generate-website-commons.mjs`.
const scriptPath = path.resolve(process.argv[1]);
const scriptFolderPath = path.dirname(scriptPath);

// ----------------------------------------------------------------------------

// This script parses only `--init` itself; unlike the other conversions, it
// does not use `scripts-helper.mjs`'s `parseOptions()`. Any other option
// (including the `--{{githubProjectOrganization}}` flag passed by the real
// npm script) is reported as unsupported, matching the original bash exactly.
const argv = process.argv.slice(2);

let doInit = false;
for (const arg of argv) {
  if (arg === "--init") {
    doInit = true;
  } else {
    console.log(`Unsupported option ${arg}`);
  }
}

// ----------------------------------------------------------------------------

// The script is invoked from the website via the following npm script:
// "generate-dependencies-details": "node node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-dependencies-details.mjs"
const currentFolderPath = path.dirname(
  path.dirname(path.dirname(path.dirname(scriptFolderPath))),
);

let projectFolderPath;

if (path.basename(currentFolderPath) === "website") {
  projectFolderPath = path.dirname(currentFolderPath);
} else if (doInit) {
  projectFolderPath = currentFolderPath;

  mkdirSync(path.join(projectFolderPath, "website"), { recursive: true });
} else {
  console.log("Not called from the website folder");
  process.exit(1);
}

// ----------------------------------------------------------------------------

const packageJson = JSON.parse(
  readFileSync(path.join(projectFolderPath, "package.json"), "utf8"),
);

const generateDetails = (key) => {
  const names = Object.keys(packageJson[key] ?? {});

  console.log();
  console.log(`\`${key}\`:`);
  console.log();

  if (names.length === 0) {
    console.log("- none");
  } else {
    for (const name of names) {
      console.log(`- https://www.npmjs.com/package/${name}`);
    }
  }
  console.log();
};

generateDetails("dependencies");
generateDetails("devDependencies");

// ----------------------------------------------------------------------------
