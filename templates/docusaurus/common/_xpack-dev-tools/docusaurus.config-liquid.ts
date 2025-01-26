// DO NOT EDIT!
// Automatically generated from docusaurus-template-liquid/templates/docusaurus.

import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
// import logger from '@docusaurus/logger';
import util from 'node:util';

import {redirects} from './docusaurus-config-redirects';
import {getCustomFields} from './customFields';

// The node.js modules cannot be used in modules imported in browser code:
// webpack < 5 used to include polyfills for node.js core modules by default.
// so the entire initialisation code must be in this file, that is
// not processed by webpack.

// ----------------------------------------------------------------------------

const customFields = getCustomFields();
console.log('customFields: ' + util.inspect(customFields));

// ----------------------------------------------------------------------------

const config: Config = {
  title: '{{longXpackName}}' +
    ((process.env.DOCUSAURUS_IS_PREVIEW === 'true') ? ' (preview)' : ''),
  tagline: '{% if packageWebsiteConfig.docusaurusTagline %}{{packageWebsiteConfig.docusaurusTagline}}{% else %}A binary distribution of {{packageConfig.longName}}{% endif %}',
  // Explicitly set in headTags.
  // favicon: '/img/favicon.ico',

  // Set the production url of your site here
  url: 'https://{{githubProjectOrganization}}.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.DOCUSAURUS_BASEURL ??
    '{% if packageWebsiteConfig.docusaurusBaseUrl %}{{packageWebsiteConfig.docusaurusBaseUrl}}{% else %}/{{githubProjectName}}/{% endif %}',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: '{{githubProjectOrganization}}', // Usually your GitHub org/user name.
  projectName: '{{githubProjectName}}', // Usually your repo name.

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
          editUrl:
            'https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/edit/xpack/website/',
          // showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/edit/xpack/website/',
          showLastUpdateTime: true,
          blogSidebarCount: 8,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-sitemap
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: [
            '{% if packageWebsiteConfig.docusaurusBaseUrl %}{{packageWebsiteConfig.docusaurusBaseUrl}}{% else %}/{{githubProjectName}}/{% endif %}blog/archive/**',
            '{% if packageWebsiteConfig.docusaurusBaseUrl %}{{packageWebsiteConfig.docusaurusBaseUrl}}{% else %}/{{githubProjectName}}/{% endif %}blog/authors/**',
            '{% if packageWebsiteConfig.docusaurusBaseUrl %}{{packageWebsiteConfig.docusaurusBaseUrl}}{% else %}/{{githubProjectName}}/{% endif %}blog/tags/**'
          ],
          filename: 'sitemap.xml',
        },
        // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-gtag
        // https://tagassistant.google.com
        gtag: {
          trackingID: 'G-7QE5W7V05S',
          anonymizeIP: false,
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        disableInDev: false,
      },
    ],
    [
      // https://docusaurus.io/docs/next/api/plugins/@docusaurus/plugin-client-redirects#redirects
      '@docusaurus/plugin-client-redirects',
      redirects
    ],
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

  // No longer needed.
  // themes: [ '@docusaurus/theme-search-algolia' ],

  // https://docusaurus.io/docs/seo
  themeConfig: {
    // The project's social card, og:image, twitter:image, 1200x630
    image: 'img/sunrise-og-image.jpg',

    metadata: [{% if packageConfig.isOrganizationWeb == "true" %}
      {
        name: 'keywords',
        content: 'xpack, binary, development, tools, reproducibility'
      }{% else %}
      {
        name: 'keywords',
        content: 'xpack, binary, development, tools, reproducibility, {% if packageConfig.shortName %}{{packageConfig.shortName}}{% else %}{{packageName}}{% endif %}'
      }{% endif %}
    ],
    navbar: {
      title: {% if githubProjectOrganization == "xpack" %}'The xPack Project'{% elsif githubProjectOrganization == "xpack-dev-tools" %}'The xPack Binary Tools'{% else %}???{% endif %},

      logo: {
        alt: 'xPack Logo',
        src: 'img/components-256.png',
        href: 'https://{{githubProjectOrganization}}.github.io/'
      },
      items: [
        {
          to: '/',
          label: {% if packageConfig.isOrganizationWeb == "true" %}'{{githubProjectOrganization}}'{% else %}{% if packageConfig.shortName %}'{{packageConfig.shortName}}'{% else %}'{{packageName}}'{% endif %}{% endif %},
          className: 'header-home-link',
          position: 'left'
        },
        {
          type: 'dropdown',
          label: 'Documentation',
          to: 'docs/getting-started',
          position: 'left',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started'
            },{% if packageWebsiteConfig.skipInstallGuide != "true" %}
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
            },{% if packageConfig.isOrganizationWeb != "true" %}
            {
              label: 'FAQ',
              to: '/docs/faq'
            },{% endif %}
            {
              label: 'Help Centre',
              to: '/docs/support'
            },{% if packageConfig.isOrganizationWeb != "true" %}
            {
              label: 'Releases',
              to: '/docs/releases'
            },{% endif %}
            {
              label: 'About',
              to: '/docs/project/about'
            },
          ]
        },{% if packageWebsiteConfig.hasCli == "true" %}
        cliNavbar,{% endif %}{% if packageWebsiteConfig.hasApi == "true" %}
        {
          to: '/docs/api',
          label: 'API',
          position: 'left',
        },{% endif %}
        {% if packageConfig.isOrganizationWeb == "true" %}
        {
          type: 'docSidebar',
          label: 'Tools',
          position: 'left',
          sidebarId: 'toolsSidebar'
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
          href: 'https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
        {
          type: 'dropdown',
          href: 'https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/',
          position: 'right',
          label: 'GitHub',
          items: [
            {
              label: `{{githubProjectName}} project`,
              href: `https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/`,
            },
            {
              label: 'xpack-dev-tools org',
              href: 'https://github.com/{{githubProjectOrganization}}/',
            },
            {
              label: 'xpack org',
              href: 'https://github.com/xpack/',
            },
          ]
        },{% if releaseSemver != "0.0.0" %}
        {
          label: `${customFields.xpackVersion}`,
          position: 'right',
          href: `https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/releases/tag/v${customFields.xpackVersion}`,
        },{% endif %}
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
            },{% else %}
            {
              label: 'Install',
              to: '/docs/install',
            },
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
              href: 'https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/discussions',
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
              label: 'GitHub {{githubProjectName}} project',
              href: 'https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/',
            },
            {
              label: 'GitHub xpack-dev-tools org',
              href: 'https://github.com/{{githubProjectOrganization}}/',
            },
            {
              label: 'GitHub xpack org',
              href: 'https://github.com/xpack/',
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
    // https://docusaurus.io/docs/search#using-algolia-docsearch
    // https://docsearch.algolia.com/docs/docsearch-v3/
    algolia: {
      // The application ID provided by Algolia
      appId: "KIDD7R4CL1",

      // Public API key: it is safe to commit it
      apiKey: "ca2ffc431941284609f2d50202fc5506",

      indexName: "xpackio",

      // It ensures that search results are relevant to the current
      // language and version. Enabled by default.
      contextualSearch: true,

      // Optional: Specify domains where the navigation should occur
      // through window.location instead on history.push. Useful when
      // our Algolia config crawls multiple documentation sites and
      // we want to navigate with window.location.href to them.
      // externalUrlRegex: 'external\\.com|domain\\.com',
      externalUrlRegex: 'xpack\\.github\\.io|xpack-dev-tools\\.github\\.io',

      // Optional: Replace parts of the item URLs from Algolia.
      // Useful when using the same search index for multiple deployments
      // using a different baseUrl. You can use regexp or string in the
      // `from` param. For example: localhost:3000 vs myCompany.com/docs
      // replaceSearchResultPathname: {
      //  from: '/docs/', // or as RegExp: /\/docs\//
      //  to: '/',
      // },

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,
    },
  } satisfies Preset.ThemeConfig,

  customFields: customFields,
};

export default config;
