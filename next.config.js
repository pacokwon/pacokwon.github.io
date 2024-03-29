/* eslint-disable @typescript-eslint/no-var-requires */
const withImages = require('next-images');

// const isProd = process.env.NODE_ENV === 'production';

module.exports = withImages({
  images: {
    domains: ['github.com'],
    disableStaticImages: true,
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/xml',
          },
        ],
      },
    ];
  },
  webpack(config, { isServer }) {
    if (isServer) require('./scripts/generate-sitemap');

    return config;
  },
});
