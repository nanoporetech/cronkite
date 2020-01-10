// tslint:disable: no-import-side-effect
import '@ionic/core';
import 'epi2me-ui-checkmark/dist';
import 'epi2me-ui-donut/dist';
import 'epi2me-ui-headlinevalue/dist';
import 'epi2me-ui-coverageplot/dist';

import { Component, Host, h, Listen, Method, Prop, State, Watch } from '@stencil/core';
import debounce from 'lodash/debounce';
import Ajv from 'ajv';
import reportSchema from '../../global/cronkite.schema.json';

import uuidv4 from 'uuid/v4';

const DEFAULT_LAYOUT = {};

@Component({
  styleUrls: ['epi-report.scss', '../../global/styles/theme.scss'],
  tag: 'epi-report',
})
export class EpiReport {
  private ajv = new Ajv();

  @Prop({ mutable: true }) config?: any;

  @Watch('config')
  async validateConfig(newConfig: any): Promise<boolean> {
    this.validConfig = this.ajv.validate(reportSchema, newConfig) as boolean;
    if (this.validConfig) {
      this.reportReady = false;
    }
    return this.validConfig;
  }

  @Prop() showConfig = false;

  @State() reportReady = false;

  validConfig = false;

  @Method()
  async loadConfig(newConfig: any): Promise<void> {
    if (await this.validateConfig(newConfig)) {
      this.config = newConfig;
    }
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
        this.setReportReady();
      }
    }, 1000);
  }

  render() {
    if (!this.config) return;
    return (
      (this.validConfig && (
        <Host id={this.config.id}>
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
          {(this.showConfig && (
            <pre>{this.config ? JSON.stringify(this.config, null, 2) : 'No config provided'}</pre>
          )) ||
            null}
        </Host>
      )) || <pre>{JSON.stringify(this.ajv.errors, null, 2)}</pre>
    );
  }
}
