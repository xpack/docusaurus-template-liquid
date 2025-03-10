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

argv="$@"

# Runs as
# .../node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-commons.sh
helper_folder_path="$(dirname $(dirname "${script_folder_path}"))/npm-packages-helper"

source "${helper_folder_path}/maintenance-scripts/scripts-helper-source.sh"

# Parse --init, --dry-run, --xpack, --xpack-dev-tools
# and leave variables in the environment.
parse_options "$@"

# -----------------------------------------------------------------------------

if [ "${is_xpack}" != "true" ] &&
   [ "${is_xpack_dev_tools}" != "true" ] &&
   [ "${is_micro_os_plus}" != "true" ]
then
  echo "Unsupported configuration..."
  exit 1
fi

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

# Used to enforce an exit code of 255, required by xargs.
trap 'trap_handler "${script_name}" $LINENO $?; return 255' ERR

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

# $1 = from_file_path
# $2 = to_file_path, optional
function relocate()
{
  local from_file_path="${1}"
  local to_file_path="${2:-"$(dirname "${from_file_path}")/_project/$(basename "${from_file_path}")"}"

  if [ -f "${from_file_path}" ]
  then
    run_verbose mkdir -pv "$(dirname "${to_file_path}")"
    if [ -f "${to_file_path}" ]
    then
      echo "${to_file_path} already present"
      exit 1
    fi
    run_verbose mv -fv "${from_file_path}" "${to_file_path}"

    if grep "'./_common/" "${to_file_path}" >/dev/null
    then
      run_verbose sed -i.bak -e "s|'\./_common|'../_common|" "${to_file_path}"
    fi
  fi
}

# -----------------------------------------------------------------------------

if [ "${do_init}" == "true" ]
then
  # TODO
  echo "--init not implemented yet"
  exit 1
