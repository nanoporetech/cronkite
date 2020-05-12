import { Component, h, Prop } from '@stencil/core';

@Component({
  styleUrl: 'cronk-simple-grid.scss',
  tag: 'cronk-simple-grid',
})
export class CronkSimpleGrid {
  @Prop() headers: string[] = [];
  @Prop() display: 'grid' | 'auto' = 'auto';
  @Prop() data: any[] = [];

  render() {
    return (
      <table>
        <thead>
          <tr class={{ grid: this.display === 'grid' }}>
            {this.headers.map((header: string) => (
              <th>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.data.map((row: any[]) => (
            <tr class={{ grid: this.display === 'grid' }}>
              {row.map((data: any, index: number) => (
                <td>
                  <span>{this.headers[index]}</span> <div innerHTML={data} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
