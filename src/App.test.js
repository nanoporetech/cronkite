import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import DashboardApp from './App';

const DEFAULT_CONFIG = {
  components:[],
  streams: []
}

it('renders without crashing', () => {
  act(() => {
    const div = document.createElement('div');
    document.body.append(div)
    ReactDOM.render(<DashboardApp dashboardConfig={DEFAULT_CONFIG} />, div);
    ReactDOM.unmountComponentAtNode(div);
  })
});
