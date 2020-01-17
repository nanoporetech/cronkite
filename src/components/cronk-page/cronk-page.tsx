// @Event({ bubbles: false, cancelable: true }) cronkPageReady!: EventEmitter<void>;
// tslint:disable: no-import-side-effect
import '@ionic/core';
import 'epi2me-ui-checkmark/dist';
import 'epi2me-ui-donut/dist';
import 'epi2me-ui-headlinevalue/dist';
import 'epi2me-ui-coverageplot/dist';

import { Component, Event, EventEmitter, h, Host, Listen, Prop, Method, State, Watch } from '@stencil/core';
import { CronkJSONTypes } from '../../types/report-json';
import Ajv from 'ajv';
import debounce from 'lodash/debounce';
import reportSchema from '../../global/cronkite.schema.json';

import uuidv4 from 'uuid/v4';

const DEFAULT_LAYOUT = {};

@Component({
  styleUrls: ['cronk-page.scss', '../../global/styles/theme.scss'],
  tag: 'cronk-page',
})
export class CronkPage {
  private ajv = new Ajv();

  @Event({ bubbles: false, cancelable: true }) cronkPageReady!: EventEmitter<void>;

  @State() _pageConfig: any;
  @State() _schemaError = '';

  @Prop() showConfig = false;

  @Prop() pageConfig?: CronkJSONTypes.ReportDefinition | undefined;
  @Watch('pageConfig')
  async watchHandler(newConfig: any) {
    // async watchHandler(newConfig: any, oldConfig: any) {
    if (await this.validateConfig(newConfig)) {
      this._pageConfig = newConfig;
      this._schemaError = '';
      return;
    }
    /**
     * ? Should we keep the old config if we're showing the schema
     * ? validation error of something new. The error could offer to
     * ? restore previous config - might be nice
     */
    // this._pageConfig = oldConfig;
    this._schemaError = this.stringifyAjvError();
  }

  @Method()
  async validateConfig(configIn: any) {
    let isValid = false;
    try {
      isValid = this.isValidConfig(configIn);
      if (!isValid) {
        console.error(`Cronkite schema validation error: ${this.stringifyAjvError()}`);
      }
    } catch (error) {
      console.error(error);
    }
    return isValid;
  }

  @Method()
  async loadConfig(newConfig: any): Promise<void> {
    if (await this.validateConfig(newConfig)) {
      this.pageConfig = newConfig;
    }
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

  stringifyAjvError() {
    return JSON.stringify(this.ajv.errors, null, 2);
  }

  isValidConfig(configIn: any): boolean {
    if (!configIn) return false;
    return this.ajv.validate(reportSchema, configIn) as boolean;
  }

  componentWillUpdate() {
    this._pageConfig = this.pageConfig;
  }

  render() {
    const hasConfig = this._pageConfig !== undefined;
    const isValidConfig = hasConfig && this.isValidConfig(this._pageConfig);
    const classes = { 'empty-page-config': !hasConfig, 'valid-page-config': isValidConfig };

    const { id, components, streams } = (isValidConfig && this._pageConfig) || {};

    const hasStreams = streams !== undefined && streams.length > 0;

    const streamsKey =
      (hasStreams &&
        streams
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
        {(this._schemaError && <pre>{this._schemaError}</pre>) || null}
      </Host>
    );
  }
}
