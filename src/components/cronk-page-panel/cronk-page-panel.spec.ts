import { SpecPage, newSpecPage } from '@stencil/core/dist/testing';
import { CronkPagePanel } from './cronk-page-panel';

describe('cronk-page-panel', () => {
  let rootInst: CronkPagePanel;
  let rootEl: HTMLCronkPagePanelElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkPagePanel],
      html: '<cronk-page-panel></cronk-page-panel>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkPagePanelElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new CronkPagePanel()).toBeTruthy();
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
