import { SpecPage, newSpecPage } from '@stencil/core/dist/testing';
import { EpiFunnel } from './epi-funnel';

describe('epi-funnel', () => {
  let rootInst: EpiFunnel;
  let rootEl: HTMLEpiFunnelElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [EpiFunnel],
      html: '<epi-funnel></epi-funnel>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLEpiFunnelElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new EpiFunnel()).toBeTruthy();
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
