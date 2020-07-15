import { Component, h, Host, Prop } from '@stencil/core';
import { StatsBoxListItem } from '../../types/statsbox.type';

@Component({
  styleUrl: 'statsbox.scss',
  tag: 'cronk-statsbox',
})
export class CronkStatsbox {
  /** Array of {label: string, value: JSONValue} for stats box headline values  */
  @Prop() statsList: StatsBoxListItem[] = [];

  render() {
    if (!Array.isArray(this.statsList)) return null;
    return (
      <Host class="stats-box">
        {this.statsList.map(stat => (
          <epi-headlinevalue key={stat.label} {...stat} />
        ))}
      </Host>
    );
  }
}
