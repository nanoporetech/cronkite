import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

// https://stenciljs.com/docs/config

const buildTypeStyles = 'src/global/styles/prod.scss';

const srcIndexHtml = 'src/index.html';

export const config: Config = {
  commonjs: {
    include: /node_modules|(..\/.+)/,
  } as any,
  devServer: {
    // openBrowser: false,
    // port: 4400,
    reloadStrategy: 'pageReload',
  },

  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.scss',
  namespace: 'cronkite',
  outputTargets: [
    {
      baseUrl: '/cronkite',
      copy: [
        {
          dest: './examples',
          src: '../examples',
        },
      ],
      // comment the following line to disable service workers in production
      serviceWorker: null,
      type: 'www',
    },
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        { src: 'cronkite.schema.json' }
      ]
    },
    {
      type: 'docs-readme',
    },
  ],
  plugins: [
    sass({
      injectGlobalPaths: [buildTypeStyles],
    }),
  ],
  srcIndexHtml,
  testing: {
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
    browserDevtools: true,
    browserHeadless: true,
    testPathIgnorePatterns: ['cypress', 'cache', 'dist'],
  },
};
