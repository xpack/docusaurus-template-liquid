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

# The script is invoked from the website via the following npm script:
# "website-generate-commons-and-build": "bash node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-commons-and-build.sh"

current_folder_path="$(dirname $(dirname $(dirname $(dirname "${script_folder_path}"))))"
if [ "$(basename "${current_folder_path}")" == "website" ]
then
  website_folder_path="${current_folder_path}"
  project_folder_path="$(dirname "${current_folder_path}")"
else
  echo "Not called from the website folder"
  exit 1
fi

templates_folder_path="$(dirname "${script_folder_path}")/templates"

source "${current_folder_path}/node_modules/@xpack/npm-packages-helper/maintenance-scripts/compute-context.sh"

post_file_path="${website_folder_path}/blog/$(date -u '+%Y-%m-%d')-${xpack_npm_package_name}-v$(echo ${xpack_release_version} | tr '.' '-')-released.mdx"

# -----------------------------------------------------------------------------

echo

if [ -f "${post_file_path}" ]
then
    echo "${post_file_path} already there! Remove it to force regenerate."
    exit 1
fi

echo "liquidjs -> ${post_file_path}"
liquidjs --context "${xpack_context}" --template "@${website_folder_path}/blog/_templates/blog-post-release-liquid.mdx" > "${post_file_path}"

echo
echo "'${script_name}' done"

# Completed successfully.
exit 0

# -----------------------------------------------------------------------------
