import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
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

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
