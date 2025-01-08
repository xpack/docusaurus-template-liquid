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

script_name="$(basename "${script_path}")"

script_folder_path="$(dirname "${script_path}")"
script_folder_name="$(basename "${script_folder_path}")"

# =============================================================================

# set -x

do_init="false"

while [ $# -gt 0 ]
do
  case "$1" in
    --init )
      do_init="true"
      shift
      ;;

    * )
      echo "Unsupported option $1"
      shift
  esac
done

# -----------------------------------------------------------------------------

# The script is invoked from the website via the following npm script:
# "website-generate-commons": "bash node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-commons.sh",

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

source "${current_folder_path}/node_modules/@xpack/npm-packages-helper/maintenance-scripts/compute-context.sh"

# -----------------------------------------------------------------------------

tmp_script_file="$(mktemp -t script)"
# Note: __EOF__ is quoted to prevent substitutions.
cat <<'__EOF__' >"${tmp_script_file}"

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

__EOF__

# -----------------------------------------------------------------------------

if [ "${do_init}" != "true" ]
then

  cd "${templates_folder_path}/docusaurus/common"

  echo
  echo "Common files, cleanups..."

  # Preliminary pass to remove _common folders.
  find . -type d -name '_common' -print0 | sort -zn | \
    xargs -0 -I '{}' rm -rfv "${website_folder_path}"/'{}'

  echo
  echo "Common files, overridden..."

  # Main pass to copy/generate common
  find . -type f -print0 | sort -zn | \
    xargs -0 -I '{}' bash "${tmp_script_file}" --force '{}' "${website_folder_path}"

  cd "${templates_folder_path}/docusaurus/first-time"

  echo
  echo "First time proposals..."

  find . -type f -print0 | sort -zn | \
    xargs -0 -I '{}' bash "${tmp_script_file}" '{}' "${website_folder_path}"

fi

echo
echo "Regenerate website package.json..."

# https://trentm.com/json
if [ -f "${website_folder_path}/package.json" ]
then
  # Be sure destination is writeable.
  chmod -f +w "${website_folder_path}/package.json"

  # Pass the existing json first, then the template one.
  cat "${website_folder_path}/package.json" "${templates_folder_path}/docusaurus/other/package.json" | json --deep-merge > "${website_folder_path}/package-new.json"

  rm "${website_folder_path}/package.json"
  mv -v "${website_folder_path}/package-new.json" "${website_folder_path}/package.json"
else
  cat "${templates_folder_path}/docusaurus/other/package.json" | json --deep-merge > "${website_folder_path}/package.json"
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

rm -rf "${tmp_script_file}"

echo
echo "${script_name} done"

# Completed successfully.
exit 0

# -----------------------------------------------------------------------------
