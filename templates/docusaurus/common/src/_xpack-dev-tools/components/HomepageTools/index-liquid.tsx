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

import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

import Link from '@docusaurus/Link';

import tools from '@site/tools';

function Tool({ longName, shortName }) {
  return (
    <>
      <div className="padding-vert--sm">
        <div>
          <b><Link to={'https://xpack-dev-tools.github.io/' + shortName + '-xpack/'}>{shortName}</Link></b> - <b>xPack {longName}</b>
        </div>
        <div className="padding-top--xs">
          <Link to={'https://github.com/{{githubProjectOrganization}}/' + shortName + '-xpack/releases/'}><img alt="GitHub Release" src={'https://img.shields.io/github/v/release/{{githubProjectOrganization}}/' + shortName + '-xpack?color=blue'} /></Link>
          &nbsp;<Link to={'https://github.com/{{githubProjectOrganization}}/' + shortName + '-xpack/releases/'}><img alt="GitHub Release Date" src={'https://img.shields.io/github/release-date/{{githubProjectOrganization}}/' + shortName + '-xpack?label=date&color=yellowgreen'} /></Link>
          &nbsp;<Link to={'https://github.com/{{githubProjectOrganization}}/' + shortName + '-xpack/releases/'}><img alt="GitHub Downloads (all assets, all releases)" src={'https://img.shields.io/github/downloads/{{githubProjectOrganization}}/' + shortName + '-xpack/total'} /></Link>
          &nbsp;<Link to={'https://github.com/{{githubProjectOrganization}}/' + shortName + '-xpack/'}><img alt="GitHub Repo stars" src={'https://img.shields.io/github/stars/{{githubProjectOrganization}}/' + shortName + '-xpack'} /></Link>
        </div>
      </div>
    </>
  )
}

function ToolWork({ longName, shortName }) {
  return (
    <>
      <div>
        <b><Link to={'https://xpack-dev-tools.github.io/' + shortName + '-xpack/'}>{shortName}</Link></b> - <b>xPack {longName}</b>
      </div>
    </>
  )
}

function ToolsLeft() {
  return (
    <div className={clsx('col col--6')}>
      <div className="text--center padding-horiz--md padding-vert--lg">
        <Heading as="h2">Main Tools</Heading>
        {tools.mainTools.map((props, idx) => (
          <Tool {...props} />
        ))}
      </div>
    </div>
  );
}

function ToolsRight() {
  return (
    <div className={clsx('col col--6')}>
      <div className="text--center padding-horiz--md padding-vert--lg">
        <Heading as="h2">Supplementary Tools</Heading>
        {tools.supplementaryTools.map((props, idx) => (
          <Tool {...props} />
        ))}
      </div>
      <hr className="hero__hr2" />
      <div className="text--center padding-horiz--md padding-vert--md">
        <Heading as="h2">Work in Progress</Heading>
        {tools.workInProgressTools.map((props, idx) => (
          <ToolWork {...props} />
        ))}
      </div>
      <hr className="hero__hr2" />
      <div className="text--center padding-horiz--md padding-vert--md">
        <Heading as="h2">Other</Heading>
        <div><b><Link to={'https://github.com/xpack-dev-tools/xbb-helper-xpack'}>xbb-helper</Link></b> - <b>xPack Build Helper</b></div>
        <div><b><Link to={'https://github.com/xpack-dev-tools/xpack-build-box'}>xpack-build-box</Link></b> - <b>xPack Build Box (XBB)</b></div>
      </div>
    </div>
  );
}

export default function HomepageTools(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row padding-bottom--lg">
          <ToolsLeft key={0} />
          <ToolsRight key={1} />
        </div>
      </div>
    </section>
  );
}
