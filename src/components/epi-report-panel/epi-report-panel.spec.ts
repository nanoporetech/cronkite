import { SpecPage, newSpecPage } from '@stencil/core/dist/testing';
import { EpiReportPanel } from './epi-report-panel';

describe('epi-report-panel', () => {
  let rootInst: EpiReportPanel;
  let rootEl: HTMLEpiReportPanelElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [EpiReportPanel],
      html: '<epi-report-panel></epi-report-panel>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLEpiReportPanelElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new EpiReportPanel()).toBeTruthy();
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
