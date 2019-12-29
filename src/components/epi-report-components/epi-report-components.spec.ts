import { SpecPage, newSpecPage } from '@stencil/core/dist/testing';
import { EpiReportComponents } from './epi-report-components';

describe('epi-report-components', () => {
  let rootInst: EpiReportComponents;
  let rootEl: HTMLEpiReportComponentsElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [EpiReportComponents],
      html: '<epi-report-components></epi-report-components>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLEpiReportComponentsElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new EpiReportComponents()).toBeTruthy();
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
