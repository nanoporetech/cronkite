import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { CronkFunnel } from './cronk-funnel';

describe('cronk-funnel', () => {
  // let rootInst: CronkFunnel;
  let rootEl: HTMLCronkFunnelElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkFunnel],
      html: '<cronk-funnel></cronk-funnel>',
    });
    // rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkFunnelElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new CronkFunnel()).toBeTruthy();
    });
  });

  describe('rendering', () => {
    it('renders nothing to start', async () => {
      expect(rootEl).toEqualLightHtml('<cronk-funnel></cronk-funnel>');
    });

    it('throws when given rubbish', async () => {
      try {
        rootEl.statsList = ['not the correct data'];
        await page.waitForChanges();
      } catch (error) {
        expect(error.message).toBe('Error: @Prop() statsList - property does not contain valid members');
      }
      expect(rootEl).toEqualLightHtml('<cronk-funnel></cronk-funnel>');
    });

    it('renders one thing correctly', async () => {
      rootEl.statsList = [{ label: 'foo', count: 20 }];
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`
      <cronk-funnel class="summary-funnel">
        <div class="summary-funnel-row">
          <cronk-proportion-bar color="primary" value="1"></cronk-proportion-bar>
          <div class="proportion-label">
            <div class="stats">
              <span class="counts">
                20
              </span>
              <span class="percent">
                100.00%
              </span>
            </div>
            <span class="label">
              foo
            </span>
          </div>
        </div>
      </cronk-funnel>`);
    });

    it('hides fields depending on prop', async () => {
      rootEl.statsList = [{ label: 'foo', count: 20 }];
      await page.waitForChanges();
      const funnelRowEl = rootEl.querySelector('.summary-funnel-row');
      expect(funnelRowEl).toEqualLightHtml(`
        <div class="summary-funnel-row">
          <cronk-proportion-bar color="primary" value="1"></cronk-proportion-bar>
          <div class="proportion-label">
            <div class="stats">
              <span class="counts">
                20
              </span>
              <span class="percent">
                100.00%
              </span>
            </div>
            <span class="label">
              foo
            </span>
          </div>
        </div>`);
      rootEl.hideLabel = true;
      await page.waitForChanges();
      expect(funnelRowEl).toEqualLightHtml(`
        <div class="summary-funnel-row">
          <cronk-proportion-bar color="primary" value="1"></cronk-proportion-bar>
          <div class="proportion-label">
            <div class="stats">
              <span class="counts">
                20
              </span>
              <span class="percent">
                100.00%
              </span>
            </div>
          </div>
        </div>`);
      rootEl.hideLabel = false;
      rootEl.hideCount = true;
      await page.waitForChanges();
      expect(funnelRowEl).toEqualLightHtml(`
        <div class="summary-funnel-row">
          <cronk-proportion-bar color="primary" value="1"></cronk-proportion-bar>
          <div class="proportion-label">
            <div class="stats">
              <span class="percent">
                100.00%
              </span>
            </div>
            <span class="label">
              foo
            </span>
          </div>
        </div>`);
      rootEl.hideCount = false;
      rootEl.hidePercent = true;
      await page.waitForChanges();
      expect(funnelRowEl).toEqualLightHtml(`
        <div class="summary-funnel-row">
          <cronk-proportion-bar color="primary" value="1"></cronk-proportion-bar>
          <div class="proportion-label">
            <div class="stats">
              <span class="counts">
                20
              </span>
            </div>
            <span class="label">
              foo
            </span>
          </div>
        </div>`);
      rootEl.hidePercent = false;
      rootEl.hideStats = true;
      await page.waitForChanges();
      expect(funnelRowEl).toEqualLightHtml(`
        <div class="summary-funnel-row">
          <cronk-proportion-bar color="primary" value="1"></cronk-proportion-bar>
          <div class="proportion-label">
            <span class="label">
              foo
            </span>
          </div>
        </div>`);
      rootEl.hideLabel = true;
      await page.waitForChanges();
      expect(funnelRowEl).toEqualLightHtml(`
        <div class="summary-funnel-row">
          <cronk-proportion-bar color="primary" value="1"></cronk-proportion-bar>
        </div>`);
    });

    it('renders and sorts many things correctly', async () => {
      rootEl.statsList = [
        { label: 'Sleepy', count: 2 },
        { label: 'Dopey', count: 20 },
        { label: 'Doc', count: 203 },
      ];
      await page.waitForChanges();
      expect(rootEl).toEqualLightHtml(`
      <cronk-funnel class="summary-funnel">
        <div class="summary-funnel-row">
          <cronk-proportion-bar color="primary" value="0.9022222222222223"></cronk-proportion-bar>
          <div class="proportion-label">
            <div class="stats">
              <span class="counts">
                203
              </span>
              <span class="percent">
                90.22%
              </span>
            </div>
            <span class="label">
              Doc
            </span>
          </div>
        </div>
        <div class="summary-funnel-row">
          <cronk-proportion-bar color="primary" value="0.08888888888888889"></cronk-proportion-bar>
          <div class="proportion-label">
            <div class="stats">
              <span class="counts">
                20
              </span>
              <span class="percent">
                8.89%
              </span>
            </div>
            <span class="label">
              Dopey
            </span>
          </div>
        </div>
        <div class="summary-funnel-row">
          <cronk-proportion-bar color="primary" value="0.008888888888888889"></cronk-proportion-bar>
          <div class="proportion-label">
            <div class="stats">
              <span class="counts">
                2
              </span>
              <span class="percent">
                0.89%
              </span>
            </div>
            <span class="label">
              Sleepy
            </span>
          </div>
        </div>
      </cronk-funnel>`);
    });
  });
});
