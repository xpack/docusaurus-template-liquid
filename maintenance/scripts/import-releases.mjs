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
// Imports the release posts of a single xpack/xpack-dev-tools/micro-os-plus
// project from its `website/_xpack.github.io/_posts/releases` folder into
// `website/blog`. Thin wrapper around the shared `importReleases()` helper.
// Invoked via the consuming project's `import-website-releases` npm script
// (in `website/package.json`).

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
// .../website/node_modules/@xpack/docusaurus-template-liquid/maintenance/scripts/import-releases.mjs
const nodeModulesFolderPath = path.dirname(
  path.dirname(path.dirname(path.dirname(scriptFolderPath))),
);
const npmHelperMaintenanceScriptsPath = path.join(
  nodeModulesFolderPath,
  "@xpack",
  "npm-packages-helper",
  "maintenance/scripts",
);

const { parseOptions, importReleases } = await import(
  pathToFileURL(
    path.join(npmHelperMaintenanceScriptsPath, "scripts-helper.mjs"),
  ).href
);

// ----------------------------------------------------------------------------

const argv = process.argv.slice(2);

// Parse --xpack, --xpack-dev-tools, --micro-os-plus. Note: like the
// original bash script, the parsed options are not otherwise used, since
// `importReleases()` itself does not take a category option.
parseOptions(argv);

// Runs as
// .../website/node_modules/@xpack/docusaurus-template-liquid/maintenance/scripts/import-releases.mjs
const projectFolderPath = path.dirname(
  path.dirname(path.dirname(path.dirname(path.dirname(path.dirname(scriptFolderPath))))),
);

importReleases(projectFolderPath, scriptFolderPath);

console.log();
console.log(`'${scriptName} ${argv.join(" ")}' done`);

process.exit(0);

// ----------------------------------------------------------------------------
