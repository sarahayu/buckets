"use strict";(self.webpackChunkbuckets=self.webpackChunkbuckets||[]).push([[988],{988:(e,n,r)=>{r.a(e,(async(e,t)=>{try{r.r(n),r.d(n,{default:()=>f});var s=r(43),c=r(668),a=r(63),i=r(684),l=r(111),o=r(267),u=r(58),d=r(139),m=r.n(d),h=r(829),v=r(579),x=e([a,o,u,h]);[a,o,u,h]=x.then?(await x)():x;const j=200,N="DEL_CVP_PAG_N",k="expl0000",b="median",S=(0,s.createContext)({});function f(e){let{data:n=a.jx}=e;const{current:r}=(0,s.useRef)(Object.keys(n)),{goal:t,showScens:c,sortMode:i,curObjectiveName:u,curScenName:d,curScenNamePreview:m,setGoal:h,setShowScens:x,setSortMode:p,setCurObjectiveName:j,setCurScenName:N,setCurScenNamePreview:k}=y(),{curDelivInterps:b,curOrderedScenNames:f}=C(n,r,u,d,m,i),O=(0,s.useMemo)((()=>b[u]),[u,b]),P=m||d;return(0,v.jsxs)(S.Provider,{value:{data:n,goal:t,curObjectiveName:u,curScenName:d,curScenNamePreview:m,curOrderedScenNames:f},children:[(0,v.jsxs)("div",{className:"dashboard",children:[(0,v.jsxs)("div",{className:"scen-input",children:[(0,v.jsx)("button",{onClick:()=>{N(f[Math.max(f.indexOf(d)-1,0)])},children:"\u27e8"}),(0,v.jsxs)("button",{className:"scen-picker",onClick:()=>{x((e=>!e))},children:[(0,v.jsx)("span",{children:"Scenario"}),(0,v.jsx)("span",{children:P}),(0,v.jsxs)("span",{children:[i," \u2192"]})]}),(0,v.jsx)("button",{onClick:()=>{N(f[Math.min(f.indexOf(d)+1,f.length-1)])},children:"\u27e9"})]}),(0,v.jsx)(w,{levelInterp:O}),(0,v.jsx)("div",{className:"pdf-container",children:(0,v.jsx)(o.A,{data:n[u][a.Vk][P][a.Zl],goal:t,setGoal:h})}),(0,v.jsx)("div",{className:"other-buckets-container",children:r.map((e=>(0,v.jsx)(g,{label:e,active:e!==u,onClick:()=>{j(e)},children:(0,v.jsx)(l.A,{levelInterp:b[e],width:50,height:50})},e)))})]}),c&&(0,v.jsx)(M,{sortMode:i,setSortMode:p,setCurScenName:N,setCurScenNamePreview:k,exitFn:()=>{x(!1)}})]})}function y(){const[e,n]=(0,s.useState)(j),[r,t]=(0,s.useState)(!1),[c,a]=(0,s.useState)(b),[i,l]=(0,s.useState)(N),[o,u]=(0,s.useState)(k),[d,m]=(0,s.useState)(null);return{goal:e,setGoal:n,showScens:r,setShowScens:t,sortMode:c,setSortMode:a,curObjectiveName:i,setCurObjectiveName:l,curScenName:o,setCurScenName:u,curScenNamePreview:d,setCurScenNamePreview:m}}function C(e,n,r,t,c,a){const i=(0,s.useMemo)((()=>(0,h.Yb)(a,e,r)),[a,r]);return{curDelivInterps:(0,s.useMemo)((()=>P(e,n,c||t)),[t,c]),curOrderedScenNames:i}}function g(e){let{label:n,active:r,onClick:t,children:s}=e;return(0,v.jsxs)("div",{className:m()("bucket-and-label",{"cur-obj":!r}),onClick:t,title:n,children:[(0,v.jsx)("span",{children:n}),s]})}function w(e){let{levelInterp:n}=e;const{curObjectiveName:r,goal:t}=(0,s.useContext)(S);return(0,v.jsx)("div",{className:"bucket-viz",children:(0,v.jsxs)("div",{className:"bucket-viz-container",children:[(0,v.jsx)("span",{className:"main-bucket-label",children:r}),(0,v.jsx)(l.A,{levelInterp:n,width:200,height:200}),(0,v.jsxs)("div",{className:"bucket-razor",style:{top:c.m4Y().domain([0,a.pk]).range([200,0])(t)+"px"},children:[(0,v.jsx)("p",{children:"Goal"}),(0,v.jsxs)("p",{children:[c.GPZ(".0f")(t)," ",(0,v.jsx)("span",{children:"TAF"})]})]})]})})}function M(e){let{sortMode:n,setSortMode:r,setCurScenName:t,setCurScenNamePreview:i,exitFn:l}=e;const{data:o,curObjectiveName:d,curScenName:h,curScenNamePreview:x,curOrderedScenNames:p,goal:j}=(0,s.useContext)(S),N=(0,s.useMemo)((()=>Array.from(p).reverse()),[p]),k=(0,s.useRef)();return(0,s.useLayoutEffect)((()=>{k.current.scrollTo(0,k.current.querySelector("#".concat(h)).getBoundingClientRect().top-100)}),[]),(0,v.jsx)("div",{className:"ridgeline-overlay",children:(0,v.jsxs)("div",{className:"ridgeline-overlay-container",children:[(0,v.jsx)("button",{className:"overlay-exit-btn",onClick:l,children:"\xd7"}),(0,v.jsxs)("div",{className:"sort-types",children:[(0,v.jsx)("input",{type:"radio",name:"sort-type",value:"median",id:"median",checked:"median"===n,onChange:()=>{r("median")}}),(0,v.jsx)("label",{htmlFor:"median",children:"Median"}),(0,v.jsx)("input",{type:"radio",name:"sort-type",value:"deliveries",id:"deliveries",checked:"deliveries"===n,onChange:()=>{r("deliveries")}}),(0,v.jsx)("label",{htmlFor:"deliveries",children:"Max. Deliveries"}),(0,v.jsx)("input",{type:"radio",name:"sort-type",value:"alphabetical",id:"alphabetical",checked:"alphabetical"===n,onChange:()=>{r("alphabetical")}}),(0,v.jsx)("label",{htmlFor:"alphabetical",children:"Alphabetical"})]}),(0,v.jsx)("div",{className:"overlay-container",onMouseLeave:()=>i(null),ref:k,children:(0,v.jsxs)("div",{className:m()("overlay-container-2",{previewing:null!==x}),children:[(0,v.jsx)(O,{keyList:N,children:N.map((e=>(0,v.jsxs)("div",{className:m()({previewing:e===x,"current-scene":e===h}),id:e,onMouseEnter:()=>i(e),onClick:()=>{t(e)},children:[(0,v.jsx)(u.A,{data:o[d][a.Vk][e][a.Zl],goal:j,width:300,height:200}),(0,v.jsx)("span",{children:e})]},e)))}),(0,v.jsx)("div",{className:"dot-overlay-razor",style:{left:c.m4Y().domain([0,a.pk]).range([0,300])(j)+"px"}})]})})]})})}function O(e){let{keyList:n,children:r}=e;const t=(0,s.useRef)({}),c=(0,s.useRef)({}),a=(0,s.useRef)({});return(0,s.useLayoutEffect)((()=>{c.current={};for(const e in t.current)c.current[e]=t.current[e];t.current={};for(const e in a.current)t.current[e]=a.current[e].getBoundingClientRect().top+a.current[e].parentNode.scrollTop;Object.keys(c.current).length&&s.Children.forEach(r,(e=>{const n=t.current[e.key],r=c.current[e.key];if(void 0===r||void 0===n)return;const s=n-r;s&&requestAnimationFrame((()=>{a.current[e.key].style.transform="translateY(".concat(-s,"px)"),a.current[e.key].style.transition="transform 0s",requestAnimationFrame((()=>{a.current[e.key].style.transform="",a.current[e.key].style.transition="transform 500ms"}))}))}))}),[n]),a.current={},s.Children.map(r,(e=>s.cloneElement(e,{ref:n=>{n&&(a.current[e.key]=n)}})))}function P(e,n,r){const t={};return n.forEach((n=>{const s=e[n][a.Vk][r][a.Zl];t[n]=c.m4Y().domain((0,i.kd)(0,1,s.length)).range(s.map((e=>Math.min(1,e/a.pk)||0))).clamp(!0)})),t}t()}catch(p){t(p)}}))}}]);
//# sourceMappingURL=988.a6deaea7.chunk.js.map