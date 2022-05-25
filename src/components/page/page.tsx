// tslint:disable: no-import-side-effect
import '@ionic/core';
import '@metrichor/ui-components';
import { Component, Event, EventEmitter, h, Host, Method, Listen, Prop, State, Watch } from '@stencil/core';
import { isDefined, isNullish, isUndefined } from 'ts-runtime-typecheck';
import { v4 as uuidv4 } from 'uuid';
import { ReportDefinition, HTMLDatastreamElement } from '../../types';
import { coerceCronkiteConfig, debounce, filterProps, validateCronkiteJSONSchema } from '../../utils';

const CRONKITE_DATASTREAM_CLASS = 'cronk-datastream';

@Component({
  styleUrl: 'page.scss',
  tag: 'cronk-page',
})
export class CronkPage {
  /** show or hide the configuration used to render the page */
  @Prop() showConfig = false;
  /** enable/disable validation ot the cronkite schema */
  @Prop({ reflect: true }) disableSchemaValidation = false;
  /** Page configuration JSON */
  @Prop({ reflect: true, mutable: true }) pageConfig: ReportDefinition | string;

  /** broadcast to any listener (mostly datastreams) that the page has fully
   * rendered and payloads should be rebroadcast to ensure the lated data
   * is set on components
   */
  @Event({ bubbles: false, cancelable: true }) cronkPageReady!: EventEmitter<void>;

  @State() _schemaError?: string = null;

  private _pageConfig?: ReportDefinition = undefined;
  private _uuid?: string = undefined;

  @Watch('pageConfig')
  watchHandler(newConfig: ReportDefinition | string): Promise<void> {
    try {
      const coercedConfig = coerceCronkiteConfig(newConfig, !this.disableSchemaValidation);
      this._pageConfig = coercedConfig;
      this._uuid = uuidv4();
      this._schemaError = null;
      return;
    } catch (error) {
      this._schemaError = error.message ?? null;
      this._pageConfig = undefined;
      this._uuid = undefined;
      console.error(error);
    }
  }

  /** validate provided configuration JSON for a page */
  @Method()
  async validateConfig(configIn: unknown): Promise<boolean> {
    const { isValidSchema, schemaErrors } = validateCronkiteJSONSchema(configIn);
    if (!isValidSchema && !isNullish(schemaErrors)) {
      console.error(`Cronkite schema validation errors:\n${schemaErrors}`);
      return false;
    }
    console.info('Cronkite schema successfully validated');
    return true;
  }

  /** Load new page configuration JSON */
  @Method()
  async loadConfig(newConfig: ReportDefinition | string): Promise<void> {
    this.pageConfig = newConfig;
  }

  /** BEGIN - Support for highly nested components to ensure render after data ready */
  @Listen('componentsLoaded')
  async componentsLoadedHandler(): Promise<void> {
    this.reloadStreams();
  }

  private reloadStreams = debounce(() => {
    // console.debug('%cCRONK-PAGE::reloadStreams::RELOADING', 'color: mediumseagreen');
    document
      .querySelectorAll(`.${CRONKITE_DATASTREAM_CLASS}`)
      .forEach((datastreamEl: HTMLDatastreamElement) => datastreamEl?.resendBroadcast?.());
  }, 0);
  /** END - Support for highly nested components to ensure render after data ready */

  componentWillLoad() {
    if (isUndefined(this._pageConfig) && isDefined(this.pageConfig)) {
      this.watchHandler(this.pageConfig);
    }
  }

  /* eslint-disable @stencil/render-returns-host */
  render() {
    // REVISIT THIS BLOCK FOR DISPLAYING ERRORS
    if (this._schemaError !== null) {
      return <pre style={{ padding: '0 1rem' }}>{this._schemaError}</pre>;
    }
    if (isUndefined(this._pageConfig)) {
      return;
    }

    const { id, components, streams } = this._pageConfig;

    return (
      <Host
        id={id}
        class={{
          validate: !this.disableSchemaValidation,
        }}
      >
        {/* RENDER COMPONENTS */}
        <cronk-page-components id={`${id}-components`} slot="components">
          {components.map((componentDefinition, componentIndex) => {
            return (
              <cronk-page-panel
                slot={componentDefinition?.layout?.position}
                key={`${this._uuid ?? id}-${componentIndex}`}
                data-key={`${this._uuid ?? id}-${componentIndex}`}
                id={`${id}-panel-${componentIndex}`}
                panelConfig={componentDefinition}
              />
            );
          })}
        </cronk-page-components>
        {/* RENDER STREAMS */}
        {streams.length > 0
          ? streams.map((streamConfig, streamIndex) => {
              const { element: EventSourceTag, ...attributes } = streamConfig;
              return (
                <EventSourceTag
                  aria-hidden={'true'}
                  key={`${this._uuid}-stream-${streamIndex}`}
                  class={CRONKITE_DATASTREAM_CLASS}
                  {...filterProps(attributes)}
                />
              );
            })
          : null}
        {/* RENDER RAW CONFIG IF REQUESTED */}
        {(this.showConfig && <pre>{JSON.stringify(this._pageConfig, null, 2)}</pre>) || null}
        {/* RENDER SCHEMA VALIDATION ERRORS */}
      </Host>
    );
  }
}
