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

    it('renders with selectList', async () => {
      rootEl.selectList = [
        {
          count: 80,
          label: 'EIGHTY',
          select: 'thing_to_select',
        },
        {
          count: 20,
          label: 'TWENTY',
          select: 'thing_to_select',
        }
      ];
      await page.waitForChanges();
      expect(rootEl).toEqualHtml(`
      <cronk-selector class="thing-selector undefined-selector">
        <table class="fixed">
          <thead>
            <tr>
              <th>
                <ion-item class="select-all-things select-all-undefined" lines="none">
                  <span class="select-label"></span>
                </ion-item>
              </th>
              <th></th>
              <th>
                COUNT
              </th>
              <th>
                %
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <ion-item lines="none">
                  <ion-label>
                    EIGHTY
                  </ion-label>
                </ion-item>
              </td>
              <td>
                <ion-progress-bar value="1"></ion-progress-bar>
              </td>
              <td>
                80
              </td>
              <td>
                (100.0%)
              </td>
            </tr>
          </tbody>
        </table>
      </cronk-selector>`);
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
