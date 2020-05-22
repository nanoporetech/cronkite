import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { CronkManagedDatastream } from './cronk-managed-datastream';

describe('cronk-managed-datastream', () => {
  // let rootInst: CronkManagedDatastream;
  let rootEl: HTMLCronkManagedDatastreamElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkManagedDatastream],
      html: '<cronk-managed-datastream></cronk-managed-datastream>',
    });
    // rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkManagedDatastreamElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new CronkManagedDatastream()).toBeTruthy();
    });
  });

  describe('rendering', () => {
    it('renders correctly', async () => {
      expect(rootEl).toEqualLightHtml(
        `<cronk-managed-datastream aria-hidden="true" class="cronk-data-eventstream"></cronk-managed-datastream>`,
      );
    });
  });
});
