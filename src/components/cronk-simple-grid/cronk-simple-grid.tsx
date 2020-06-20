import { Component, h, Host, Method, Prop, Watch } from '@stencil/core';

@Component({
  styleUrl: 'cronk-simple-grid.scss',
  tag: 'cronk-simple-grid',
})
export class CronkSimpleGrid {
  @Prop() headers: string[] = [];
  @Prop() display: 'grid' | 'auto' = 'auto';
  @Prop() data: any[] = [];
  @Prop() headerColour: 'primary' | 'secondary' | 'tertiary' | 'dark' = 'dark';
  @Prop() batchSize = 50;
  @Prop() rows = 10;
  @Prop() sort: null | [number, string][] = null;
  _data: any[] = [];

  length = 0;
  infiniteScrollEl?: HTMLIonInfiniteScrollElement;
  gridListEl?: HTMLElement;

  @Watch('display')
  @Watch('headers')
  @Watch('rows')
  @Watch('sort')
  @Watch('data')
  reloadData() {
    // console.info('reloading data');
    if (!this.gridListEl) return;
    this.gridListEl.innerHTML = '';
    this.length = 0;
    this._data = this.data;
    if (this.sort && this.sort.length) {
      this.sort.forEach(([index, direction = 'asc']) =>
        this._data.sort((a: any, b: any) => (direction === 'asc' ? a[index] - b[index] : b[index] - a[index])),
      );
    }
    this.appendItems();
  }

  @Method()
  async appendItems() {
    if (!this.gridListEl) return;
    const originalLength = this.length;
    this._data.slice(this.length, originalLength + this.batchSize).forEach((row: any[]) => {
      const tr = document.createElement('tr');
      if (this.display === 'grid') {
        tr.className = 'grid';
      }
      if (row.length) {
        row.forEach((data: any, index: number) => {
          const td = document.createElement('td');
          const div = document.createElement('div');
          td.innerHTML = `<span>${this.headers[index]}</span>`;
          div.innerHTML = data;
          td.appendChild(div);
          tr.appendChild(td);
        });
        this.gridListEl?.appendChild(tr);
      }
    });

    this.length = originalLength + this.batchSize;
  }

  async wait(time: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  componentDidLoad() {
    if (!this.infiniteScrollEl || !this.gridListEl) return;
    this.infiniteScrollEl.addEventListener('ionInfinite', async () => {
      if (!this.infiniteScrollEl) return;
      if (this.length < this._data.length) {
        // console.info('Loading data...');
        await this.wait(100);
        this.infiniteScrollEl.complete();
        this.appendItems();
        // console.info('Done');
      } else {
        // console.info('No More Data');
        this.infiniteScrollEl.disabled = true;
      }
    });
  }

  sorted(index: number) {
    const sorted = this.sort && this.sort.length && this.sort.filter(s => s[0] === index);
    if (sorted && sorted.length) {
      return { [`sort-${sorted[0][1]}`]: true };
    }
    return {};
  }

  render() {
    return (
      <Host>
        <ion-content
          style={{
            height: `calc(3.04rem + (${Math.min(this.rows, this.batchSize)} * 3.04rem))`,
          }}
        >
          <table>
            <thead>
              <tr class={{ grid: this.display === 'grid' }}>
                {this.headers.map((header: string, index: number) => (
                  <th
                    class={{
                      'cronk-grid-header-colour': true,
                      dark: this.headerColour === 'dark',
                      primary: this.headerColour === 'primary',
                      secondary: this.headerColour === 'secondary',
                      tertiary: this.headerColour === 'tertiary',
                      ...this.sorted(index),
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody ref={init => (this.gridListEl = init)}></tbody>
          </table>
          <ion-infinite-scroll ref={init => (this.infiniteScrollEl = init)} threshold="100px" id="infinite-scroll">
            <ion-infinite-scroll-content
              loading-spinner="bubbles"
              loading-text="Loading more data..."
            ></ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </ion-content>
      </Host>
    );
  }
}
