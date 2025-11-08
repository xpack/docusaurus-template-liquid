#!/usr/bin/env bash

# -----------------------------------------------------------------------------
#
# This file is part of the xPack project (http://xpack.github.io).
# Copyright (c) 2024-2025 Liviu Ionescu. All rights reserved.
#
# Permission to use, copy, modify, and/or distribute this software
# for any purpose is hereby granted, under the terms of the MIT license.
#
# If a copy of the license was not distributed with this file, it can
# be obtained from https://opensource.org/licenses/mit.
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
# "website-generate-commons": "bash node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-website-commons.sh",

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

# source "${current_folder_path}/node_modules/@xpack/npm-packages-helper/maintenance-scripts/compute-context.sh"

# -----------------------------------------------------------------------------

function generate_details()
{
  key=$1

  local dependencies="$(json -f "${project_folder_path}/package.json" ${key} | grep -v '{' | grep -v '}')"

  # echo "|${dependencies}|"

  echo
  echo "\`${key}\`:"
  echo

  if [ -z "${dependencies}" ]
  then
    echo "- none"
  else
    for line in ${dependencies}
    do
      # echo "|${line}|"
      new_line="$(echo \"${line}\" | sed -e 's|^.  .|- https://www.npmjs.com/package/|' -e 's|\".*$||')"
      echo "${new_line}"
    done
  fi
  echo
}

# -----------------------------------------------------------------------------

# dependencies="$(json -f "${project_folder_path}/package.json" -o json-0 dependencies)"

generate_details dependencies
generate_details devDependencies

