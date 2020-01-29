import{r as t,h as s,c as a,H as i}from"./p-f24f087d.js";import"./p-a5a6d918.js";import{p as e}from"./p-4f8d6af9.js";const h={"fn:jmespath":"@"},n=[{channel:"cronkite:stream",shape:h}],r=class{constructor(s){t(this,s),this.eTag="STARTER - ETAG",this.cachedResponse=null,this.cachedBroadcasts={},this.filters={},this.dispatch=async(t,s,a)=>{const i=new CustomEvent(t||"cronkite:stream",{bubbles:!0,composed:!0,detail:a});s.dispatchEvent(i)},this.type="data",this.url=null,this.channels=n,this.acceptsFilters=!1,this.credentials="include",this.mode="cors",this.pollFrequency=15e3,this.corsProxy="",this.responseHandler=async(t,s)=>{const{channels:a,dispatch:i,filters:n}=s;let r;a.forEach(async s=>{r=await e(t,s.shape||h),(void 0===s.filtered||s.filtered)&&n.length&&Array.isArray(r)&&(r=r.filter(t=>n.map(s=>s(t)).every(t=>t))),this.cachedBroadcasts[s.channel]=((t,s,a)=>async()=>{i(t,s,a)})(s.channel,this.hostEl,r),this.cachedBroadcasts[s.channel]()})},this.requestHandler=async t=>await fetch(this.url,{body:null,cache:"force-cache",credentials:this.credentials,headers:{accept:"application/json"},method:t.toUpperCase(),mode:this.mode}),this.requestSuccess=t=>{const s=t.status;return s>=200&&s<400},this.fetchData=async()=>{let t=null;try{t=await this.requestHandler("GET")}catch(a){console.error("Error (GET request)",a,t)}if(!t)return;const s=await t.json();this.cachedResponse=s,await this.broadcast(s)},this.pollData=async()=>{let t=null;try{t=await this.requestHandler("HEAD")}catch(a){console.error("Error (HEAD request)",a,t)}if(!t)return;const s=t.headers.get("etag")||"";s!==this.eTag&&(await this.fetchData(),this.eTag=s)}}async listFilters(){return this.filters}async addFilter(t,s){this.filters[t]=s,await this.broadcast(this.cachedResponse)}async resendBroadcast(){Object.values(this.cachedBroadcasts).forEach(t=>t())}async broadcast(t){t&&await this.responseHandler(t,{channels:this.channels,dispatch:this.dispatch,filters:Object.values(this.filters),type:this.type})}async initDataStream(){this.url&&(this.intervalID=setInterval(this.pollData,this.pollFrequency),await this.pollData())}async componentWillUpdate(){clearInterval(this.intervalID),await this.initDataStream()}componentDidUnload(){this.filters={},clearInterval(this.intervalID)}async componentDidLoad(){this.url&&await this.initDataStream()}render(){return s(i,{"aria-hidden":"true",class:{"cronk-filtered-datastream":this.acceptsFilters,[`cronk-${this.type}-eventstream`]:!0}})}get hostEl(){return a(this)}};export{r as cronk_poll_datastream};