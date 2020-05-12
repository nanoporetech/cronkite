import { newE2EPage } from '@stencil/core/testing';

describe('cronk-simple-grid', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<cronk-simple-grid></cronk-simple-grid>');
    const element = await page.find('cronk-simple-grid');
    expect(element).toHaveClass('hydrated');
  });{cursor}
});
