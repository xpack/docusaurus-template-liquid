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

# The script is invoked via the following npm script:
# "website-generate-commons-and-build": "bash website/node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-commons-and-build.sh"

project_folder_path="$(dirname $(dirname $(dirname $(dirname $(dirname "${script_folder_path}")))))"
website_folder_path="${project_folder_path}/website"
templates_folder_path="$(dirname "${script_folder_path}")/templates"

export npm_package_scoped_name="$(liquidjs --context "@${project_folder_path}/package.json" --template '{{name}}')"
export npm_package_scope="$(echo "${npm_package_scoped_name}" | sed -e 's|^@||' -e 's|/.*||' )"
export npm_package_name="$(echo "${npm_package_scoped_name}" | sed -e 's|^@[a-zA-Z0-9-]*/||')"
export npm_package_version="$(liquidjs --context "@${project_folder_path}/package.json" --template '{{version}}')"
export npm_package_description="$(liquidjs --context "@${project_folder_path}/package.json" --template '{{description}}')"

github_full_name="$(liquidjs --context "@${project_folder_path}/package.json" --template '{{repository.url}}' | sed -e 's|^https://github.com/||' -e 's|[.]git$||')"

export github_project_organization="$(echo "${github_full_name}" | sed -e 's|/.*||')"
export github_project_name="$(echo "${github_full_name}" | sed -e 's|.*/||')"

export npm_package_website_config="$(liquidjs --context "@${project_folder_path}/package.json" --template '{{websiteConfig | json}}')"

export context="{ \"packageScopedName\": \"${npm_package_scoped_name}\", \"packageScope\": \"${npm_package_scope}\", \"packageName\": \"${npm_package_name}\", \"packageVersion\": \"${npm_package_version}\", \"packageDescription\": \"${npm_package_description}\", \"githubProjectOrganization\": \"${github_project_organization}\", \"githubProjectName\": \"${github_project_name}\", \"packageWebsiteConfig\": ${npm_package_website_config} }"

echo "context=${context}"

tmp_script_file="$(mktemp) -t script"
# Note: __EOF__ is quoted to prevent substitutions.
cat <<'__EOF__' >"${tmp_script_file}"

# xargs stops only for exit code 255.
function trap_handler()
{
  local from_file="$1"
  shift
  local line_number="$1"
  shift
  local exit_code="$1"
  shift

  echo "FAIL ${from_file} line: ${line_number} exit: ${exit_code}"
  exit 255
}

# echo $@
# set -x

do_force="n"
if [ "${1}" == "--force" ]
then
  # Ask to override and write protect.
  do_force="y"
  shift
fi

# The source file path.
from_path="$(echo "${1}" | sed -e 's|^\.\/||')"

# The destination file path.
to_path="${2}/$(echo "${from_path}" | sed -e 's|-liquid||')"

# Used to enforce an exit code of 255, required by xargs.
trap 'trap_handler ${from_path} $LINENO $?; return 255' ERR

if [ ! -f "${from_path}" ]
then
  echo "${to_path} not a file"
  exit 1
fi

if [ "$(basename "${from_path}")" == ".DS_Store" ]
then
  echo "${from_path} ignored" # Skip macOS specifics.
  exit 0
fi

if [ -f "${to_path}" ] && [ "${do_force}" == "n" ]
then
  echo "${to_path} already present"
  exit 0
fi

if [ -f "${to_path}" ]
then
    # Be sure destination is writable.
    chmod -f +w "${to_path}"
fi

mkdir -p "$(dirname ${to_path})"

if [[ "$(basename "${from_path}")" =~ .*-liquid.* ]]
then
  echo liquidjs "@${from_path}" '->' "${to_path}"
  # --strict-variables
  liquidjs --context "${context}" --template "@${from_path}" --output "${to_path}" --strict-filters
else
  cp -v "${from_path}" "${to_path}"
fi

if [ "${do_force}" == "y" ]
then
  chmod -w "${to_path}"
fi

__EOF__

cd "${templates_folder_path}/docusaurus/common"

echo
echo "Common files, cleanups..."

# Preliminary pass to remove _common folders.
find . -type d -name '_common' -print0 | sort -zn | \
  xargs -0 -I '{}' rm -rfv "${website_folder_path}"/'{}'

echo
echo "Common files, overriden..."

# Main pass to copy/generate common
find . -type f -print0 | sort -zn | \
  xargs -0 -I '{}' bash "${tmp_script_file}" --force '{}' "${website_folder_path}"

cd "${templates_folder_path}/docusaurus/first-time"

echo
echo "First time proposals..."

find . -type f -print0 | sort -zn | \
  xargs -0 -I '{}' bash "${tmp_script_file}" '{}' "${website_folder_path}"

cd "${templates_folder_path}/docusaurus/other"

echo
echo "Regenerate top README.md..."

if [ $(cat "${project_folder_path}/README.md" | wc -l | tr -d '[:blank:]') -ge 42 ]
then
  mv -v "${project_folder_path}/README.md" "${project_folder_path}/README-long.md"
fi
echo
echo liquidjs "@README-TOP-liquid.md" '->' "${project_folder_path}/README.md"
liquidjs --context "${context}" --template "@README-TOP-liquid.md" --output "${project_folder_path}/README.md" --strict-variables --strict-filters

rm -rf "${tmp_script_file}"
