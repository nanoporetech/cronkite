import { SpecPage, newSpecPage } from '@stencil/core/dist/testing';
import { EpiPollDatastream } from './epi-poll-datastream';

describe('epi-poll-datastream', () => {
  // let rootInst: EpiPollDatastream;
  let rootEl: HTMLEpiPollDatastreamElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [EpiPollDatastream],
      html: '<epi-poll-datastream></epi-poll-datastream>',
    });
    // rootInst = page.rootInstance;
    rootEl = page.root as HTMLEpiPollDatastreamElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new EpiPollDatastream()).toBeTruthy();
    });
  });

  describe('rendering', () => {
    it('renders correctly', async () => {
      expect(rootEl).toEqualLightHtml(
        `<epi-poll-datastream aria-hidden="true" class="epi-data-eventstream"></epi-poll-datastream>`,
      );
      // rootEl.message = 'Nobody said it was easy';
      // await page.waitForChanges();
    });
  });
});
