import { SpecPage, newSpecPage } from '@stencil/core/dist/testing';
import { EpiReportTitle } from './epi-report-title';

describe('epi-report-title', () => {
  let rootInst: EpiReportTitle;
  let rootEl: HTMLEpiReportTitleElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [EpiReportTitle],
      html: '<epi-report-title></epi-report-title>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLEpiReportTitleElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new EpiReportTitle()).toBeTruthy();
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
