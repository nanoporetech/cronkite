import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { CronkApp } from './cronk-app';

describe('cronk-app', () => {
  let rootInst: CronkApp;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkApp],
      html: '<cronk-app></cronk-app>',
    });
    rootInst = page.rootInstance;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(rootInst).toBeTruthy();
    });
  });

  describe('rendering', () => {
    const fetchMock = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: jest.fn().mockImplementation(() => Promise.resolve({})),
        ok: true,
      });
    });

    Object.defineProperty(global, 'fetch', {
      value: fetchMock,
      writable: true,
    });

    it('changes according to report selection', async () => {
      expect(fetchMock).toHaveBeenLastCalledWith('/cronkite/examples/reports/hello-world.json');

      rootInst.report = 'pychopper';
      await page.waitForChanges();
      expect(fetchMock).toHaveBeenLastCalledWith('/cronkite/examples/reports/pychopper.json');
    });
  });
});
