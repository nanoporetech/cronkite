import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { CronkStatsbox } from './cronk-statsbox';

describe('cronk-statsbox', () => {
  let rootInst: CronkStatsbox;
  let rootEl: HTMLCronkStatsboxElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CronkStatsbox],
      html: '<cronk-statsbox></cronk-statsbox>',
    });
    rootInst = page.rootInstance;
    rootEl = page.root as HTMLCronkStatsboxElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new CronkStatsbox()).toBeTruthy();
    });
  });
});
