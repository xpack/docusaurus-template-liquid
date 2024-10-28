
website_folder_path="${project_folder_path}/website"
templates_folder_path="$(dirname "${script_folder_path}")/templates"

export npm_package_scoped_name="$(liquidjs --context "@${project_folder_path}/package.json" --template '{{name}}')"
export npm_package_scope="$(echo "${npm_package_scoped_name}" | sed -e 's|^@||' -e 's|/.*||' )"
export npm_package_name="$(echo "${npm_package_scoped_name}" | sed -e 's|^@[a-zA-Z0-9-]*/||')"
export npm_package_version="$(liquidjs --context "@${project_folder_path}/package.json" --template '{{version}}')"
export npm_package_description="$(liquidjs --context "@${project_folder_path}/package.json" --template '{{description}}')"

github_full_name="$(liquidjs --context "@${project_folder_path}/package.json" --template '{{repository.url}}' | sed -e 's|^https://github.com/||' -e 's|^git+https://github.com/||' -e 's|[.]git$||')"

export github_project_organization="$(echo "${github_full_name}" | sed -e 's|/.*||')"
export github_project_name="$(echo "${github_full_name}" | sed -e 's|.*/||')"

export npm_package_website_config="$(liquidjs --context "@${project_folder_path}/package.json" --template '{{websiteConfig | json}}')"

export npm_package_engines_node_version="$(liquidjs --context "@${project_folder_path}/package.json" --template '{{engines.node}}' | sed -e 's|[^0-9]*||')"

export npm_package_engines_node_version_major="$(echo "${npm_package_engines_node_version}" | sed -e 's|[.].*||')"

export npm_package_dependencies_typescript_version="$(liquidjs --context "@${project_folder_path}/package.json" --template '{{devDependencies.typescript}}' | sed -e 's|[^0-9]*||')"

export release_date="$(date '+%Y-%m-%d %H:%M:%S %z')"

export context="{ \"packageScopedName\": \"${npm_package_scoped_name}\", \"packageScope\": \"${npm_package_scope}\", \"packageName\": \"${npm_package_name}\", \"packageVersion\": \"${npm_package_version}\", \"packageDescription\": \"${npm_package_description}\", \"githubProjectOrganization\": \"${github_project_organization}\", \"githubProjectName\": \"${github_project_name}\", \"packageEnginesNodeVersion\": \"${npm_package_engines_node_version}\", \"packageEnginesNodeVersionMajor\": \"${npm_package_engines_node_version_major}\", \"packageDependenciesTypescriptVersion\": \"${npm_package_dependencies_typescript_version}\", \"releaseDate\": \"${release_date}\", \"packageWebsiteConfig\": ${npm_package_website_config} }"

echo "context=${context}"