else

  if false
  then
    (
      echo
      echo "Relocating files..."

      cd "${website_folder_path}"

      chmod -R +w *

      relocate "docs/getting-started/_documentation.mdx" "docs/_shared/_documentation.mdx"

      relocate "docs/developer/_coverage-exceptions.mdx"
      relocate "docs/developer/_style-exceptions.mdx"
      relocate "docs/developer/_test-results.mdx"

      relocate "docs/developer/_more.mdx"
      relocate "docs/developer/_other-repositories.mdx"

      relocate "docs/faq/_more.mdx" "docs/faq/_project/_content.mdx"

      relocate "docs/getting-started/_compatibility.mdx"
      relocate "docs/getting-started/_more-credits.mdx"
      relocate "docs/getting-started/_overview.mdx"
      relocate "docs/getting-started/_status.mdx"

      relocate "docs/getting-started/_more.mdx"
      relocate "docs/getting-started/_other-benefits.mdx"

      relocate "docs/getting-started/_overview.mdx"
      if [ -f "docs/getting-started/_project/_overview.mdx" ] && grep "'../_shared/" "docs/getting-started/_project/_overview.mdx" >/dev/null
      then
        run_verbose sed -i.bak -e "s|'\.\./_shared|'../../_shared|" "docs/getting-started/_project/_overview.mdx"
      fi

      relocate "docs/getting-started/_release-schedule.mdx" "docs/_shared/_release-schedule.mdx"
      relocate "docs/getting-started/_upgrade-notice.mdx"

      relocate "docs/install/_troubleshooting-windows.mdx"
      relocate "docs/install/_custom-install.mdx"

      relocate "docs/install/_automatic-install-quick-test.mdx"
      relocate "docs/install/_folders-hierarchies-linux.mdx"
      relocate "docs/install/_folders-hierarchies-macos.mdx"
      relocate "docs/install/_folders-hierarchies-windows.mdx"
      relocate "docs/install/_manual-install-quick-test.mdx"

      relocate "docs/install/_miscellaneous.mdx"
      relocate "docs/install/_testing.mdx"

      relocate "docs/maintainer/_more.mdx"
      relocate "docs/maintainer/_dependencies-details.mdx"
      relocate "docs/maintainer/_custom-maintainer.mdx" "docs/maintainer/_project/_content.mdx"

      relocate "docs/maintainer/_check-upstream-release.mdx"
      relocate "docs/maintainer/_development-durations.mdx" "docs/_shared/_development-durations.mdx"
      relocate "docs/maintainer/_first-development-run.mdx"
      relocate "docs/maintainer/_first-production-run.mdx"
      relocate "docs/maintainer/_github-actions-durations.mdx" "docs/_shared/_github-actions-durations.mdx"
      relocate "docs/maintainer/_more-repos.mdx"
      relocate "docs/maintainer/_more-tests.mdx"
      relocate "docs/maintainer/_patches.mdx"
      relocate "docs/maintainer/_share-custom.mdx"
      relocate "docs/maintainer/_update-version-specific.mdx"

      relocate "docs/project/about/_more-intro.mdx"
      relocate "docs/project/about/_website.mdx"
      relocate "docs/project/history/_history.mdx" "docs/project/history/_project/_content.mdx"

      relocate "docs/releases/index.md" "docs/releases/index.mdx"

      relocate "docs/project/history/history.mdx" "docs/project/history/_project/_content.mdx"

      relocate "docs/user/_more.mdx"
      relocate "docs/user/_use-in-testing.mdx"
      relocate "docs/user/_versioning.mdx"

      relocate "docs/install/_project/_folders-hierarchies-linux.mdx" "docs/_shared/_folders-hierarchies-linux.mdx"
      relocate "docs/install/_project/_folders-hierarchies-macos.mdx" "docs/_shared/_folders-hierarchies-macos.mdx"
      relocate "docs/install/_project/_folders-hierarchies-windows.mdx" "docs/_shared/_folders-hierarchies-windows.mdx"

      find . -name '*.bak' -exec rm -v '{}' ';'
    )
  fi

  echo
  echo "Processing template from ${templates_folder_path}/docusaurus..."

  echo
  echo "Common files, cleanups..."

  cd "${templates_folder_path}/docusaurus/common"

  # Preliminary pass to remove _common folders.
  find . -type d -name '_common' -print0 | sort -zn | \
    xargs -0 -I '{}' bash "${script_folder_path}/process-template-item.sh" --remove-folder '{}' "${website_folder_path}"

  echo
  echo "Common files, overridden..."

  # Main pass to copy/generate common
  find . -type f -print0 | sort -zn | \
    xargs -0 -I '{}' bash "${script_folder_path}/process-template-item.sh" --force '{}' "${website_folder_path}"

  echo
  echo "First time proposals..."

  cd "${templates_folder_path}/docusaurus/first-time"

  find . -type f -print0 | sort -zn | \
    xargs -0 -I '{}' bash "${script_folder_path}/process-template-item.sh" '{}' "${website_folder_path}"

  if [ "${xpack_github_project_organization}" == "xpack" ] ||
     [ "${xpack_github_project_organization}" == "xpack-dev-tools" ]
  then
    echo
    echo "Regenerate top README.md..."

    if [ $(cat "${project_folder_path}/README.md" | wc -l | tr -d '[:blank:]') -ge 42 ]
    then
      mv -v "${project_folder_path}/README.md" "${project_folder_path}/README-long.md"
    fi
    echo
    substitute "${templates_folder_path}/docusaurus/other/README-TOP-liquid.md" "README.md" "${project_folder_path}"
  elif [ "${xpack_github_project_organization}" == "micro-os-plus" ]
  then
    substitute "${templates_folder_path}/docusaurus/other/README-TOP-MICRO-OS-liquid.md" "README.md" "${project_folder_path}"

  fi

fi

# -----------------------------------------------------------------------------

echo
echo "'${script_name} ${argv}' done"

# Completed successfully.
exit 0

# -----------------------------------------------------------------------------
