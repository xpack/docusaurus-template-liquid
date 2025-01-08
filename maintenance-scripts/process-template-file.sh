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

# xargs stops only for exit code 255.
function trap_handler()
{
  local from_file="$1"
  shift
  local line_number="$1"
  shift
  local exit_code="$1"
  shift

  echo "FAIL ${from_file} line: ${line_number} exit: ${exit_code}"
  exit 255
}

# Runs in the source folder.
# $1 = relative file path to source
# $2 = absolute folder path to destination

# echo $@
# set -x

do_force="n"
if [ "${1}" == "--force" ]
then
  # Ask to override and write protect.
  do_force="y"
  shift
fi

# The source file path.
from_file_path="$(echo "${1}" | sed -e 's|^\.\/||')"
to_relative_file_path="$(echo "${from_file_path}" | sed -e 's|-liquid||')"

# The destination file path.
to_file_path="${2}/${to_relative_file_path}"

# Used to enforce an exit code of 255, required by xargs.
trap 'trap_handler ${from_file_path} $LINENO $?; return 255' ERR

if [ ! -f "${from_file_path}" ]
then
  echo "${from_file_path} not a file"
  exit 1
fi

if [ "$(basename "${from_file_path}")" == ".DS_Store" ]
then
  echo "${from_file_path} ignored" # Skip macOS specifics.
  exit 0
fi

if [ -f "${to_file_path}" ] && [ "${do_force}" == "n" ]
then
  echo "${to_file_path} already present"
  exit 0
fi

# Destination relative file paths to skip.
skip_pages_array=()

if [ "${xpack_is_organization_web}" == "true" ]
then
  skip_pages_array+=(\
    "docs/developer/_test-results.mdx" \
    "docs/faq/index-liquid.mdx" "docs/user/index.mdx" \
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
    "docs/install/_common/_cli.mdx" \
    "docs/install/_common/_no-administrative-rights.mdx" \
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

# echo "skip_pages_array=${skip_pages_array[@]}"
# echo "to_relative_file_path=${to_relative_file_path}"

if [[ ${skip_pages_array[@]} =~ "${to_relative_file_path}" ]]
then
  echo "${from_file_path} skipped"
  exit 0
fi

if [ -f "${to_file_path}" ]
then
  # Be sure destination is writeable.
  chmod -f +w "${to_file_path}"
fi

mkdir -p "$(dirname ${to_file_path})"

if [[ "$(basename "${from_file_path}")" =~ .*-liquid.* ]]
then
  echo liquidjs "@${from_file_path}" '->' "${to_file_path}"
  # --strict-variables
  liquidjs --context "${xpack_context}" --template "@${from_file_path}" --output "${to_file_path}" --strict-filters
else
  cp -v "${from_file_path}" "${to_file_path}"
fi

if [ "${do_force}" == "y" ]
then
  chmod -w "${to_file_path}"
fi

# Completed successfully.
exit 0

# -----------------------------------------------------------------------------
