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

argv="$@"

# The script is invoked from the `website` via the following npm script:
# "website-generate-commons": "bash node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-commons.sh",
helper_folder_path="$(dirname $(dirname "${script_folder_path}"))/npm-packages-helper"

source "${helper_folder_path}/maintenance-scripts/scripts-helper-source.sh"

# Parse --init, --dry-run, --xpack, --xpack-dev-tools
# and leave variables in the environment.
parse_options "$@"

# -----------------------------------------------------------------------------

current_folder_path="$(dirname $(dirname $(dirname $(dirname "${script_folder_path}"))))"

if [ "$(basename "${current_folder_path}")" == "website" ]
then
  website_folder_path="${current_folder_path}"
  project_folder_path="$(dirname "${current_folder_path}")"
else
  if [ "${do_init}" == "true" ]
  then
    project_folder_path="${current_folder_path}"
    website_folder_path="${project_folder_path}/website"

    mkdir -pv "${website_folder_path}"
  else
    echo "Not called from the website folder"
    exit 1
  fi

  # When called from the top folder.
  # website_folder_path="${current_folder_path}/website"
  # project_folder_path="${current_folder_path}"
fi

templates_folder_path="$(dirname "${script_folder_path}")/templates"

export project_folder_path
export templates_folder_path
export website_folder_path

# -----------------------------------------------------------------------------

# Process package.json files and leave results in environment variables.
compute_context

# -----------------------------------------------------------------------------

if [ "${do_dry_run}" == "true" ]
then
  echo
  echo "Dry run!"
  echo
fi

# -----------------------------------------------------------------------------

if [ "${do_init}" != "true" ]
then

  cd "${templates_folder_path}/docusaurus/common"

  echo
  echo "Common files, cleanups..."

  # Preliminary pass to remove _common folders.
  find . -type d -name '_common' -print0 | sort -zn | \
    xargs -0 -I '{}' bash "${script_folder_path}/process-template-item.sh" --remove-folder '{}' "${website_folder_path}"

  echo
  echo "Common files, overridden..."

  # Main pass to copy/generate common
  find . -type f -print0 | sort -zn | \
    xargs -0 -I '{}' bash "${script_folder_path}/process-template-item.sh" --force '{}' "${website_folder_path}"

  cd "${templates_folder_path}/docusaurus/first-time"

  echo
  echo "First time proposals..."

  find . -type f -print0 | sort -zn | \
    xargs -0 -I '{}' bash "${script_folder_path}/process-template-item.sh" '{}' "${website_folder_path}"

fi

if [ "${do_init}" != "true" ]
then

  echo
  echo "Regenerate top README.md..."

  if [ $(cat "${project_folder_path}/README.md" | wc -l | tr -d '[:blank:]') -ge 42 ]
  then
    mv -v "${project_folder_path}/README.md" "${project_folder_path}/README-long.md"
  fi
  echo
  echo liquidjs "@README-TOP-liquid.md" '->' "${project_folder_path}/README.md"
  liquidjs --context "${xpack_context}" --template "@${templates_folder_path}/docusaurus/other/README-TOP-liquid.md" --output "${project_folder_path}/README.md" --strict-variables --strict-filters --lenient-if

fi

echo
echo "${script_name} ${argv} done"

# Completed successfully.
exit 0

# -----------------------------------------------------------------------------
