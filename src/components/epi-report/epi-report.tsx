// tslint:disable-next-line: no-import-side-effect
import '@ionic/core';
import { Component, Host, h, Method, Prop } from '@stencil/core';

import uuidv4 from 'uuid/v4';

const DEFAULT_LAYOUT = {};

@Component({
  styleUrls: ['epi-report.scss', '../../global/styles/theme.scss'],
  tag: 'epi-report',
})
export class EpiReport {
  @Prop({ mutable: true }) config?: any;
  @Prop() showConfig = false;

  @Method()
  async loadConfig(newConfig: any): Promise<void> {
    this.config = newConfig;
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

        {this.config.streams.map((streamConfig: any, streamIndex: number) => (
          <epi-event-stream
            key={`${streamConfig.element || 'stream'}-${streamIndex}`}
            config={streamConfig}
          ></epi-event-stream>
        ))}
        {(this.showConfig && <pre>{this.config ? JSON.stringify(this.config, null, 2) : 'No config provided'}</pre>) ||
          null}
      </Host>
    );
  }
}
