import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  styleUrl: 'title.scss',
  tag: 'cronk-title',
})
export class CronkTitle {
  /** Specify a title */
  @Prop() reportTitle = '';
  render() {
    return <Host>{(this.reportTitle && this.reportTitle) || null}</Host>;
  }
}
