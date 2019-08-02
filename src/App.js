import React, {useEffect, useState} from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import uuidv4 from 'uuid/v4';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import ReportComponent from './components/ReportComponent'
import ReportStream from './components/ReportStream'
import './App.scss';
import {loadDashboardLayout, saveDashboardLayout} from './utils';

const DEFAULT_LAYOUT = {
  x: 4,
  y: 4,
  w: 4,
  h: 2
}
const ResponsiveGridLayout = WidthProvider(Responsive);


const DashboardApp = props => {

  const [dashboardConfig, setDashboardConfig] = useState(props.dashboardConfig || null)
  const [autoSave] = useState(true)

  useEffect(() => {
    const fetchDashboardConfig = async () => {
      const reportLayout = await loadDashboardLayout(null, 'helloWorld');
      setDashboardConfig(reportLayout)
    }
    if (dashboardConfig === null) {
      fetchDashboardConfig()
    }
    if (dashboardConfig !== null && props.dashboardConfig !== null && dashboardConfig !== props.dashboardConfig) {
      const {id: dashboardId} = dashboardConfig;
      saveDashboardLayout(dashboardId, dashboardConfig)
    }
    return () => {
      // cleanup
    };
  }, [dashboardConfig, props])

  return dashboardConfig ? (
    <React.Fragment>
      {
        dashboardConfig.streams.map((streamProps, i) =>
          <ReportStream key={`${streamProps.element || 'stream'}-${i}`} {...streamProps}></ReportStream>
        )
      }
      <ResponsiveGridLayout
        className="layout"
        // breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 4, md:4, sm: 4, xs: 2, xxs: 1}}
        rowHeight={80}
        onResizeStop={(
          _,
          newItem,
          ) => {
          const { i } = newItem
          const vizComponent = document.getElementById(i);
          if (!vizComponent) {
            console.info("COULDN'T FIND VIZ COMPONENT", newItem);
            return
          }
          const {width, height} = vizComponent.parentNode.getBoundingClientRect()
          if (vizComponent.tagName.toLowerCase()=== 'epi-donutsummary') {
            const minDimension = Math.floor(Math.min(width - 20, height - 20));
            vizComponent.width = minDimension;
            vizComponent.height = minDimension;
            return;
          }
          vizComponent.width = Math.floor(width * 0.6);
          vizComponent.height = Math.floor((height - 20) * 0.6);
        }}
        onLayoutChange={(newLayout) => {
          dashboardConfig.components = dashboardConfig.components.map((componentDef, i) => Object.assign({}, componentDef, { layout: newLayout[i] }))
          autoSave && saveDashboardLayout(dashboardConfig.id || null,  dashboardConfig)
        }}
      >
        {
          dashboardConfig.components.map((compDef, i) => {
          const componentDefinition = compDef.layout ? compDef : {...compDef, layout: DEFAULT_LAYOUT}
          const uuid = componentDefinition.layout.i || uuidv4();
          return (<div className="component-panel"  style={{display: componentDefinition.hidden ? 'none' : 'initial' }}  key={uuid} data-grid={componentDefinition.layout}>
              <ReportComponent id={uuid} {...componentDefinition} />
            </div>)
          })
        }
      </ResponsiveGridLayout>
    </React.Fragment>
  ) : null;
};

export default DashboardApp;
