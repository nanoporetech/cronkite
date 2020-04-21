import { newSpecPage } from '@stencil/core/testing';
import { CronkProportionBar } from './cronk-proportion-bar';

describe('cronk-proportion-bar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CronkProportionBar],
      html: `<cronk-proportion-bar></cronk-proportion-bar>`,
    });
    expect(page.root).toEqualHtml(`
    <cronk-proportion-bar class="proportion-bar" value="0">
      <div class="ion-color-primary" style="display: block; height: 100%; width: 0%;"></div>
    </cronk-proportion-bar>
    `);
  });
});
