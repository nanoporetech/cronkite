import { Component, h, Prop } from '@stencil/core';

@Component({
  styleUrl: 'cronk-list.scss',
  tag: 'cronk-list',
})
export class CronkList {
  @Prop() items: any[] = [];
  @Prop() ordered = false;

  render() {
    const ListType = this.ordered ? 'ol' : 'ul';
    if (!this.items.length) return;
    return (
      <ListType>
        {this.items.map(item => {
          return <li innerHTML={`${item}`} />;
        })}
      </ListType>
    );
  }
}
