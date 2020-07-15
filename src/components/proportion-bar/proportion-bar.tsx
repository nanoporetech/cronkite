import { Component, ComponentInterface, h, Host, Prop } from '@stencil/core';

@Component({
  styleUrl: 'proportion-bar.scss',
  tag: 'cronk-proportion-bar',
})
export class CronkProportionBar implements ComponentInterface {
  /** proportion ( 0 <= value <= 1) */
  @Prop({ reflect: true }) value = 0;
  /** Colour of the proportion bar */
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
