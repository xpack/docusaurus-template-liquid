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

script_name="$(basename "${script_path}")"

script_folder_path="$(dirname "${script_path}")"
script_folder_name="$(basename "${script_folder_path}")"

# =============================================================================

# set -x

# Runs as
# .../xpack.github/npm-packages/docusaurus-template-liquid.git/maintenance-scripts
repos_folder="$(dirname $(dirname "${script_folder_path}"))"

# npm-packages
cd "${repos_folder}"

for f in "${repos_folder}"/*/.git
do
  (
    cd "${f}/.."

    name="$(basename "$(pwd)")"

    if [ ! -d "website" ]
    then
      echo "${name} has no website..."
      continue
    fi

    if ! grep websiteConfig website/package.json
    then
      echo "${name} has no websiteConfig..."
      continue
    fi

    echo
    pwd

    # set -x

    if git branch | grep development
    then
      development_branch="development"
    else
      development_branch="master"
    fi

    if git branch | grep website
    then
      website_branch="website"
    else
      website_branch="master"
    fi

    git checkout "${development_branch}"

    git add website
    git commit -m "website: updates" || true

    git add package*.json .*ignore .github
    git commit -m "re-generate commons" || true

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

echo "${script_name} done"

# -----------------------------------------------------------------------------
