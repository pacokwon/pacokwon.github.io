/* eslint-disable @typescript-eslint/no-var-requires */
const withImages = require('next-images');

// const isProd = process.env.NODE_ENV === 'production';

module.exports = withImages({
  images: {
    domains: ['github.com'],
    disableStaticImages: true,
  },
  webpack(config, _options) {
    return config;
  },
});
