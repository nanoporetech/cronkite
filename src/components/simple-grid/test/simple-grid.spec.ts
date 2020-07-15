import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { CronkSimpleGrid } from '../simple-grid';

describe('cronk-simple-grid', () => {
  let rootInst: CronkSimpleGrid;
  let rootEl: HTMLCronkSimpleGridElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkSimpleGrid],
      html: '<cronk-simple-grid></cronk-simple-grid>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkSimpleGridElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(rootInst).toBeTruthy();
    });
  });

  describe('rendering', () => {
    it('renders nothing to start', async () => {
      expect(rootEl).toEqualLightHtml(`<cronk-simple-grid>
      <ion-content style="height: calc(3.04rem + (10 * 3.04rem));">
        <table>
          <thead>
            <tr></tr>
          </thead>
          <tbody></tbody>
        </table>
        <ion-infinite-scroll id="infinite-scroll" threshold="100px">
          <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data..."></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-content>
    </cronk-simple-grid>`);
    });

    it('renders anything in a list (WITHOUT headers)', async () => {
      rootEl.data = [
        ['not the correct data', true, 1234, null],
        [{ foo: 'bar' }, ['speedy', 'roadrunner'], '<a href="#">LINKED</a>'],
      ];
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`<cronk-simple-grid>
      <ion-content style=\"height: calc(3.04rem + (10 * 3.04rem));\">
        <table>
          <thead>
            <tr></tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span>
                  undefined
                </span>
                <div>
                  not the correct data
                </div>
              </td>
              <td>
                <span>
                  undefined
                </span>
                <div></div>
              </td>
              <td>
                <span>
                  undefined
                </span>
                <div></div>
              </td>
              <td>
                <span>
                  undefined
                </span>
                <div></div>
              </td>
            </tr>
            <tr>
              <td>
                <span>
                  undefined
                </span>
                <div></div>
              </td>
              <td>
                <span>
                  undefined
                </span>
                <div></div>
              </td>
              <td>
                <span>
                  undefined
                </span>
                <div>
                  <a href=\"#\">
                    LINKED
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <ion-infinite-scroll id=\"infinite-scroll\" threshold=\"100px\">
          <ion-infinite-scroll-content loading-spinner=\"bubbles\" loading-text=\"Loading more data...\"></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-content>
    </cronk-simple-grid>`);
    });

    it('renders anything in a list (WITH headers)', async () => {
      rootEl.headers = ['One', 'Two', 'Three'];
      rootEl.data = [['not the correct data', true, 1234, null]];
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`<cronk-simple-grid>
      <ion-content style=\"height: calc(3.04rem + (10 * 3.04rem));\">
        <table>
          <thead>
            <tr>
              <th class=\"cronk-grid-header-colour dark\">
                One
              </th>
              <th class=\"cronk-grid-header-colour dark\">
                Two
              </th>
              <th class=\"cronk-grid-header-colour dark\">
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
                <span>
                  undefined
                </span>
                <div></div>
              </td>
            </tr>
          </tbody>
        </table>
        <ion-infinite-scroll id=\"infinite-scroll\" threshold=\"100px\">
          <ion-infinite-scroll-content loading-spinner=\"bubbles\" loading-text=\"Loading more data...\"></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-content>
    </cronk-simple-grid>`);
    });
    it('renders grid style', async () => {
      rootEl.data = [['not the correct data']];
      rootEl.display = 'grid';
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`<cronk-simple-grid>
      <ion-content style=\"height: calc(3.04rem + (10 * 3.04rem));\">
        <table>
          <thead>
            <tr class=\"grid\"></tr>
          </thead>
          <tbody>
            <tr class=\"grid\">
              <td>
                <span>
                  undefined
                </span>
                <div>
                  not the correct data
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <ion-infinite-scroll id=\"infinite-scroll\" threshold=\"100px\">
          <ion-infinite-scroll-content loading-spinner=\"bubbles\" loading-text=\"Loading more data...\"></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-content>
    </cronk-simple-grid>`);
    });

    it('renders grid style', async () => {
      rootEl.headers = ['LENGTH', 'NAME'];
      rootEl.data = [
        ['0', 1234],
        ['2', 234],
        ['4', 1234],
        ['6', 15123],
        ['8', 1235],
        ['10', 13216],
        ['12', 1344],
      ];
      rootEl.rows = 3;
      rootEl.headerColour = 'primary';
      rootEl.sort = [
        [1, 'asc'],
        [0, 'desc'],
      ];
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`<cronk-simple-grid>
      <ion-content style=\"height: calc(3.04rem + (3 * 3.04rem));\">
        <table>
          <thead>
            <tr>
              <th class=\"cronk-grid-header-colour primary sort-desc\">
                LENGTH
              </th>
              <th class=\"cronk-grid-header-colour primary sort-asc\">
                NAME
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span>
                  LENGTH
                </span>
                <div>
                  12
                </div>
              </td>
              <td>
                <span>
                  NAME
                </span>
                <div></div>
              </td>
            </tr>
            <tr>
              <td>
                <span>
                  LENGTH
                </span>
                <div>
                  10
                </div>
              </td>
              <td>
                <span>
                  NAME
                </span>
                <div></div>
              </td>
            </tr>
            <tr>
              <td>
                <span>
                  LENGTH
                </span>
                <div>
                  8
                </div>
              </td>
              <td>
                <span>
                  NAME
                </span>
                <div></div>
              </td>
            </tr>
            <tr>
              <td>
                <span>
                  LENGTH
                </span>
                <div>
                  6
                </div>
              </td>
              <td>
                <span>
                  NAME
                </span>
                <div></div>
              </td>
            </tr>
            <tr>
              <td>
                <span>
                  LENGTH
                </span>
                <div>
                  4
                </div>
              </td>
              <td>
                <span>
                  NAME
                </span>
                <div></div>
              </td>
            </tr>
            <tr>
              <td>
                <span>
                  LENGTH
                </span>
                <div>
                  2
                </div>
              </td>
              <td>
                <span>
                  NAME
                </span>
                <div></div>
              </td>
            </tr>
            <tr>
              <td>
                <span>
                  LENGTH
                </span>
                <div>
                  0
                </div>
              </td>
              <td>
                <span>
                  NAME
                </span>
                <div></div>
              </td>
            </tr>
          </tbody>
        </table>
        <ion-infinite-scroll id=\"infinite-scroll\" threshold=\"100px\">
          <ion-infinite-scroll-content loading-spinner=\"bubbles\" loading-text=\"Loading more data...\"></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-content>
    </cronk-simple-grid>`);
    });
  });
});
