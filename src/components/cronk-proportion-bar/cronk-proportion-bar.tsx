import { Component, ComponentInterface, h, Host, Prop } from '@stencil/core';

@Component({
  styleUrl: 'cronk-proportion-bar.scss',
  tag: 'cronk-proportion-bar',
})
export class CronkProportionBar implements ComponentInterface {
  @Prop({ reflect: true }) value = 0;
  @Prop() color = 'primary';

  render() {
    return (
      <Host class="proportion-bar">
        <div
          class={`ion-color-${this.color}`}
          style={{
            display: 'block',
            height: '100%',
            width: `${this.value * 100}%`,
          }}
        />
      </Host>
    );
  }
}
