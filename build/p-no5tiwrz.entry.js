import{r as t,h as e,c as s}from"./p-f24f087d.js";var a;!function(t){t.telemetry="telemetry",t.status="status"}(a||(a={}));const n=t=>t.toLowerCase().replace("bc","bc").replace("na","no barcode"),r={default:{transformFlatten:t=>async({type:e,data:s,version:a,key:n},{channels:r,dispatch:c,filters:l})=>{let i=s.map(t=>Object.assign(t,...t.key.map((t,e)=>({[n[e]]:t}))));l.length&&(i=i.filter(t=>l.map(e=>e(t)).every(t=>t))),c(`${r}:${e}:${a}`,t,{data:i}),i=null}},status:{},telemetry:{transformAndEmitQCData:t=>async({type:e,data:s,version:a,key:r},{channels:c,dispatch:l,filters:i})=>{let o=s.map(t=>Object.assign(t,...t.key.map((t,e)=>{const s=r[e];return{[s]:"barcode"===s?n(t):t}})));i.length&&(o=o.filter(t=>i.map(e=>e(t)).every(t=>t)));let d=o.reduce((t,e)=>{const{barcode:s}=e;return Object.assign(Object.assign({},t),{[s]:t[s]?[...t[s],e]:[e]})},{});l(`${c}:${e}:${a}`,t,{data:o}),l(`${c}:${e}:${a}:barcodes`,t,{barcodeIds:Object.keys(d),barcodes:Object.entries(d).map(([t,e])=>({label:t,payload:e}))}),o=null,d=null},transformAndEmitSimpleAlignerData:t=>async({type:e,data:s,version:a,key:n},{channels:r,dispatch:c,filters:l})=>{let i=s.map(t=>Object.assign(t,...t.key.map((t,e)=>({[n[e]]:t}))));l.length&&(i=i.filter(t=>l.map(e=>e(t)).every(t=>t)));let o=i.reduce((t,e)=>{const{barcode:s}=e;return Object.assign(Object.assign({},t),{[s]:t[s]?[...t[s],e]:[e]})},{});c(`${r}:${e}:${a}`,t,{data:i}),c(`${r}:${e}:${a}:barcodes`,t,{barcodeIds:Object.keys(o),barcodes:Object.entries(o).map(([t,e])=>({label:t,payload:e}))}),i=null,o=null}}},c=class{constructor(e){t(this,e),this.type="default",this.channel="instance:default",this.credentials="include",this.mode="cors",this.pollFrequency=15e3}getResponseHandler(){switch(this.type){case a.telemetry:return r.telemetry;case a.status:return r.status;default:return r.default}}getPayloadResponseHandler(){const t=this.getResponseHandler();switch(this.flavour){case"basecalling_1d_barcode-v1":return t.transformAndEmitQCData(this.hostEl);case"simple_aligner_barcode_compact_quick-v1":return t.transformAndEmitSimpleAlignerData(this.hostEl);default:return t.transformFlatten(this.hostEl)}}render(){if(!this.type||!this.flavour||!this.idWorkflowInstance)return null;const t=`https://${location.host}/workflow_instance/${this.idWorkflowInstance}/${this.flavour}.json`;return e("cronk-poll-datastream",{credentials:this.credentials,responseHandler:this.getPayloadResponseHandler(),type:this.type,url:t,channels:[{channel:this.channel}]})}get hostEl(){return s(this)}};export{c as epi_instance_datastream};