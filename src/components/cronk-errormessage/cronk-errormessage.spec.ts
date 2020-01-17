import { newSpecPage, SpecPage } from '@stencil/core/dist/testing';
import { CronkErrormessage } from './cronk-errormessage';

describe('cronk-errormessage', () => {
  // let rootInst: CronkErrormessage;
  let rootEl: HTMLCronkErrormessageElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkErrormessage],
      html: '<cronk-errormessage></cronk-errormessage>',
    });
    // rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkErrormessageElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new CronkErrormessage()).toBeTruthy();
    });
  });

  describe('rendering', () => {
    it('renders correctly', async () => {
      expect(rootEl).toEqualLightHtml(`<cronk-errormessage>
        Yikes! An error occurred
      </cronk-errormessage>`);
      rootEl.message = 'Nobody said it was easy';
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`<cronk-errormessage>
      Nobody said it was easy
    </cronk-errormessage>`);
    });
  });
});
