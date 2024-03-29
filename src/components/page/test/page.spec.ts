// tslint:disable: object-literal-sort-keys
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { ReportDefinition } from '../../../types/reportconfig.type';
import { CronkPage } from '../page';

describe('cronk-page', () => {
  let rootInst: CronkPage;
  let rootEl: HTMLCronkPageElement;
  let page: SpecPage;
  const originalConsoleError = console.error as jest.Mock;

  beforeEach(async () => {
    (console.error as jest.Mock) = jest.fn();
    page = await newSpecPage({
      components: [CronkPage],
      html: '<cronk-page></cronk-page>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkPageElement;
  });

  afterEach(async () => {
    (console.error as jest.Mock as jest.Mock).mockClear();
  });

  afterAll(() => {
    (console.error as jest.Mock) = originalConsoleError;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(rootInst).toBeTruthy();
    });

    it('has no Page config to start', async () => {
      page = await newSpecPage({
        components: [CronkPage],
        html: '<cronk-page></cronk-page>',
      });
      expect(page.rootInstance.pageConfig).toBeFalsy();
      expect(page.root).toEqualHtml('<cronk-page></cronk-page>');
    });
  });

  describe('public methods', () => {
    it('validateConfig()', async () => {
      page = await newSpecPage({
        components: [CronkPage],
        html: '<cronk-page></cronk-page>',
      });
      const cronkPage = page.rootInstance;

      expect(await cronkPage.validateConfig({})).toEqual(false);
      expect((console.error as jest.Mock).mock.calls).toHaveLength(1);
      expect((console.error as jest.Mock).mock.calls[0][0]).toContain(`must have required property 'id'`);

      expect(
        await cronkPage.validateConfig({
          id: 'test:page',
        }),
      ).toEqual(false);
      expect((console.error as jest.Mock).mock.calls).toHaveLength(2);
      expect((console.error as jest.Mock).mock.calls[1][0]).toContain(`must have required property 'components'`);

      expect(
        await cronkPage.validateConfig({
          id: 'test:page',
          components: [],
        }),
      ).toEqual(false);
      expect((console.error as jest.Mock).mock.calls).toHaveLength(3);
      expect((console.error as jest.Mock).mock.calls[2][0]).toContain(`must have required property 'streams'`);

      expect(
        await cronkPage.validateConfig({
          id: 'test:page',
          components: [],
          streams: [],
        }),
      ).toEqual(true);
      expect((console.error as jest.Mock).mock.calls).toHaveLength(3);
    });
  });

  describe('rendering', () => {
    it('renders no pageConfig correctly', async () => {
      await page.waitForChanges();
      expect(rootEl).toMatchSnapshot();
    });

    it('renders various pageConfig correctly', async () => {
      await page.waitForChanges();
      expect(rootEl).toMatchSnapshot();

      rootEl.pageConfig = {} as ReportDefinition;
      await page.waitForChanges();
      expect(rootEl).toMatchSnapshot();
      expect(rootEl.innerText).toContain(`must have required property 'id'`);

      rootEl.pageConfig = {
        id: 'test:page',
      } as ReportDefinition;
      await page.waitForChanges();
      expect(rootEl).toMatchSnapshot();

      rootEl.pageConfig = {
        id: 'test:page',
        components: [],
        streams: [],
      };
      await page.waitForChanges();
      expect(rootEl).toMatchSnapshot();
    });
  });
});
