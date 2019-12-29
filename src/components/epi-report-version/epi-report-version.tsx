import { Component, Host, h } from '@stencil/core';

@Component({
  styleUrl: 'epi-report-version.scss',
  tag: 'epi-report-version',
})
export class EpiReportVersion {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
