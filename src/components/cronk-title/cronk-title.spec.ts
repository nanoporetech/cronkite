import { newSpecPage, SpecPage } from '@stencil/core/dist/testing';
import { CronkTitle } from './cronk-title';

describe('cronk-title', () => {
  let rootInst: CronkTitle;
  let rootEl: HTMLCronkTitleElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkTitle],
      html: '<cronk-title></cronk-title>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkTitleElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new CronkTitle()).toBeTruthy();
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
