import React, { useEffect, useRef, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import uuidv4 from 'uuid/v4';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import Selector from './components/Selector'
import './App.css';
import {loadReportLayout, mapAttributesToProps, saveReportLayout} from './utils';

const ResponsiveGridLayout = WidthProvider(Responsive);
// const idWorkflowInstance = 207139;
const idWorkflowInstance = 207024;
// const idWorkflowInstance = 207357;

const ReportComponent = function (props) {
  const {element: CustomElement, listen, hidden, ...attributes} = props;
  const customElRef = useRef();
  const [customElProps, setCustomRefProps] = useState({});

  const eventHandler = async (event) => {
    const { detail } = event
    if (!detail) return
    const newProps = await mapAttributesToProps(attributes, detail)
    setCustomRefProps(newProps)
  }

  useEffect(() => {
    listen && window.addEventListener(listen, eventHandler);
    return function cleanup() {
      window.removeEventListener(listen, eventHandler);
    };
  });

  return CustomElement === 'Selector'
  ? <Selector ref={customElRef} {...customElProps}></Selector>
  : <CustomElement id={props.id} ref={customElRef} {...customElProps} ></CustomElement>
}

function App() {
  const reportLayout = loadReportLayout(idWorkflowInstance, 'qc');
  const autoSaveLayout = false;
  return (
    <React.Fragment>
      {
        reportLayout.streams.map(({type, flavour}) => <epi-datastream
          key={`${idWorkflowInstance}-${type}-${flavour}`}
          type={type}
          flavour={flavour}
          id-subject={idWorkflowInstance}
          poll-frequency="25000"
          ></epi-datastream>
        )
      }
      <ResponsiveGridLayout
        className="layout"
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 24, md:20, sm: 12, xs: 8, xxs: 2}}
        rowHeight={5}
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
          vizComponent.width = Math.floor(width);
          vizComponent.height = Math.floor(height - 10);
        }}
        onLayoutChange={(newLayout) => {
          reportLayout.components = reportLayout.components.map((componentDef, i) => Object.assign({}, componentDef, { layout: newLayout[i] }))
          autoSaveLayout && saveReportLayout(idWorkflowInstance, reportLayout)
        }}
      >
        {
          reportLayout.components.map((compDef, i) => {
          const uuid = compDef.layout.i || uuidv4();
          return (<div className="component-panel"  style={{display: compDef.hidden ? 'none' : 'initial' }}  key={uuid} data-grid={compDef.layout}>
              <ReportComponent id={uuid} {...compDef} />
            </div>)
          })
        }
      </ResponsiveGridLayout>
    </React.Fragment>
  );
}

export default App;
