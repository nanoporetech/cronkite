import { Component, Host, h, Prop, Watch } from '@stencil/core';
import { EpiReportDataTypes } from '../../types';

@Component({
  styleUrl: 'epi-funnel.scss',
  tag: 'epi-funnel',
})
export class EpiFunnel {
  @Prop() statsList: EpiReportDataTypes.IFunnelListItem[] = [];
  @Watch('statsList')
  statsListValidator(newStatsList: any[]) {
    const isValid = newStatsList.length === 0 || newStatsList.every(member => !!member.label && !!member.count);
    if (!isValid) {
      throw new Error('Error: @Prop() statsList - property does not contain valid members');
    }
  }

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
