import { newSpecPage } from '@stencil/core/testing';
import { EpiInstanceDatastream } from './epi-instance-datastream';
import { EpiReportDataSource } from '../interfaces'

it('should render my component', async () => {
  const page = await newSpecPage({
    components: [EpiInstanceDatastream],
    html: `<epi-instance-datastream></epi-instance-datastream>`,
  });
  expect(page.root).toEqualHtml(`
    <epi-instance-datastream></epi-instance-datastream>
  `);
});
