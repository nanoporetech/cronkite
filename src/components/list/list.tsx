import { Component, h, Prop } from '@stencil/core';

@Component({
  styleUrl: 'list.scss',
  tag: 'cronk-list',
})
export class CronkList {
  /** any[] of items to list */
  @Prop() items: any[] = [];
  /** Render bullets as numbers (true) or not (discs) */
  @Prop() ordered = false;
  /** Show/hide bullets */
  @Prop() bullets = true;
  /** reverse the provided order */
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
