import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { Stream } from '../../../types/reportconfig.type';
import { CronkDatastreams } from '../datastreams';

describe('cronk-datastreams', () => {
  let rootInst: CronkDatastreams;
  let rootEl: HTMLCronkDatastreamsElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkDatastreams],
      html: '<cronk-datastreams></cronk-datastreams>',
    });
    rootEl = page.root as HTMLCronkDatastreamsElement;
    rootInst = page.rootInstance as CronkDatastreams;
    await page.waitForChanges();
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(rootInst).toBeTruthy();
    });
  });

  describe('rendering', () => {
    it('renders correctly', async () => {
      expect(rootEl).toEqualLightHtml(`<cronk-datastreams></cronk-datastreams>`);
    });
  });

  describe('public methods', () => {
    it('returns current state', async () => {
      expect(rootInst.pageComponentsReady).toBeFalsy()
      expect(rootInst.streams).toBeFalsy()
      rootEl.streams = [{ foo: 'bar' } as unknown as Stream];
      await page.waitForChanges();
      expect(rootEl).toEqualHtml(` <cronk-datastreams>
        <cronk-event-stream></cronk-event-stream>
      </cronk-datastreams>`);
      expect(rootInst.pageComponentsReady).toBeFalsy()
      expect(rootInst.streams).toEqual([{ foo: 'bar' }])
    });

    it('creates event stream elements', async () => {
      rootEl.streams = [
        {
          '@channels': [],
          '@url': 'http://example.com',
          element: 'foo-bar',
        },
      ];
      await page.waitForChanges();
      expect(rootEl).toEqualHtml(` <cronk-datastreams>
        <cronk-event-stream></cronk-event-stream>
      </cronk-datastreams>`);
    });

    it('rebroadcasts on streams that are configured to', async () => {
      rootEl.streamsID = 'foo:bar';
      rootEl.streams = [
        {
          '@channels': [],
          '@url': 'http://example.com',
          element: 'foo-bar',
        },
      ];
      await page.waitForChanges();

      const mockBroadcaster = jest.fn().mockImplementation(() => {
        return Promise.resolve('reload called');
      });

      const mockStream = page.doc.createElement('mock-stream');
      mockStream.setAttribute('class', 'cronk-datastream');
      (mockStream as HTMLCronkManagedDatastreamElement).resendBroadcast = mockBroadcaster;

      page.body.appendChild(mockStream);

      await page.waitForChanges();
      rootEl.reload();
      await page.waitForChanges();

      expect(mockBroadcaster).toHaveBeenCalled();

    });
  });
});
