import{r as t,h as e}from"./p-f24f087d.js";import{C as s}from"./p-5dec669d.js";const a={colour:s,width:300},i=class{constructor(e){t(this,e),this.data=[],this.width=300}setDataHandler(t){"string"==typeof this.data&&(this.data=this.validateData(t))}componentWillLoad(){"string"==typeof this.data&&(this.data=this.validateData(this.data))}validateData(t){let e=t;if("string"==typeof t)try{e=JSON.parse(t)}catch(s){e=[],console.warn("Could not process data",s.message)}return e.sort((t,e)=>e.value-t.value).reduce((t,s,i)=>{if(e.length<=a.colour.length||i<a.colour.length)return[...t,s];let[n,...r]=t.reverse();return[n=Object.assign(n,{name:"Other",value:n.value||0+s.value||0}),...r].reverse()},[])}render(){if(!this.data||"string"==typeof this.data)return null;const t=this.data.reduce((t,e)=>t+e.value||0,0),s=this.validateData(this.data),i=this.width||a.width,n=18/a.width;return e("div",{class:"donutsummary-container",style:{minWidth:`${i}px`,fontSize:`calc(${n} * ${i}px)`}},e("div",{class:"donutsummary-legend-container",style:{minHeight:`calc(${i}px - calc(${n} * 7rem))`,minWidth:`calc(${i}px - calc(${n} * 7rem))`,transform:`translateY(calc(${n} * 3.6rem))`}},s.length?e("slot",{name:"donut-legend"},e("div",{class:"legend-list"},s.sort((t,e)=>e.value-t.value).map(({name:s,value:r,colour:l,color:c},o)=>e("li",{class:"legend-item",key:s},e("span",{class:"legend-percentage"},(r/t*100).toFixed(0),"%"),e("span",{class:"legend-icon",role:"presentation",style:{backgroundColor:l||c||a.colour[o],minHeight:`calc(${n} * ${i}px)`,minWidth:`calc(${n} * ${i}px)`}}),e("span",{class:"legend-label"},s))))):null),e("div",{class:"donutsummary-image-container"},e("epi-donutimage",{width:this.width,height:this.width,data:s,"inner-radius":"80"})))}static get watchers(){return{data:["setDataHandler"]}}static get style(){return":host{--epi-donut-background-color:var(--epi2me-background-color,transparent)}.donutsummary-container{display:-ms-flexbox;display:flex;-ms-flex-flow:row wrap;flex-flow:row wrap;width:-webkit-min-content;width:-moz-min-content;width:min-content;-ms-flex:0 1 auto;flex:0 1 auto;-ms-flex-pack:center;justify-content:center;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;line-height:1.7;margin:0 auto;color:#555}.donutsummary-container .donutsummary-image-container{z-index:0}.donutsummary-container .donutsummary-legend-container{display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-line-pack:center;align-content:center;-ms-flex:0 1 auto;flex:0 1 auto;-ms-flex-flow:row wrap;flex-flow:row wrap;position:absolute;z-index:1;-webkit-transform:translateY(3.5rem);transform:translateY(3.5rem)}.donutsummary-container .donutsummary-legend-container .legend-list{list-style:circle;list-style:none;margin:0;padding:0;width:60%}.donutsummary-container .donutsummary-legend-container .legend-list .legend-item{display:-ms-flexbox;display:flex;-ms-flex:1;flex:1;-ms-flex-pack:end;justify-content:flex-end;-ms-flex-align:center;align-items:center;width:100%}.donutsummary-container .donutsummary-legend-container .legend-list .legend-item .legend-percentage{text-align:right;margin-right:5%}.donutsummary-container .donutsummary-legend-container .legend-list .legend-item .legend-icon{display:inline-block;border-radius:50%;margin-right:5%}.donutsummary-container .donutsummary-legend-container .legend-list .legend-item .legend-label{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;min-width:60%;max-width:60%;text-align:left}.donutsummary-container .donutsummary-legend-container .legend-list .legend-item .legend-label:hover{overflow:visible}"}};export{i as epi_donutsummary};