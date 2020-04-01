import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { CronkPollDatastream } from './cronk-poll-datastream';

describe('cronk-poll-datastream', () => {
  // let rootInst: CronkPollDatastream;
  let rootEl: HTMLCronkPollDatastreamElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkPollDatastream],
      html: '<cronk-poll-datastream></cronk-poll-datastream>',
    });
    // rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkPollDatastreamElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new CronkPollDatastream()).toBeTruthy();
    });
  });

  describe('rendering', () => {
    it('renders correctly', async () => {
      expect(rootEl).toEqualLightHtml(
        `<cronk-poll-datastream aria-hidden="true" class="cronk-data-eventstream"></cronk-poll-datastream>`,
      );
    });
  });
});
