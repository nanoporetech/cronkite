import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
// import svg from 'rollup-plugin-svg';

// https://stenciljs.com/docs/config

const isDevMode = process.argv.includes('--dev');
const buildTypeStyles = isDevMode ? 'src/global/styles/dev.scss' : 'src/global/styles/prod.scss';

const srcIndexHtml = isDevMode ? 'src/index.dev.html' : 'src/index.html';

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
      baseUrl: '/',
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
    },
  ],
  plugins: [
    sass({
      injectGlobalPaths: [
        buildTypeStyles,
        'src/global/styles/colours.scss',
        'src/global/styles/font.scss',
        'src/global/styles/scaling.scss',
        'src/global/styles/variables.scss',
      ],
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
