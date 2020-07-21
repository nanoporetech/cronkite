import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  styleUrl: 'errormessage.scss',
  tag: 'cronk-errormessage',
})
export class CronkErrormessage {
  /** Customised message for error reporting */
  @Prop() message = 'Yikes! An error occurred';

  render() {
    return <Host>{this.message}</Host>;
  }
}
