import { Component, Element, Host, h, Prop } from '@stencil/core';

@Component({
  styleUrl: 'app-root.scss',
  tag: 'app-root',
})
export class AppRoot {
  @Element() el!: HTMLAppRootElement;
  @Prop() report = 'hello-world';

  reportEl?: HTMLEpiReportElement;

  async componentDidLoad() {
    if (!this.reportEl) return;
    const response = await fetch(`../../../examples/reports/${this.report}.json`);
    const reportConfig = await response.json();
    this.reportEl.config = reportConfig;
  }

  async componentWillUpdate() {
    if (!this.reportEl) return;
    const response = await fetch(`../../../examples/reports/${this.report}.json`);
    const reportConfig = await response.json();
    this.reportEl.config = reportConfig;
  }

  render() {
    return (
      <Host>
        <epi-report ref={init => (this.reportEl = init)}></epi-report>
      </Host>
    );
  }
}
