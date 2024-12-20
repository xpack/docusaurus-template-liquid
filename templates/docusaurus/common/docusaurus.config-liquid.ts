// DO NOT EDIT!
// Automatically generated from docusaurus-template-liquid/templates/docusaurus.

import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
// import logger from '@docusaurus/logger';
import util from 'node:util';
{% if packageWebsiteConfig.hasCli == "true" %}
import cliNavbar from './docusaurus-config-navbar-cli'
{% endif%}{% if packageWebsiteConfig.hasCustomDocsNavbarItem == "true" %}
import {customDocsNavbarItem} from './navbar-docs-items'
{% endif %}

import {redirects} from './docusaurus-config-redirects'

// The node.js modules cannot be used in modules imported in browser code:
// webpack < 5 used to include polyfills for node.js core modules by default.
// so the entire initialisation code must be in this file, that is
// not processed by webpack.

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

// ----------------------------------------------------------------------------

function getCustomFields() {
  const pwd = fileURLToPath(import.meta.url);
  // console.log(pwd);

  // First get the version from the top package.json.
  const topFilePath = path.join(path.dirname(path.dirname(pwd)), 'package.json');
  // console.log(filePath);
  const topFileContent = fs.readFileSync(topFilePath);

  const topPackageJson = JSON.parse(topFileContent.toString());
  const releaseVersion = topPackageJson.version.replace(/[.-]pre/, '');

  console.log(`package version: ${topPackageJson.version}`);

  const enginesNodeVersion = topPackageJson.engines.node.replace(/[^0-9]*/, '') || '';
  const enginesNodeVersionMajor = enginesNodeVersion.replace(/[.].*/, '');
  const customFields = {
    enginesNodeVersion,
    enginesNodeVersionMajor
  }

  return {
    releaseVersion,
    docusaurusVersion: require('@docusaurus/core/package.json').version,
    buildTime: new Date().getTime(),
    ...customFields,
  }
}

// ----------------------------------------------------------------------------

const customFields = getCustomFields();
console.log('customFields: ' + util.inspect(customFields));

// ----------------------------------------------------------------------------

