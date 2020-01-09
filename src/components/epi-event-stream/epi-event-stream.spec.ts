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

  describe('rendering', () => {
    it(`Won't render if config containing an 'element' key is provided`, async () => {
      expect(rootEl).toEqualLightHtml('<epi-event-stream></epi-event-stream>');
      expect(rootInst.customElProps).toBeUndefined();
      rootEl.config = {};
      await rootInst.componentWillLoad();
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml('<epi-event-stream></epi-event-stream>');
    });

    it('renders with correct config', async () => {
      expect(rootEl).toEqualLightHtml('<epi-event-stream></epi-event-stream>');
      expect(rootInst.customElProps).toBeUndefined();
      const datastreamTagName = 'my-test-datastream';
      rootEl.config = { element: datastreamTagName, '@foo': 'bar', other: 'baz' };
      await rootInst.componentWillLoad();
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`<epi-event-stream aria-hidden="true">
        <${datastreamTagName} foo="bar"></${datastreamTagName}>
      </epi-event-stream>`);
    });
  });
});
