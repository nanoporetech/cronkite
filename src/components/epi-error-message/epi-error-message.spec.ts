import { SpecPage, newSpecPage } from '@stencil/core/dist/testing';
import { EpiErrorMessage } from './epi-error-message';

describe('epi-error-message', () => {
  // let rootInst: EpiErrorMessage;
  let rootEl: HTMLEpiErrorMessageElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [EpiErrorMessage],
      html: '<epi-error-message></epi-error-message>',
    });
    // rootInst = page.rootInstance;
    rootEl = page.root as HTMLEpiErrorMessageElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new EpiErrorMessage()).toBeTruthy();
    });
  });

  describe('rendering', () => {
    it('renders correctly', async () => {
      expect(rootEl).toEqualLightHtml(`<epi-error-message>
        Yikes! An error occurred
      </epi-error-message>`);
      rootEl.message = 'Nobody said it was easy';
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`<epi-error-message>
      Nobody said it was easy
    </epi-error-message>`);
    });
  });
});
