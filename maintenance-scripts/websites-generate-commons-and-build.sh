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
function generate_top_commons()
{
  (
    local from_folder_path="$(dirname "${1}")"

    cd "${from_folder_path}"

    echo
    echo "----------------------------------------------------------------------------"
    pwd

    # set -x

    if [ "${do_init}" == "true" ]
    then
      (
        if [ ! -d "website" ]
        then
          return
        fi

        run_verbose chmod -R +w website
        cd website

        run_verbose npm install del-cli json liquidjs --save-dev
        run_verbose npm link @xpack/npm-packages-helper @xpack/docusaurus-template-liquid

        export xpack_context="{}"
        echo
        substitute_and_merge "${templates_folder_path}/docusaurus/common/${accepted_path}/package-merge-liquid.json" "package.json" "${from_folder_path}/website"
      )
      return
    fi

    name="$(basename "$(pwd)")"

    top_config="$(json -f "package.json" -o json-0 topConfig)"
    if [ -z "${top_config}" ]
    then
      echo "${name} has no topConfig..."
      return
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
    else
      if git branch | grep xpack-development >/dev/null
      then
        development_branch="xpack-development"
      elif git branch | grep development >/dev/null
      then
        development_branch="development"
      else
        development_branch="master"
      fi
    fi

    run_verbose git checkout "${development_branch}"

    if [ -d "website" ]
    then
      website_config="$(json -f "website/package.json" -o json-0 websiteConfig)"

      if [ ! -z "${website_config}" ]
      then
        (
          cd website

          # -------------------------------------------------------------------
          # Custom actions.

          # if [ ! -d "docs/project" ]
          # then
          #   run_verbose mkdir -pv docs/project/about docs/project/history
          #   run_verbose cp docs/about/_more-intro.mdx docs/project/about
          #   run_verbose cp docs/about/_website.mdx docs/project/about
          #   run_verbose cp docs/about/_history.mdx docs/project/history
          # fi

          # if [ ! -f "docs/project/history/_history.mdx" ]
          # then
          #   run_verbose cp docs/about/_history.mdx docs/project/history
          # fi

          # run_verbose rm -rf docs/about

          # -------------------------------------------------------------------

          # npm run deep-clean
          run_verbose npm run npm-install
          run_verbose npm run npm-link-helpers

          run_verbose npm run generate-website-commons

          run_verbose npm run clear
          run_verbose npm run build
        )
      else
        echo "${name} has no websiteConfig..."
      fi

    else
      echo "${name} has no website..."
    fi
  )
}

# -----------------------------------------------------------------------------

# Runs as
# .../xpack.github/packages/npm-packages-helper.git/maintenance-scripts/projects-generate-top-commons.sh

my_projects_folder_path="$(dirname $(dirname $(dirname $(dirname "${script_folder_path}"))))"

if [ "${is_xpack}" == "true" ]
then
  xpack_github_folder_path="${my_projects_folder_path}/xpack.github"
  packages_folder_path="${xpack_github_folder_path}/packages"
  www_folder_path="${xpack_github_folder_path}/www"

  for file_path in "${packages_folder_path}"/*/.git "${www_folder_path}"/*/.git
  do
    generate_top_commons "${file_path}"
  done
elif [ "${is_xpack_dev_tools}" == "true" ]
then
  xpack_dev_tools_github_folder_path="${my_projects_folder_path}/xpack-dev-tools.github"
  xpacks_folder_path="${xpack_dev_tools_github_folder_path}/xPacks"
  www_folder_path="${xpack_dev_tools_github_folder_path}/www"

  # "${xpack_dev_tools_github_folder_path}/xpack-build-box.git/.git"
  for file_path in "${xpacks_folder_path}"/*/.git "${www_folder_path}"/*/.git
  do
    generate_top_commons "${file_path}"
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
