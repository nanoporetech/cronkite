import { Component, h, Host, Prop, Watch } from '@stencil/core';
import { FunnelListItem } from '../../types/funnel.type';

@Component({
  styleUrl: 'funnel.scss',
  tag: 'cronk-funnel',
})
export class CronkFunnel {
  /** {label, count}[] of members */
  @Prop() statsList: FunnelListItem[] = [];
  /** Show/hide label */
  @Prop() hideLabel = false;
  /** Show/hide stats */
  @Prop() hideStats = false;
  /** Show/hide count */
  @Prop() hideCount = false;
  /** Show/hide percent */
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

    const sortedMembers: FunnelListItem[] = (Object.values(
      members,
    ) as FunnelListItem[]).sort((a, b) => b.count - a.count);

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
