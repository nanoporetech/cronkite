import { Component, Host, h } from '@stencil/core';

@Component({
  styleUrl: 'cronk-version.scss',
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
