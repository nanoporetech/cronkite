// tslint:disable: object-literal-sort-keys
import { SpecPage, newSpecPage } from '@stencil/core/dist/testing';
// import { CronkJSONTypes } from '../../types/report-json';
import { CronkPage } from './cronk-page';

describe('cronk-page', () => {
  let rootInst: CronkPage;
  let rootEl: HTMLCronkPageElement;
  let page: SpecPage;
  const originalConsoleError = console.error;

  beforeEach(async () => {
    console.error = jest.fn();
    page = await newSpecPage({
      components: [CronkPage],
      html: '<cronk-page></cronk-page>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkPageElement;
  });

  afterEach(async () => {
    console.error.mockClear();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new CronkPage()).toBeTruthy();
    });

    it('has no Page config to start', () => {
      expect(new CronkPage().pageConfig).toBeFalsy();
      expect(rootEl).toEqualHtml('<cronk-page class="empty-page-config"></cronk-page>');
    });
  });

  describe('class methods', () => {
    it('isValidConfig() & stringifyAjvError()', () => {
      const cronkPage = new CronkPage();
      expect(cronkPage.stringifyAjvError()).toBeUndefined();

      expect(cronkPage.isValidConfig({})).toEqual(false);
      expect(cronkPage.stringifyAjvError()).toContain(`should have required property 'id'`);

      expect(
        cronkPage.isValidConfig({
          id: 'test:page',
        }),
      ).toEqual(false);
      expect(cronkPage.stringifyAjvError()).toContain(`should have required property 'components'`);

      expect(
        cronkPage.isValidConfig({
          id: 'test:page',
          components: [],
        }),
      ).toEqual(false);
      expect(cronkPage.stringifyAjvError()).toContain(`should have required property 'streams'`);

      expect(
        cronkPage.isValidConfig({
          id: 'test:page',
          components: [],
          streams: [],
        }),
      ).toEqual(true);
      expect(cronkPage.stringifyAjvError()).toEqualText('null');
    });
  });

  describe('public methods', () => {
    it('validateConfig() & stringifyAjvError()', async () => {
      const cronkPage = new CronkPage();
      expect(cronkPage.stringifyAjvError()).toBeUndefined();

      expect(await cronkPage.validateConfig({})).toEqual(false);
      expect(console.error.mock.calls).toHaveLength(1);
      expect(console.error.mock.calls[0][0]).toContain(`should have required property 'id'`);
      expect(cronkPage.stringifyAjvError()).toContain(`should have required property 'id'`);

      expect(
        await cronkPage.validateConfig({
          id: 'test:page',
        }),
      ).toEqual(false);
      expect(console.error.mock.calls).toHaveLength(2);
      expect(console.error.mock.calls[1][0]).toContain(`should have required property 'components'`);
      expect(cronkPage.stringifyAjvError()).toContain(`should have required property 'components'`);

      expect(
        await cronkPage.validateConfig({
          id: 'test:page',
          components: [],
        }),
      ).toEqual(false);
      expect(console.error.mock.calls).toHaveLength(3);
      expect(console.error.mock.calls[2][0]).toContain(`should have required property 'streams'`);
      expect(cronkPage.stringifyAjvError()).toContain(`should have required property 'streams'`);

      expect(
        await cronkPage.validateConfig({
          id: 'test:page',
          components: [],
          streams: [],
        }),
      ).toEqual(true);
      expect(console.error.mock.calls).toHaveLength(3);
      expect(cronkPage.stringifyAjvError()).toEqualText('null');
    });
  });

  describe('rendering', () => {
    it('renders no pageConfig correctly', async () => {
      await page.waitForChanges();
      expect(rootEl).toHaveClass('empty-page-config');
    });

    it('renders various pageConfig correctly', async () => {
      await page.waitForChanges();
      expect(rootEl).toHaveClass('empty-page-config');
      expect(rootEl).not.toHaveClass('valid-page-config');

      rootEl.pageConfig = {};
      await page.waitForChanges();
      expect(rootEl).not.toHaveAttribute('id');
      expect(rootEl).not.toHaveClass('empty-page-config');
      expect(rootEl).not.toHaveClass('valid-page-config');
      expect(rootEl.innerText).toContain(`should have required property 'id'`);

      rootEl.pageConfig = {
        id: 'test:page',
      };
      await page.waitForChanges();

      expect(rootEl).not.toHaveAttribute('id');
      expect(rootEl).not.toHaveClass('empty-page-config');
      expect(rootEl).not.toHaveClass('valid-page-config');

      rootEl.pageConfig = {
        id: 'test:page',
        components: [],
        streams: [],
      };
      await page.waitForChanges();
      expect(rootEl).toHaveAttribute('id');
      expect(rootEl).toEqualAttribute('id', 'test:page');
      expect(rootEl).not.toHaveClass('empty-page-config');
      expect(rootEl).toHaveClass('valid-page-config');
    });
  });
});
