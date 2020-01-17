declare namespace DataTypes {
  interface IStatsBoxListItem {
    label: string;
    value: string;
    caseSensitive?: boolean;
  }
  interface IFunnelListItem {
    label: string;
    count: number;
  }
}

export { DataTypes as CronkDataTypes };