const config: Config = {
  title: '{{ packageWebsiteConfig.title }}' +
    ((process.env.DOCUSAURUS_IS_PREVIEW === 'true') ? ' (preview)' : ''),
  tagline: '{% if packageWebsiteConfig.tagline %}{{packageWebsiteConfig.tagline}}{% else %}{{ packageDescription }}{% endif %}',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://{{ githubProjectOrganization }}.github.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.DOCUSAURUS_BASEURL ??
    '{% if baseUrlPreview != baseUrl %}{{ baseUrlPreview }}{% else %}{{ baseUrl }}{% endif %}',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: '{{ githubProjectOrganization }}', // Usually your GitHub org/user name.
  projectName: '{{ githubProjectName }}', // Usually your repo name.

  onBrokenAnchors: 'throw',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  onDuplicateRoutes: 'throw',

  // Useful for the sitemap.xml, to avoid redirects, since
  // GitHub redirects all to trailing slash.
  trailingSlash: true,

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/{{ githubProjectOrganization }}/{{ githubProjectName }}/edit/master/website/',
          // showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/{{ githubProjectOrganization }}/{{ githubProjectName }}/edit/master/website/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        sitemap: {
          // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-sitemap
          changefreq: 'weekly',
          priority: 0.5,
          // ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      // https://docusaurus.io/docs/next/api/plugins/@docusaurus/plugin-client-redirects#redirects
      '@docusaurus/plugin-client-redirects',
      redirects
    ],
    [
      // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-gtag
      // https://tagassistant.google.com
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-T50NMR8JZ1',
        anonymizeIP: false,
      }
    ],
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        disableInDev: false,
      },
    ],{% if packageWebsiteConfig.hasApi == "true" %}
    [
      'docusaurus-plugin-typedoc',
      {
        // https://typedoc-plugin-markdown.org/docs/options#display-options
        blockTagsPreserveOrder: [
          "@example"
        ],
        categorizeByGroup: false, // Otherwise it fails to load the sidebar.
        classPropertiesFormat: "list", // "table" not, it may have examples
        entryPointStrategy: "resolve",
        entryPoints: [
          "../src/index.ts"
        ],
        enumMembersFormat: "table",
        excludeExternals: true,
        excludeInternal: true,
        expandObjects: true,
        expandParameters: true,
        indexFormat: "table",
        interfacePropertiesFormat: "list", // "table" not, it may have examples
        logLevel: "Verbose",
        parametersFormat: "table",
        plugin: [
          "typedoc-plugin-markdown"
        ],
        propertyMembersFormat: "table",
        readme: "none",
        skipErrorChecking: true,
        sort: [
          "instance-first",
          "visibility"
        ],
        tsconfig: '../tsconfig.json',
        "tableColumnSettings": {
          "leftAlignHeaders": true
        },
        typeDeclarationFormat: "table",
        useCodeBlocks: false, // Nice, but it might be mistaken for examples.
      }
    ],{% endif %}

    // Local plugins.
    './src/plugins/SelectReleasesPlugin',
  ],


  // https://docusaurus.io/docs/api/docusaurus-config#headTags
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        href: '{{baseUrl}}favicons/favicon-48x48.png',
        sizes: '48x48'
      }
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '{{baseUrl}}favicons/favicon.svg'
      }
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'shortcut icon',
        href: '{{baseUrl}}favicons/favicon.ico'
      }
    },
    {
      // This might also go to themeConfig.metadata.
      tagName: 'meta',
      attributes: {
        name: 'apple-mobile-web-app-title',
        content: 'xPack'
      }
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'manifest',
        href: '{{baseUrl}}favicons/site.webmanifest'
      }
    }
  ],

  themeConfig: {
    // The project's social card, og:image, twitter:image, 1200x630
    image: 'img/sunrise-og-image.jpg',

    metadata: [
      {
        name: 'keywords',
        content: '{{ packageWebsiteConfig.metadataKeywords }}'
      }
    ],
    navbar: {
      // Overriden by i18n/en/docusaurus-theme-classic.
      title: {% if githubProjectOrganization == "xpack" %}'The xPack Project'{% elsif githubProjectOrganization == "xpack-dev-tools" %}'xPack Binary Development Tools'{% endif %},

      logo: {
        alt: 'xPack Logo',
        src: 'img/components-256.png',
        href: 'https://{{githubProjectOrganization}}.github.io/',
      },
      items: [
        {
          to: '/',
          // label: 'Home',
          className: 'header-home-link',
          position: 'left'
        },{% if packageWebsiteConfig.hasCustomDocsNavbarItem == "true" %}
        customDocsNavbarItem,
        {% else %}
        {
          type: 'dropdown',
          label: 'Documentation',
          to: 'docs/getting-started',
          position: 'left',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started'
            },{% if packageWebsiteConfig.skipInstallCommand != "true" %}
            {
              label: 'Install Guide',
              to: '/docs/install'
            },{% endif %}
            {
              label: 'User\'s Guide',
              to: '/docs/user'
            },{% if packageWebsiteConfig.skipContributorGuide != "true" %}
            {
              label: 'Contributor\'s Guide',
              to: '/docs/developer'
            },{% endif %}
            {
              label: 'Maintainer\'s Guide',
              to: '/docs/maintainer'
            },
            {
              label: 'Help Centre',
              to: '/docs/support'
            },
            {
              label: 'Releases',
              to: '/docs/releases'
            },
            {
              label: 'About',
              to: '/docs/project/about'
            }
          ],
        },{% endif %}{% if packageWebsiteConfig.hasCli == "true" %}
        cliNavbar,{% endif %}{% if packageWebsiteConfig.hasApi == "true" %}
        {
          to: '/docs/api',
          label: 'API Reference',
          position: 'left',
        },{% endif %}
        {
          type: 'dropdown',
          to: '/blog',
          label: 'Blog',
          position: 'left',
          items: [
            {
              label: 'Recent',
              to: '/blog'
            },
            {
              label: 'Archive',
              to: '/blog/archive'
            },
            {
              label: 'Tags',
              to: '/blog/tags'
            },
          ]
        },
        {
          href: 'https://github.com/{{ githubProjectOrganization }}/{{ githubProjectName }}/',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },{% if releaseVersion != "0.0.0" %}
        {
          label: `v${customFields.releaseVersion}`,
          position: 'right',
          href: `https://www.npmjs.com/package/{{ packageScopedName }}/v/${customFields.releaseVersion}`,
        },{% endif %}
        {
          href: 'https://github.com/xpack/',
          label: 'xpack',
          position: 'right',
        },
        {
          href: 'https://github.com/xpack-dev-tools/',
          label: 'xpack-dev-tools',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Pages',
          items: [{% if packageConfig.isOrganizationWeb == "true" %}
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'About',
              to: '/docs/project/about',
            },{% else %}{% if packageWebsiteConfig.skipInstallCommand != "true" %}
            {
              label: 'Install',
              to: '/docs/install',
            },{% else %}
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },{% endif %}
            {
              label: 'Support',
              to: '/docs/support',
            },
            {
              label: 'Releases',
              to: '/docs/releases',
            },{% endif %}
            {
              label: 'Blog',
              to: '/blog',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/{{ githubProjectOrganization }}/{{ githubProjectName }}/discussions',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/xpack',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/kbzWaJerFG',
            },
            {
              label: 'X/Twitter',
              href: 'https://twitter.com/xpack_project',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Donate via PayPal',
              href: 'https://www.paypal.com/donate/?hosted_button_id=5MFRG9ZRBETQ8',
            },
            {
              label: 'GitHub {{ githubProjectName }}',
              href: 'https://github.com/{{ githubProjectOrganization }}/{{ githubProjectName }}/',
            },
            {
              label: 'GitHub xpack',
              href: 'https://github.com/xpack/',
            },
            {
              label: 'GitHub xpack-dev-tools',
              href: 'https://github.com/xpack-dev-tools/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Liviu Ionescu. Built with Docusaurus v${customFields.docusaurusVersion} on ${new Date(customFields.buildTime).toDateString()}.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  customFields: customFields,
};

export default config;
