import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { CronkSimpleGrid } from './cronk-simple-grid';

describe('cronk-simple-grid', () => {
  // let rootInst: CronkSimpleGrid;
  let rootEl: HTMLCronkSimpleGridElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkSimpleGrid],
      html: '<cronk-simple-grid></cronk-simple-grid>',
    });
    // rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkSimpleGridElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new CronkSimpleGrid()).toBeTruthy();
    });
  });

  describe('rendering', () => {
    it('renders nothing to start', async () => {
      expect(rootEl).toEqualLightHtml(`<cronk-simple-grid></cronk-simple-grid>`);
    });

    it('renders anything in a list (WITHOUT headers)', async () => {
      rootEl.data = [
        ['not the correct data', true, 1234, null],
        [{ foo: 'bar' }, ['speedy', 'roadrunner'], '<a href="#">LINKED</a>'],
      ];
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`<cronk-simple-grid>
      <table>
        <thead>
          <tr></tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span></span>
              <div>
                not the correct data
              </div>
            </td>
            <td>
              <span></span>
              <div></div>
            </td>
            <td>
              <span></span>
              <div></div>
            </td>
            <td>
              <span></span>
              <div></div>
            </td>
          </tr>
          <tr>
            <td>
              <span></span>
              <div></div>
            </td>
            <td>
              <span></span>
              <div></div>
            </td>
            <td>
              <span></span>
              <div>
                <a href=\"#\">
                  LINKED
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </cronk-simple-grid>`);
    });

    it('renders anything in a list (WITH headers)', async () => {
      rootEl.headers = ['One', 'Two', 'Three'];
      rootEl.data = [['not the correct data', true, 1234, null]];
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`<cronk-simple-grid>
      <table>
        <thead>
          <tr>
            <th>
              One
            </th>
            <th>
              Two
            </th>
            <th>
              Three
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span>
                One
              </span>
              <div>
                not the correct data
              </div>
            </td>
            <td>
              <span>
                Two
              </span>
              <div></div>
            </td>
            <td>
              <span>
                Three
              </span>
              <div></div>
            </td>
            <td>
              <span></span>
              <div></div>
            </td>
          </tr>
        </tbody>
      </table>
    </cronk-simple-grid>`);
    });
    it('renders grid style', async () => {
      rootEl.data = [['not the correct data']];
      rootEl.display = 'grid';
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`<cronk-simple-grid>
      <table>
        <thead>
          <tr class=\"grid\"></tr>
        </thead>
        <tbody>
          <tr class=\"grid\">
            <td>
              <span></span>
              <div>
                not the correct data
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </cronk-simple-grid>`);
    });
  });
});
