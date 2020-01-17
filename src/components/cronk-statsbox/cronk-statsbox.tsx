import { Component, h, Host, Prop } from '@stencil/core';
import { CronkDataTypes } from '../../types';

@Component({
  styleUrl: 'cronk-statsbox.scss',
  tag: 'cronk-statsbox',
})
export class CronkStatsbox {
  @Prop() statsList: CronkDataTypes.IStatsBoxListItem[] = [];

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
