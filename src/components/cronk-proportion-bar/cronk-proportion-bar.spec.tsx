import { newSpecPage } from '@stencil/core/testing';
import { CronkProportionBar } from './cronk-proportion-bar';

describe('cronk-proportion-bar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CronkProportionBar],
      html: `<cronk-proportion-bar></cronk-proportion-bar>`,
    });
    expect(page.root).toEqualHtml(`
      <cronk-proportion-bar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </cronk-proportion-bar>
    `);
  });
});
