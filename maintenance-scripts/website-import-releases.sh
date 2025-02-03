#!/usr/bin/env bash

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
# .../xpack.github/packages/docusaurus-template-liquid.git/maintenance-scripts/website-import-releases.sh
helper_folder_path="$(dirname $(dirname "${script_folder_path}"))/npm-packages-helper"

source "${helper_folder_path}/maintenance-scripts/scripts-helper-source.sh"

# Parse --init
# and leave variables in the environment.
parse_options "$@"

# -----------------------------------------------------------------------------

# Runs as
# .../xpack.github/packages/npm-packages-helper.git/maintenance-scripts/projects-generate-top-commons.sh

my_projects_folder_path="$(dirname $(dirname $(dirname $(dirname $(dirname $(dirname $(dirname $(dirname "${script_folder_path}"))))))))"
stamps_folder_name="$(echo "${script_name}" | sed -e 's|\.sh$||')"

xpack_dev_tools_github_folder_path="${my_projects_folder_path}/xpack-dev-tools.github"
export stamps_folder_path="${xpack_dev_tools_github_folder_path}/stamps/${stamps_folder_name}"
# export xpacks_folder_path="${xpack_dev_tools_github_folder_path}/xPacks"

project_folder_path="$(dirname $(dirname $(dirname $(dirname $(dirname "${script_folder_path}")))))"

import_releases "${project_folder_path}"

echo
echo "'${script_name} ${argv}' done"

exit 0

# -----------------------------------------------------------------------------
