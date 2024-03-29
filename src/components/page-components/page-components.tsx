import { Component, Event, EventEmitter, h, Host } from '@stencil/core';

@Component({
  styleUrl: 'page-components.scss',
  tag: 'cronk-page-components',
})
export class CronkPageComponents {
  /** Notify whe component has been finally rendered */
  @Event() componentsLoaded!: EventEmitter<void>;

  componentDidLoad() {
    // console.debug('%cEPI-REPORT-COMPONENTS :: componentDidLoad', 'color: goldenrod');
    this.componentsLoaded.emit();
  }

  render() {
    return (
      <Host>
        <slot name="header"></slot>
        <div class="components-content">
          <slot></slot>
          <slot name="error"></slot>
        </div>
        <slot name="footer"></slot>
      </Host>
    );
  }
}
