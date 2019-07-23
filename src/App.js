import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import uuidv4 from 'uuid/v4';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import ReportComponent from './components/ReportComponent'
import ReportStream from './components/ReportStream'
import './App.css';
import {loadReportLayout, saveReportLayout} from './utils';

const DEFAULT_LAYOUT = {
  x: 0,
  y: 0,
  w: 8,
  h: 2
}
const ResponsiveGridLayout = WidthProvider(Responsive);

// const idWorkflowInstance = 207139;
// const idWorkflowInstance = 207024;
// const idWorkflowInstance = 207357;
const idWorkflowInstance = 207912;


function App() {
  const reportLayout = loadReportLayout(idWorkflowInstance, 'qc');
  const autoSaveLayout = true;
  return (
    <React.Fragment>
      {
        reportLayout.streams.map((streamProps, i) =>
          <ReportStream key={`${streamProps.element || 'stream'}-${i}`} idSubject={idWorkflowInstance} {...streamProps}></ReportStream>
        )
      }
      <ResponsiveGridLayout
        className="layout"
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 24, md:20, sm: 12, xs: 8, xxs: 2}}
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
          reportLayout.components = reportLayout.components.map((componentDef, i) => Object.assign({}, componentDef, { layout: newLayout[i] }))
          autoSaveLayout && saveReportLayout(idWorkflowInstance, reportLayout)
        }}
      >
        {
          reportLayout.components.map((compDef, i) => {
          const componentDefinition = compDef.layout ? compDef : {...compDef, layout: DEFAULT_LAYOUT}
          const uuid = componentDefinition.layout.i || uuidv4();
          return (<div className="component-panel"  style={{display: componentDefinition.hidden ? 'none' : 'initial' }}  key={uuid} data-grid={componentDefinition.layout}>
              <ReportComponent id={uuid} {...componentDefinition} />
            </div>)
          })
        }
      </ResponsiveGridLayout>
    </React.Fragment>
  );
}

export default App;
