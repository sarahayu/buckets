/*! For license information please see 988.5337b48e.chunk.js.LICENSE.txt */
(self.webpackChunkbuckets=self.webpackChunkbuckets||[]).push([[988],{267:(e,t,r)=>{"use strict";r.a(e,(async(e,n)=>{try{r.d(t,{A:()=>f});var a=r(243),s=r(43),c=r(987),o=r(829),l=r(63),i=r(579),u=e([o,l]);[o,l]=u.then?(await u)():u;const h=20,p={top:10,right:30,bottom:50,left:50},m=[0,l.pk];function f(e){let{data:t,goal:r,setGoal:n,width:l=600,height:u=400}=e;const d=(0,s.useRef)(),f=(0,s.useMemo)((()=>(0,c.u)(t,m,t.length/h,l,u)),[t]),v=[0,t.length],g=a.m4Y().domain(m).range([0,l]),y=a.m4Y().domain(v).range([u,0]),x=f.filter((e=>e[0]>r)).length;return(0,s.useEffect)((()=>{d.current.attr("width",l+p.left+p.right).attr("height",u+p.top+p.bottom).style("pointer-events","none").append("g").attr("class","graph-area").attr("transform","translate(".concat(p.left,",").concat(p.top,")")).append("g").attr("transform","translate(0, ".concat(u,")")).call(a.l78().scale(a.m4Y().domain(m).range([0,l]))).call((e=>{e.selectAll("line").attr("stroke","gray"),e.selectAll("path").attr("stroke","gray"),e.selectAll("text").attr("fill","gray")})).append("text").attr("fill","black").attr("transform","translate(".concat(l/2,", ",30,")")).text("Delivery (TAF)");const e=document.querySelector("#pdf-razor");e.style.transform="translateX(".concat(a.m4Y().domain(m).range([p.left,l+p.left]).clamp(!0)(r),"px)");const t=e=>e.preventDefault();let s=!1;document.querySelector("#pdf-razor").addEventListener("mousedown",(()=>{s=!0,window.addEventListener("selectstart",t)})),document.addEventListener("mouseup",(()=>{s=!1,window.removeEventListener("selectstart",t)})),document.querySelector("#pdf-wrapper").addEventListener("mousemove",(t=>{s&&"pdf-wrapper"===t.target.id&&(e.style.transform="translateX(".concat(Math.min(Math.max(t.offsetX,p.left),p.left+l),"px)\n            "),n(a.m4Y().domain([p.left,l+p.left]).range(m).clamp(!0)(t.offsetX)))}))}),[]),(0,s.useEffect)((()=>{const e=d.current.select(".graph-area").selectAll(".icons").data(f).join((e=>e.append("g").call((e=>e.append("path"))))).attr("class","icons").call((e=>{e.selectAll("path").attr("d",a.HRO(o.XC,u/h))}));e.transition("position").delay((e=>100*a.m4Y(v).invert(e[1]))).duration(500).attr("transform",(e=>"translate(".concat(g(e[0]),",").concat(y(e[1]),")"))),e.transition("color").delay((e=>100*a.m4Y(v).invert(e[1]))).duration(0).attr("fill",(e=>e[0]>r?"steelblue":"black"))}),[r,f]),(0,i.jsxs)("div",{className:"dot-pdf-wrapper",id:"pdf-wrapper",children:[(0,i.jsx)("div",{className:"pdf-razor",id:"pdf-razor",children:(0,i.jsxs)("div",{children:[(0,i.jsxs)("span",{children:[f.length-x," out of ",h," years WILL NOT meet demand"]}),(0,i.jsxs)("span",{children:[x," out of ",h," years WILL meet demand"]})]})}),(0,i.jsx)("svg",{ref:e=>{d.current=a.Ltv(e)}})]})}n()}catch(d){n(d)}}))},58:(e,t,r)=>{"use strict";r.a(e,(async(e,n)=>{try{r.d(t,{A:()=>f});var a=r(243),s=r(43),c=r(987),o=r(829),l=r(63),i=r(579),u=e([o,l]);[o,l]=u.then?(await u)():u;const h=20,p={top:10,right:10,bottom:3,left:0},m=[0,l.pk];function f(e){let{data:t,goal:r,width:n=600,height:u=400}=e;const d=(0,s.useRef)(),f=(0,s.useMemo)((()=>(0,c.u)(t,m,t.length/h,n,u)),[t]);return(0,s.useEffect)((()=>{const e=d.current.attr("width",n+p.left+p.right).attr("height",u+p.top+p.bottom).style("pointer-events","none").append("g").attr("class","graph-area").attr("transform","translate(".concat(p.left,",").concat(p.top,")"));e.append("g").attr("transform","translate(0, ".concat(u,")")).call((e=>{e.selectAll("line").attr("stroke","gray"),e.selectAll("path").attr("stroke","gray")})),e.append("path").attr("class","ridgeline").attr("fill","none").attr("stroke","steelblue")}),[]),(0,s.useEffect)((()=>{const e=a.m4Y().domain(m).range([0,n]),r=a.m4Y().domain([0,.05]).range([u,0]).clamp(!0),s=(0,o.C5)((0,o.xC)(20),e.ticks(l.pk/4));d.current.select(".graph-area").select(".ridgeline").datum(s(t)).attr("d",a.n8j().curve(a.qrM).x((t=>e(t[0]))).y((e=>r(e[1]))))}),[t]),(0,s.useEffect)((()=>{const e=a.m4Y().domain(m).range([0,n]),s=a.m4Y().domain([0,t.length]).range([u,0]);d.current.select(".graph-area").selectAll(".icons").data(f).join((e=>e.append("g").attr("class","icons").call((e=>e.append("path"))))).call((e=>{e.select("path").attr("d",a.HRO(o.XC,u/h))})).attr("transform",(t=>"translate(".concat(e(t[0]),",").concat(s(t[1]),")"))).attr("fill",(e=>e[0]>r?"steelblue":"black"))}),[r,f]),(0,i.jsx)("svg",{className:"dot-pdf-shadowed",ref:e=>{d.current=a.Ltv(e)}})}n()}catch(d){n(d)}}))},988:(e,t,r)=>{"use strict";r.a(e,(async(e,n)=>{try{r.r(t),r.d(t,{default:()=>b});var a=r(43),s=r(243),c=r(63),o=r(684),l=r(111),i=r(267),u=r(58),d=r(139),h=r.n(d),p=r(829),m=r(579),f=e([c,i,u,p]);[c,i,u,p]=f.then?(await f)():f;const g=200,y="DEL_CVP_PAG_N",x="expl0000",k="median",j=(0,a.createContext)({});function b(e){let{data:t=c.jx}=e;const{current:r}=(0,a.useRef)(Object.keys(t)),{goal:n,showScens:s,sortMode:o,curObjectiveName:u,curScenName:d,curScenNamePreview:h,setGoal:p,setShowScens:f,setSortMode:v,setCurObjectiveName:g,setCurScenName:y,setCurScenNamePreview:x}=M(),{curDelivInterps:k,curOrderedScenNames:b}=w(t,r,u,d,h,o),P=(0,a.useMemo)((()=>k[u]),[u,k]),A=h||d;return(0,m.jsxs)(j.Provider,{value:{data:t,goal:n,curObjectiveName:u,curScenName:d,curScenNamePreview:h,curOrderedScenNames:b},children:[(0,m.jsxs)("div",{className:"dashboard",children:[(0,m.jsxs)("div",{className:"scen-input",children:[(0,m.jsx)("span",{children:"Scenario"}),(0,m.jsxs)("div",{className:"scen-picker",children:[(0,m.jsx)("button",{onClick:()=>{y(b[Math.max(b.indexOf(d)-1,0)])},children:"\u27e8"}),(0,m.jsx)("span",{children:A}),(0,m.jsx)("button",{onClick:()=>{y(b[Math.min(b.indexOf(d)+1,b.length-1)])},children:"\u27e9"})]}),(0,m.jsxs)("button",{children:[o," \u2192"]})]}),(0,m.jsx)(N,{levelInterp:P}),(0,m.jsx)("div",{className:"pdf-container",children:(0,m.jsx)(i.A,{data:t[u][c.Vk][A][c.Zl],goal:n,setGoal:p})}),(0,m.jsx)("div",{className:"other-buckets-container",children:r.map((e=>(0,m.jsx)(S,{label:e,active:e!==u,onClick:()=>{g(e)},children:(0,m.jsx)(l.A,{levelInterp:k[e],width:50,height:50})},e)))})]}),s&&(0,m.jsx)(C,{sortMode:o,setSortMode:v,setCurScenName:y,setCurScenNamePreview:x})]})}function M(){const[e,t]=(0,a.useState)(g),[r,n]=(0,a.useState)(!1),[s,c]=(0,a.useState)(k),[o,l]=(0,a.useState)(y),[i,u]=(0,a.useState)(x),[d,h]=(0,a.useState)(null);return{goal:e,setGoal:t,showScens:r,setShowScens:n,sortMode:s,setSortMode:c,curObjectiveName:o,setCurObjectiveName:l,curScenName:i,setCurScenName:u,curScenNamePreview:d,setCurScenNamePreview:h}}function w(e,t,r,n,s,c){const o=(0,a.useMemo)((()=>(0,p.Yb)(c,e,r)),[c,r]);return{curDelivInterps:(0,a.useMemo)((()=>A(e,t,s||n)),[n,s]),curOrderedScenNames:o}}function S(e){let{label:t,active:r,onClick:n,children:a}=e;return(0,m.jsxs)("div",{className:h()("bucket-and-label",{"cur-obj":!r}),onClick:n,title:t,children:[(0,m.jsx)("span",{children:t}),a]})}function N(e){let{levelInterp:t}=e;const{curObjectiveName:r,goal:n}=(0,a.useContext)(j);return(0,m.jsx)("div",{className:"bucket-viz",children:(0,m.jsxs)("div",{className:"bucket-viz-container",children:[(0,m.jsx)("span",{className:"main-bucket-label",children:r}),(0,m.jsx)(l.A,{levelInterp:t,width:200,height:200}),(0,m.jsxs)("div",{className:"bucket-razor",style:{top:s.m4Y().domain([0,c.pk]).range([200,0])(n)+"px"},children:[(0,m.jsx)("p",{children:"Goal"}),(0,m.jsxs)("p",{children:[s.GPZ(".0f")(n)," ",(0,m.jsx)("span",{children:"TAF"})]})]})]})})}function C(e){let{sortMode:t,setSortMode:r,setCurScenName:n,setCurScenNamePreview:l}=e;const{data:i,curObjectiveName:d,curScenName:p,curScenNamePreview:f,curOrderedScenNames:v,goal:g}=(0,a.useContext)(j),y=(0,a.useMemo)((()=>Array.from(v).reverse().filter(((e,t)=>e===p||(0,o.kd)(0,.9,20).map((e=>Math.floor((e+.05)*v.length))).includes(t)))),[v,p]);return(0,m.jsxs)("div",{className:"ridgeline-overlay",children:[(0,m.jsxs)("div",{className:"sort-types",children:[(0,m.jsx)("input",{type:"radio",name:"sort-type",value:"median",id:"median",checked:"median"===t,onChange:()=>{r("median")}}),(0,m.jsx)("label",{htmlFor:"median",children:"Median"}),(0,m.jsx)("input",{type:"radio",name:"sort-type",value:"deliveries",id:"deliveries",checked:"deliveries"===t,onChange:()=>{r("deliveries")}}),(0,m.jsx)("label",{htmlFor:"deliveries",children:"Max. Deliveries"}),(0,m.jsx)("input",{type:"radio",name:"sort-type",value:"alphabetical",id:"alphabetical",checked:"alphabetical"===t,onChange:()=>{r("alphabetical")}}),(0,m.jsx)("label",{htmlFor:"alphabetical",children:"Alphabetical"})]}),(0,m.jsxs)("div",{className:h()("overlay-container",{previewing:null!==f}),onMouseLeave:()=>l(null),children:[(0,m.jsx)(P,{keyList:y,children:y.map((e=>(0,m.jsxs)("div",{className:h()({previewing:e===f,"current-scene":e===p}),onMouseEnter:()=>l(e),onClick:()=>{n(e)},children:[(0,m.jsx)(u.A,{data:i[d][c.Vk][e][c.Zl],goal:g,width:300,height:200}),(0,m.jsx)("span",{children:e})]},e)))}),(0,m.jsx)("div",{className:"dot-overlay-razor",style:{left:s.m4Y().domain([0,c.pk]).range([0,300])(g)+"px"}})]})]})}function P(e){let{keyList:t,children:r}=e;const n=(0,a.useRef)({}),s=(0,a.useRef)({}),c=(0,a.useRef)({});return(0,a.useLayoutEffect)((()=>{s.current={};for(const e in n.current)s.current[e]=n.current[e];n.current={};for(const e in c.current)n.current[e]=c.current[e].getBoundingClientRect();Object.keys(s.current).length&&a.Children.forEach(r,(e=>{const t=n.current[e.key],r=s.current[e.key];if(void 0===r||void 0===t)return;const a=t.top-r.top;a&&requestAnimationFrame((()=>{c.current[e.key].style.transform="translateY(".concat(-a,"px)"),c.current[e.key].style.transition="transform 0s",requestAnimationFrame((()=>{c.current[e.key].style.transform="",c.current[e.key].style.transition="transform 500ms"}))}))}))}),[t]),c.current={},a.Children.map(r,(e=>a.cloneElement(e,{ref:t=>{t&&(c.current[e.key]=t)}})))}function A(e,t,r){const n={};return t.forEach((t=>{const a=e[t][c.Vk][r][c.Zl];n[t]=s.m4Y().domain((0,o.kd)(0,1,a.length)).range(a.map((e=>Math.min(1,e/c.pk)||0))).clamp(!0)})),n}n()}catch(v){n(v)}}))},111:(e,t,r)=>{"use strict";r.d(t,{A:()=>u});var n=r(243),a=r(43),s=r(684),c=r(579);const o=40,l=10,i=3;function u(e){let{levelInterp:t,colorInterp:r=s.YW,width:u=200,height:d=400,resolution:h=l}=e;const p=(0,a.useId)(),m=(0,a.useRef)(),f=(0,a.useMemo)((()=>(0,s.kd)(0,1,h+1).map((e=>t(e)))),[t,h]),v=(0,s.ZC)(f),g=u-2*i,y=d-i;return(0,a.useLayoutEffect)((()=>{const e=m.current.append("g").attr("class","svg-container").attr("transform","translate(".concat(i,", ").concat(i/2,")"));e.append("defs").append("clipPath").attr("id","bucket-mask-"+p).append("path").attr("class","bucket-mask-path"),e.append("g").attr("class","graph-area").attr("clip-path","url(#bucket-mask-".concat(p,")")),e.append("g").append("path").attr("class","bucket-outline").attr("stroke","lightgray").attr("stroke-linecap","round").attr("stroke-width",i).attr("fill","none")}),[p]),(0,a.useLayoutEffect)((()=>{const e=m.current.attr("width",u).attr("height",d).select(".svg-container");e.select(".bucket-mask-path").attr("d",(0,s.wh)(g,y)),e.select(".bucket-outline").attr("d",(0,s.wh)(g,y).split("z")[0])}),[u,d,g,y]),(0,a.useLayoutEffect)((()=>{const e=m.current.select(".graph-area").selectAll(".bucketBox").data(f).join("rect").attr("class","bucketBox").attr("width",2*g).attr("height",2*y).attr("x",-g/2).attr("fill",((e,t)=>r(t/l)));e.transition("liquidLevel").ease(n.guX.period(.6)).delay(((e,t)=>t*(100/h))).duration(1e3).attr("y",(e=>y-e*y)),e.transition("liquidSway").duration(2e3).delay(((e,t)=>10*t)).ease(n.I1g).attrTween("transform",(function(e,t){const r=v?Math.abs(v[t]-e):0;return e=>"rotate(".concat(Math.sin(Math.min(4*Math.PI*e/(.5*r+.5),4*Math.PI))*r*o*(1-e),", ").concat(g/2,", ",0,")")}))}),[f,v,u,d,g,y,h,r]),(0,c.jsx)("div",{className:"bucket-wrapper",children:(0,c.jsx)("svg",{ref:e=>{m.current=n.Ltv(e)}})})}},987:(e,t,r)=>{"use strict";r.d(t,{u:()=>s});var n=r(243),a=r(684);function s(e,t,r,s,c){const o=e.length/r;let l=n.JWi().value((e=>e)).domain(t).thresholds((0,a.kd)(...t,Math.ceil(s/(c/o))))(e),i=(0,a.Q2)(l,r,o),u=[];for(let n=0;n<i.length;n++)for(let t=0;t<i[n];t++)u.push([(l[n].x1+l[n].x0)/2,(t+.5)/o*e.length]);return u}},684:(e,t,r)=>{"use strict";r.d(t,{Q2:()=>o,YW:()=>i,ZC:()=>l,kd:()=>s,wh:()=>c});var n=r(243),a=r(43);function s(e,t,r){return n.y17(r).map((n=>n/(r-1)*(t-e)+e))}function c(e,t){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.8,s=e*a+e*(1-a)/2,c=e*(1-a)/2,o=[{x:n.GWP(s,e)(r),y:n.GWP(t,0)(r)},{x:s,y:t},{x:c,y:t},{x:n.GWP(c,0)(r),y:n.GWP(t,0)(r)}];return n.n8j().x((function(e){return e.x})).y((function(e){return e.y}))(o)+"z"}function o(e,t,r){let a=e.map((e=>Math.round(e.length/t))),s=n.czq(a);for(;s>r;)a[n.z94(e,((e,r)=>0!==e.length?e.length/t-a[r]:1/0))]-=1,s=n.czq(a);for(;s<r;)a[n.P2Z(e,((e,r)=>0!==e.length?e.length/t-a[r]:-1/0))]+=1,s=n.czq(a);return a}function l(e,t){const r=(0,a.useRef)({value:e,prev:null}),n=r.current.value;return(t?t(e,n):e===n)||(r.current={value:e,prev:n}),r.current.prev}const i=e=>n.dM(n.m4Y([.2,1])(e))},63:(e,t,r)=>{"use strict";r.a(e,(async(e,n)=>{try{r.d(t,{Vk:()=>o,Zl:()=>l,jx:()=>i,pk:()=>c});var a=r(829),s=e([a]);a=(s.then?(await s)():s)[0];const c=1200,o="scens",l="delivs",i=await async function(){const e=await(await fetch("./all_objectives.json")).json();for(const t of e){t[o]=t[o];for(const e of t[o])e[l]=e[l].map((e=>Math.min(Math.max(0,e),c))).sort(((e,t)=>t-e));t[o]=(0,a.Et)(t[o],(e=>{let{name:t}=e;return t}))}return console.log("DATA: loading objectives data"),(0,a.Et)(e,(e=>{let{obj:t}=e;return t}))}();n()}catch(c){n(c)}}),1)},829:(e,t,r)=>{"use strict";r.a(e,(async(e,n)=>{try{r.d(t,{C5:()=>v,Et:()=>h,XC:()=>p,Yb:()=>N,cv:()=>S,hh:()=>M,js:()=>m,nC:()=>w,si:()=>f,xC:()=>g});var a=r(243),s=r(783),c=r.n(s),o=r(43),l=r(63),i=r(684),u=e([l]);function h(e,t){const r=Object.groupBy(e,t);for(const n of Object.keys(r))r[n]=r[n][0];return r}l=(u.then?(await u)():u)[0];const p={draw:function(e,t){e.moveTo(0,-t/2),e.lineTo(t/4,-t/4),e.arc(0,0,t/Math.SQRT2/2,-Math.PI/4,5*Math.PI/4),e.lineTo(0,-t/2),e.closePath()}},m="M0,-1L0.5,-0.5A0.707,0.707,0,1,1,-0.5,-0.5L0,-1Z";function f(e){return e-=.0088,Math.min(1,Math.max(0,(3.1304*e**3-4.2384*e**2+3.3471*e+.0298)/2.2326))}function v(e,t){return function(r){return t.map((function(t){return[t,a.i2o(r,(function(r){return e(t-r)}))]}))}}function g(e){return function(t){return Math.abs(t/=e)<=1?.75*(1-t*t)/e:0}}function y(e){const t=e/2,r=3*Math.PI/2/16,n=[{x:Math.cos(5*Math.PI/4)*t,y:Math.sin(5*Math.PI/4)*t},{x:0,y:-Math.SQRT2*t}];for(let a=0;a<=16;a++)n.push({x:Math.cos(a*r-Math.PI/4)*t,y:Math.sin(a*r-Math.PI/4)*t});return n}function x(e,t){const r=c().Bounds.create(e),n=r.min.x,s=r.max.x,o=r.min.y,l=r.max.y,i=a.m4Y([n,s]),u=a.m4Y([o,l]),d=[];for(let a=0;a<t;a++)for(;;){const t=i(Math.random()),r=u(Math.random());if(c().Vertices.contains(e,{x:t,y:r})){d.push([t,r]);break}}return d}const k=function(){const e=y(3),t=y(1),r=[];for(let n=0;n<e.length-2;n++)r.push([e[n],e[n+(n<2?1:2)],t[n+(n<2?1:2)],t[n]]);return r}();let j,b;function M(e,t,r){j&&r.length===b||(j=a.y17(4).map((()=>x(y(1),b=r.length))));const n=a.czq(r.map((e=>{let{r:t}=e;return t**2*3.14}))),s=Math.floor(2*Math.sqrt(n/3.14)/2),o=j[Math.floor(Math.random()*j.length)].map((e=>{let[t,r]=e;return[t*s,r*s]})),l=c().Engine,i=c().Bodies,u=c().Composite,d=l.create(),h=o.sort(((e,t)=>t[1]-e[1])),p=r.map(((e,t)=>{let{r:r,id:n}=e;const[a,s]=h[t];return i.circle(a,s,r,{restitution:0,id:n})})),m=k.map((e=>c().Body.create({position:c().Vertices.centre(e),vertices:e,isStatic:!0}))),f=c().Body.create({isStatic:!0});c().Body.setParts(f,m),c().Body.setCentre(f,{x:0,y:0}),c().Body.scale(f,1.1*s,1.1*s),u.add(d.world,[...p,f]);for(let a=0,c=60,v=.3;a<c*v;a++)l.update(d,1e3/c);return p.map((r=>{let{position:n,id:a}=r;return{id:a,x:n.x+e,y:n.y+t+.1*s}}))}function w(e,t){const[r,n]=(0,o.useState)(e);return[(0,o.useMemo)((()=>t(r)),[r]),(0,o.useCallback)((e=>{n(t(e))}),[])]}function S(e,t,r,n){const s=r[e][l.Vk][t][l.Zl];return a.m4Y().domain((0,i.kd)(0,1,s.length)).range(s.map((e=>Math.min(1,e/n)||0))).clamp(!0)}function N(e,t,r){return"median"===e?Object.keys(t[r][l.Vk]).sort(((e,n)=>a.i2o(t[r][l.Vk][e][l.Zl])-a.i2o(t[r][l.Vk][n][l.Zl]))):"deliveries"===e?Object.keys(t[r][l.Vk]).sort(((e,n)=>a.T9B(t[r][l.Vk][e][l.Zl])-a.T9B(t[r][l.Vk][n][l.Zl]))):"alphabetical"===e?Object.keys(t[r][l.Vk]).sort():void 0}n()}catch(d){n(d)}}))},139:(e,t)=>{var r;!function(){"use strict";var n={}.hasOwnProperty;function a(){for(var e="",t=0;t<arguments.length;t++){var r=arguments[t];r&&(e=c(e,s(r)))}return e}function s(e){if("string"===typeof e||"number"===typeof e)return e;if("object"!==typeof e)return"";if(Array.isArray(e))return a.apply(null,e);if(e.toString!==Object.prototype.toString&&!e.toString.toString().includes("[native code]"))return e.toString();var t="";for(var r in e)n.call(e,r)&&e[r]&&(t=c(t,r));return t}function c(e,t){return t?e?e+" "+t:e+t:e}e.exports?(a.default=a,e.exports=a):void 0===(r=function(){return a}.apply(t,[]))||(e.exports=r)}()}}]);
//# sourceMappingURL=988.5337b48e.chunk.js.map