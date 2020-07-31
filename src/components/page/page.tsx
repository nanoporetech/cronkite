// tslint:disable: no-import-side-effect
import '@ionic/core';
import '@metrichor/ui-components';
import { Component, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from '@stencil/core';
import Ajv from 'ajv';
import reportSchema from '../../cronkite.schema.json';
import { ComponentConfig, ReportDefinition, Stream } from '../../types/reportconfig.type';
import { debounce } from '../../utils';

@Component({
  assetsDirs: ['../../cronkite.schema.json'],
  styleUrl: 'page.scss',
  tag: 'cronk-page',
})
export class CronkPage {
  private ajv = new Ajv();

  /** broadcast to any listener (mostly datastreams) that the page has fully
   * rendered and payloads should be rebroadcast to ensure the lated data
   * is set on components
   */
  @Event({ bubbles: false, cancelable: true }) cronkPageReady!: EventEmitter<void>;

  @State() _pageConfig: ReportDefinition | undefined;
  @State() _schemaError = '';

  /** show or hide the configuration used to render the page */
  @Prop() showConfig = false;
  /** enable/disable validation ot the cronkite schema */
  @Prop({ reflect: true }) validationEnabled = true;
  /** Page configuration JSON */
  @Prop({ reflect: true, mutable: true }) pageConfig: ReportDefinition | string | undefined;

  @Watch('pageConfig')
  async watchHandler(newConfig: any) {
    const sanitized = this.coerceCronkiteConfig(newConfig);
    if ((await this.validateConfig(sanitized)) || !this.validationEnabled || newConfig === null) {
      this._schemaError = '';
      return;
    }
    this._schemaError = this.stringifyAjvError();
  }

  /** validate provided configuration JSON for a page */
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

  /** Load new page configuration JSON */
  @Method()
  async loadConfig(newConfig: any): Promise<void> {
    this.pageConfig = newConfig;
  }

  @Listen('componentsLoaded')
  async componentsLoadedHandler() {
    this.reloadStreams();
  }

  private reloadStreams = debounce(async () => {
    // console.debug('%cCRONK-PAGE::reloadStreams::RELOADING', 'color: mediumseagreen');
    this.cronkPageReady.emit();
    document.querySelector('cronk-datastreams')?.reload();
  }, 0);

  private coerceCronkiteConfig = (config: ReportDefinition | string): ReportDefinition | null => {
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
    return coercedConfig as ReportDefinition;
  };

  private stringifyAjvError() {
    return JSON.stringify(this.ajv.errors, null, 2);
  }

  private isValidConfig(configIn: any): boolean {
    if (!configIn) return false;
    return this.ajv.validate(reportSchema, configIn) as boolean;
  }

  private updatePageConfigState() {
    if (typeof this.pageConfig === 'string') {
      const coercedConfig = this.coerceCronkiteConfig(this.pageConfig);
      if (coercedConfig !== null) {
        this._pageConfig = coercedConfig;
        return;
      }
    }
    this._pageConfig = (this.pageConfig && (this.pageConfig as ReportDefinition)) || undefined;
  }

  componentWillUpdate() {
    this.updatePageConfigState();
  }

  componentWillLoad() {
    this.updatePageConfigState();
  }

  /* eslint-disable @stencil/render-returns-host */
  render() {
    const hasConfig = this._pageConfig !== undefined;
    const isValidConfig =
      (hasConfig && this.validationEnabled && this.isValidConfig(this._pageConfig)) || !this.validationEnabled;
    const classes = { 'empty-page-config': !hasConfig, 'valid-page-config': isValidConfig && this.validationEnabled };

    const { id, components, streams } = (isValidConfig && (this._pageConfig as ReportDefinition)) || {};

    const hasStreams = streams !== undefined && streams.length > 0;

    const streamsKey =
      (hasStreams &&
        (streams as Stream[])
          .reduce(
            (previousStreams: any, currentStream: any) => {
              return [...previousStreams, ...currentStream['@channels'].map((channel: any) => channel.channel)];
            },
            [id],
          )
          .join(':')) ||
      'no:streams';

    // console.debug('CRONK-PAGE::render', { hasConfig, isValidConfig, id, classes, components, streams, streamsKey });
    return <Host id={id} class={classes}>
      {/* RENDER COMPONENTS */}
      {(isValidConfig && (
        <cronk-page-components id={`${id}-components`} slot="components">
          {(components || []).map((compDef: ComponentConfig, componentIndex: number) => {
            const componentDefinition = compDef.layout ? compDef : { ...compDef, layout: {} };
            const uuid = `${id}-panel-${componentIndex}`;
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
  }
}
