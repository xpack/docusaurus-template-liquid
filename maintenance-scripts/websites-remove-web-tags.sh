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
# .../xpack.github/packages/docusaurus-template-liquid.git/maintenance-scripts/websites-generate-commons-and-build.sh
helper_folder_path="$(dirname "${script_folder_path}")/node_modules/@xpack/npm-packages-helper"

source "${helper_folder_path}/maintenance-scripts/scripts-helper-source.sh"

# Parse --init, --dry-run, --xpack, --xpack-dev-tools
# and leave variables in the environment.
parse_options "$@"

# -----------------------------------------------------------------------------

templates_folder_path="$(dirname "${script_folder_path}")/templates"

tmp_file_path="$(mktemp -t top_commons.XXXXX)"

# Used to enforce an exit code of 255, required by xargs.
trap 'trap_handler ERROR $LINENO $? ${tmp_file_path}; return 255' ERR

# -----------------------------------------------------------------------------

# $1 = *.git
function remove-web-tags()
{
  (
    local from_folder_path="$(dirname "${1}")"
    local git_folder_name="$(basename "${from_folder_path}")"

    if [ -f "${stamps_folder_path}/${git_folder_name}" ]
    then
      echo "${git_folder_name} already generated..."
      return 0
    fi

    cd "${from_folder_path}"

    echo
    echo "----------------------------------------------------------------------------"
    pwd

    # set -x

    (
      if [ ! -d "website" ]
      then
        return
      fi

      run_verbose chmod -R +w website
      cd website

      for tag in $(git tag -l "web-*")
      do
        run_verbose git tag -d "${tag}"
        run_verbose git push origin ":refs/tags/${tag}" || true
      done
    )
    return 0
  )
}

# -----------------------------------------------------------------------------

# Runs as
# .../xpack.github/packages/docusaurus-template-liquid.git/maintenance-scripts/projects-generate-top-commons.sh

my_projects_folder_path="$(dirname $(dirname $(dirname $(dirname "${script_folder_path}"))))"
stamps_folder_name="$(echo "${script_name}" | sed -e 's|\.sh$||')"

if [ "${is_xpack}" == "true" ]
then
  xpack_github_folder_path="${my_projects_folder_path}/xpack.github"
  export stamps_folder_path="${xpack_github_folder_path}/stamps/${stamps_folder_name}"
  export packages_folder_path="${xpack_github_folder_path}/packages"
  export www_folder_path="${xpack_github_folder_path}/www"

  for file_path in "${packages_folder_path}"/*/.git "${www_folder_path}"/*/.git
  do
    remove-web-tags "${file_path}"
  done
elif [ "${is_xpack_dev_tools}" == "true" ]
then
  xpack_dev_tools_github_folder_path="${my_projects_folder_path}/xpack-dev-tools.github"
  export stamps_folder_path="${xpack_dev_tools_github_folder_path}/stamps/${stamps_folder_name}"
  export xpacks_folder_path="${xpack_dev_tools_github_folder_path}/xPacks"
  export www_folder_path="${xpack_dev_tools_github_folder_path}/www"

  for file_path in "${xpacks_folder_path}"/*/.git "${www_folder_path}"/*/.git "${xpack_dev_tools_github_folder_path}/xpack-build-box.git/.git"
  do
    remove-web-tags "${file_path}"
  done
else
  echo "Unsupported configuration..."
  exit 1
fi

rm -rf "${tmp_file_path}"

echo
echo "'${script_name} ${argv}' done"

exit 0

# -----------------------------------------------------------------------------
