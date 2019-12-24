import { SpecPage, newSpecPage } from '@stencil/core/dist/testing';
import { EpiEventStream } from './epi-event-stream';

describe('epi-event-stream', () => {
  let rootInst: EpiEventStream;
  let rootEl: HTMLEpiEventStreamElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [EpiEventStream],
      html: '<epi-event-stream></epi-event-stream>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLEpiEventStreamElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new EpiEventStream()).toBeTruthy();
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
