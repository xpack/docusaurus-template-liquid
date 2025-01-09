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

while [ $# -gt 0 ]
do
  case "$1" in
    * )
      echo "Unsupported option $1"
      shift
  esac
done

# -----------------------------------------------------------------------------

# Runs as
# .../xpack.github/packages/docusaurus-template-liquid.git/maintenance-scripts/websites-update-and-publish.sh
packages_folder_path="$(dirname $(dirname "${script_folder_path}"))"
www_folder_path="$(dirname "${packages_folder_path}")/www"

for f in "${packages_folder_path}"/*/.git "${www_folder_path}"/*/.git
do
  (
    cd "${f}/.."

    echo
    pwd

    # set -x

    name="$(basename "$(pwd)")"

    top_config="$(json -f "package.json" -o json-0 topConfig)"
    if [ -z "${top_config}" ]
    then
      echo "${name} has no topConfig..."
      continue
    fi

    has_empty_master="$(echo "${top_config}" | json hasEmptyMaster)"

    if [ "${has_empty_master}" == "true" ]
    then
      if git branch | grep webpreview >/dev/null
      then
        development_branch="webpreview"
      else
        development_branch="website"
      fi
      website_branch="website"
    else
      if git branch | grep development >/dev/null
      then
        development_branch="development"
      else
        development_branch="master"
      fi
      if git branch | grep website >/dev/null
      then
        website_branch="website"
      else
        website_branch="master"
      fi
    fi

    git checkout "${development_branch}"

    if [ -d "website" ]
    then
      website_config="$(json -f "website/package.json" -o json-0 websiteConfig)"

      if [ ! -z "${website_config}" ]
      then
        git add website
        git commit -m "website: re-generate commons" || true
      else
        echo "${name} has no websiteConfig..."
      fi
    else
      echo "${name} has no website..."
    fi

    git push

    if [ "${development_branch}" != "${website_branch}" ]
    then
      git checkout "${website_branch}"
      git merge "${development_branch}"
      git push

      git checkout "${development_branch}"
    fi
  )
done

echo
echo "${script_name} done"

# Completed successfully.
exit 0

# -----------------------------------------------------------------------------
