import { newSpecPage, SpecPage } from '@stencil/core/dist/testing';
import { CronkSelector } from './cronk-selector';

describe('cronk-selector', () => {
  let rootInst: CronkSelector;
  let rootEl: HTMLCronkSelectorElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkSelector],
      html: '<cronk-selector></cronk-selector>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkSelectorElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new CronkSelector()).toBeTruthy();
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
