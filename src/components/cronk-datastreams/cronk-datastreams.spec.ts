import { newSpecPage, SpecPage } from '@stencil/core/dist/testing';
import { CronkDatastreams } from './cronk-datastreams';

describe('cronk-datastreams', () => {
  let rootInst: CronkDatastreams;
  let rootEl: HTMLCronkDatastreamsElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkDatastreams],
      html: '<cronk-datastreams></cronk-datastreams>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkDatastreamsElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new CronkDatastreams()).toBeTruthy();
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
