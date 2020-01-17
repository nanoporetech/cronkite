import { Component, Event, EventEmitter, Host, h } from '@stencil/core';

@Component({
  styleUrl: 'cronk-page-components.scss',
  tag: 'cronk-page-components',
})
export class CronkPageComponents {
  @Event() componentsLoaded!: EventEmitter<void>;

  componentDidLoad() {
    console.debug('%cEPI-REPORT-COMPONENTS :: componentDidLoad', 'color: goldenrod');
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
