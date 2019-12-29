import { Component, Host, h } from '@stencil/core';

@Component({
  styleUrl: 'epi-report-title.scss',
  tag: 'epi-report-title',
})
export class EpiReportTitle {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
