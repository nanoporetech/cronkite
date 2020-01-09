import { SpecPage, newSpecPage } from '@stencil/core/dist/testing';
import { EpiFunnel } from './epi-funnel';

describe('epi-funnel', () => {
  // let rootInst: EpiFunnel;
  let rootEl: HTMLEpiFunnelElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [EpiFunnel],
      html: '<epi-funnel></epi-funnel>',
    });
    // rootInst = page.rootInstance;
    rootEl = page.root as HTMLEpiFunnelElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new EpiFunnel()).toBeTruthy();
    });
  });

  describe('rendering', () => {
    it('renders nothing to start', async () => {
      expect(rootEl).toEqualLightHtml('<epi-funnel></epi-funnel>');
    });

    it('throws when given rubbish', async () => {
      try {
        rootEl.statsList = ['not the correct data'];
        await page.waitForChanges();
      } catch (error) {
        expect(error.message).toBe('Error: @Prop() statsList - property does not contain valid members');
      }
      expect(rootEl).toEqualLightHtml('<epi-funnel></epi-funnel>');
    });

    it('renders one thing correctly', async () => {
      rootEl.statsList = [{ label: 'foo', count: 20 }];
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`<epi-funnel class="summary-funnel">
        <table class="fixed">
          <tbody>
            <tr align-items-center="true">
              <td><ion-progress-bar color="secondary" value="1"></ion-progress-bar></td>
              <td class="counts">20</td>
              <td class="percent">(100.00%)</td>
              <td class="label">foo</td>
            </tr>
          </tbody>
        </table>
      </epi-funnel>`);
    });

    it('renders and sorts many things correctly', async () => {
      rootEl.statsList = [
        { label: 'Sleepy', count: 2 },
        { label: 'Dopey', count: 20 },
        { label: 'Doc', count: 203 },
      ];
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`<epi-funnel class="summary-funnel">
      <table class="fixed">
        <tbody>
          <tr align-items-center="true">
            <td><ion-progress-bar color="secondary" value="0.9022222222222223"></ion-progress-bar></td>
            <td class="counts">203</td>
            <td class="percent">(90.22%)</td>
            <td class="label">Doc</td>
          </tr>
          <tr align-items-center="true">
            <td><ion-progress-bar color="secondary" value="0.08888888888888889"></ion-progress-bar></td>
            <td class="counts">20</td>
            <td class="percent">(8.89%)</td>
            <td class="label">Dopey</td>
          </tr>
          <tr align-items-center="true">
            <td><ion-progress-bar color="secondary" value="0.008888888888888889"></ion-progress-bar></td>
            <td class="counts">2</td>
            <td class="percent">(0.89%)</td>
            <td class="label">Sleepy</td>
          </tr>
        </tbody>
      </table>
    </epi-funnel>`);
    });
  });
});
