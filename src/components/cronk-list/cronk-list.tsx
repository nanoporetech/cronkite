import { Component, h, Prop } from '@stencil/core';

@Component({
  styleUrl: 'cronk-list.scss',
  tag: 'cronk-list',
})
export class CronkList {
  @Prop() items: any[] = [];
  @Prop() ordered = false;
  @Prop() bullets = true;
  @Prop() reverse = false;

  render() {
    const ListType = this.ordered ? 'ol' : 'ul';
    if (!this.items.length) return;
    return (
      <ListType
        class={{
          ordered: this.bullets && this.ordered,
          unordered: this.bullets && !this.ordered,
        }}
      >
        {(this.reverse ? [...this.items].reverse() : this.items).map(item => {
          return <li innerHTML={`${item}`} />;
        })}
      </ListType>
    );
  }
}
