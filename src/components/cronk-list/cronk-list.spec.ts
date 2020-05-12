import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { CronkList } from './cronk-list';

describe('cronk-list', () => {
  // let rootInst: CronkList;
  let rootEl: HTMLCronkListElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkList],
      html: '<cronk-list></cronk-list>',
    });
    // rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkListElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new CronkList()).toBeTruthy();
    });
  });

  describe('rendering', () => {
    it('renders nothing to start', async () => {
      expect(rootEl).toEqualLightHtml('<cronk-list></cronk-list>');
    });

    it('renders anything in a list', async () => {
      rootEl.items = [
        'not the correct data',
        true,
        1234,
        null,
        { foo: 'bar' },
        ['speedy', 'roadrunner'],
        '<a href="#">LINKED</a>',
      ];
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`<cronk-list>
      <ul class="unordered">
        <li>
          not the correct data
        </li>
        <li>
          true
        </li>
        <li>
          1234
        </li>
        <li>
          null
        </li>
        <li>
          [object Object]
        </li>
        <li>
          speedy,roadrunner
        </li>
        <li>
          <a href="#">
            LINKED
          </a>
        </li>
      </ul>
    </cronk-list>`);
    });
    it('renders ORDERED list', async () => {
      rootEl.items = ['not the correct data'];
      rootEl.ordered = true;
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`<cronk-list>
      <ol class="ordered">
        <li>
          not the correct data
        </li>
      </ol>
    </cronk-list>`);
    });
  });
});
