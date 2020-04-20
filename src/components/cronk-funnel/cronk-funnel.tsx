import { Component, h, Host, Prop, Watch } from '@stencil/core';
import { CronkDataTypes } from '../../types';

@Component({
  styleUrl: 'cronk-funnel.scss',
  tag: 'cronk-funnel',
})
export class CronkFunnel {
  @Prop() statsList: CronkDataTypes.IFunnelListItem[] = [];
  @Prop() hideLabel = false;
  @Prop() hideStats = false;
  @Prop() hideCount = false;
  @Prop() hidePercent = false;

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

    const sortedMembers: CronkDataTypes.IFunnelListItem[] = (Object.values(
      members,
    ) as CronkDataTypes.IFunnelListItem[]).sort((a, b) => b.count - a.count);

    return (
      <Host class="summary-funnel">
        {sortedMembers.map(member => {
          return (
            <div key={member.label} class="summary-funnel-row">
              <cronk-proportion-bar value={member.count / total} color="primary" />
              {((!this.hideStats || !this.hideLabel) && (
                <div class="proportion-label">
                  {!this.hideStats && (
                    <div class="stats">
                      {!this.hideCount && <span class="counts">{member.count.toLocaleString()}</span>}
                      {!this.hidePercent && (
                        <span class="percent">{`${((member.count / total) * 100).toFixed(2)}%`}</span>
                      )}
                    </div>
                  )}
                  {!this.hideLabel && <span class="label">{member.label}</span>}
                </div>
              )) ||
                null}
            </div>
          );
        })}
      </Host>
    );
  }
}
