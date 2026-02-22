/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2024-2026 Liviu Ionescu. All rights reserved.
 *
 * Permission to use, copy, modify, and/or distribute this software
 * for any purpose is hereby granted, under the terms of the MIT license.
 *
 * If a copy of the license was not distributed with this file, it can
 * be obtained from https://opensource.org/licenses/mit.
 */

import Link from '@docusaurus/Link';

import type { FeatureItem } from './FeatureItem';

export const FeatureList: FeatureItem[] = [
  {
    title: 'Multi-language, cross-platform',
    Svg: require('@site/static/img/mosaic.svg').default,
    description: (
      <>
{% if packageConfig.hasCli == "true" -%}
        The CLI application is compatible with any shell, and can be utilized across multiple platforms (<b>Windows</b>, <b>macOS</b>, <b>GNU/Linux</b>).
{% else -%}
        The module is compatible with <b>TypeScript</b> and <b>JavaScript</b> projects, and can be utilised across multiple platforms (<b>Windows</b>, <b>macOS</b>, <b>GNU/Linux</b>).
 {% endif -%}
      </>
    ),
  },
  {
    title: 'Easy to Use & Reproducible',
    Svg: require('@site/static/img/check-badge.svg').default,
    description: (
      <>
{% if packageConfig.hasCli == "true" -%}
        Projects refer to this application via an explicitly versioned <b>dependency</b>. This ensures reproducibility, which is especially beneficial in <b>CI/CD</b> environments.
{% else -%}
        Projects refer to this module via an explicitly versioned <b>dependency</b>. This ensures reproducibility, which is especially beneficial in <b>CI/CD</b> environments.
{% endif -%}
      </>
    ),
  },
  {
    title: 'Part of the Node.js ecosystem',
    Svg: require('@site/static/img/globe.svg').default,
    description: (
      <>
{% if packageConfig.hasCli == "true" -%}
        The application can be installed with <b><Link to="https://docs.npmjs.com/cli/npm">npm</Link></b> from the <b>npmjs.com</b> public repository, just like millions of other packages.
{% else -%}
        The module can be installed with <b><Link to="https://docs.npmjs.com/cli/npm">npm</Link></b> from the <b>npmjs.com</b> public repository, just like millions of other packages.
{% endif -%}
      </>
    ),
  },
];
