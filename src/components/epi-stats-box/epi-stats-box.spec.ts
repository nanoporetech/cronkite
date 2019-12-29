import { SpecPage, newSpecPage } from '@stencil/core/dist/testing';
import { EpiStatsBox } from './epi-stats-box';

describe('epi-stats-box', () => {
  let rootInst: EpiStatsBox;
  let rootEl: HTMLEpiStatsBoxElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [EpiStatsBox],
      html: '<epi-stats-box></epi-stats-box>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLEpiStatsBoxElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new EpiStatsBox()).toBeTruthy();
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
