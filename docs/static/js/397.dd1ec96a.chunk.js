"use strict";(self.webpackChunkbuckets=self.webpackChunkbuckets||[]).push([[397],{7397:(t,e,a)=>{a.a(t,(async(t,r)=>{try{a.r(e),a.d(e,{default:()=>_});a(5760);var n=a(5043),s=a(3999),i=a(5111),l=a(7595),c=a(1146),o=a(6823),p=a(3394),d=a(3950),m=a(8704),u=a(579),A=t([d,m]);function _(){const[t,e]=(0,n.useState)(o.A.DEFAULT_OBJECTIVE),[a,r]=(0,n.useState)(!1),s=(0,m.A)(t,a),i=(0,d.R)(s,t,a);return(0,n.useEffect)((function(){(0,p.f2)(".bucket-wrapper, .vardrop, .var-scen-label, .vardrop .dot-histogram-wrapper, .main-histogram, .tut-drop-graphics-wrapper"),s.setReadyHash((t=>t+1))}),[t,a]),(0,u.jsxs)("div",{className:"tutorial-view",children:[(0,u.jsx)(v,{val:t,setVal:e,options:Object.keys(o.A.SELECTED_OBJS).map((t=>({options:t,display_name:o.A.SELECTED_OBJS[t]})))}),(0,u.jsx)(T,{label:"normalize across scenarios",val:a,setVal:r}),(0,u.jsxs)("div",{className:"scrollama scrollama-1",children:[(0,u.jsx)(g,{curObjective:t,normalized:a,tutorialState:s}),(0,u.jsx)(f,{slides:i})]})]})}function g(t){let{curObjective:e,tutorialState:a}=t;const{maxDelivs:r,minDelivs:s}=a,i=(0,n.useMemo)((()=>({data:a.objectiveDelivs,domain:[s,r]})),[a.objectiveDelivs]),l=(0,n.useMemo)((()=>o.A.VARIATIONS.map((t=>({...t,interper:a.variationInterpers[t.idx],histData:{data:a.objectiveVariationDelivs[t.idx],domain:[s,r]}})))),[a.objectiveVariationDelivs,a.variationInterpers]);return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(I,{label:o.A.SELECTED_OBJS[e],bucketInterper:a.bucketInterper}),(0,u.jsx)(x,{label:o.A.SELECTED_OBJS[e],mainDropInterper:a.dropInterper,mainHistData:i,variations:l})]})}function f(t){let{slides:e}=t;return(0,u.jsx)(j,{cleanupFn:()=>{for(let a=e.length-1;a>=0;a--){var t;null===(t=e[a].animHandler)||void 0===t||t.undo()}},children:e.map(((t,e)=>(0,u.jsx)(s.p,{data:t,children:(0,u.jsx)(R,{slide:t})},e)))})}function v(t){let{val:e,setVal:a,options:r}=t;return(0,u.jsx)("select",{value:e,onChange:t=>a(t.target.value),children:r.map(((t,e)=>{let{option:a,display_name:r}=t;return(0,u.jsx)("option",{value:a,children:r},e)}))})}function T(t){let{label:e,val:a,setVal:r}=t;return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)("label",{htmlFor:"normalize",children:e}),(0,u.jsx)("input",{checked:a,onChange:t=>r(t.target.checked),type:"checkbox",name:"normalize",id:"normalize"})]})}function x(t){let{label:e,mainDropInterper:a,mainHistData:r,variations:n}=t;return(0,u.jsxs)("div",{className:"tut-drop-graphics-wrapper",children:[(0,u.jsx)(b,{dropInterper:a,histData:r,label:e}),n.map(((t,e)=>(0,u.jsx)(y,{variation:t},e)))]})}function b(t){let{dropInterper:e,histData:a,label:r}=t;return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)("div",{className:"main-waterdrop",children:(0,u.jsx)(c.A,{levelInterp:e,width:400,height:o.A.BAR_CHART_HEIGHT,colorInterp:o.A.INTERP_COLOR})}),(0,u.jsx)("div",{className:"main-histogram",children:(0,u.jsx)(l.A,{width:330,height:220,data:a.data,domain:a.domain})}),(0,u.jsx)("p",{className:"fancy-font objective-label",children:r})]})}function y(t){let{variation:e}=t;const{idx:a,clas:r,desc:n,interper:s,histData:i}=e;return(0,u.jsxs)("div",{className:"vardrop ".concat(r),desc:n,children:[(0,u.jsxs)("div",{children:[(0,u.jsx)(c.A,{levelInterp:s,width:200,height:o.A.BAR_CHART_HEIGHT/2,colorInterp:o.A.INTERP_COLOR}),(0,u.jsx)(l.A,{width:330,height:220,data:i.data,domain:i.domain})]}),(0,u.jsx)("p",{className:"var-scen-label",children:n})]},a)}function I(t){let{label:e,bucketInterper:a}=t;return(0,u.jsx)("div",{className:"tut-graph-wrapper",children:(0,u.jsxs)("div",{className:"tut-graph",children:[(0,u.jsx)("svg",{id:"pag-bar-graph"}),(0,u.jsx)(i.A,{levelInterp:a,width:300,height:o.A.BAR_CHART_HEIGHT,colorInterp:o.A.INTERP_COLOR}),(0,u.jsx)("p",{className:"fancy-font objective-label",children:e})]})})}function j(t){let{cleanupFn:e,children:a}=t;return(0,u.jsxs)(s.h,{offset:.9,onStepEnter:async t=>{var e;let{data:a,direction:r}=t;"up"!==r&&(null===(e=a.animHandler)||void 0===e||e.do())},onStepExit:async t=>{var e;let{data:a,direction:r}=t;"down"!==r&&(null===(e=a.animHandler)||void 0===e||e.undo())},children:[a,(0,u.jsx)(s.p,{data:{},children:(0,u.jsx)(L,{cleanupFn:e})},"last")]})}[d,m]=A.then?(await A)():A;const R=(0,n.forwardRef)((function(t,e){let{slide:a}=t;return(0,u.jsx)("div",{ref:e,className:"tut-text-card",children:a.text})})),L=(0,n.forwardRef)((function(t,e){let{cleanupFn:a}=t;return(0,u.jsx)("div",{ref:e,className:"tut-text-card",style:{marginBottom:"40vh"},children:(0,u.jsx)("button",{onClick:()=>{window.scrollTo(0,0),a()},children:"Back to Top"})})}));r()}catch(h){r(h)}}))},4554:(t,e,a)=>{a.a(t,(async(t,r)=>{try{a.d(e,{Vk:()=>i,Zl:()=>l,jx:()=>o});var n=a(7343),s=t([n]);n=(s.then?(await s)():s)[0];const i="scens",l="delivs",c="delivs_unord",o=await async function(){const t=await(await fetch("./select_complete_objectives.json")).json();for(const e of t){for(const t of e[i])t[c]=Array.from(t[l]),t[l]=Array.from(t[l]).sort(((t,e)=>e-t));e[i]=(0,n.Et)(e[i],(t=>{let{name:e}=t;return e}))}return console.log("DATA: loading objectives data"),(0,n.Et)(t,(t=>{let{obj:e}=t;return e}))}();Object.keys(o),Object.keys(Object.values(o)[0][i]);r()}catch(i){r(i)}}),1)},7595:(t,e,a)=>{a.d(e,{A:()=>p});var r=a(5760),n=a(5043),s=a(4987),i=a(579);const l=20,c={top:10,right:10,bottom:10,left:60},o={draw:function(t,e){t.moveTo(0,-e/2),t.lineTo(e/4,-e/4),t.arc(0,0,e/Math.SQRT2/2,-Math.PI/4,5*Math.PI/4),t.lineTo(0,-e/2),t.closePath()}};function p(t){let{data:e,domain:a=[0,r.max(e)],width:p=600,height:d=400}=t;const m=(0,n.useRef)(),u=(0,n.useMemo)((()=>(0,s.u)(e,a,e.length/l,d,p)),[e,a]),A=[0,e.length],h=r.scaleLinear().domain(A).range([0,p]),_=r.scaleLinear().domain(a).range([d,0]);return(0,n.useEffect)((()=>{m.current.selectAll("*").remove();m.current.attr("width",p+c.left+c.right).attr("height",d+c.top+c.bottom).style("pointer-events","none").append("g").attr("class","graph-area").attr("transform","translate(".concat(c.left,",").concat(c.top,")")).append("g").call(r.axisLeft().scale(_).tickFormat(r.format(".2s"))).call((t=>{t.selectAll("line").attr("stroke","gray"),t.selectAll("path").attr("stroke","gray"),t.selectAll("text").attr("fill","gray")})).append("text").attr("fill","black").attr("font-size","2em").attr("transform","translate(".concat(-(c.left-5),", ").concat(d/2,") rotate(-90)")).attr("text-anchor","middle").attr("dominant-baseline","hanging").text("Deliveries (TAF)")}),[e,a]),(0,n.useEffect)((()=>{const t=m.current.select(".graph-area").selectAll(".icons").data(u).join((t=>t.append("g").call((t=>t.append("path"))))).attr("class","icons").call((t=>{t.selectAll("path").attr("d",r.symbol(o,d/l))}));t.attr("transform",(t=>"translate(".concat(h(t[1]),",").concat(_(t[0]),")"))),t.attr("fill","steelblue")}),[u]),(0,i.jsx)("div",{className:"dot-histogram-wrapper",children:(0,i.jsx)("svg",{ref:t=>{m.current=r.select(t)}})})}},6823:(t,e,a)=>{a.d(e,{A:()=>n});a(5760);function r(t,e){let{scen_num_str:a,desc:r}=t;return{idx:e,scen_num_str:a,desc:r,scen_str:"expl".concat(a),clas:"drop".concat(e+1)}}const n={BAR_CHART_WIDTH:500,BAR_CHART_HEIGHT:400,INTERP_COLOR:a(1684).YW,DEFAULT_OBJECTIVE:"DEL_NOD_AG_TOTAL",BASELINE_SCENARIO:"expl0000",VARIATIONS:[{scen_num_str:"0004",desc:"natural flows"},{scen_num_str:"0015",desc:"reduce delta regs."},{scen_num_str:"0320",desc:"prioritize carryover"},{scen_num_str:"0360",desc:"municipal priority"},{scen_num_str:"0261",desc:"rebalancing"}].map(r),SELECTED_OBJS:{DEL_NOD_AG_TOTAL:"DEL_NOD_AG_TOTAL",DEL_SJV_AG_TOTAL:"DEL_SJV_AG_TOTAL",DEL_NOD_MI_TOTAL:"DEL_NOD_MI_TOTAL",DEL_SJV_MI_TOTAL:"DEL_SJV_MI_TOTAL",DEL_SOCAL_MI_TOTAL:"DEL_SOCAL_MI_TOTAL",CVP_SWP_EXPORTS:"CVP_SWP_EXPORTS",NDO:"NDO",SAC_IN:"SAC_IN",SJR_IN:"SJR_IN",STO_NOD_TOTAL:"STO_NOD_TOTAL",STO_SOD_TOTAL:"STO_SOD_TOTAL"}}},7479:(t,e,a)=>{a.a(t,(async(t,r)=>{try{a.d(e,{W:()=>A});var n=a(5760),s=a(4554),i=a(6823),l=a(3394),c=a(63),o=(a(1684),a(7343)),p=t([s,c,o]);[s,c,o]=p.then?(await p)():p;const m="expl0000";function u(){return{initChartAnimGroup:function(t){let e,a,r,l,o,{deps:p,objective:d,normalized:u}=t;const A=40,h=30,_=40,g=60;return function(){{n.select("#pag-bar-graph > *").remove();const t=n.select("#pag-bar-graph").attr("width",i.A.BAR_CHART_WIDTH+g+h).attr("height",i.A.BAR_CHART_HEIGHT+A+_).attr("opacity",1).append("g").attr("class","svg-group").attr("transform","translate(".concat(g,",").concat(A,")")),u=s.jx[d][c.Vk][m][c.sQ];o=p.maxDelivs,l=p.minDelivs;const f=u.map(((t,e)=>({val:t,placeFromLeft:e,year:e+1}))).sort(((t,e)=>e.val-t.val)),v=n.scaleBand().domain(f.map((t=>{let{year:e}=t;return e})).sort(((t,e)=>t-e))).range([0,i.A.BAR_CHART_WIDTH]).padding(.4),T=n.scaleLinear().domain([l,o]).range([i.A.BAR_CHART_HEIGHT,0]),x=n.axisBottom(v).tickSize(0).tickFormat((t=>"year ".concat(t))).tickValues(v.domain().filter(((t,e)=>0===e||(e+1)%10===0)));t.append("g").attr("class","anim-xaxis"),t.append("g").attr("class","axis-y"),t.select(".anim-xaxis").attr("opacity",1).attr("transform","translate(0, ".concat(i.A.BAR_CHART_HEIGHT,")")).call(x).selectAll("text").attr("transform","translate(-10,0)rotate(-45)").style("text-anchor","end"),t.select(".axis-y").call(n.axisLeft(T).tickFormat(n.format(".2s"))).append("text").text("Deliveries (TAF)").attr("fill","black").attr("font-weight","bold").attr("transform","translate(-50, ".concat(i.A.BAR_CHART_HEIGHT/2,") rotate(-90)")),e=v,a=x,r=f}}(),{barsAppear:{do:function(){{const t=n.scaleLinear().domain([l,o]).range([i.A.BAR_CHART_HEIGHT,0]);n.select("#pag-bar-graph .svg-group").selectAll(".bars").data(r,(t=>t.placeFromLeft)).join("rect").attr("class","bars").attr("x",(t=>e(t.year))).attr("y",i.A.BAR_CHART_HEIGHT).attr("width",e.bandwidth()).attr("height",0).attr("opacity",1).attr("fill","steelblue").transition().duration(500).delay((t=>10*t.placeFromLeft)).attr("y",(e=>t(e.val))).attr("height",(e=>i.A.BAR_CHART_HEIGHT-t(e.val)))}},undo:function(){n.select("#pag-bar-graph .svg-group").selectAll(".bars").data(r,(t=>t.placeFromLeft)).transition().duration(500).delay((t=>10*(r.length-t.placeFromLeft-1))).attr("y",i.A.BAR_CHART_HEIGHT).attr("height",0)}},barsCondense:{do:async function(){{const t=i.A.BAR_CHART_WIDTH/8,e=n.select("#pag-bar-graph .svg-group");e.select(".anim-xaxis").call(a.tickFormat(""));const s=e.selectAll(".bars");s.style("mix-blend-mode","multiply").transition().duration(500).attr("opacity",.05).transition().delay((t=>100+1e3*(1-(1-t.placeFromLeft/r.length)**4))).duration(500).attr("width",t).attr("x",i.A.BAR_CHART_WIDTH/2-t/2).end().catch((()=>{})).then((()=>{e.select(".anim-xaxis").transition().transition(500).attr("transform","translate(0, ".concat(i.A.BAR_CHART_HEIGHT+50,")")).attr("opacity",0),s.transition().delay(500).attr("x",0),e.transition().delay(500).attr("transform","translate(".concat(g+i.A.BAR_CHART_WIDTH/2-t/2,",").concat(A,")"))}))}},undo:function(){{const t=n.select("#pag-bar-graph .svg-group"),s=t.selectAll(".bars");t.select(".anim-xaxis").transition().transition(500).attr("transform","translate(0, ".concat(i.A.BAR_CHART_HEIGHT,")")).attr("opacity",1),t.select(".anim-xaxis").call(a.tickFormat((t=>"year ".concat(t)))),t.transition().delay(500).attr("transform","translate(".concat(g,",").concat(A,")")),s.transition().delay((t=>100+1e3*(1-(t.placeFromLeft/r.length)**4))).duration(500).attr("x",(t=>e(t.year))).attr("width",e.bandwidth()).transition().duration(500).attr("opacity",1).end().catch((()=>{})).then((()=>{s.style("mix-blend-mode","normal")}))}}}}},initBucketsFillAnim:function(t){let{deps:e,objective:a}=t;return{do:function(){n.selectAll(".tut-graph-wrapper .bucket-wrapper").style("display","initial"),n.select("#pag-bar-graph").attr("opacity",0),e.setBucketInterper((()=>e.objectiveInterper))},undo:function(){e.setBucketInterper((()=>n.scaleLinear().range([0,0]))),n.selectAll(".tut-graph-wrapper .bucket-wrapper").style("display","none"),n.select("#pag-bar-graph").transition().attr("opacity",1)}}},initDropFillAnim:function(t){let{deps:e,objective:a}=t;return{do:function(){(0,l.YB)(".main-waterdrop"),(0,l.YB)(".tut-drop-graphics-wrapper",n,"grid"),(0,l.f2)(".tut-graph-wrapper, .bucket-wrapper"),e.setDropInterper((()=>e.objectiveInterperDrop))},undo:function(){(0,l.f2)(".tut-drop-graphics-wrapper, .main-waterdrop"),(0,l.YB)(".bucket-wrapper"),(0,l.YB)(".tut-graph-wrapper",n,"flex"),e.setDropInterper((()=>n.scaleLinear().range([0,0])))}}},initShowVariationsAnim:function(t){let{deps:e}=t;return{do:function(){n.selectAll(".vardrop").style("display","initial").classed("hasarrow",!0),n.selectAll(".tut-drop-graphics-wrapper .objective-label").style("display","none"),e.setVariationInterpers(e.objectiveVariationInterpers),n.selectAll(".var-scen-label").style("display","block"),n.selectAll(".var-scen-label").style("opacity","1"),n.select(".main-waterdrop").transition().style("transform","translateY(100px) scale(0.5)"),n.select(".main-waterdrop .var-scen-label").transition().style("transform","scale(2)"),n.select(".main-histogram").style("display","initial"),n.selectAll(".vardrop .dot-histogram-wrapper").style("display","initial")},undo:function(){n.select(".main-waterdrop").transition().style("transform","none"),n.select(".main-waterdrop .var-scen-label").transition().style("transform","scale(1)"),n.select(".main-histogram").style("display","none"),n.selectAll(".vardrop .dot-histogram-wrapper").style("display","none"),n.selectAll(".var-scen-label").style("display","none"),n.selectAll(".tut-drop-graphics-wrapper .objective-label").style("display","initial"),n.selectAll(".vardrop").style("display","none").classed("hasarrow",!1),e.setVariationInterpers(i.A.VARIATIONS.map((()=>n.scaleLinear().range([0,0]))))}}}}}const A=u();r()}catch(d){r(d)}}))},3950:(t,e,a)=>{a.a(t,(async(t,r)=>{try{a.d(e,{R:()=>c});var n=a(5043),s=a(7479),i=t([s]);function c(t,e,a){const[r,i]=(0,n.useState)([]);return(0,n.useEffect)((function(){if(0===t.readyHash)return;const r={deps:t,objective:e,normalized:a},n=s.W.initChartAnimGroup(r),l=s.W.initBucketsFillAnim(r),c=s.W.initDropFillAnim(r),o=s.W.initShowVariationsAnim(r),p=[{name:"barsAppear",animHandler:n.barsAppear,text:"Bar Graph"},{name:"barsCondense",animHandler:n.barsCondense,text:"Gradient"},{name:"bucketsFill",animHandler:l,text:"Bucket"},{name:"forNowLetsFocus",animHandler:c,text:"Waterdrop"},{name:"ifChangeReality",animHandler:o,text:"Different Scenarios"}];i(p)}),[t.readyHash]),r}s=(i.then?(await i)():i)[0],r()}catch(l){r(l)}}))},8704:(t,e,a)=>{a.a(t,(async(t,r)=>{try{a.d(e,{A:()=>m});var n=a(5760),s=a(5043),i=a(1684),l=a(4554),c=a(6823),o=a(7343),p=t([l,o]);function m(t,e){const[a,r]=(0,s.useState)(0),[p,d]=(0,s.useState)(0),[m,u]=(0,s.useState)(0),[A,h]=(0,s.useState)((()=>n.scaleLinear().range([0,0]))),[_,g]=(0,s.useState)((()=>n.scaleLinear().range([0,0]))),[f,v]=(0,s.useState)((()=>n.scaleLinear().range([0,0]))),[T,x]=(0,s.useState)((()=>n.scaleLinear().range([0,0]))),[b,y]=(0,s.useState)((()=>c.A.VARIATIONS.map((()=>n.scaleLinear().range([0,0]))))),[I,j]=(0,s.useState)((()=>[])),[R,L]=(0,s.useState)((()=>c.A.VARIATIONS.map((()=>[])))),[E,H]=(0,s.useState)((()=>c.A.VARIATIONS.map((()=>n.scaleLinear().range([0,0])))));return(0,s.useEffect)((()=>{h((()=>n.scaleLinear().range([0,0]))),g((()=>n.scaleLinear().range([0,0]))),y((()=>c.A.VARIATIONS.map((()=>n.scaleLinear().range([0,0])))));const a=l.jx[t][l.Vk][c.A.BASELINE_SCENARIO][l.Zl];let r,s;if(r="NDO"===t?n.quantile(a,.75):n.max(a),e){const e=[c.A.BASELINE_SCENARIO,...c.A.VARIATIONS.map((t=>{let{scen_str:e}=t;return e}))].map((e=>n.min(l.jx[t][l.Vk][e][l.Zl])));s=n.min(e)}else s=0;d(r),u(s),j((()=>a));const p=n.scaleLinear().domain((0,i.kd)(0,1,a.length)).range(a.map((t=>(t-s)/(r-s))).sort(((t,e)=>t-e)).reverse()).clamp(!0),m=t=>(0,o.si)(n.scaleLinear().domain((0,i.kd)(0,1,a.length)).range(a.map((t=>(t-s)/(r-s))).sort(((t,e)=>t-e)).reverse()).clamp(!0)(t));v((()=>p)),x((()=>m));const A=c.A.VARIATIONS.map((e=>{let{scen_str:a}=e;return l.jx[t][l.Vk][a][l.Zl]})),_=A.map((t=>e=>(0,o.si)(n.scaleLinear().domain((0,i.kd)(0,1,t.length)).range(t.map((t=>(t-s)/(r-s))).sort(((t,e)=>t-e)).reverse()).clamp(!0)(e))));L((()=>A)),H((()=>_))}),[t,e]),{readyHash:a,setReadyHash:r,maxDelivs:p,minDelivs:m,bucketInterper:A,setBucketInterper:h,dropInterper:_,setDropInterper:g,variationInterpers:b,setVariationInterpers:y,objectiveDelivs:I,objectiveInterper:f,objectiveInterperDrop:T,objectiveVariationDelivs:R,objectiveVariationInterpers:E}}[l,o]=p.then?(await p)():p,r()}catch(d){r(d)}}))}}]);
//# sourceMappingURL=397.dd1ec96a.chunk.js.map