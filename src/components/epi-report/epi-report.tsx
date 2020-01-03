// tslint:disable-next-line: no-import-side-effect
import '@ionic/core';
import { Component, Host, h, Listen, Method, Prop, State } from '@stencil/core';
import debounce from 'lodash/debounce';

import uuidv4 from 'uuid/v4';

const DEFAULT_LAYOUT = {};

@Component({
  styleUrls: ['epi-report.scss', '../../global/styles/theme.scss'],
  tag: 'epi-report',
})
export class EpiReport {
  @Prop({ mutable: true }) config?: any;
  @Prop() showConfig = false;

  @State() reportReady = false;

  @Method()
  async loadConfig(newConfig: any): Promise<void> {
    this.config = newConfig;
  }

  @Listen('componentsLoaded')
  async reportReadyHandler() {
    this.setReportReady();
  }

  setReportReady = debounce(() => {
    this.reportReady = true;
  }, 100);

  componentDidLoad() {
    setTimeout(() => {
      // fallback to ensure streams get written
      if (!this.reportReady) {
        this.reportReady = true;
      }
    }, 1000);
  }

  render() {
    if (!this.config) return;
    return (
      <Host>
        <epi-report-components>
          {(this.config.components || []).map((compDef: any) => {
            const componentDefinition = compDef.layout ? compDef : { ...compDef, layout: DEFAULT_LAYOUT };
            const uuid = componentDefinition.layout.i || uuidv4();
            return (
              <epi-report-panel
                slot={componentDefinition.layout.position}
                key={uuid}
                id={uuid}
                panelConfig={componentDefinition}
              />
            );
          })}
        </epi-report-components>
        {(this.reportReady &&
          this.config.streams &&
          this.config.streams.map((streamConfig: any, streamIndex: number) => (
            <epi-event-stream
              key={`${streamConfig.element || 'stream'}-${streamIndex}`}
              config={streamConfig}
            ></epi-event-stream>
          ))) ||
          null}
        {(this.showConfig && <pre>{this.config ? JSON.stringify(this.config, null, 2) : 'No config provided'}</pre>) ||
          null}
      </Host>
    );
  }
}
