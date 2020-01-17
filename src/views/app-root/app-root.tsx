import { Component, Element, h, Host, Prop } from '@stencil/core';

@Component({
  styleUrl: 'app-root.scss',
  tag: 'app-root',
})
export class AppRoot {
  @Element() el!: HTMLAppRootElement;
  @Prop() report = 'hello-world';

  cronkPageEl?: HTMLCronkPageElement;

  async componentDidLoad() {
    if (!this.cronkPageEl) return;
    const response = await fetch(`/cronkite/examples/reports/${this.report}.json`);
    // console.info('reportConfig', reportConfig);
    const reportConfig = await response.json();
    this.cronkPageEl.pageConfig = reportConfig;
  }

  async componentWillUpdate() {
    if (!this.cronkPageEl) return;
    const response = await fetch(`/cronkite/examples/reports/${this.report}.json`);
    const reportConfig = await response.json();
    this.cronkPageEl.pageConfig = reportConfig;
  }

  render() {
    return (
      <Host>
        <cronk-page ref={init => (this.cronkPageEl = init)}></cronk-page>
      </Host>
    );
  }
}
