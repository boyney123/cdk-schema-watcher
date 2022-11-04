// @ts-check

const theme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SchemaWatcher',
  tagline: 'Notify consumers of changes to your EventBridge schemas',
  url: 'https://schema-watcher.vercel.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  plugins: [
    'my-loaders',
    // [
    //   '@docusaurus/plugin-google-gtag',
    //   {
    //     trackingID: 'G-xxxxx',
    //   },
    // ],
  ],
  scripts: ['https://unpkg.com/browse/leader-line@1.0.7/leader-line.min.js'],
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/boyney123/cdk-schema-watcher/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'SchemaWatcher',
        logo: {
          alt: 'SchemaWatcher Logo',
          src: 'img/logo.svg',
        },

        items: [
          {
            type: 'doc',
            docId: 'introduction',
            position: 'left',
            label: 'Docs',
          },
          {
            type: 'doc',
            position: 'left',
            docId: 'plugin-intro',
            label: 'Plugins',
          },
          {
            href: 'https://github.com/boyney123/cdk-schema-watcher',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      announcementBar: {
        content:
          '⭐️ If you like SchemaWatcher, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/boyney123/cdk-schema-watcher">GitHub</a>! ⭐️',
      },
      colorMode: {
        disableSwitch: true,
        defaultMode: 'light',
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction',
                to: '/docs/introduction',
              },
              {
                label: 'Installation',
                to: '/docs/installation',
              },
              {
                label: 'Plugins',
                to: '/docs/plugin-intro',
              },
            ],
          },
          {
            title: 'Connect',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/boyney123',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/boyney123/cdk-schema-watcher',
              },
            ],
          },
        ],
        copyright: `Open Source project built by David Boyne. Built for the community.`,
      },
      prism: {
        theme: theme,
        darkTheme: theme,
      },
    }),
};

module.exports = config;
