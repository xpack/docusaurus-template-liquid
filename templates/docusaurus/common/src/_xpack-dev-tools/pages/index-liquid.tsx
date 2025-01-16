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
import HeadTitle from '@site/src/components/HeadTitle';

import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
{% if customFields.isOrganizationWeb == "true" %}
import HomepageTools from '@site/src/components/HomepageTools';
{% endif %}
import InstallWithCopy from '@site/src/components/InstallWithCopy';
import customField from '@site/src/libs/customField';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <HeadTitle title="Welcome to the xPack {{appName}}!" />
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
{% if customFields.isOrganizationWeb != "true" %}
        <div className={styles.installWithCopy}>
          <InstallWithCopy>xpm install @xpack-dev-tools/{{appLcName}}@{customField('version')} --verbose</InstallWithCopy>
        </div>
{% endif %}
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout {% if customFields.isOrganizationWeb == "true" %}
      title="Welcome!"
      description="A collection of binary packages with development tools">{% else %}
      title="Welcome!"
      description="A binary package with the {{appLcName}} executables">{% endif %}
      <HomepageHeader />
      <main>
        <HomepageFeatures />{% if customFields.isOrganizationWeb == "true" %}
        <hr className="hero__hr"/>
        <HomepageTools />{% endif %}
      </main>
    </Layout>
  );
}
