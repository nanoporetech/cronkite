import { newSpecPage, SpecPage } from '@stencil/core/dist/testing';
import { CronkPageComponents } from './cronk-page-components';

describe('cronk-page-components', () => {
  let rootInst: CronkPageComponents;
  let rootEl: HTMLCronkPageComponentsElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkPageComponents],
      html: '<cronk-page-components></cronk-page-components>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkPageComponentsElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new CronkPageComponents()).toBeTruthy();
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
