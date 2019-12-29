import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  styleUrl: 'epi-error-message.scss',
  tag: 'epi-error-message',
})
export class EpiErrorMessage {
  @Prop() message = 'Yikes! An error occurred';

  render() {
    return <Host>{this.message}</Host>;
  }
}
