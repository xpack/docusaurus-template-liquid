// DO NOT EDIT!
// Automatically generated from docusaurus-template-liquid/templates/docusaurus.

import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

{% if customFields.isOrganizationWeb == "true" %}
import toolsSidebar from './sidebars-tools.js';
{% endif %}

{% if customFields.hasCustomUserSidebar == "true" %}
import {userSidebarCategory} from "./sidebar-user";
{% endif %}

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  docsSidebar: [
    {
      type: 'doc',
      id: 'getting-started/index',
      label: 'Getting Started'
    },{% if customFields.isOrganizationWeb == "true" %}
    {
      type: 'doc',
      id: 'install/index',
      label: 'Install Guides'
    },
    {
      type: 'doc',
      id: 'user/index',
      label: 'User\'s Guides'
    },
    {
      type: 'category',
      label: 'Contributor\'s Guides',
      link: {
        type: 'doc',
        id: 'developer/index',
      },
      items: [
        {
          type: 'doc',
          id: 'developer/install/prerequisites/index',
          label: 'Build Prerequisites'
        }
      ]
    },
    {
      type: 'doc',
      id: 'maintainer/index',
      label: 'Maintainer\'s Guides'
    },
    {% else %}
    {
      type: 'doc',
      id: 'install/index',
      label: 'Install Guide'
    },{% if customFields.hasCustomUserSidebar == "true" %}
    userSidebarCategory,{% else %}
    {
      type: 'doc',
      id: 'user/index',
      label: 'User\'s Guide'
    },{% endif %}{% if customFields.isOrganizationWeb != "true" %}
    {
      type: 'doc',
      id: 'developer/index',
      label: 'Contributor\'s Guide'
    },
    {
      type: 'doc',
      id: 'maintainer/index',
      label: 'Maintainer\'s Guide'
    },{% if customFields.showTestsResults == 'true' %}
    {
      type: 'doc',
      id: 'tests/index',
      label: 'Tests results'
    },{% endif %}{% endif %}
    {
      type: 'doc',
      id: 'faq/index',
      label: 'FAQ'
    },
    {
      type: 'doc',
      id: 'support/index',
      label: 'Help Centre'
    },
    {
      type: 'doc',
      id: 'releases/index',
      label: 'Releases'
    },{% endif %}
    {
      type: 'doc',
      id: 'about/index',
      label: 'About'
    }
  ],{% if customFields.showTestsResults == 'true' %}
  testsSidebar: [{type: 'autogenerated', dirName: 'tests'}],{% endif %}{% if customFields.isOrganizationWeb == "true" %}
  toolsSidebar,{% endif %}
};

export default sidebars;
