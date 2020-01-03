import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  styleUrl: 'epi-report-title.scss',
  tag: 'epi-report-title',
})
export class EpiReportTitle {
  @Prop() reportTitle = '';
  render() {
    return <Host>{(this.reportTitle && this.reportTitle) || null}</Host>;
  }
}
