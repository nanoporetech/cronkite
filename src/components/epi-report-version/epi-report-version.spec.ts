import { SpecPage, newSpecPage } from '@stencil/core/dist/testing';
import { EpiReportVersion } from './epi-report-version';

describe('epi-report-version', () => {
  let rootInst: EpiReportVersion;
  let rootEl: HTMLEpiReportVersionElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [EpiReportVersion],
      html: '<epi-report-version></epi-report-version>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLEpiReportVersionElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new EpiReportVersion()).toBeTruthy();
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
