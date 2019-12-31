import { Component, Host, h, Prop } from '@stencil/core';
import { EpiReportDataTypes } from '../../types';
// import { groupBy, sumBy, sortBy } from 'lodash';
// import sortBy from 'lodash/sumBy';

@Component({
  styleUrl: 'epi-funnel.scss',
  tag: 'epi-funnel',
})
export class EpiFunnel {
  @Prop() statsList: EpiReportDataTypes.IFunnelListItem[] = [];

  render() {
    if (!Array.isArray(this.statsList) || !this.statsList.length) return null;

    let total = 0;
    const members = {};
    this.statsList.forEach(member => {
      if (member.label in members) {
        members[member.label].count += member.count || 0;
      } else {
        members[member.label] = member;
      }
      total += member.count || 0;
    });

    const sortedMembers: EpiReportDataTypes.IFunnelListItem[] = (Object.values(
      members,
    ) as EpiReportDataTypes.IFunnelListItem[]).sort((a, b) => b.count - a.count);

    return (
      <Host class="summary-funnel">
        <table class="fixed">
          <tbody>
            {sortedMembers.map(member => (
              <tr key={member.label} align-items-center="true">
                <td>
                  <ion-progress-bar color="secondary" value={member.count / total} />
                </td>
                <td class="counts">{member.count.toLocaleString()}</td>
                <td class="percent">({((member.count / total) * 100).toFixed(2)}%)</td>
                <td class="label">{member.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Host>
    );
  }
}
