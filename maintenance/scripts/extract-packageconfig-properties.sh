#!/usr/bin/env bash

# -----------------------------------------------------------------------------
#
# This file is part of the xPack project (http://xpack.github.io).
# Copyright (c) 2024-2026 Liviu Ionescu. All rights reserved.
#
# Permission to use, copy, modify, and/or distribute this software for any
# purpose is hereby granted, under the terms of the MIT license.
#
# If a copy of the license was not distributed with this file, it can be
# obtained from https://opensource.org/licenses/mit.
#
# -----------------------------------------------------------------------------

# Extract all unique topConfig.xxx property references from the
# templates folder and print them sorted, one per line.

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

# -----------------------------------------------------------------------------

script_path="$(cd "$(dirname "$0")" && pwd)"
repo_path="$(cd "${script_path}/.." && pwd)"
templates_path="${repo_path}/templates"

# Use grep to find all occurrences, then extract property names with grep -oE,
# sort and deduplicate.

# grep --include='*' -rh 'packageConfig\.' "${templates_path}" \
#   | grep -oE 'packageConfig\.[a-zA-Z_][a-zA-Z0-9_]*' \
#   | sort -u

grep --include='*' -rh 'websiteConfig\.' "${templates_path}" \
  | grep -oE 'websiteConfig\.[a-zA-Z_][a-zA-Z0-9_]*' \
  | sort -u

# -----------------------------------------------------------------------------
