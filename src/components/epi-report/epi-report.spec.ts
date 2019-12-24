import { SpecPage, newSpecPage } from '@stencil/core/dist/testing';
import { EpiReport } from './epi-report';

describe('epi-report', () => {
  let rootInst: EpiReport;
  let rootEl: HTMLEpiReportElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [EpiReport],
      html: '<epi-report></epi-report>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLEpiReportElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new EpiReport()).toBeTruthy();
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
