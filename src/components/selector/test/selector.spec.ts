import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { CronkSelector } from '../selector';

describe('cronk-selector', () => {
  let rootInst: CronkSelector;
  let rootEl: HTMLCronkSelectorElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkSelector],
      html: '<cronk-selector></cronk-selector>',
    });
    rootEl = page.root as HTMLCronkSelectorElement;
    rootInst = page.rootInstance as CronkSelector;
    await page.waitForChanges();
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(rootInst).toBeTruthy();
    });
    it('renders correctly', () => {
      expect(rootEl).toEqualHtml('<cronk-selector></cronk-selector>');
    });
  });

  describe('rendering', () => {
    it('renders heading', async () => {
      rootEl.heading = 'Dummy heading';
      await page.waitForChanges();
      expect(rootEl).toEqualHtml('<cronk-selector></cronk-selector>');
    });

    it('renders with selectList checkbox', async () => {
      rootEl.selector = 'whichty';
      rootEl.selectList = [
        {
          count: 80,
          label: 'EIGHTY',
          select: 'select_eighty',
        },
        {
          count: 20,
          label: 'TWENTY',
          select: 'select_twenty',
        },
      ];
      await page.waitForChanges();
      expect(rootEl).toMatchSnapshot();
    });

    it('renders with selectList radio', async () => {
      rootEl.selector = 'watchy';
      rootEl.multiselect = false;
      rootEl.selectList = [
        {
          count: 80,
          label: 'EIGHTY',
          select: 'select_eighty',
        },
        {
          count: 20,
          label: 'TWENTY',
          select: 'select_twenty',
        },
      ];
      await page.waitForChanges();
      expect(rootEl).toMatchSnapshot();
    });

    it('renders with selector', async () => {
      rootEl.heading = 'Dummy heading';
      await page.waitForChanges();
      expect(rootEl).toEqualHtml('<cronk-selector></cronk-selector>');
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
