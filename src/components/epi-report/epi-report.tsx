import { Component, Host, h, Method, Prop } from '@stencil/core';
import uuidv4 from 'uuid/v4';

const DEFAULT_LAYOUT = {
  h: 2,
  w: 4,
  x: 4,
  y: 4,
};

@Component({
  styleUrl: 'epi-report.scss',
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
      <Host
        style={{
          gridTemplateColumns: `repeat(${4}, auto)`,
        }}
      >
        {this.config.components.map((compDef: any) => {
          const componentDefinition = compDef.layout ? compDef : { ...compDef, layout: DEFAULT_LAYOUT };
          const uuid = componentDefinition.layout.i || uuidv4();
          return <epi-report-panel key={uuid} id={uuid} panelConfig={componentDefinition} />;
        })}
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
