import { Component, Event, EventEmitter, Host, h } from '@stencil/core';

@Component({
  styleUrl: 'epi-report-components.scss',
  tag: 'epi-report-components',
})
export class EpiReportComponents {
  @Event() componentsLoaded!: EventEmitter<void>;

  componentDidLoad() {
    this.componentsLoaded.emit();
  }

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
