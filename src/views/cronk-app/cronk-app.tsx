import { Component, Element, h, Host, Prop } from '@stencil/core';

@Component({
  styleUrl: 'cronk-app.scss',
  tag: 'cronk-app',
})
export class CronkApp {
  @Element() el!: HTMLCronkAppElement;

  /** Example file name */
  @Prop() report = 'hello-world';

  private cronkPageEl?: HTMLCronkPageElement;

  async componentDidLoad() {
    const response = await fetch(`/cronkite/examples/reports/${this.report}.json`);
    const reportConfig = await response.json();
    this.cronkPageEl.pageConfig = reportConfig;
  }

  async componentWillUpdate() {
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
