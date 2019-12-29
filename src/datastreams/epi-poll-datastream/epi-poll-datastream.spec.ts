import { newSpecPage } from '@stencil/core/testing';
import { EpiPollDatastream } from './epi-poll-datastream';

it('should render my component', async () => {
  const page = await newSpecPage({
    components: [EpiPollDatastream],
    html: `<epi-poll-datastream></epi-poll-datastream>`,
  });
  expect(page.root).toEqualHtml(`
    <epi-poll-datastream aria-hidden="true" class="epi-data-eventstream epi-filtered-datastream"></epi-poll-datastream>
  `);
});
