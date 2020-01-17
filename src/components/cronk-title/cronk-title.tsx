import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  styleUrl: 'cronk-title.scss',
  tag: 'cronk-title',
})
export class CronkTitle {
  @Prop() reportTitle = '';
  render() {
    return <Host>{(this.reportTitle && this.reportTitle) || null}</Host>;
  }
}
