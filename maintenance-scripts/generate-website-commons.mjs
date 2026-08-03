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
// Generates (or refreshes) the website common files of a xpack/
// xpack-dev-tools/micro-os-plus project, from the liquid templates in the
// sibling `templates/docusaurus` folder. Invoked via the consuming
// project's `generate-website-commons` npm script (in `website/package.json`).

import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
} from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { globSync } from "glob";

// ----------------------------------------------------------------------------

// Note: `process.argv[1]` is not resolved through symlinks (unlike
// `fileURLToPath(import.meta.url)`), matching bash `$0` behaviour. This
// matters because `@xpack/docusaurus-template-liquid` is typically
// installed as a symlink to a shared checkout, and both the project folder
// location and the sibling `@xpack/npm-packages-helper` package are
// derived from the invocation path, not the real script location. For the
// same reason, the helper is loaded with a dynamic import of a computed
// absolute path rather than a static relative specifier, which Node would
// resolve against the real (symlink-followed) location of this file
// instead.
const scriptPath = path.resolve(process.argv[1]);
const scriptName = path.basename(scriptPath);
const scriptFolderPath = path.dirname(scriptPath);

// Runs as
// .../website/node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-website-commons.mjs
const nodeModulesFolderPath = path.dirname(
  path.dirname(path.dirname(scriptFolderPath)),
);
const npmHelperMaintenanceScriptsPath = path.join(
  nodeModulesFolderPath,
  "@xpack",
  "npm-packages-helper",
  "maintenance-scripts",
);

const {
  parseOptions,
  checkIfShouldIgnorePath,
  prepareToPaths,
  computeContext,
  substitute,
  processFile,
} = await import(
  pathToFileURL(
    path.join(npmHelperMaintenanceScriptsPath, "scripts-helper.mjs"),
  ).href
);

// ----------------------------------------------------------------------------

const templatesFolderPath = path.join(
  path.dirname(scriptFolderPath),
  "templates",
);

