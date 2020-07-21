/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ReportDefinition, Stream } from "./types/reportconfig.type";
import { FunnelListItem } from "./types/funnel.type";
import { ChannelShape, DatastreamResponseHandler, FilterFn, MetadataObj, ResponseTypes, StreamConfig } from "./types/datastreams.type";
import { JSONValue } from "./types/json.type";
import { SelectListMember } from "./types/selector.type";
import { StatsBoxListItem } from "./types/statsbox.type";
export namespace Components {
    interface CronkApp {
        /**
          * Example file name
         */
        "report": string;
    }
    interface CronkDatastreams {
        /**
          * Rebroadcast the last cached payload
         */
        "reload": () => Promise<void>;
        /**
          * Array of stream configuration
         */
        "streams"?: Stream[];
        /**
          * Unique ID for stream
         */
        "streamsID"?: string;
    }
    interface CronkErrormessage {
        /**
          * Customised message for error reporting
         */
        "message": string;
    }
    interface CronkEventStream {
        /**
          * Event stream configuration
         */
        "config": Stream;
    }
    interface CronkFunnel {
        /**
          * Show/hide count
         */
        "hideCount": boolean;
        /**
          * Show/hide label
         */
        "hideLabel": boolean;
        /**
          * Show/hide percent
         */
        "hidePercent": boolean;
        /**
          * Show/hide stats
         */
        "hideStats": boolean;
        /**
          * {label, count}[] of members
         */
        "statsList": FunnelListItem[];
    }
    interface CronkList {
        /**
          * Show/hide bullets
         */
        "bullets": boolean;
        /**
          * any[] of items to list
         */
        "items": any[];
        /**
          * Render bullets as numbers (true) or not (discs)
         */
        "ordered": boolean;
        /**
          * reverse the provided order
         */
        "reverse": boolean;
    }
    interface CronkManagedDatastream {
        /**
          * Whether or not a datastream is affected by filters like cronk-selector
         */
        "acceptsFilters": boolean;
        /**
          * Attach/add a new filter function to apply to members of a datastream
         */
        "addFilter": (fnKey: string, filterFn: FilterFn) => Promise<void>;
        /**
          * Channel configuration describing how broadcasts are constructed
         */
        "channels": ChannelShape[];
        /**
          * Stream data source managed externally to component
         */
        "data": JSONValue;
        /**
          * List any filter functions applied to the data streams
         */
        "listFilters": () => Promise<{}>;
        /**
          * Rebroadcast latest cached payload to on all configured channels
         */
        "resendBroadcast": () => Promise<void>;
        /**
          * sets class `cronk-${this.type}-eventstream` on cronk-managed-datastream element
         */
        "type": string;
    }
    interface CronkPage {
        /**
          * Load new page configuration JSON
         */
        "loadConfig": (newConfig: any) => Promise<void>;
        /**
          * Page configuration JSON
         */
        "pageConfig": ReportDefinition | string | undefined;
        /**
          * show or hide the configuration used to render the page
         */
        "showConfig": boolean;
        /**
          * validate provided configuration JSON for a page
         */
        "validateConfig": (configIn: any) => Promise<boolean>;
        /**
          * enable/disable validation ot the cronkite schema
         */
        "validationEnabled": boolean;
    }
    interface CronkPageComponents {
    }
    interface CronkPagePanel {
        /**
          * Configuration for a specific component
         */
        "panelConfig": any;
    }
    interface CronkPollDatastream {
        /**
          * Whether or not a datastream is affected by filters like cronk-selector
         */
        "acceptsFilters": boolean;
        /**
          * Attach/add a new filter function to apply to members of a datastream
         */
        "addFilter": (fnKey: string, filterFn: () => boolean) => Promise<void>;
        /**
          * Channel configuration describing how broadcasts are constructed
         */
        "channels": ChannelShape[];
        /**
          * fetch API credentials
         */
        "credentials": RequestCredentials;
        /**
          * List any filter functions applied to the data streams
         */
        "listFilters": () => Promise<any>;
        /**
          * fetch API request mode
         */
        "mode": RequestMode;
        /**
          * Polling interval to check URL for changes
         */
        "pollFrequency": number;
        /**
          * Rebroadcast latest cached payload to on all configured channels
         */
        "resendBroadcast": () => Promise<void>;
        /**
          * fetch API response format
         */
        "responseFormat": ResponseTypes;
        /**
          * Custom response handler
         */
        "responseHandler": DatastreamResponseHandler;
        /**
          * sets class `cronk-${this.type}-eventstream` on cronk-poll-datastream element
         */
        "type": string;
        /**
          * fetch API URL
         */
        "url": string | null;
    }
    interface CronkProportionBar {
        /**
          * Colour of the proportion bar
         */
        "color": string;
        /**
          * proportion ( 0 <= value <= 1)
         */
        "value": number;
    }
    interface CronkSelector {
        /**
          * Custom heading for the selector
         */
        "heading": string;
        /**
          * Label for each selectable - default 'COUNT'
         */
        "label": string;
        /**
          * Minimum number of selected members
         */
        "minimumSelection": number;
        /**
          * Should all selectable members be selected on initial render
         */
        "selectAllOnLoad": boolean;
        /**
          * a list of selectable members {select, label, count}[]
         */
        "selectList": SelectListMember[];
        /**
          * a value that will be used to filter data streams by
         */
        "selector": any;
    }
    interface CronkSimpleGrid {
        /**
          * Append items to the grid
         */
        "appendItems": () => Promise<void>;
        /**
          * How many new elements to attach to grid when the bottom is reached
         */
        "batchSize": number;
        /**
          * any[][] for data to be rendered in the table
         */
        "data": any[];
        /**
          * CSS display property
         */
        "display": 'grid' | 'auto';
        /**
          * Style settings for grid header row
         */
        "headerColour": 'primary' | 'secondary' | 'tertiary' | 'dark';
        /**
          * string[] of table headers
         */
        "headers": string[];
        /**
          * How many rows to render before scroll overflow kicks in
         */
        "rows": number;
        /**
          * How to sort columns
         */
        "sort": null | [number, string][];
    }
    interface CronkStatsbox {
        /**
          * Array of {label: string, value: JSONValue} for stats box headline values
         */
        "statsList": StatsBoxListItem[];
    }
    interface CronkTitle {
        /**
          * Specify a title
         */
        "reportTitle": string;
    }
    interface CronkVersion {
    }
}
declare global {
    interface HTMLCronkAppElement extends Components.CronkApp, HTMLStencilElement {
    }
    var HTMLCronkAppElement: {
        prototype: HTMLCronkAppElement;
        new (): HTMLCronkAppElement;
    };
    interface HTMLCronkDatastreamsElement extends Components.CronkDatastreams, HTMLStencilElement {
    }
    var HTMLCronkDatastreamsElement: {
        prototype: HTMLCronkDatastreamsElement;
        new (): HTMLCronkDatastreamsElement;
    };
    interface HTMLCronkErrormessageElement extends Components.CronkErrormessage, HTMLStencilElement {
    }
    var HTMLCronkErrormessageElement: {
        prototype: HTMLCronkErrormessageElement;
        new (): HTMLCronkErrormessageElement;
    };
    interface HTMLCronkEventStreamElement extends Components.CronkEventStream, HTMLStencilElement {
    }
    var HTMLCronkEventStreamElement: {
        prototype: HTMLCronkEventStreamElement;
        new (): HTMLCronkEventStreamElement;
    };
    interface HTMLCronkFunnelElement extends Components.CronkFunnel, HTMLStencilElement {
    }
    var HTMLCronkFunnelElement: {
        prototype: HTMLCronkFunnelElement;
        new (): HTMLCronkFunnelElement;
    };
    interface HTMLCronkListElement extends Components.CronkList, HTMLStencilElement {
    }
    var HTMLCronkListElement: {
        prototype: HTMLCronkListElement;
        new (): HTMLCronkListElement;
    };
    interface HTMLCronkManagedDatastreamElement extends Components.CronkManagedDatastream, HTMLStencilElement {
    }
    var HTMLCronkManagedDatastreamElement: {
        prototype: HTMLCronkManagedDatastreamElement;
        new (): HTMLCronkManagedDatastreamElement;
    };
    interface HTMLCronkPageElement extends Components.CronkPage, HTMLStencilElement {
    }
    var HTMLCronkPageElement: {
        prototype: HTMLCronkPageElement;
        new (): HTMLCronkPageElement;
    };
    interface HTMLCronkPageComponentsElement extends Components.CronkPageComponents, HTMLStencilElement {
    }
    var HTMLCronkPageComponentsElement: {
        prototype: HTMLCronkPageComponentsElement;
        new (): HTMLCronkPageComponentsElement;
    };
    interface HTMLCronkPagePanelElement extends Components.CronkPagePanel, HTMLStencilElement {
    }
    var HTMLCronkPagePanelElement: {
        prototype: HTMLCronkPagePanelElement;
        new (): HTMLCronkPagePanelElement;
    };
    interface HTMLCronkPollDatastreamElement extends Components.CronkPollDatastream, HTMLStencilElement {
    }
    var HTMLCronkPollDatastreamElement: {
        prototype: HTMLCronkPollDatastreamElement;
        new (): HTMLCronkPollDatastreamElement;
    };
    interface HTMLCronkProportionBarElement extends Components.CronkProportionBar, HTMLStencilElement {
    }
    var HTMLCronkProportionBarElement: {
        prototype: HTMLCronkProportionBarElement;
        new (): HTMLCronkProportionBarElement;
    };
    interface HTMLCronkSelectorElement extends Components.CronkSelector, HTMLStencilElement {
    }
    var HTMLCronkSelectorElement: {
        prototype: HTMLCronkSelectorElement;
        new (): HTMLCronkSelectorElement;
    };
    interface HTMLCronkSimpleGridElement extends Components.CronkSimpleGrid, HTMLStencilElement {
    }
    var HTMLCronkSimpleGridElement: {
        prototype: HTMLCronkSimpleGridElement;
        new (): HTMLCronkSimpleGridElement;
    };
    interface HTMLCronkStatsboxElement extends Components.CronkStatsbox, HTMLStencilElement {
    }
    var HTMLCronkStatsboxElement: {
        prototype: HTMLCronkStatsboxElement;
        new (): HTMLCronkStatsboxElement;
    };
    interface HTMLCronkTitleElement extends Components.CronkTitle, HTMLStencilElement {
    }
    var HTMLCronkTitleElement: {
        prototype: HTMLCronkTitleElement;
        new (): HTMLCronkTitleElement;
    };
    interface HTMLCronkVersionElement extends Components.CronkVersion, HTMLStencilElement {
    }
    var HTMLCronkVersionElement: {
        prototype: HTMLCronkVersionElement;
        new (): HTMLCronkVersionElement;
    };
    interface HTMLElementTagNameMap {
        "cronk-app": HTMLCronkAppElement;
        "cronk-datastreams": HTMLCronkDatastreamsElement;
        "cronk-errormessage": HTMLCronkErrormessageElement;
        "cronk-event-stream": HTMLCronkEventStreamElement;
        "cronk-funnel": HTMLCronkFunnelElement;
        "cronk-list": HTMLCronkListElement;
        "cronk-managed-datastream": HTMLCronkManagedDatastreamElement;
        "cronk-page": HTMLCronkPageElement;
        "cronk-page-components": HTMLCronkPageComponentsElement;
        "cronk-page-panel": HTMLCronkPagePanelElement;
        "cronk-poll-datastream": HTMLCronkPollDatastreamElement;
        "cronk-proportion-bar": HTMLCronkProportionBarElement;
        "cronk-selector": HTMLCronkSelectorElement;
        "cronk-simple-grid": HTMLCronkSimpleGridElement;
        "cronk-statsbox": HTMLCronkStatsboxElement;
        "cronk-title": HTMLCronkTitleElement;
        "cronk-version": HTMLCronkVersionElement;
    }
}
declare namespace LocalJSX {
    interface CronkApp {
        /**
          * Example file name
         */
        "report"?: string;
    }
    interface CronkDatastreams {
        /**
          * Array of stream configuration
         */
        "streams"?: Stream[];
        /**
          * Unique ID for stream
         */
        "streamsID"?: string;
    }
    interface CronkErrormessage {
        /**
          * Customised message for error reporting
         */
        "message"?: string;
    }
    interface CronkEventStream {
        /**
          * Event stream configuration
         */
        "config"?: Stream;
    }
    interface CronkFunnel {
        /**
          * Show/hide count
         */
        "hideCount"?: boolean;
        /**
          * Show/hide label
         */
        "hideLabel"?: boolean;
        /**
          * Show/hide percent
         */
        "hidePercent"?: boolean;
        /**
          * Show/hide stats
         */
        "hideStats"?: boolean;
        /**
          * {label, count}[] of members
         */
        "statsList"?: FunnelListItem[];
    }
    interface CronkList {
        /**
          * Show/hide bullets
         */
        "bullets"?: boolean;
        /**
          * any[] of items to list
         */
        "items"?: any[];
        /**
          * Render bullets as numbers (true) or not (discs)
         */
        "ordered"?: boolean;
        /**
          * reverse the provided order
         */
        "reverse"?: boolean;
    }
    interface CronkManagedDatastream {
        /**
          * Whether or not a datastream is affected by filters like cronk-selector
         */
        "acceptsFilters"?: boolean;
        /**
          * Channel configuration describing how broadcasts are constructed
         */
        "channels"?: ChannelShape[];
        /**
          * Stream data source managed externally to component
         */
        "data"?: JSONValue;
        /**
          * sets class `cronk-${this.type}-eventstream` on cronk-managed-datastream element
         */
        "type"?: string;
    }
    interface CronkPage {
        /**
          * broadcast to any listener (mostly datastreams) that the page has fully rendered and payloads should be rebroadcast to ensure the lated data is set on components
         */
        "onCronkPageReady"?: (event: CustomEvent<void>) => void;
        /**
          * Page configuration JSON
         */
        "pageConfig"?: ReportDefinition | string | undefined;
        /**
          * show or hide the configuration used to render the page
         */
        "showConfig"?: boolean;
        /**
          * enable/disable validation ot the cronkite schema
         */
        "validationEnabled"?: boolean;
    }
    interface CronkPageComponents {
        /**
          * Notify whe component has been finally rendered
         */
        "onComponentsLoaded"?: (event: CustomEvent<void>) => void;
    }
    interface CronkPagePanel {
        /**
          * Configuration for a specific component
         */
        "panelConfig"?: any;
    }
    interface CronkPollDatastream {
        /**
          * Whether or not a datastream is affected by filters like cronk-selector
         */
        "acceptsFilters"?: boolean;
        /**
          * Channel configuration describing how broadcasts are constructed
         */
        "channels"?: ChannelShape[];
        /**
          * fetch API credentials
         */
        "credentials"?: RequestCredentials;
        /**
          * fetch API request mode
         */
        "mode"?: RequestMode;
        /**
          * Polling interval to check URL for changes
         */
        "pollFrequency"?: number;
        /**
          * fetch API response format
         */
        "responseFormat"?: ResponseTypes;
        /**
          * Custom response handler
         */
        "responseHandler"?: DatastreamResponseHandler;
        /**
          * sets class `cronk-${this.type}-eventstream` on cronk-poll-datastream element
         */
        "type"?: string;
        /**
          * fetch API URL
         */
        "url"?: string | null;
    }
    interface CronkProportionBar {
        /**
          * Colour of the proportion bar
         */
        "color"?: string;
        /**
          * proportion ( 0 <= value <= 1)
         */
        "value"?: number;
    }
    interface CronkSelector {
        /**
          * Custom heading for the selector
         */
        "heading"?: string;
        /**
          * Label for each selectable - default 'COUNT'
         */
        "label"?: string;
        /**
          * Minimum number of selected members
         */
        "minimumSelection"?: number;
        /**
          * Should all selectable members be selected on initial render
         */
        "selectAllOnLoad"?: boolean;
        /**
          * a list of selectable members {select, label, count}[]
         */
        "selectList"?: SelectListMember[];
        /**
          * a value that will be used to filter data streams by
         */
        "selector"?: any;
    }
    interface CronkSimpleGrid {
        /**
          * How many new elements to attach to grid when the bottom is reached
         */
        "batchSize"?: number;
        /**
          * any[][] for data to be rendered in the table
         */
        "data"?: any[];
        /**
          * CSS display property
         */
        "display"?: 'grid' | 'auto';
        /**
          * Style settings for grid header row
         */
        "headerColour"?: 'primary' | 'secondary' | 'tertiary' | 'dark';
        /**
          * string[] of table headers
         */
        "headers"?: string[];
        /**
          * How many rows to render before scroll overflow kicks in
         */
        "rows"?: number;
        /**
          * How to sort columns
         */
        "sort"?: null | [number, string][];
    }
    interface CronkStatsbox {
        /**
          * Array of {label: string, value: JSONValue} for stats box headline values
         */
        "statsList"?: StatsBoxListItem[];
    }
    interface CronkTitle {
        /**
          * Specify a title
         */
        "reportTitle"?: string;
    }
    interface CronkVersion {
    }
    interface IntrinsicElements {
        "cronk-app": CronkApp;
        "cronk-datastreams": CronkDatastreams;
        "cronk-errormessage": CronkErrormessage;
        "cronk-event-stream": CronkEventStream;
        "cronk-funnel": CronkFunnel;
        "cronk-list": CronkList;
        "cronk-managed-datastream": CronkManagedDatastream;
        "cronk-page": CronkPage;
        "cronk-page-components": CronkPageComponents;
        "cronk-page-panel": CronkPagePanel;
        "cronk-poll-datastream": CronkPollDatastream;
        "cronk-proportion-bar": CronkProportionBar;
        "cronk-selector": CronkSelector;
        "cronk-simple-grid": CronkSimpleGrid;
        "cronk-statsbox": CronkStatsbox;
        "cronk-title": CronkTitle;
        "cronk-version": CronkVersion;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "cronk-app": LocalJSX.CronkApp & JSXBase.HTMLAttributes<HTMLCronkAppElement>;
            "cronk-datastreams": LocalJSX.CronkDatastreams & JSXBase.HTMLAttributes<HTMLCronkDatastreamsElement>;
            "cronk-errormessage": LocalJSX.CronkErrormessage & JSXBase.HTMLAttributes<HTMLCronkErrormessageElement>;
            "cronk-event-stream": LocalJSX.CronkEventStream & JSXBase.HTMLAttributes<HTMLCronkEventStreamElement>;
            "cronk-funnel": LocalJSX.CronkFunnel & JSXBase.HTMLAttributes<HTMLCronkFunnelElement>;
            "cronk-list": LocalJSX.CronkList & JSXBase.HTMLAttributes<HTMLCronkListElement>;
            "cronk-managed-datastream": LocalJSX.CronkManagedDatastream & JSXBase.HTMLAttributes<HTMLCronkManagedDatastreamElement>;
            "cronk-page": LocalJSX.CronkPage & JSXBase.HTMLAttributes<HTMLCronkPageElement>;
            "cronk-page-components": LocalJSX.CronkPageComponents & JSXBase.HTMLAttributes<HTMLCronkPageComponentsElement>;
            "cronk-page-panel": LocalJSX.CronkPagePanel & JSXBase.HTMLAttributes<HTMLCronkPagePanelElement>;
            "cronk-poll-datastream": LocalJSX.CronkPollDatastream & JSXBase.HTMLAttributes<HTMLCronkPollDatastreamElement>;
            "cronk-proportion-bar": LocalJSX.CronkProportionBar & JSXBase.HTMLAttributes<HTMLCronkProportionBarElement>;
            "cronk-selector": LocalJSX.CronkSelector & JSXBase.HTMLAttributes<HTMLCronkSelectorElement>;
            "cronk-simple-grid": LocalJSX.CronkSimpleGrid & JSXBase.HTMLAttributes<HTMLCronkSimpleGridElement>;
            "cronk-statsbox": LocalJSX.CronkStatsbox & JSXBase.HTMLAttributes<HTMLCronkStatsboxElement>;
            "cronk-title": LocalJSX.CronkTitle & JSXBase.HTMLAttributes<HTMLCronkTitleElement>;
            "cronk-version": LocalJSX.CronkVersion & JSXBase.HTMLAttributes<HTMLCronkVersionElement>;
        }
    }
}
