import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { CronkEventStream } from '../event-stream';

describe('cronk-event-stream', () => {
  let rootInst: CronkEventStream;
  let rootEl: HTMLCronkEventStreamElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkEventStream],
      html: '<cronk-event-stream></cronk-event-stream>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkEventStreamElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(rootInst).toBeTruthy();
    });
  });

  describe('rendering', () => {
    it(`Won't render if config containing an 'element' key is provided`, async () => {
      expect(rootEl).toEqualLightHtml('<cronk-event-stream></cronk-event-stream>');
      expect(rootInst.customElProps).toBeUndefined();
      rootEl.config = {};
      await rootInst.componentWillLoad();
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml('<cronk-event-stream></cronk-event-stream>');
    });

    it('renders with correct config', async () => {
      expect(rootEl).toEqualLightHtml('<cronk-event-stream></cronk-event-stream>');
      expect(rootInst.customElProps).toBeUndefined();
      const datastreamTagName = 'my-test-datastream';
      rootEl.config = { element: datastreamTagName, '@foo': 'bar', other: 'baz' };
      await rootInst.componentWillLoad();
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`<cronk-event-stream aria-hidden="true">
        <${datastreamTagName} class="cronk-datastream" foo="bar"></${datastreamTagName}>
      </cronk-event-stream>`);
    });
  });
});
