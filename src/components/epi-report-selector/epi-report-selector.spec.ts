import { SpecPage, newSpecPage } from '@stencil/core/dist/testing';
import { EpiReportSelector } from './epi-report-selector';

describe('epi-report-selector', () => {
  let rootInst: EpiReportSelector;
  let rootEl: HTMLEpiReportSelectorElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [EpiReportSelector],
      html: '<epi-report-selector></epi-report-selector>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLEpiReportSelectorElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new EpiReportSelector()).toBeTruthy();
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
