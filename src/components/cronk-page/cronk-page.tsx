// tslint:disable: no-import-side-effect
import '@ionic/core';
import '@metrichor/ui-components';
import { Component, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from '@stencil/core';
import Ajv from 'ajv';
import debounce from 'lodash/debounce';
import { v4 as uuidv4 } from 'uuid';
import reportSchema from '../../cronkite.schema.json';
import { CronkJSONTypes } from '../../types/report-json';

const DEFAULT_LAYOUT = {};

@Component({
  assetsDirs: ['../../cronkite.schema.json'],
  styleUrls: ['cronk-page.scss'],
  tag: 'cronk-page',
})
export class CronkPage {
  private ajv = new Ajv();

  @Event({ bubbles: false, cancelable: true }) cronkPageReady!: EventEmitter<void>;

  @State() _pageConfig: CronkJSONTypes.ReportDefinition | undefined;
  @State() _schemaError = '';

  @Prop() showConfig = false;
  @Prop({ reflect: true }) validationEnabled = true;

  @Prop({ reflect: true, mutable: true }) pageConfig?: CronkJSONTypes.ReportDefinition | string | undefined;
  @Watch('pageConfig')
  async watchHandler(newConfig: any) {
    const sanitized = this.coerceCronkiteConfig(newConfig);
    if ((await this.validateConfig(sanitized)) || !this.validationEnabled || newConfig === null) {
      this._schemaError = '';
      return;
    }
    this._schemaError = this.stringifyAjvError();
  }

  @Method()
  async validateConfig(configIn: any) {
    if (!configIn) return false;
    let isValid = false;
    const alarm = (this.validationEnabled && 'error') || 'warn';
    try {
      isValid = this.isValidConfig(configIn);
      if (!isValid) {
        console[alarm](
          `Cronkite schema validation ${alarm === 'error' ? alarm : 'warning'}: ${this.stringifyAjvError()}`,
        );
      }
    } catch (error) {
      console.error(error);
    }
    return isValid;
  }

  @Method()
  async loadConfig(newConfig: any): Promise<void> {
    this.pageConfig = newConfig;
  }

  @Listen('componentsLoaded')
  async componentsLoadedHandler() {
    this.reloadStreams();
  }

  private reloadStreams = debounce(async () => {
    console.debug('%cCRONK-PAGE::reloadStreams::RELOADING', 'color: mediumseagreen');
    this.cronkPageReady.emit();
    document.querySelector('cronk-datastreams')?.reload();
  }, 0);

  coerceCronkiteConfig = (config: CronkJSONTypes.ReportDefinition | string): CronkJSONTypes.ReportDefinition | null => {
    let coercedConfig = config;
    if (typeof coercedConfig === 'string') {
      try {
        coercedConfig = JSON.parse(coercedConfig);
      } catch (error) {
        this._schemaError = error.message;
        return null;
      }
    }
    if (!coercedConfig) return null;
    return coercedConfig as CronkJSONTypes.ReportDefinition;
  };

  stringifyAjvError() {
    return JSON.stringify(this.ajv.errors, null, 2);
  }

  isValidConfig(configIn: any): boolean {
    if (!configIn) return false;
    return this.ajv.validate(reportSchema, configIn) as boolean;
  }

  updatePageConfigState() {
    if (typeof this.pageConfig === 'string') {
      const coercedConfig = this.coerceCronkiteConfig(this.pageConfig);
      if (coercedConfig !== null) {
        this._pageConfig = coercedConfig;
        return;
      }
    }
    this._pageConfig = (this.pageConfig && (this.pageConfig as CronkJSONTypes.ReportDefinition)) || undefined;
  }

  componentWillUpdate() {
    this.updatePageConfigState();
  }

  componentWillLoad() {
    this.updatePageConfigState();
  }

  render() {
    const hasConfig = this._pageConfig !== undefined;
    const isValidConfig =
      (hasConfig && this.validationEnabled && this.isValidConfig(this._pageConfig)) || !this.validationEnabled;
    const classes = { 'empty-page-config': !hasConfig, 'valid-page-config': isValidConfig && this.validationEnabled };

    const { id, components, streams } = (isValidConfig && (this._pageConfig as CronkJSONTypes.ReportDefinition)) || {};

    const hasStreams = streams !== undefined && streams.length > 0;

    const streamsKey =
      (hasStreams &&
        (streams as CronkJSONTypes.Stream[])
          .reduce(
            (previousStreams: any, currentStream: any) => {
              return [...previousStreams, ...currentStream['@channels'].map((channel: any) => channel.channel)];
            },
            [id],
          )
          .join(':')) ||
      'no:streams';

    // console.debug('CRONK-PAGE::render', { hasConfig, isValidConfig, id, classes, components, streams, streamsKey });
    return (
      <Host id={id} class={classes}>
        {/* RENDER COMPONENTS */}
        {(isValidConfig && (
          <cronk-page-components id={uuidv4()} slot="components">
            {(components || []).map((compDef: any) => {
              const componentDefinition = compDef.layout ? compDef : { ...compDef, layout: DEFAULT_LAYOUT };
              const uuid = componentDefinition.layout.i || uuidv4();
              return (
                <cronk-page-panel
                  slot={componentDefinition.layout.position}
                  key={uuid}
                  id={uuid}
                  panelConfig={componentDefinition}
                />
              );
            })}
          </cronk-page-components>
        )) ||
          null}
        {/* RENDER STREAMS */}
        {(streams && streams.length && (
          <cronk-datastreams streams={streams} streamsID={streamsKey}></cronk-datastreams>
        )) ||
          null}
        {/* RENDER RAW CONFIG IF REQUESTED */}
        {(this.showConfig && (
          <pre>{isValidConfig ? JSON.stringify(this._pageConfig, null, 2) : 'No config provided'}</pre>
        )) ||
          null}
        {/* RENDER SCHEMA VALIDATION ERRORS */}
        {(this.validationEnabled && this._schemaError && <pre>{this._schemaError}</pre>) || null}
      </Host>
    );
  }
}
