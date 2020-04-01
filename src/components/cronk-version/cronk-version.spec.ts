import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { CronkVersion } from './cronk-version';

describe('cronk-version', () => {
  let rootInst: CronkVersion;
  let rootEl: HTMLCronkVersionElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkVersion],
      html: '<cronk-version></cronk-version>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkVersionElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new CronkVersion()).toBeTruthy();
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