// Formats a date as `YYYY-MM-DD`, matching bash's `date '+%Y-%m-%d'`.
const formatDateYYYYMMDD = (date) => {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// ----------------------------------------------------------------------------

// Removes the destination folder corresponding to a template folder named
// `_common`, replacing the `--remove-folder` branch of the bash
// `process-template-item.sh` script.
const removeCommonFolder = (relativeFolderPath, websiteFolderPath, options) => {
  if (checkIfShouldIgnorePath(relativeFolderPath, options.acceptedPath)) {
    return;
  }

  const fromRelativeFolderPath = relativeFolderPath.replace(/^\.\//, "");
  const fromAbsoluteFolderPath = path.join(
    templatesFolderPath,
    "docusaurus",
    "common",
    fromRelativeFolderPath,
  );
  if (!statSync(fromAbsoluteFolderPath).isDirectory()) {
    console.log(`${fromRelativeFolderPath} not a folder`);
    process.exit(1);
  }

  // Note: unlike prepareToPaths(), _micro-os-plus is intentionally not
  // substituted here, matching the original bash behaviour.
  const toRelativeFolderPath = relativeFolderPath
    .replace("/_xpack/", "/")
    .replace("/_xpack-dev-tools/", "/")
    .replace(/^\.\//, "");
  const toAbsoluteFolderPath = path.join(
    websiteFolderPath,
    toRelativeFolderPath,
  );

  if (existsSync(toAbsoluteFolderPath)) {
    console.log(`rm ${toRelativeFolderPath}`);
    if (!options.doDryRun) {
      rmSync(toAbsoluteFolderPath, { recursive: true, force: true });
    }
  }
};

// Computes the destination paths to skip for this particular project
// configuration, then delegates to processFile() for the actual
// copy/liquid substitution. Replaces the default branch of the bash
// `process-template-item.sh` script.
const processTemplateItem = (relativeFilePath, websiteFolderPath, params) => {
  const {
    context,
    options,
    doForce,
    fromAbsoluteFolderPath,
    substitutionPrefix,
  } = params;

  if (checkIfShouldIgnorePath(relativeFilePath, options.acceptedPath)) {
    return;
  }

  const { fromRelativeFilePath, toRelativeFilePath, toAbsoluteFilePath } =
    prepareToPaths(relativeFilePath, websiteFolderPath);

  if (path.basename(fromRelativeFilePath) === ".DS_Store") {
    // Skip macOS specifics, silently (the "ignored" echo is commented out
    // in the original bash script, unlike the other template generators).
    return;
  }

  // Duplicate, already present in processFile().
  // if (existsSync(toAbsoluteFilePath) && !doForce) {
  //   console.log(`already present: ${toRelativeFilePath}`)
  //   return
  // }

  // --------------------------------------------------------------------------
  // Compute exclusions.

  const skipPages = [];

  const topConfig = context.topConfig;
  const websiteConfig = context.websiteConfig;

  if (options.isXpack) {
    if (topConfig.isOrganisationWeb) {
      skipPages.push(
        "docs/developer/_test-results.mdx",
        "docs/faq/index-liquid.mdx",
        "docs/getting-started/_common/_commonjs-compatibility.mdx",
        "docs/getting-started/_common/_github-and-npmjs.mdx",
        "docs/getting-started/_compatibility.mdx",
        "docs/getting-started/_overview.mdx",
        "docs/getting-started/_status.mdx",
        "docs/install/index-liquid.mdx",
        "docs/maintainer/_more.mdx",
        "docs/releases/index.mdx",
      );
    }

    if (!websiteConfig.hasMetadataMinimum) {
      skipPages.push("docs/metadata/_common/_minimum-required.mdx");
    }

    if (!topConfig.hasCli) {
      skipPages.push(
        "docs/install/_common/_prerequisites-cli.mdx",
        "docs/install/_common/_install-cli.mdx",
        "docs/install/_common/_no-administrative-rights.mdx",
        "docs/install/_project/_more-install.mdx",
        "docs/install/_project/_troubleshooting-windows.mdx",
      );
    } else {
      skipPages.push(
        "docs/install/_common/_prerequisites-module.mdx",
        "docs/install/_common/_install-module.mdx",
      );
    }

    if (!websiteConfig.hasPolicies) {
      skipPages.push("docs/user/policies/_common/_policies.mdx");
    }

    if (websiteConfig.skipContributorGuide) {
      skipPages.push(
        "docs/developer/_common/_prerequisites.mdx",
        "docs/developer/_common/_get-project-sources.mdx",
        "docs/developer/_coverage-exceptions.mdx",
        "docs/developer/_style-exceptions.mdx",
        "docs/developer/_test-results.mdx",
        "docs/developer/index.mdx",
      );
    }
  } else if (options.isXpackDevTools) {
    if (topConfig.isOrganisationWeb) {
      skipPages.push(
        "blog/_common/_download-analytics.mdx",
        "docs/_common/_branches-details.mdx",
        "docs/_common/_build-website-locally.mdx",
        "docs/_common/_code-formatting.mdx",
        "docs/_common/_continuous-integration.mdx",
        "docs/_common/_generate-top-commons.mdx",
        "docs/_common/_generate-website-commons.mdx",
        "docs/_common/_get-helper-sources-details.mdx",
        "docs/_common/_get-project-sources.mdx",
        "docs/_common/_manual-tests.mdx",
        "docs/_common/_prepare-website.mdx",
        "docs/_common/_prerequisites.mdx",
        "docs/_common/_publish-website.mdx",
        "docs/_common/_release-schedule-continuous.mdx",
        "docs/_common/_start-local-web-server.mdx",
        "docs/_common/_xpm-clean-ups.mdx",
        "docs/_project/_development-durations.mdx",
        "docs/_project/_documentation.mdx",
        "docs/_project/_folders-hierarchies-linux.mdx",
        "docs/_project/_folders-hierarchies-macos.mdx",
        "docs/_project/_folders-hierarchies-windows.mdx",
        "docs/_project/_github-actions-durations.mdx",
        "docs/_project/_release-schedule.mdx",
        "docs/about/_common/HistoryXpm/index.tsx",
        "docs/developer/_common/_platform-docker-section.mdx",
        "docs/developer/_common/_platform-native-section.mdx",
        "docs/developer/_more.mdx",
        "docs/developer/_other-repositories.mdx",
        "docs/faq/_common/_flatpack-snap.mdx",
        "docs/faq/_common/_nixos.mdx",
        "docs/faq/_more.mdx",
        "docs/faq/index.mdx",
        "docs/maintainer/_check-upstream-release.mdx",
        "docs/maintainer/_common/_gcc-check-upstream-release.mdx",
        "docs/maintainer/_common/_arm-toolchain-check-upstream-release.mdx",
        "docs/maintainer/_common/_arm-toolchain-get-upstream-versions.mdx",
        "docs/maintainer/_common/_arm-toolchain-update-version-specific.mdx",
        "docs/maintainer/_common/_platform-docker-build.mdx",
        "docs/maintainer/_common/_platform-native-build.mdx",
        "docs/maintainer/_development-durations.mdx",
        "docs/maintainer/_first-development-run.mdx",
        "docs/maintainer/_first-production-run.mdx",
        "docs/maintainer/_github-actions-durations.mdx",
        "docs/maintainer/_more-repos.mdx",
        "docs/maintainer/_more-tests.mdx",
        "docs/maintainer/_patches.mdx",
        "docs/maintainer/_share-custom.mdx",
        "docs/maintainer/_update-version-specific.mdx",
        "docs/releases/index.md",
        "docs/user/_common/_arm-toolchain-versioning.mdx",
        "docs/user/_common/_libraries-and-rpath.mdx",
        "docs/user/_common/_versioning.mdx",
        "docs/user/_more.mdx",
        "docs/user/_use-in-testing.mdx",
        "docs/user/_versioning.mdx",
      );
    } else {
      if (!websiteConfig.isArmToolchain) {
        skipPages.push(
          "docs/maintainer/_common/_arm-toolchain-check-upstream-release.mdx",
          "docs/maintainer/_common/_arm-toolchain-get-upstream-versions.mdx",
          "docs/maintainer/_common/_arm-toolchain-update-version-specific.mdx",
          "docs/user/_common/_arm-toolchain-versioning.mdx",
        );
      }

      skipPages.push(
        "src/components/HomepageTools/index.tsx",
        "src/components/HomepageTools/styles.module.css",
      );
    }

    if (context.githubProjectName === "xpack-build-box") {
      skipPages.push(
        "docs/_common/_branches-details.mdx",
        "docs/_common/_build-website-locally.mdx",
        "docs/_common/_code-formatting.mdx",
        "docs/_common/_continuous-integration.mdx",
        "docs/_common/_generate-top-commons.mdx",
        "docs/_common/_generate-website-commons.mdx",
        "docs/_common/_get-helper-sources-details.mdx",
        "docs/_common/_get-project-sources.mdx",
        "docs/_common/_manual-tests.mdx",
        "docs/_common/_prepare-website.mdx",
        "docs/_common/_prerequisites.mdx",
        "docs/_common/_publish-website.mdx",
        "docs/_common/_release-schedule-continuous.mdx",
        "docs/_common/_start-local-web-server.mdx",
        "docs/_common/_xpm-clean-ups.mdx",
        "docs/_project/_development-durations.mdx",
        "docs/_project/_folders-hierarchies-linux.mdx",
        "docs/_project/_folders-hierarchies-macos.mdx",
        "docs/_project/_folders-hierarchies-windows.mdx",
        "docs/_project/_github-actions-durations.mdx",
        "docs/_project/_release-schedule.mdx",
        "docs/getting-started/_common/_benefits.mdx",
        "docs/getting-started/_common/_details-reproducible-operations.mdx",
        "docs/getting-started/_common/_features.mdx",
        "docs/getting-started/_common/_install-preamble.mdx",
        "docs/getting-started/_common/_what-are-xpm-packages.mdx",
      );
    }
  }

  if (!websiteConfig.hasCustomDeveloper) {
    skipPages.push("docs/developer/_project/_content.mdx");
  } else {
    skipPages.push(
      "docs/developer/_common/_content.mdx",
      "docs/developer/_project/_coverage-exceptions.mdx",
      "docs/developer/_project/_style-exceptions.mdx",
      "docs/developer/_project/_test-results.mdx",
      "docs/developer/_project/_more.mdx",
      "docs/developer/_project/_other-repositories.mdx",
    );
  }

  if (websiteConfig.skipContributorGuide) {
    skipPages.push(
      "docs/developer/index.mdx",
      "docs/developer/_common/_content.mdx",
      "docs/developer/_common/_platform-docker-section.mdx",
      "docs/developer/_common/_platform-native-section.mdx",
      "docs/developer/_project/_more.mdx",
      "docs/developer/_project/_other-repositories.mdx",
    );
  }

  if (!websiteConfig.hasCustomGettingStarted) {
    skipPages.push("docs/getting-started/_project/_content.mdx");
  } else {
    // Keep _common/_license, _common/_credits, _common/_enjoyed-using,
    // _common/_xpm-xcdl-features.
    skipPages.push(
      "docs/getting-started/_common/_change-log.mdx",
      "docs/getting-started/_common/_commonjs-compatibility.mdx",
      "docs/getting-started/_common/_content.mdx",
      "docs/getting-started/_common/_github-and-npmjs.mdx",
      "docs/getting-started/_common/_releases.mdx",
      "docs/getting-started/_common/_support-and-feedback.mdx",
      "docs/getting-started/_project/_compatibility.mdx",
      "docs/getting-started/_project/_compatibility-notices.mdx",
      "docs/getting-started/_project/_more-credits.mdx",
      "docs/getting-started/_project/_overview.mdx",
      "docs/getting-started/_project/_status.mdx",
      "docs/getting-started/_project/_more.mdx",
      "docs/getting-started/_project/_upgrade-notice.mdx",
    );
  }

  if (websiteConfig.skipInstallGuide) {
    skipPages.push(
      "docs/_shared/_folders-hierarchies-linux.mdx",
      "docs/_shared/_folders-hierarchies-macos.mdx",
      "docs/_shared/_folders-hierarchies-windows.mdx",
      "docs/install/index.mdx",
      "docs/install/_common/_content.mdx",
      "docs/install/_common/_prerequisites-module.mdx",
      "docs/install/_common/_install-module.mdx",
      "docs/install/_common/_automatic-install-quick-test.mdx",
      "docs/install/_common/_manual-install-quick-test.mdx",
      "docs/install/_project/_content.mdx",
      "docs/install/_project/_troubleshooting-windows.mdx",
      "docs/install/_project/_automatic-install-quick-test.mdx",
      "docs/install/_project/_manual-install-quick-test.mdx",
      "docs/install/_project/_miscellaneous.mdx",
      "docs/install/_project/_testing.mdx",
    );
  }

  if (websiteConfig.skipInstallCommand) {
    skipPages.push(
      "docs/_shared/_folders-hierarchies-linux.mdx",
      "docs/_shared/_folders-hierarchies-macos.mdx",
      "docs/_shared/_folders-hierarchies-windows.mdx",
      "docs/install/_common/_automatic-install-quick-test.mdx",
      "docs/install/_common/_manual-install-quick-test.mdx",
      "docs/install/_common/_cli-liquid.mdx",
      "docs/install/_common/_no-administrative-rights.mdx",
      "docs/install/_project/_automatic-install-quick-test.mdx",
      "docs/install/_project/_manual-install-quick-test.mdx",
      "docs/install/_project/_miscellaneous.mdx",
      "docs/install/_project/_testing.mdx",
      "docs/install/_project/_troubleshooting-windows.mdx",
      "docs/getting-started",
    );
  }

  if (!websiteConfig.hasCustomInstall) {
    skipPages.push("docs/install/_project/_content.mdx");
  } else {
    skipPages.push(
      "docs/install/_common/_content.mdx",
      "docs/install/_common/_initialise-the-project.mdx",
      "docs/install/_common/_installation-details.mdx",
      "docs/install/_common/_reproducibility-and-dependencies.mdx",
      "docs/install/_common/_uninstall.mdx",
      "docs/install/_common/_xpm-package-refresher.mdx",
      "docs/install/_project/_troubleshooting-windows.mdx",
    );
  }

  if (!websiteConfig.hasCustomMaintainer) {
    skipPages.push("docs/maintainer/_project/_content.mdx");
  } else {
    skipPages.push(
      "docs/maintainer/_common/_content.mdx",
      "docs/maintainer/_common/_gcc-check-upstream-release.mdx",
      "docs/maintainer/_common/_platform-docker-build.mdx",
      "docs/maintainer/_common/_platform-native-build.mdx",
      "docs/maintainer/_common/_analytics.mdx",
      "docs/maintainer/_common/_check-git.mdx",
      "docs/maintainer/_common/_ci-tests.mdx",
      "docs/maintainer/_common/_close-milestone.mdx",
      "docs/maintainer/_common/_close-open-issues.mdx",
      "docs/maintainer/_common/_fix-open-issues.mdx",
      "docs/maintainer/_common/_increase-version.mdx",
      "docs/maintainer/_common/_prepare-new-blog-post.mdx",
      "docs/maintainer/_common/_prepare-release.mdx",
      "docs/maintainer/_common/_publish-release.mdx",
      "docs/maintainer/_common/_set-new-version.mdx",
      "docs/maintainer/_common/_share-on-twitter.mdx",
      "docs/maintainer/_common/_tag-npm-latest.mdx",
      "docs/maintainer/_common/_update-changelog.mdx",
      "docs/maintainer/_common/_update-main-branch.mdx",
      "docs/maintainer/_common/_update-website-config.mdx",
      "docs/maintainer/_project/_check-upstream-release.mdx",
      "docs/maintainer/_project/_custom.mdx",
      "docs/maintainer/_project/_dependencies-detail.mdx",
      "docs/maintainer/_project/_first-development-run.mdx",
      "docs/maintainer/_project/_first-production-run.mdx",
      "docs/maintainer/_project/_more.mdx",
      "docs/maintainer/_project/_more-repos.mdx",
      "docs/maintainer/_project/_more-tests.mdx",
      "docs/maintainer/_project/_patches.mdx",
      "docs/maintainer/_project/_share-custom.mdx",
      "docs/maintainer/_project/_update-version-specific.mdx",
    );
  }

  if (!websiteConfig.hasCustomAbout) {
    skipPages.push("docs/project/about/_project/_content.mdx");
  } else {
    skipPages.push("docs/project/about/_common/_the-project.mdx");
  }

  if (!websiteConfig.hasCustomUser) {
    if (context.isXpackBinary) {
      skipPages.push("docs/user/_project/_content.mdx");
    }
  } else {
    skipPages.push(
      "docs/user/_project/_more.mdx",
      "docs/user/_project/_use-in-testing.mdx",
      "docs/user/_project/_versioning.mdx",
      "docs/user/_common/_arm-toolchain-versioning.mdx",
      "docs/user/_common/_libraries-and-rpath.mdx",
    );
  }

  if (websiteConfig.hasCustomConfigDoxyfile) {
    skipPages.push("doxygen/config.doxyfile");
  }

  if (websiteConfig.skipReleases) {
    skipPages.push(
      "docs/releases/index.mdx",
      "blog/_common/_download-analytics.mdx",
      "blog/_common/_prerequisites.mdx",
    );
  }

  if (websiteConfig.skipFaq) {
    skipPages.push(
      "docs/faq/index.mdx",
      "docs/faq/_project/_content.mdx",
      "docs/faq/_common/_flatpack-snap.mdx",
      "docs/faq/_common/_nixos.mdx",
    );
  }

  if (!websiteConfig.isGccToolchain) {
    skipPages.push(
      "docs/_common/_gcc-release-schedule.mdx",
      "docs/maintainer/_common/_first-development-run-gcc.mdx",
    );
  }

  if (!context.isXpackBinary) {
    skipPages.push(
      "blog/_common/_deprecation-notices-glib-2.27.mdx",
      "blog/_common/_deprecation-notices-glib-2.28.mdx",
      "blog/_common/_prerequisites-glib-2.27.mdx",
      "blog/_common/_prerequisites-glib-2.28.mdx",
      "blog/2025-02-13-xbb.mdx",
      "docs/_shared/_development-durations.mdx",
      "docs/_shared/_github-actions-durations.mdx",
      "docs/faq/_common/_flatpack-snap.mdx",
      "docs/faq/_common/_nixos.mdx",
      "docs/user/_common/_versioning.mdx",
    );
  }

  if (websiteConfig.hasCustomHomepageFeatures) {
    skipPages.push("src/components/HomepageFeatures/FeatureList.tsx");
  } else {
    skipPages.push("src/components/HomepageFeatures/CustomFeatureList.tsx");
  }

  if (!websiteConfig.hasHomepageTools) {
    skipPages.push("src/components/HomepageTools/styles.module.css");
  }

  if (!context.isNpmPublished) {
    skipPages.push("blog/_common/_download-analytics.mdx");
  }

  if (!websiteConfig.hasCustomUserSidebar) {
    skipPages.push("sidebar-docs-user-custom.js");
  }

  if (!websiteConfig.hasCustomGettingStartedSidebar) {
    skipPages.push("sidebar-docs-getting-started-custom.ts");
  }

  if (websiteConfig.skipTests) {
    skipPages.push("docs/developer/_project/_test-results.mdx");
  }

  if (!topConfig.isTypescript) {
    skipPages.push(
      "config/api-extractor-original.json",
      "config/api-extractor.json",
      "config/patch-doc-model-json.sh",
      "config/tsconfig-api-extractor.json",
      "config/tsdoc2docusaurus.json",
      "config/README.md",
    );
  }

  // --------------------------------------------------------------------------

  if (skipPages.includes(toRelativeFilePath)) {
    console.log(`skipped: ${toRelativeFilePath}`);
    return;
  }

  processFile({
    context,
    fromAbsoluteFolderPath,
    fromRelativeFilePath,
    toRelativeFilePath,
    toAbsoluteFilePath,
    substitutionPrefix,
    doForce,
    doDryRun: options.doDryRun,
  });
};

// ----------------------------------------------------------------------------

const argv = process.argv.slice(2);

// Parse --init, --dry-run, --xpack, --xpack-dev-tools, --micro-os-plus.
const options = parseOptions(argv);

if (!options.isXpack && !options.isXpackDevTools && !options.isMicroOsPlus) {
  console.log("Unsupported configuration...");
  process.exit(1);
}

// The script is invoked via the following website npm script:
// "generate-website-commons": "node node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-website-commons.mjs"
const currentFolderPath = path.dirname(
  path.dirname(path.dirname(path.dirname(scriptFolderPath))),
);

let websiteFolderPath;
let projectFolderPath;

if (path.basename(currentFolderPath) === "website") {
  websiteFolderPath = currentFolderPath;
  projectFolderPath = path.dirname(currentFolderPath);
} else if (options.doInit) {
  projectFolderPath = currentFolderPath;
  websiteFolderPath = path.join(projectFolderPath, "website");

  mkdirSync(websiteFolderPath, { recursive: true });
} else {
  console.log("Not called from the website folder");
  process.exit(1);
}

let templatesRelativeFolderPath = templatesFolderPath.startsWith(
  `${projectFolderPath}/`,
)
  ? templatesFolderPath.slice(projectFolderPath.length + 1)
  : templatesFolderPath;
templatesRelativeFolderPath = templatesRelativeFolderPath.replace(
  /^.*?node_modules\/@xpack\//,
  "",
);
templatesRelativeFolderPath = templatesRelativeFolderPath.replace(
  /^.*?node_modules\/@micro-os-plus\//,
  "",
);

// ----------------------------------------------------------------------------

// Process package.json files and leave results in the context object.
const context = computeContext({
  projectFolderPath,
  websiteFolderPath,
  options,
});

// ----------------------------------------------------------------------------

if (options.doDryRun) {
  console.log();
  console.log("Dry run!");
}

// ----------------------------------------------------------------------------

if (options.doInit) {
  if (options.isMicroOsPlus) {
    const websiteDoxyfilePath = path.join(
      projectFolderPath,
      "website",
      "config.doxyfile",
    );
    if (existsSync(websiteDoxyfilePath)) {
      const oldWebsitePath = path.join(projectFolderPath, "website");
      const doxygenPath = path.join(projectFolderPath, "doxygen");
      renameSync(oldWebsitePath, doxygenPath);
      mkdirSync(oldWebsitePath, { recursive: true });
      renameSync(doxygenPath, path.join(oldWebsitePath, "doxygen"));
      rmSync(path.join(oldWebsitePath, "doxygen", "package.json"), {
        force: true,
      });
      rmSync(path.join(oldWebsitePath, "doxygen", "package-lock.json"), {
        force: true,
      });
    }

    // Destructive, it does not merge.
    substitute({
      context,
      fromAbsoluteFolderPath: path.join(
        templatesFolderPath,
        "docusaurus",
        "common",
      ),
      fromRelativeFilePath: "package-merge-liquid.json",
      toRelativeFilePath: "package.json",
      toAbsoluteFilePath: path.join(websiteFolderPath, "package.json"),
      substitutionPrefix: "",
      doDryRun: options.doDryRun,
    });

    const blogPostFileName = `${formatDateYYYYMMDD(new Date())}-website.mdx`;
    substitute({
      context,
      fromAbsoluteFolderPath: path.join(
        templatesFolderPath,
        "docusaurus",
        "other",
        "_micro-os-plus",
      ),
      fromRelativeFilePath: "first-website-post-liquid.mdx",
      toRelativeFilePath: blogPostFileName,
      toAbsoluteFilePath: path.join(
        websiteFolderPath,
        "blog",
        blogPostFileName,
      ),
      substitutionPrefix: "",
      doDryRun: options.doDryRun,
    });

    process.exit(0);
  } else if (options.isXpack) {
    // Destructive, it does not merge.
    substitute({
      context,
      fromAbsoluteFolderPath: path.join(
        templatesFolderPath,
        "docusaurus",
        "common",
      ),
      fromRelativeFilePath: "package-merge-liquid.json",
      toRelativeFilePath: "package.json",
      toAbsoluteFilePath: path.join(websiteFolderPath, "package.json"),
      substitutionPrefix: "",
      doDryRun: options.doDryRun,
    });
  } else {
    console.log("--init not implemented yet");
    process.exit(1);
  }
} else {
  console.log();
  console.log(`Processing template from ${templatesFolderPath}/docusaurus...`);

  console.log();
  console.log("Common files, cleanups...");

  const commonFolderPath = path.join(
    templatesFolderPath,
    "docusaurus",
    "common",
  );

  // Preliminary pass to remove _common folders.
  const commonDirs = globSync("**/_common", {
    cwd: commonFolderPath,
    dot: true,
  })
    .filter((entry) =>
      statSync(path.join(commonFolderPath, entry)).isDirectory(),
    )
    .sort();

  for (const relativeFolderPath of commonDirs) {
    removeCommonFolder(`./${relativeFolderPath}`, websiteFolderPath, options);
  }

  console.log();
  console.log("Common files, overridden...");

  const commonSubstitutionPrefix = `${templatesRelativeFolderPath}/common`;

  // Main pass to copy/generate common files.
  const commonFiles = globSync("**/*", {
    cwd: commonFolderPath,
    dot: true,
    nodir: true,
  }).sort();

  for (const relativeFilePath of commonFiles) {
    processTemplateItem(`./${relativeFilePath}`, websiteFolderPath, {
      context,
      options,
      doForce: true,
      fromAbsoluteFolderPath: commonFolderPath,
      substitutionPrefix: commonSubstitutionPrefix,
    });
  }

  console.log();
  console.log("First time proposals...");

  const firstTimeFolderPath = path.join(
    templatesFolderPath,
    "docusaurus",
    "first-time",
  );
  const firstTimeSubstitutionPrefix = `${templatesRelativeFolderPath}/first-time`;

  const firstTimeFiles = existsSync(firstTimeFolderPath)
    ? globSync("**/*", {
        cwd: firstTimeFolderPath,
        dot: true,
        nodir: true,
      }).sort()
    : [];

  for (const relativeFilePath of firstTimeFiles) {
    processTemplateItem(`./${relativeFilePath}`, websiteFolderPath, {
      context,
      options,
      doForce: false,
      fromAbsoluteFolderPath: firstTimeFolderPath,
      substitutionPrefix: firstTimeSubstitutionPrefix,
    });
  }

  if (
    context.githubProjectOrganization === "xpack" ||
    context.githubProjectOrganization === "xpack-dev-tools"
  ) {
    console.log();
    console.log("Regenerate top README.md...");

    const readmePath = path.join(projectFolderPath, "README.md");
    const readmeLineCount =
      readFileSync(readmePath, "utf8").split("\n").length - 1;
    if (readmeLineCount >= 42) {
      const readmeLongPath = path.join(projectFolderPath, "README-long.md");
      console.log(`mv ${readmePath} -> ${readmeLongPath}`);
      renameSync(readmePath, readmeLongPath);
    }

    console.log();
    substitute({
      context,
      fromAbsoluteFolderPath: path.join(
        templatesFolderPath,
        "docusaurus",
        "other",
      ),
      fromRelativeFilePath: "README-TOP-liquid.md",
      toRelativeFilePath: "README.md",
      toAbsoluteFilePath: path.join(projectFolderPath, "README.md"),
      substitutionPrefix: "",
      doDryRun: options.doDryRun,
    });
  } else if (context.githubProjectOrganization === "micro-os-plus") {
    substitute({
      context,
      fromAbsoluteFolderPath: path.join(
        templatesFolderPath,
        "docusaurus",
        "other",
      ),
      fromRelativeFilePath: "README-TOP-MICRO-OS-liquid.md",
      toRelativeFilePath: "README.md",
      toAbsoluteFilePath: path.join(projectFolderPath, "README.md"),
      substitutionPrefix: "",
      doDryRun: options.doDryRun,
    });
  }
}

// ----------------------------------------------------------------------------

console.log();
console.log(`'${scriptName} ${argv.join(" ")}' done`);

process.exit(0);

// ----------------------------------------------------------------------------
