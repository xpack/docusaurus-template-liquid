/*
 * DO NOT EDIT!
 * Automatically generated from docusaurus-template-liquid/templates/docusaurus.
 *
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2024-2026 Liviu Ionescu. All rights reserved.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose is hereby granted, under the terms of the MIT license.
 *
 * If a copy of the license was not distributed with this file, it can be
 * obtained from https://opensource.org/licenses/mit.
 */

import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HeadTitle from '@site/src/components/HeadTitle';

import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

{%- if websiteConfig.hasHomepageTools %}

import HomepageTools from '@site/src/components/HomepageTools';
{%- endif %}
{%- unless websiteConfig.skipInstallCommand %}
import InstallWithCopy from '@site/src/components/InstallWithCopy';
{%- endunless %}

{%- if platforms == "" %}
{%- assign platforms = websiteConfig.platforms | default: '' %}
{%- endif %}

{%- if isNpmBinary %}
{%- assign platforms = "win32-x64,darwin-x64,linux-x64" %}
{%- endif %}
{%- assign platforms_array = platforms | split: "," %}

{%- assign isMacOS = false %}
{%- assign isLinux = false %}
{%- assign isWindows = false %}

{%- for platform in platforms_array %}
{%- if platform == 'darwin-x64' or platform == 'darwin-arm64' %}{% assign isMacOS = true %}{% endif %}
{%- if platform == 'linux-x64' or platform == 'linux-arm64' or platform == 'linux-arm' %}{% assign isLinux = true %}{% endif %}
{%- if platform == 'win32-x64' %}{% assign isWindows = true %}{% endif %}
{%- endfor %}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <HeadTitle title="Welcome to {% if websiteConfig.title != '' %}{{websiteConfig.title}}{% else %}the {{longXpackName}}{% endif %}!" />
      <div className="container">
        <Heading as="h1" className="hero__title">{siteConfig.title}</Heading>
        <p className="hero__subtitle">{siteConfig.tagline}
{%- if platforms != '' or isNpmBinary %}
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
{%- unless websiteConfig.skipInstallCommand %}
        <div className={styles.installWithCopy}>
{%- if isXpackBinary or websiteConfig.isXpmDependency %}
          <InstallWithCopy>xpm install {% if websiteConfig.isInstallGlobally %}--location=global {% endif %}{{packageScopedName}}@{{releaseVersion}} --verbose</InstallWithCopy>
{%- else %}
          <InstallWithCopy>npm install {% if websiteConfig.isInstallGlobally %}--global {% endif %}{{packageScopedName}}@{{releaseVersion}}</InstallWithCopy>
{%- endif %}
        </div>
{%- endunless %}
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
{%- if websiteConfig.hasHomepageTools %}
        <hr className="hero__hr"/>
        <HomepageTools />
{%- endif %}
      </main>
    </Layout>
  );
}
