/*
 * DO NOT EDIT!
 * Automatically generated from docusaurus-template-liquid/templates/docusaurus.
 *
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2024 Liviu Ionescu. All rights reserved.
 *
 * Permission to use, copy, modify, and/or distribute this software
 * for any purpose is hereby granted, under the terms of the MIT license.
 *
 * If a copy of the license was not distributed with this file, it can
 * be obtained from https://opensource.org/licenses/MIT.
 */

import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HeadTitle from '@site/src/components/HeadTitle';

import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

{%- if packageWebsiteConfig.hasHomepageTools == "true" %}

import HomepageTools from '@site/src/components/HomepageTools';
{%- endif %}
{%- if packageWebsiteConfig.skipInstallCommand != "true" %}
import InstallWithCopy from '@site/src/components/InstallWithCopy';
{%- endif %}

{%- if isNpmBinary == "true" %}
{%- assign platforms = "win32-x64,darwin-x64,linux-x64" %}
{%- endif %}
{%- assign platforms_array = platforms | split: "," %}

{%- assign isMacOS = false %}
{%- assign isLinux = false %}
{%- assign isWindows = false %}

{%- for platform in platforms_array %}
{%- if platform == "darwin-x64" or platform == "darwin-arm64" %}{% assign isMacOS = true %}{% endif %}
{%- if platform == "linux-x64" or platform == "linux-arm64" or platform == "linux-arm" %}{% assign isLinux = true %}{% endif %}
{%- if platform == "win32-x64" %}{% assign isWindows = true %}{% endif %}
{%- endfor %}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <HeadTitle title="Welcome to {% if packageWebsiteConfig.title %}{{packageWebsiteConfig.title}}{% else %}the {{longXpackName}}{% endif %}!" />
      <div className="container">
        <Heading as="h1" className="hero__title">{siteConfig.title}</Heading>
        <p className="hero__subtitle">{siteConfig.tagline}
{%- if platforms != "" or isNpmBinary == "true" %}
        <span className="margin-left-platforms">
{%- if isWindows %}
          <span className="tagline-platform-windows"></span>
{%- endif %}
{%- if isMacOS %}
          <span className="tagline-platform-apple"></span>
{%- endif %}
{%- if isLinux %}
          <span className="tagline-platform-linux"></span>
{%- endif %}
        </span>
{%- endif %}
        </p>
{%- if packageWebsiteConfig.skipInstallCommand != "true" %}
        <div className={styles.installWithCopy}>
{%- if isXpackBinary == "true" or packageWebsiteConfig.isXpmDependency == "true" %}
          <InstallWithCopy>xpm install {% if packageWebsiteConfig.isInstallGlobally == "true" %}--location=global {% endif %}{{packageScopedName}}@{{releaseVersion}} --verbose
          </InstallWithCopy>
{%- else %}
          <InstallWithCopy>npm install {% if packageWebsiteConfig.isInstallGlobally == "true" %}--global {% endif %}{{packageScopedName}}@{{releaseVersion}}
{%- endif %}

        </div>
{%- endif %}
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Welcome!"
      description={siteConfig.tagline} >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
{%- if packageConfig.isOrganizationWeb == "true" %}
        <hr className="hero__hr"/>
        <HomepageTools />
{%- endif %}
      </main>
    </Layout>
  );
}
