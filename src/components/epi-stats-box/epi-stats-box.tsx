import { Component, Host, h, Prop } from '@stencil/core';
import { EpiReportDataTypes } from '../../types';

// interface IStatsBoxListItem {
//   [
//     { label: 'total analysed', value: totalReads.toLocaleString() },
//     {
//       label: 'selected reads',
//       value: selectedCount.toLocaleString(),
//     },
//     {
//       label: 'avg sequence length',
//       value: `${nicesize(averageSequenceLength, {
//         unit: `base${averageSequenceLength > 1 ? 's' : ''}`,
//       })}`,
//       'case-sensitive': true,
//     },
//     {
//       label: 'avg transcript length',
//       value: `${nicesize(averageTranscriptLength, {
//         unit: `base${averageTranscriptLength > 1 ? 's' : ''}`,
//       })}`,
//       'case-sensitive': true,
//     },
//   ]
// }

@Component({
  styleUrl: 'epi-stats-box.scss',
  tag: 'epi-stats-box',
})
export class EpiStatsBox {
  @Prop() statsList: EpiReportDataTypes.IStatsBoxListItem[] = [];

  render() {
    if (!Array.isArray(this.statsList)) return null;
    return (
      <Host class="stats-box">
        {this.statsList.map(stat => (
          <epi-headlinevalue key={stat.label} {...stat} />
        ))}
        {/* <ion-grid>
          <ion-row class="ion-justify-content-center" style={{ marginBottom: 0 }}>
          </ion-row>
        </ion-grid> */}
      </Host>
    );
  }
}
