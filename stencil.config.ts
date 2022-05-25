import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'cronkite',
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.scss',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        { src: 'cronkite.schema.json' }
      ]
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      baseUrl: '/cronkite',
      copy: [
        {
          dest: './examples',
          src: '../examples',
        },
      ],
    },
  ],
  plugins: [
    sass({
      injectGlobalPaths: ['src/global/styles/prod.scss'],
    }),
  ],
};
