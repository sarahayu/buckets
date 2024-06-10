"use strict";(self.webpackChunkbuckets=self.webpackChunkbuckets||[]).push([[746],{746:(t,e,n)=>{n.a(t,(async(t,a)=>{try{n.r(e),n.d(e,{default:()=>v});var r=n(487),o=n(43),s=n(684),c=n(63),i=n(829),l=n(579),u=t([c,i]);[c,i]=u.then?(await u)():u;const d=10,p=0,f=15,m="M0,-10L5,-5A7.071,7.071,0,1,1,-5,-5L0,-10Z",y=4;function v(t){let{watercolor:e=!1}=t;const{current:n}=(0,o.useRef)(Object.keys(c.jx)),a=(0,o.useRef)(),[u,h]=(0,o.useState)(p),[v,x]=(0,o.useState)(!1),g=(0,o.useRef)(),M=(0,o.useMemo)((()=>(0,i.Yb)("median",c.jx,n[u])),[u]),b=(0,o.useMemo)((()=>M.map((t=>{const e=(0,i.cv)(n[u],t,c.jx);return(0,s.kd)(0,1,d+1).map((t=>e(t)))})).reverse()),[u]);return(0,o.useLayoutEffect)((()=>{a.current={width:window.innerWidth,height:window.innerHeight},g.current.attr("width",window.innerWidth).attr("height",window.innerHeight)}),[]),(0,o.useLayoutEffect)((()=>{const t=a.current.width,e=a.current.height,n=1/(v?r.T9B(b.map((t=>t[0]))):1),o=(0,i.hh)(t/2,e/2,b.map(((t,e)=>({r:t[0]*n*f,id:e})))).map((t=>{let{id:e,x:a,y:o}=t;return{levs:b[e].map((t=>t*n)),maxLev:b[e][0]*n,tilt:50*Math.random()-25,dur:500*Math.random()+1e3,startX:a,startY:r.m4Y([2*-f-f,2*-f])(Math.random()),endX:a,endY:o}}));g.current.selectAll(".dropTranslateY").data(o,((t,e)=>e)).join((t=>t.append("g").attr("class","dropTranslateY").call((t=>{t.append("g").attr("class","dropTranslateX").each((function(t,e){let{levs:n,maxLev:a}=t;r.Ltv(this).append("defs").append("clipPath").attr("id","drop-mask-"+e).append("path").attr("transform","scale(".concat(a*f/2/y,")")).attr("d",m),r.Ltv(this).append("g").attr("clip-path","url(#drop-mask-".concat(e,")")).selectAll("rect").data(n,((t,e)=>e)).join("rect").attr("width",a*f*2).attr("height",a*f*2).attr("x",-a*f*2/2).attr("y",-a*f*2/2).attr("fill",((t,e)=>(0,s.YW)(e/d)))}))})))).attr("transform",(t=>{let{startY:e}=t;return"translate(0, ".concat(e,")")})).each((function(t){let{startX:e,tilt:n,levs:a,maxLev:o}=t;r.Ltv(this).select(".dropTranslateX").attr("transform","translate(".concat(e,", 0) rotate(").concat(n,")")).style("opacity",.2),r.Ltv(this).select(".dropTranslateX").selectAll("rect").data(a,((t,e)=>e)).attr("width",o*f*2).attr("height",o*f*2).attr("x",-o*f*2/2).attr("y",(t=>o*f*2/2-(0,i.si)(t/o)*(o*f*2))),r.Ltv(this).select(".dropTranslateX").select("path").attr("transform","scale(".concat(o*f/2/Math.SQRT2/y,")"))})).call((t=>{t.transition("y").duration((t=>{let{dur:e}=t;return e})).delay(((t,e)=>5*Math.floor(e/1))).ease(r.GDP).attr("transform",(t=>{let{endY:e}=t;return"translate(0, ".concat(e,")")}))})).call((t=>{t.transition("trans").duration((t=>{let{dur:e}=t;return.5*e})).delay(((t,e)=>5*Math.floor(e/1))).ease(r.yfw).select(".dropTranslateX").attr("transform",(t=>{let{endX:e,tilt:n}=t;return"translate(".concat(e,", 0) rotate(").concat(n,")")})).style("opacity",1)}))}),[b,v]),(0,l.jsxs)("div",{className:"bubbles-wrapper",children:[(0,l.jsx)("select",{value:u,onChange:t=>h(parseInt(t.target.value)),children:n.map(((t,e)=>(0,l.jsx)("option",{name:e,value:e,children:t},e)))}),(0,l.jsx)("input",{type:"checkbox",id:"html",name:"fav_language",value:"HTML",checked:v,onChange:()=>{x((t=>!t))}}),(0,l.jsx)("label",{htmlFor:"html",children:"normalize"}),(0,l.jsx)("div",{className:"bubbles-svg-wrapper"+(e?"-painter":""),children:(0,l.jsx)("svg",{className:"bubbles-svg"+(e?"-painter":""),ref:t=>{g.current=r.Ltv(t)}})})]})}a()}catch(h){a(h)}}))},684:(t,e,n)=>{n.d(e,{Q2:()=>c,YW:()=>l,ZC:()=>i,kd:()=>o,wh:()=>s});var a=n(487),r=n(43);function o(t,e,n){return a.y17(n).map((a=>a/(n-1)*(e-t)+t))}function s(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.8,o=t*r+t*(1-r)/2,s=t*(1-r)/2,c=[{x:a.GWP(o,t)(n),y:a.GWP(e,0)(n)},{x:o,y:e},{x:s,y:e},{x:a.GWP(s,0)(n),y:a.GWP(e,0)(n)}];return a.n8j().x((function(t){return t.x})).y((function(t){return t.y}))(c)+"z"}function c(t,e,n){let r=t.map((t=>Math.round(t.length/e))),o=a.czq(r);for(;o>n;)r[a.z94(t,((t,n)=>0!==t.length?t.length/e-r[n]:1/0))]-=1,o=a.czq(r);for(;o<n;)r[a.P2Z(t,((t,n)=>0!==t.length?t.length/e-r[n]:-1/0))]+=1,o=a.czq(r);return r}function i(t,e){const n=(0,r.useRef)({value:t,prev:null}),a=n.current.value;return(e?e(t,a):t===a)||(n.current={value:t,prev:a}),n.current.prev}const l=t=>a.dM(a.m4Y([.2,1])(t))},63:(t,e,n)=>{n.a(t,(async(t,a)=>{try{n.d(e,{Vk:()=>c,Zl:()=>i,jx:()=>l,pk:()=>s});var r=n(829),o=t([r]);r=(o.then?(await o)():o)[0];const s=1200,c="scens",i="delivs",l=await async function(){const t=await(await fetch("./all_objectives.json")).json();for(const e of t){for(const t of e[c])t[i]=t[i].map((t=>Math.min(Math.max(0,t),s))).sort(((t,e)=>e-t));e[c]=(0,r.Et)(e[c],(t=>{let{name:e}=t;return e}))}return console.log("DATA: loading objectives data"),(0,r.Et)(t,(t=>{let{obj:e}=t;return e}))}();a()}catch(s){a(s)}}),1)},829:(t,e,n)=>{n.a(t,(async(t,a)=>{try{n.d(e,{C5:()=>m,Et:()=>d,XC:()=>p,Yb:()=>j,cv:()=>w,hh:()=>b,nC:()=>k,si:()=>f,xC:()=>y});var r=n(487),o=n(783),s=n.n(o),c=n(43),i=n(63),l=n(684),u=t([i]);function d(t,e){const n=Object.groupBy(t,e);for(const a of Object.keys(n))n[a]=n[a][0];return n}i=(u.then?(await u)():u)[0];const p={draw:function(t,e){t.moveTo(0,-e/2),t.lineTo(e/4,-e/4),t.arc(0,0,e/Math.sqrt(2)/2,-Math.PI/4,5*Math.PI/4),t.lineTo(0,-e/2),t.closePath()}};function f(t){return(3.1304*t**3-4.2384*t**2+3.3471*t+.0298)/2.4}function m(t,e){return function(n){return e.map((function(e){return[e,r.i2o(n,(function(n){return t(e-n)}))]}))}}function y(t){return function(e){return Math.abs(e/=t)<=1?.75*(1-e*e)/t:0}}function v(t){const e=t/2,n=3*Math.PI/2/20,a=[{x:Math.cos(5*Math.PI/4)*e,y:Math.sin(5*Math.PI/4)*e},{x:0,y:-Math.SQRT2*e}];for(let r=0;r<=20;r++)a.push({x:Math.cos(r*n-Math.PI/4)*e,y:Math.sin(r*n-Math.PI/4)*e});return a}function x(t,e){const n=s().Bounds.create(t),a=n.min.x,o=n.max.x,c=n.min.y,i=n.max.y,l=r.m4Y([a,o]),u=r.m4Y([c,i]),h=[];for(let r=0;r<e;r++)for(;;){const e=l(Math.random()),n=u(Math.random());if(s().Vertices.contains(t,{x:e,y:n})){h.push([e,n]);break}}return h}const g=function(){const t=v(1.4),e=v(1),n=[];for(let a=0;a<t.length-1;a++)n.push([t[a],t[a+1],e[a+1],e[a]]);return n}();let M;function b(t,e,n){M=M||x(v(1),n.length);const a=r.i2o(n.map((t=>{let{r:e}=t;return 2*e})))*Math.floor(Math.sqrt(n.length)),o=M.map((t=>{let[e,n]=t;return[e*a/2,n*a/2]})),c=s().Engine,i=s().Bodies,l=s().Composite,u=c.create(),h=o.sort(((t,e)=>e[1]-t[1])),d=n.map(((n,a)=>{let{r:r,id:o}=n;const[s,c]=h[a];return i.circle(s+t,c+e,2*r,{restitution:0,id:o})})),p=g.map((t=>s().Body.create({position:s().Vertices.centre(t),vertices:t,isStatic:!0}))),f=s().Body.create({isStatic:!0});s().Body.setParts(f,p),s().Body.scale(f,1.4*a,1.4*a),s().Body.translate(f,{x:t,y:e+a/2*.4}),l.add(u.world,[...d,f]);for(let r=0,s=60;r<1*s;r++)c.update(u,1e3/s);return d.map((t=>{let{position:e,id:n}=t;return{id:n,x:e.x,y:e.y}}))}function k(t,e){const[n,a]=(0,c.useState)(t);return[(0,c.useMemo)((()=>e(n)),[n]),(0,c.useCallback)((t=>{a(e(t))}),[])]}function w(t,e,n){const a=n[t][i.Vk][e][i.Zl];return r.m4Y().domain((0,l.kd)(0,1,a.length)).range(a.map((t=>Math.min(1,t/1200)||0))).clamp(!0)}function j(t,e,n){return"median"===t?Object.keys(e[n][i.Vk]).sort(((t,a)=>r.i2o(e[n][i.Vk][t][i.Zl])-r.i2o(e[n][i.Vk][a][i.Zl]))):"deliveries"===t?Object.keys(e[n][i.Vk]).sort(((t,a)=>r.T9B(e[n][i.Vk][t][i.Zl])-r.T9B(e[n][i.Vk][a][i.Zl]))):void 0}a()}catch(h){a(h)}}))}}]);
//# sourceMappingURL=746.d35fed60.chunk.js.map