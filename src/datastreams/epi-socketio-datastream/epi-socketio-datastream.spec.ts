import { newSpecPage } from '@stencil/core/testing';
import { EpiSocketioDatastream } from './epi-socketio-datastream';

it('should render my component', async () => {
  const page = await newSpecPage({
    components: [EpiSocketioDatastream],
    html: `<epi-socketio-datastream></epi-socketio-datastream>`,
  });
  expect(page.root).toEqualHtml(`
    <epi-socketio-datastream aria-hidden="true" class="epi-data-eventstream epi-filtered-datastream"></epi-socketio-datastream>
  `);
});
