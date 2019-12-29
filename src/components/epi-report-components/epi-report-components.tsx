import { Component, Host, h } from '@stencil/core';

@Component({
  styleUrl: 'epi-report-components.scss',
  tag: 'epi-report-components',
})
export class EpiReportComponents {
  render() {
    return (
      <Host>
        <slot name="header"></slot>
        <div
          class="components-content"
          style={{
            gridTemplateColumns: `repeat(${4}, auto)`,
          }}
        >
          <slot></slot>
        </div>
        <slot name="footer"></slot>
      </Host>
    );
  }
}
