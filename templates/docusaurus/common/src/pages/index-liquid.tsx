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
 * be obtained from https://opensource.org/licenses/MIT/.
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

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <HeadTitle title="Welcome to {% if packageWebsiteConfig.title %}{{packageWebsiteConfig.title}}{% else %}the {{longXpackName}}{% endif %}!" />
      <div className="container">
        <Heading as="h1" className="hero__title">{siteConfig.title}</Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
{%- if packageWebsiteConfig.skipInstallCommand != "true" %}
        <div className={styles.installWithCopy}>
          <InstallWithCopy>{% if isXpackBinary == "true" %}xpm{% else %}npm{% endif %} install {% if packageWebsiteConfig.isInstallGlobally == "true" %}--location=global {% endif %}{{packageScopedName}}@{{releaseVersion}}{% if isXpackBinary == "true" %} --verbose{% endif %}</InstallWithCopy>
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
