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
# .../xpack.github/packages/docusaurus-template-liquid.git/maintenance-scripts/import-releases.sh
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

# -----------------------------------------------------------------------------

# Process package.json files and leave results in environment variables.
compute_context

# -----------------------------------------------------------------------------

function process_tag()
{
  if [[ $# -lt 2 ]]
  then
    echo "Missing arguments"
    exit 1
  fi

  local tag="$1"
  local seconds="$2"

  local version="$(echo "${tag}" | sed -e 's|^v||')"
  local date=$(date -r ${seconds} '+%Y-%m-%d %H:%M:%S %z')

  local post_relative_file_path="blog/$(date -r ${seconds} '+%Y-%m-%d')-${xpack_permalink_name}-$(echo $tag | sed -e 's|[.]|-|g')-released.mdx"

  if [ ! -f "${website_folder_path}/${post_relative_file_path}" ]
  then
    export xpack_context=$(echo "${xpack_context}" | json -o json-0 \
    -e "this.releaseVersion=\"${version}\"" \
    -e "this.releaseDate=\"${date}\"" \
    )

    substitute "${website_folder_path}/blog/_templates/blog-post-release-liquid.mdx" \
    "${post_relative_file_path}" \
    "${website_folder_path}"
  else
    echo "File '${post_relative_file_path}' already exists."
  fi
}

# -----------------------------------------------------------------------------

website_folder_path="${project_folder_path}/website"

cd "${project_folder_path}"
for line in $(git for-each-ref --format="%(refname:short) %(creatordate:format:%s)" "refs/tags/*")
do
  (IFS=$' '; process_tag ${line})
done

echo
echo "'${script_name} ${argv}' done"

exit 0

# -----------------------------------------------------------------------------
