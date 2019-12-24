import { newE2EPage } from '@stencil/core/testing';

describe('app-root', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<app-root></app-root>');
    await page.waitForChanges();

    const element = await page.find('app-root');
    expect(element).toHaveClass('hydrated');
  });
});
