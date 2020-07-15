import { Component, h, Host } from '@stencil/core';

@Component({
  styleUrl: 'version.scss',
  tag: 'cronk-version',
})
export class CronkVersion {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
