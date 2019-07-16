import React from 'react';
import GridLayout from 'react-grid-layout';
import './App.css';

const dummy = {
  streams: [
    {type: 'telemetry', flavour: 'qc'}
  ],
  components: [{
    listen: 'datastream:telemetry',
    element: 'epi-headlinevalue',
    '@label': 'Total reads',
    '@value': '$.data.count',
    layout: {x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4}
  }]
}

const idWorkflowInstance = 200222;
// const url = 'https://epi2me.nanoporetech.com/workflow_instance/200222/basecalling_1d_barcode-v1.json'



function App() {
  return (
    <React.Fragment>
      {
        dummy.streams.map(({type, flavour}) => <epi-datastream
          key={`${idWorkflowInstance}-${type}-${flavour}`}
          type={type}
          flavour={flavour}
          id-subject={idWorkflowInstance}
          poll-frequency="25000"
          ></epi-datastream>
        )
      }
      </React.Fragment>
  );
  <GridLayout className="layout" cols={7} rowHeight={30} width={1200}>
    {
      dummy.components.map(props => <ReportComponent {...props}/>)
    }
  </GridLayout>
}

export default App;


