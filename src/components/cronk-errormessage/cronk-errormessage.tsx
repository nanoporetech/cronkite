import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  styleUrl: 'cronk-errormessage.scss',
  tag: 'cronk-errormessage',
})
export class CronkErrormessage {
  @Prop() message = 'Yikes! An error occurred';

  render() {
    return <Host>{this.message}</Host>;
  }
}
