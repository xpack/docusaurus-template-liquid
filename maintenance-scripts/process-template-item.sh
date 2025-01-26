#!/usr/bin/env bash

# -----------------------------------------------------------------------------
#
# This file is part of the xPack project (http://xpack.github.io).
# Copyright (c) 2024 Liviu Ionescu.  All rights reserved.
#
# Permission to use, copy, modify, and/or distribute this software
# for any purpose is hereby granted, under the terms of the MIT license.
#
# If a copy of the license was not distributed with this file, it can
# be obtained from https://opensource.org/licenses/mit/.
#
# -----------------------------------------------------------------------------

# -----------------------------------------------------------------------------
# Safety settings (see https://gist.github.com/ilg-ul/383869cbb01f61a51c4d).

if [[ ! -z ${DEBUG} ]]
then
  set ${DEBUG} # Activate the expand mode if DEBUG is anything but empty.
else
  DEBUG=""
fi

set -o errexit # Exit if command failed.
set -o pipefail # Exit if pipe failed.
set -o nounset # Exit if variable not set.

# Remove the initial space and instead use '\n'.
IFS=$'\n\t'

# -----------------------------------------------------------------------------
# Identify the script location, to reach, for example, the helper scripts.

script_path="$0"
if [[ "${script_path}" != /* ]]
then
  # Make relative path absolute.
  script_path="$(pwd)/$0"
fi

export script_path
export script_name="$(basename "${script_path}")"

export script_folder_path="$(dirname "${script_path}")"
export script_folder_name="$(basename "${script_folder_path}")"

# =============================================================================

# set -x

# The script is invoked from node_modules/@xpack/docusaurus-template-liquid.js via
# ${script_folder_path}/process-template-item.sh

helper_folder_path="$(dirname $(dirname "${script_folder_path}"))/npm-packages-helper"

source "${helper_folder_path}/maintenance-scripts/scripts-helper-source.sh"

# -----------------------------------------------------------------------------

# Runs in the source folder.
# $1 = relative file path to source, starts with `./`
# $2 = absolute folder path to destination

# echo $@
# set -x

do_remove_folder="false"
do_force="false"

if [ "${1}" == "--remove-folder" ]
then
  # Ask to override and write protect.
  do_remove_folder="true"
  shift
elif [ "${1}" == "--force" ]
then
  # Ask to override and write protect.
  do_force="true"
  shift
fi

export do_remove_folder
export do_force

# -----------------------------------------------------------------------------

# If one of the selector paths is present, but not the right one, exit.
if check_if_should_ignore_path "$@"
then
  exit 0
fi

# -----------------------------------------------------------------------------

if [ "${do_remove_folder}" == "true" ]
then
  from_relative_folder_path="$(echo "${1}" | sed -e 's|^\.\/||')"
  # Superfluous, `find -type d` should not allow this.
  if [ ! -d "${from_relative_folder_path}" ]
  then
    echo "${from_relative_folder_path} not a folder"
    exit 1
  fi

  to_relative_folder_path="$(echo "${1}" | sed -e 's|/_xpack/|/|' -e 's|/_xpack-dev-tools/|/|' -e 's|^\.\/||')"
  to_absolute_folder_path="${2}/${to_relative_folder_path}"

  if [ -d "${to_absolute_folder_path}" ]
  then
    echo "rm ${to_relative_folder_path}"
    if [ "${do_dry_run}" != "true" ]
    then
      rm -rf "${to_absolute_folder_path}"
    fi
  fi

  exit 0
fi

# -----------------------------------------------------------------------------

prepare_paths "$@"

# -----------------------------------------------------------------------------

tmp_file_path="$(mktemp -t top_commons.XXXXX)"

# Used to enforce an exit code of 255, required by xargs.
trap 'trap_handler ${from_relative_file_path} $LINENO $? ${tmp_file_path}; return 255' ERR

# -----------------------------------------------------------------------------

# Superfluous, `find -type f` should not allow this.
if [ ! -f "${from_relative_file_path}" ]
then
  echo "${from_relative_file_path} not a file"
  exit 1
fi

if [ "$(basename "${from_relative_file_path}")" == ".DS_Store" ]
then
  # echo "${from_relative_file_path} ignored" # Skip macOS specifics.
  exit 0
fi

if [ -f "${to_absolute_file_path}" ] && [ "${do_force}" != "true" ]
then
  echo "already present: ${to_relative_file_path}"
  exit 0
fi

# -----------------------------------------------------------------------------
# Compute exclusions.

# Destination relative file paths to skip.
skip_pages_array=("BEGIN")

if [ "${is_xpack}" == "true" ]
then

  if [ "${xpack_is_organization_web}" == "true" ]
  then
    skip_pages_array+=(\
      "docs/developer/_test-results.mdx" \
      "docs/faq/index-liquid.mdx" \
      "docs/getting-started/_common/_commonjs-compatibility.mdx" \
      "docs/getting-started/_common/_github-and-npmjs.mdx" \
      "docs/getting-started/_compatibility.mdx" \
      "docs/getting-started/_overview.mdx" \
      "docs/getting-started/_status.mdx" \
      "docs/install/index-liquid.mdx" \
      "docs/maintainer/_more.mdx" \
      "docs/releases/index.mdx" \
      "blog/_common/_download-analytics.mdx" \
      "blog/_common/_prerequisites.mdx"
    )
  fi

  if [ "${xpack_skip_install_command}" == "true" ]
  then
    skip_pages_array+=(\
      "docs/install/_common/_cli-liquid.mdx" \
      "docs/install/_common/_no-administrative-rights.mdx" \
      "docs/install/_common/_prerequisites.mdx" \
      "docs/install/_troubleshooting-windows.mdx" \
      "docs/install/index.mdx" \
    )
  fi

  if [ "${xpack_has_metadata_minimum}" != "true" ]
  then
    skip_pages_array+=(\
      "docs/metadata/_common/_minimum-required.mdx" \
    )
  fi

  if [ "${xpack_has_cli}" != "true" ]
  then
    skip_pages_array+=(\
      "docs/install/_common/_prerequisites-cli.mdx" \
      "docs/install/_common/_install-cli.mdx" \
      "docs/install/_common/_no-administrative-rights.mdx" \
      "docs/install/_project/_more-install.mdx" \
      "docs/install/_project/_troubleshooting-windows.mdx" \
    )
  else
    skip_pages_array+=(\
      "docs/install/_common/_prerequisites-module.mdx" \
      "docs/install/_common/_install-module.mdx" \
    )
  fi

  if [ "${xpack_has_policies}" != "true" ]
  then
    skip_pages_array+=(\
      "docs/user/policies/_common/_policies.mdx" \
    )
  fi

  if [ "${xpack_skip_contributor_guide}" == "true" ]
  then
    skip_pages_array+=(\
      "docs/developer/_common/_prerequisites.mdx" \
      "docs/developer/_common/_get-project-sources.mdx" \
      "docs/developer/_coverage-exceptions.mdx" \
      "docs/developer/_style-exceptions.mdx" \
      "docs/developer/_test-results.mdx" \
      "docs/developer/index.mdx" \
    )
  fi

  if [ "${xpack_has_custom_homepage_features}" == "true" ]
  then
    skip_pages_array+=(\
      "src/components/HomepageFeatures/FeatureList.tsx" \
    )
  fi

elif [ "${is_xpack_dev_tools}" == "true" ]
then
  if [ "${xpack_is_organization_web}" == "true" ]
  then
    skip_pages_array+=(\
      "blog/_common/_download-analytics.mdx" \
      "docs/about/_common/HistoryXpm/index.tsx" \
      "docs/developer/_common/_platform-docker-section.mdx" \
      "docs/developer/_common/_platform-native-section.mdx" \
      "docs/developer/_more.mdx" \
      "docs/developer/_other-repositories.mdx" \
      "docs/faq/_common/_flatpack-snap.mdx" \
      "docs/faq/_common/_nixos.mdx" \
      "docs/faq/_more.mdx" \
      "docs/faq/index.mdx" \
      "docs/maintainer/_check-upstream-release.mdx" \
      "docs/maintainer/_common/_gcc-check-upstream-release.mdx" \
      "docs/maintainer/_common/_arm-toolchain-check-upstream-release.mdx" \
      "docs/maintainer/_common/_arm-toolchain-update-version-specific.mdx" \
      "docs/maintainer/_common/_platform-docker-build.mdx" \
      "docs/maintainer/_common/_platform-native-build.mdx" \
      "docs/maintainer/_development-durations.mdx" \
      "docs/maintainer/_first-development-run.mdx" \
      "docs/maintainer/_first-production-run.mdx" \
      "docs/maintainer/_github-actions-durations.mdx" \
      "docs/maintainer/_more-repos.mdx" \
      "docs/maintainer/_more-tests.mdx" \
      "docs/maintainer/_patches.mdx" \
      "docs/maintainer/_share-custom.mdx" \
      "docs/maintainer/_update-version-specific.mdx" \
      "docs/releases/index.md" \
      "docs/user/_common/_arm-toolchain-versioning.mdx" \
      "docs/user/_common/_libraries-and-rpath.mdx" \
      "docs/user/_common/_versioning.mdx" \
      "docs/user/_more.mdx" \
      "docs/user/_use-in-testing.mdx" \
      "docs/user/_versioning.mdx" \
    )
  else

    if [ "${xpack_website_config_is_arm_toolchain}" != "true" ]
    then
      skip_pages_array+=(\
        "docs/maintainer/_common/_arm-toolchain-check-upstream-release.mdx" \
        "docs/maintainer/_common/_arm-toolchain-update-version-specific.mdx" \
        "docs/user/_common/_arm-toolchain-versioning.mdx" \
      )
    fi

    skip_pages_array+=(\
      "src/components/HomepageTools/index.tsx" \
      "src/components/HomepageTools/styles.module.css" \
    )
  fi
fi

if [ "${xpack_has_custom_developer}" != "true" ]
then
  skip_pages_array+=(\
    "docs/developer/_project/_content.mdx" \
  )
else
  skip_pages_array+=(\
    "docs/developer/_common/_content.mdx" \
    "docs/developer/_project/_coverage-exceptions.mdx" \
    "docs/developer/_project/_style-exceptions.mdx" \
    "docs/developer/_project/_test-results.mdx" \
    "docs/developer/_project/_more.mdx" \
    "docs/developer/_project/_other-repositories.mdx" \
  )
fi

if [ "${xpack_has_custom_getting_started}" != "true" ]
then
  skip_pages_array+=(\
    "docs/getting-started/_project/_content.mdx" \
  )
else
  skip_pages_array+=(\
    "docs/getting-started/_common/_content.mdx" \
    "docs/getting-started/_project/_compatibility.mdx" \
    "docs/getting-started/_project/_more-credits.mdx" \
    "docs/getting-started/_project/_overview.mdx" \
    "docs/getting-started/_project/_status.mdx" \
  )
fi

if [ "${xpack_skip_install_guide}" == "true" ]
then
  skip_pages_array+=(\
    "docs/install/index.mdx" \
    "docs/install/_common/_content.mdx" \
    "docs/install/_common/_prerequisites-module.mdx" \
    "docs/install/_common/_install-module.mdx" \
    "docs/install/_project/_content.mdx" \
    "docs/install/_project/_troubleshooting-windows.mdx" \
    "docs/install/_common/_automatic-install-quick-test.mdx" \
    "docs/install/_common/_manual-install-quick-test.mdx" \
    "docs/install/_project/_automatic-install-quick-test.mdx" \
    "docs/install/_project/_folders-hierarchies-linux.mdx" \
    "docs/install/_project/_folders-hierarchies-macos.mdx" \
    "docs/install/_project/_folders-hierarchies-windows.mdx" \
    "docs/install/_project/_manual-install-quick-test.mdx" \
    "docs/install/_project/_miscellaneous.mdx" \
    "docs/install/_project/_testing.mdx" \
  )
fi

if [ "${xpack_skip_install_command}" == "true" ]
then
  skip_pages_array+=(\
    "docs/install/_common/_automatic-install-quick-test.mdx" \
    "docs/install/_common/_manual-install-quick-test.mdx" \
    "docs/install/_project/_automatic-install-quick-test.mdx" \
    "docs/install/_project/_manual-install-quick-test.mdx" \
    "docs/install/_project/_folders-hierarchies-linux.mdx" \
    "docs/install/_project/_folders-hierarchies-macos.mdx" \
    "docs/install/_project/_folders-hierarchies-windows.mdx" \
    "docs/install/_project/_miscellaneous.mdx" \
    "docs/install/_project/_testing.mdx" \
    "docs/getting-started"
  )
fi

if [ "${xpack_website_config_is_gcc_toolchain}" != "true" ]
then
  skip_pages_array+=(\
    "docs/_common/_gcc-release-schedule.mdx" \
  )
fi

if [ "${xpack_has_custom_install}" != "true" ]
then
  skip_pages_array+=(\
    "docs/install/_project/_content.mdx" \
  )
else
  skip_pages_array+=(\
    "docs/install/_common/_content.mdx" \
    "docs/install/_project/_troubleshooting-windows.mdx" \
  )
fi

if [ "${xpack_has_custom_maintainer}" != "true" ]
then
  skip_pages_array+=(\
    "docs/maintainer/_project/_content.mdx" \
  )
else
  skip_pages_array+=(\
    "docs/maintainer/_common/_content.mdx" \
    "docs/maintainer/_project/_dependencies-detail.mdx" \
    "docs/maintainer/_project/_more.mdx" \
  )
fi

if [ "${xpack_has_custom_about}" != "true" ]
then
  skip_pages_array+=(\
    "docs/project/about/_project/_content.mdx" \
  )
else
  skip_pages_array+=(\
  )
fi

if [ "${xpack_has_custom_user}" != "true" ]
then
  skip_pages_array+=(\
    "docs/user/_project/_content.mdx" \
  )
else
  skip_pages_array+=(\
    "docs/user/_project/_content.mdx" \
    "docs/user/_project/_use-in-testing.mdx" \
    "docs/user/_project/_versioning.mdx" \
    "docs/user/_common/_arm-toolchain-versioning.mdx" \
    "docs/user/_common/_libraries-and-rpath.mdx" \
    "docs/user/_common/_versioning.mdx" \
  )
fi

if [ "${xpack_skip_releases}" == "true" ]
then
  skip_pages_array+=(\
    "docs/releases/index.mdx" \
  )
fi

if [ "${xpack_skip_faq}" == "true" ]
then
  skip_pages_array+=(\
    "docs/faq/index.mdx" \
    "docs/faq/_project/_content.mdx" \
  )
fi

# -----------------------------------------------------------------------------

skip_pages_array+=("END")

# The array members are concatenated with spaces separators.
# echo "skip_pages_array=${skip_pages_array[@]}"
# echo "to_relative_file_path=${to_relative_file_path}"

set +o nounset # Do not exit if variable not set (empty skip_pages_array).

# To ensure proper match, use explicit spaces.
if [[ ${skip_pages_array[@]} =~ " ${to_relative_file_path} " ]]
then
  # echo "skipped: ${from_relative_file_path}"
  echo "skipped: ${to_relative_file_path}"
  rm -f "${tmp_file_path}"
  exit 0
fi

set -o nounset # Exit if variable not set.

# -----------------------------------------------------------------------------

process_file

rm -rf "${tmp_file_path}"

# Completed successfully.
exit 0

# -----------------------------------------------------------------------------
