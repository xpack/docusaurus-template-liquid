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

    git checkout "${development_branch}"

    npm run generate-top-commons
    npm run npm-install
    npm run npm-link-helper

    cd website

    # npm run deep-clean
    npm run npm-install
    npm run npm-link-helper
    npm run generate-website-commons

    npm run build
  )
done

echo "${script_name} done"

# -----------------------------------------------------------------------------
