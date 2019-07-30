import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import DashboardApp from './App';
import { defineCustomElements as defineDatastreamElements } from 'epi2me-ui-datastream/loader';
import { defineCustomElements as defineHeadlinevalueElements } from 'epi2me-ui-headlinevalue/loader';
import { defineCustomElements as defineCoverageplotElements } from 'epi2me-ui-coverageplot/loader';
import { defineCustomElements as defineCheckmarkElements } from 'epi2me-ui-checkmark/loader';
import { defineCustomElements as defineDonutElements } from 'epi2me-ui-donut/loader';
import * as serviceWorker from './serviceWorker';

defineDatastreamElements(window);
defineHeadlinevalueElements(window);
defineCoverageplotElements(window);
defineCheckmarkElements(window);
defineDonutElements(window);

const DEFAULT_DASHBOARD_ID = 'epi2me:default:dashboard';
const rootEl = document.getElementById('root')
let dashboardConfig = null;

// First get config set on the node
try {
    console.debug("Trying load from dataset")
    dashboardConfig = JSON.parse(rootEl.dataset.dashboardConfig)
    console.debug("Dataset loaded", dashboardConfig)
} catch (ignore) { }

// If the node has no config then try fetch it from local storage
if (! dashboardConfig) {
    try {
        console.debug("Trying load from localstorage")
        dashboardConfig = !dashboardConfig && JSON.parse(localStorage.getItem(DEFAULT_DASHBOARD_ID))
        console.debug("localstorage loaded", dashboardConfig)
    } catch (ignore) { }
}

// Fallback to empty config
if (! dashboardConfig) {
    console.debug('Fallback to default EMPTY config', dashboardConfig)
    dashboardConfig = { id: DEFAULT_DASHBOARD_ID, streams: [], components: [] };
}

ReactDOM.render(<DashboardApp dashboardConfig={dashboardConfig}/>, rootEl);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
