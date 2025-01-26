// DO NOT EDIT!
// Automatically generated from docusaurus-template-liquid/templates/docusaurus.

import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';{% if packageWebsiteConfig.hasApi == "true" %}
import typedocSidebarItems from "./docs/api/typedoc-sidebar.cjs";{% endif %}{% if packageWebsiteConfig.hasCli == "true" %}
import cliSidebar from "./sidebar-cli";{% endif %}{% if packageWebsiteConfig.hasCustomUserSidebar == "true" %}
import {userSidebarCategory} from "./sidebar-user";{% endif %}{% if packageWebsiteConfig.hasCustomSidebar == "true" %}
import {customDocsSidebar} from "./sidebar-docs-custom";{% endif %}

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {

  {% if packageWebsiteConfig.hasCustomSidebar == "true" %}
  docsSidebar: customDocsSidebar,
  {% else %}
  docsSidebar: [
    {
      type: 'doc',
      id: 'getting-started/index',
      label: 'Getting Started'
    },{% if packageWebsiteConfig.skipInstallGuide != "true" %}
    {
      type: 'doc',
      id: 'install/index',
      label: 'Install Guide'
    },{% endif %}{% if packageWebsiteConfig.hasCustomUserSidebar == "true" %}
    userSidebarCategory,{% else %}
    {
      type: 'doc',
      id: 'user/index',
      label: 'User\'s Guide'
    },{% endif %}{% if packageWebsiteConfig.skipContributorGuide != "true" %}
    {
      type: 'doc',
      id: 'developer/index',
      label: 'Contributor\'s Guide'
    },{% endif %}{% if packageWebsiteConfig.skipMaintainerGuide != "true" %}
    {
      type: 'doc',
      id: 'maintainer/index',
      label: 'Maintainer\'s Guide'
    },{% endif %}{% if packageWebsiteConfig.skipFaq != "true" %}
    {
      type: 'doc',
      id: 'faq/index',
      label: 'FAQ'
    },{% endif %}
    {
      type: 'doc',
      id: 'support/index',
      label: 'Help Centre'
    },{% if packageWebsiteConfig.skipReleases != "true" %}
    {
      type: 'doc',
      id: 'releases/index',
      label: 'Releases'
    },{% endif %}
    {
      type: 'category',
      label: 'Project',
      link: {
        type: 'doc',
        id: 'project/about/index',
      },
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'project/about/index',
          label: 'About'
        },
        {
          type: 'doc',
          id: 'project/history/index',
          label: 'History'
        },
        {
          type: 'link',
          label: 'License',
          href: 'https://opensource.org/license/MIT',
        },
      ]
    },
  ],{% endif %}
  {% if packageWebsiteConfig.hasApi == "true" %}
  typedocSidebar: [
    {
      type: 'category',
      label: 'API Reference (TypeDoc)',
      link: {
        type: 'doc',
        id: 'api/index',
      },
      collapsed: false,
      items: typedocSidebarItems,
    },
  ],{% endif %}
  {% if packageWebsiteConfig.hasCli == "true" %}
  cliSidebar
  {% endif %}
};

export default sidebars;
