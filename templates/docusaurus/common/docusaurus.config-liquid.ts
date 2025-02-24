// DO NOT EDIT!
// Automatically generated from docusaurus-template-liquid/templates/docusaurus.

import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
// import logger from '@docusaurus/logger';
import util from 'node:util';

{%- if packageWebsiteConfig.hasCli == "true" %}

import cliNavbar from './docusaurus-config-navbar-cli';
{%- endif %}
{%- if packageWebsiteConfig.hasCustomDocsNavbarItem == "true" %}
import {customDocsNavbarItem} from './navbar-docs-items';
{%- endif %}

import {redirects} from './docusaurus-config-redirects';
import {getCustomFields} from './customFields';

// The node.js modules cannot be used in modules imported in browser code:
// webpack < 5 used to include polyfills for node.js core modules by default.
// so the entire initialisation code must be in this file, that is
// not processed by webpack.

// ----------------------------------------------------------------------------

const customFields = getCustomFields();
console.log('customFields: ' + util.inspect(customFields));

const actualBaseUrl = process.env.DOCUSAURUS_BASEURL ??
    '{% if packageConfig.isWebPreview == "true" %}{{baseUrlPreview}}{% else %}{{baseUrl}}{% endif %}';

// ----------------------------------------------------------------------------

const config: Config = {
  title: '{% if packageWebsiteConfig.title %}{{packageWebsiteConfig.title}}{% else %}{{longXpackName}}{% endif %}' +
    ((process.env.DOCUSAURUS_IS_PREVIEW === 'true') ? ' (preview)' : ''),
  tagline: '{% if packageWebsiteConfig.tagline %}{{packageWebsiteConfig.tagline}}{% elsif isXpackBinary == "true" and packageConfig.descriptiveName %}A binary distribution of {{packageConfig.descriptiveName}}{% else %}{{packageDescription}}{% endif %}',

  // Explicitly set in headTags.
  // favicon: '/img/favicon.ico',

  // Set the production url of your site here
  url: 'https://{{githubProjectOrganization}}.github.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: actualBaseUrl,

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

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        sidebarPath: './sidebars.ts',
        // Please change this to your repo.
        // Remove this to remove the "edit this page" links.
        editUrl: 'https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/edit/{{branchWebsite}}/website/',
        // showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      },
    ],
    [
      // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-blog
      '@docusaurus/plugin-content-blog',
      {
        showReadingTime: true,
        blogSidebarCount: 8,
        feedOptions: {
          type: ['rss', 'atom'],
          xslt: true,
        },
        // Please change this to your repo.
        // Remove this to remove the "edit this page" links.
        editUrl: 'https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/edit/{{branchWebsite}}/website/',
        // Useful options to enforce blogging best practices
        onInlineTags: 'warn',
        onInlineAuthors: 'warn',
        onUntruncatedBlogPosts: 'warn',
      },
    ],
    [
      '@docusaurus/plugin-content-pages',
      {}
    ],
    [
      // https://docusaurus.io/docs/next/api/plugins/@docusaurus/plugin-client-redirects#redirects
      '@docusaurus/plugin-client-redirects',
      redirects,
    ],
    [
      '@docusaurus/plugin-debug',
      {}
    ],
    [
      // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-gtag
      // https://tagassistant.google.com
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: '{% if githubProjectOrganization == "xpack" %}G-8WX9T80JEK{% elsif githubProjectOrganization == "xpack-dev-tools" %}G-7QE5W7V05S{% endif %}',
        anonymizeIP: false,
      }
    ],
    [
      // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-sitemap
      '@docusaurus/plugin-sitemap',
      {
        lastmod: 'date',
        changefreq: 'weekly',
        priority: 0.5,
        ignorePatterns: [
          actualBaseUrl + 'blog/archive/**',
          actualBaseUrl + 'blog/authors/**',
          actualBaseUrl + 'blog/tags/**'
        ],
        filename: 'sitemap.xml',
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
    ],
{%- if packageWebsiteConfig.hasApi == "true" %}
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
    ],
{%- endif %}

    // Local plugins.
    './src/plugins/SelectReleasesPlugin',
  ],

  themes: [
    [
      '@docusaurus/theme-classic',
      {
        customCss: './src/css/custom.css',
      }
    ],
    [
      // Explicitly required when not using `preset-classic`.
      // https://docusaurus.io/docs/search#using-algolia-docsearch
      '@docusaurus/theme-search-algolia',
      {
      }
    ],
  ],

  // https://docusaurus.io/docs/api/docusaurus-config#headTags
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        href: actualBaseUrl + 'favicons/favicon-48x48.png',
        sizes: '48x48'
      }
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/svg+xml',
        href: actualBaseUrl + 'favicons/favicon.svg'
      }
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'shortcut icon',
        href: actualBaseUrl + 'favicons/favicon.ico'
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
        href: actualBaseUrl + 'favicons/site.webmanifest'
      }
    }
  ],

  // https://docusaurus.io/docs/seo
  themeConfig: {
    // The project's social card, og:image, twitter:image, 1200x630
    image: 'img/sunrise-og-image.jpg',

    metadata: [
      {
        name: 'keywords',
{%- if packageWebsiteConfig.metadataKeywords %}
        content: '{{packageWebsiteConfig.metadataKeywords}}'
{%- elsif githubProjectOrganization == "xpack-dev-tools" %}
        content: 'xpack, binary, development, tools, reproducibility, {% if packageConfig.permalinkName %}{{packageConfig.permalinkName}}{% else %}{{packageName}}{% endif %}'
{%- else %}
        content: 'xpack, {% if packageConfig.permalinkName %}{{packageConfig.permalinkName}}{% else %}{{packageName}}{% endif %}'
{%- endif %}
      }
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
          label: {% if packageConfig.isOrganizationWeb == "true" %}'{{githubProjectOrganization}}'{% else %}{% if packageConfig.permalinkName %}'{{packageConfig.permalinkName}}'{% else %}'{{packageName}}'{% endif %}{% endif %},
          className: 'header-home-link',
          position: 'left'
        },
{%- if packageWebsiteConfig.hasCustomDocsNavbarItem == "true" %}
        customDocsNavbarItem,
{%- else %}
        {
          type: 'dropdown',
          label: 'Documentation',
          to: 'docs/getting-started',
          position: 'left',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started'
            },
{%- if packageWebsiteConfig.skipInstallGuide != "true" %}
            {
              label: 'Install Guide{% if packageWebsiteConfig.usePluralGuides == "true" %}s{% endif %}',
              to: '/docs/install'
            },
{%- endif %}
            {
              label: 'User\'s Guide{% if packageWebsiteConfig.usePluralGuides == "true" %}s{% endif %}',
              to: '/docs/user'
            },
{%- if packageWebsiteConfig.skipContributorGuide != "true" %}
            {
              label: 'Contributor\'s Guide{% if packageWebsiteConfig.usePluralGuides == "true" %}s{% endif %}',
              to: '/docs/developer'
            },
{%- endif %}
{%- if packageWebsiteConfig.skipMaintainerGuide != "true" %}
            {
              label: 'Maintainer\'s Guide{% if packageWebsiteConfig.usePluralGuides == "true" %}s{% endif %}',
              to: '/docs/maintainer'
            },
{%- endif %}
{%- if packageWebsiteConfig.skipFaq != "true" %}
            {
              label: 'FAQ',
              to: '/docs/faq'
            },
{%- endif %}
            {
              label: 'Help Centre',
              to: '/docs/support'
            },
{%- if packageWebsiteConfig.skipReleases != "true" %}
            {
              label: 'Releases',
              to: '/docs/releases'
            },
{%- endif %}
            {
              label: 'About',
              to: '/docs/project/about'
            },
          ],
        },
{%- endif %}
{%- if packageWebsiteConfig.hasCli == "true" %}
        cliNavbar,
{%- endif %}
{%- if packageWebsiteConfig.hasApi == "true" %}
        {
          to: '/docs/api',
          label: 'API',
          position: 'left',
        },
{%- endif %}
{%- if packageWebsiteConfig.hasToolsSidebar == "true" %}
        {
          type: 'docSidebar',
          label: 'Tools',
          position: 'left',
          sidebarId: 'toolsSidebar'
        },
{%- endif %}
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
              label: 'xpack org',
              href: 'https://github.com/xpack/',
            },
            {
              label: 'xpack-dev-tools org',
              href: 'https://github.com/xpack-dev-tools/',
            },
          ]
        },
{%- if isXpackBinary == "true" %}
        {
          label: `${customFields.xpackVersion}`,
          position: 'right',
          href: `https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/releases/tag/v${customFields.xpackVersion}`,
        },
{%- elsif isNpmPublished == "true" %}
        {
          label: `${customFields.releaseVersion}`,
          position: 'right',
          href: `https://www.npmjs.com/package/{{packageScopedName}}/v/${customFields.releaseVersion}`,
        },
{%- endif %}
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Pages',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
{%- if packageWebsiteConfig.skipReleases != "true" %}
            {
              label: 'Releases',
              to: '/docs/releases',
            },
{%- else %}
            {
              label: 'Support',
              to: '/docs/support',
            },
{%- endif %}
            {
              label: 'About',
              to: '/docs/project/about',
            },
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
              href: 'https://discord.com/invite/kbzWaJerFG',
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
              label: 'GitHub xpack org',
              href: 'https://github.com/xpack/',
            },
            {
              label: 'GitHub xpack-dev-tools org',
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
