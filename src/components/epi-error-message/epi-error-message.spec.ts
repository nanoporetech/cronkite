import { SpecPage, newSpecPage } from '@stencil/core/dist/testing';
import { EpiErrorMessage } from './epi-error-message';

describe('epi-error-message', () => {
  let rootInst: EpiErrorMessage;
  let rootEl: HTMLEpiErrorMessageElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [EpiErrorMessage],
      html: '<epi-error-message></epi-error-message>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLEpiErrorMessageElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new EpiErrorMessage()).toBeTruthy();
    });
  });

  // describe('rendering', () => {
  //   it('renders correctly', async () => {
  //     await page.waitForChanges();
  //   });
  // });
});
