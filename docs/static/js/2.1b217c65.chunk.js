"use strict";(self.webpackChunkbuckets=self.webpackChunkbuckets||[]).push([[2,746],{746:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.r(e),n.d(e,{default:()=>x});var a=n(243),o=n(43),c=n(684),s=n(63),i=n(829),l=n(475),u=n(579),h=t([s,i]);[s,i]=h.then?(await h)():h;const p=5,f=2,m=7,y="M0,-10L5,-5A7.071,7.071,0,1,1,-5,-5L0,-10Z",v=4;function x(t){let{watercolor:e=!1}=t;const{current:n}=(0,o.useRef)(Object.keys(s.jx)),r=(0,o.useRef)(),[h,d]=(0,o.useState)(f),[x,g]=(0,o.useState)(!1),[b,M]=(0,l.ok)(),k=(0,o.useRef)(),j=(0,o.useMemo)((()=>(0,i.Yb)("median",s.jx,n[h]).reverse()),[h]),w=(0,o.useMemo)((()=>j.map((t=>{const e=(0,i.cv)(n[h],t,s.jx,s.pk);return(0,c.kd)(0,1,p+1).map(((t,n)=>e(t)))}))),[h]);return(0,o.useLayoutEffect)((()=>{r.current={width:window.innerWidth,height:window.innerHeight},k.current.attr("width",window.innerWidth).attr("height",window.innerHeight),b.get("obj")&&n.includes(b.get("obj"))&&(d(n.indexOf(b.get("obj"))),g("true"==b.get("norm")))}),[]),(0,o.useLayoutEffect)((()=>{const t=r.current.width,e=r.current.height,n=(0,i.hh)(t/2,e/2,w.map(((t,e)=>({r:1*(x?1:t[0])*m*2.5,id:e})))).map((t=>{let{id:e,x:n,y:r}=t;return{levs:w[e].map((t=>1*t*(x?1/w[e][0]:1))),maxLev:x?1:1*Math.max(w[e][0],.1),tilt:50*Math.random()-25,dur:100*Math.random()+400,startX:n,startY:r-4*m*Math.random(),endX:n,endY:r}}));k.current.selectAll(".smallDrop").data(n,((t,e)=>e)).join((t=>t.append("g").attr("class","smallDrop").each((function(t,e){let{levs:n,maxLev:r}=t;a.Ltv(this).append("defs").append("clipPath").attr("id","drop-mask-"+e).append("path").attr("d",y),a.Ltv(this).append("g").attr("clip-path","url(#drop-mask-".concat(e,")")).selectAll("rect").data(n,((t,e)=>e)).join("rect").attr("fill",((t,e)=>(0,c.YW)(e/p)))})))).attr("transform",(t=>{let{startX:e,startY:n,tilt:r}=t;return"translate(".concat(e,", ").concat(n,") rotate(").concat(r,")")})).style("opacity",0).each((function(t){let{levs:e,maxLev:n}=t;a.Ltv(this).selectAll("rect").data(e,((t,e)=>e)).attr("width",n*m*2).attr("height",n*m*2).attr("x",-n*m*2/2).attr("y",(t=>n*m*2/2-(0,i.si)(t/n)*(n*m*2))),a.Ltv(this).select("path").attr("transform","scale(".concat(n*m/2/Math.SQRT2/v,")"))})).call((t=>{t.transition().duration((t=>{let{dur:e}=t;return e})).ease(a.yfw).attr("transform",(t=>{let{endX:e,endY:n,tilt:r}=t;return"translate(".concat(e,", ").concat(n,") rotate(").concat(r,")")})).style("opacity",1)}))}),[w,x]),(0,u.jsxs)("div",{className:"bubbles-wrapper",children:[(0,u.jsxs)("div",{className:"bubbles-input-area",children:[(0,u.jsx)("select",{value:h,onChange:t=>d(parseInt(t.target.value)),children:n.map(((t,e)=>(0,u.jsx)("option",{name:e,value:e,children:t},e)))}),(0,u.jsx)("input",{type:"checkbox",id:"norm",checked:x,onChange:()=>{g((t=>!t))}}),(0,u.jsx)("label",{htmlFor:"norm",children:"normalize"})]}),(0,u.jsx)("div",{className:"bubbles-svg-wrapper"+(e?"-painter":""),children:(0,u.jsx)("svg",{className:"bubbles-svg"+(e?"-painter":""),ref:t=>{k.current=a.Ltv(t)}})})]})}r()}catch(d){r(d)}}))},2:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.r(e),n.d(e,{default:()=>i});var a=n(746),o=n(579),c=t([a]);function i(){return(0,o.jsx)(a.default,{watercolor:!0})}a=(c.then?(await c)():c)[0],r()}catch(s){r(s)}}))},684:(t,e,n)=>{n.d(e,{Q2:()=>s,YW:()=>l,ZC:()=>i,kd:()=>o,wh:()=>c});var r=n(243),a=n(43);function o(t,e,n){return r.y17(n).map((r=>r/(n-1)*(e-t)+t))}function c(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.8,o=t*a+t*(1-a)/2,c=t*(1-a)/2,s=[{x:r.GWP(o,t)(n),y:r.GWP(e,0)(n)},{x:o,y:e},{x:c,y:e},{x:r.GWP(c,0)(n),y:r.GWP(e,0)(n)}];return r.n8j().x((function(t){return t.x})).y((function(t){return t.y}))(s)+"z"}function s(t,e,n){let a=t.map((t=>Math.round(t.length/e))),o=r.czq(a);for(;o>n;)a[r.z94(t,((t,n)=>0!==t.length?t.length/e-a[n]:1/0))]-=1,o=r.czq(a);for(;o<n;)a[r.P2Z(t,((t,n)=>0!==t.length?t.length/e-a[n]:-1/0))]+=1,o=r.czq(a);return a}function i(t,e){const n=(0,a.useRef)({value:t,prev:null}),r=n.current.value;return(e?e(t,r):t===r)||(n.current={value:t,prev:r}),n.current.prev}const l=t=>r.dM(r.m4Y([.2,1])(t))},63:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.d(e,{Vk:()=>s,Zl:()=>i,jx:()=>l,pk:()=>c});var a=n(829),o=t([a]);a=(o.then?(await o)():o)[0];const c=1200,s="scens",i="delivs",l=await async function(){const t=await(await fetch("./all_objectives.json")).json();for(const e of t){e[s]=e[s];for(const t of e[s])t[i]=t[i].map((t=>Math.min(Math.max(0,t),c))).sort(((t,e)=>e-t));e[s]=(0,a.Et)(e[s],(t=>{let{name:e}=t;return e}))}return console.log("DATA: loading objectives data"),(0,a.Et)(t,(t=>{let{obj:e}=t;return e}))}();r()}catch(c){r(c)}}),1)},829:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.d(e,{C5:()=>m,Et:()=>d,XC:()=>p,Yb:()=>P,cv:()=>w,hh:()=>k,nC:()=>j,si:()=>f,xC:()=>y});var a=n(243),o=n(783),c=n.n(o),s=n(43),i=n(63),l=n(684),u=t([i]);function d(t,e){const n=Object.groupBy(t,e);for(const r of Object.keys(n))n[r]=n[r][0];return n}i=(u.then?(await u)():u)[0];const p={draw:function(t,e){t.moveTo(0,-e/2),t.lineTo(e/4,-e/4),t.arc(0,0,e/Math.sqrt(2)/2,-Math.PI/4,5*Math.PI/4),t.lineTo(0,-e/2),t.closePath()}};function f(t){return(3.1304*t**3-4.2384*t**2+3.3471*t+.0298)/2.4}function m(t,e){return function(n){return e.map((function(e){return[e,a.i2o(n,(function(n){return t(e-n)}))]}))}}function y(t){return function(e){return Math.abs(e/=t)<=1?.75*(1-e*e)/t:0}}function v(t){const e=t/2,n=3*Math.PI/2/16,r=[{x:Math.cos(5*Math.PI/4)*e,y:Math.sin(5*Math.PI/4)*e},{x:0,y:-Math.SQRT2*e}];for(let a=0;a<=16;a++)r.push({x:Math.cos(a*n-Math.PI/4)*e,y:Math.sin(a*n-Math.PI/4)*e});return r}function x(t,e){const n=c().Bounds.create(t),r=n.min.x,o=n.max.x,s=n.min.y,i=n.max.y,l=a.m4Y([r,o]),u=a.m4Y([s,i]),h=[];for(let a=0;a<e;a++)for(;;){const e=l(Math.random()),n=u(Math.random());if(c().Vertices.contains(t,{x:e,y:n})){h.push([e,n]);break}}return h}const g=function(){const t=v(3),e=v(1),n=[];for(let r=0;r<t.length-2;r++)n.push([t[r],t[r+(r<2?1:2)],e[r+(r<2?1:2)],e[r]]);return n}();let b,M;function k(t,e,n){b&&n.length===M||(b=a.y17(4).map((()=>x(v(1),M=n.length))));const r=a.czq(n.map((t=>{let{r:e}=t;return e**2*3.14}))),o=Math.floor(2*Math.sqrt(r/3.14)/2),s=b[Math.floor(Math.random()*b.length)].map((t=>{let[e,n]=t;return[e*o,n*o]})),i=c().Engine,l=c().Bodies,u=c().Composite,h=i.create(),d=s.sort(((t,e)=>e[1]-t[1])),p=n.map(((t,e)=>{let{r:n,id:r}=t;const[a,o]=d[e];return l.circle(a,o,n,{restitution:0,id:r})})),f=g.map((t=>c().Body.create({position:c().Vertices.centre(t),vertices:t,isStatic:!0}))),m=c().Body.create({isStatic:!0});c().Body.setParts(m,f),c().Body.setCentre(m,{x:0,y:0}),c().Body.scale(m,1.1*o,1.1*o),u.add(h.world,[...p,m]);for(let a=0,c=60,y=.3;a<c*y;a++)i.update(h,1e3/c);return p.map((n=>{let{position:r,id:a}=n;return{id:a,x:r.x+t,y:r.y+e+.1*o}}))}function j(t,e){const[n,r]=(0,s.useState)(t);return[(0,s.useMemo)((()=>e(n)),[n]),(0,s.useCallback)((t=>{r(e(t))}),[])]}function w(t,e,n,r){const o=n[t][i.Vk][e][i.Zl];return a.m4Y().domain((0,l.kd)(0,1,o.length)).range(o.map((t=>Math.min(1,t/r)||0))).clamp(!0)}function P(t,e,n){return"median"===t?Object.keys(e[n][i.Vk]).sort(((t,r)=>a.i2o(e[n][i.Vk][t][i.Zl])-a.i2o(e[n][i.Vk][r][i.Zl]))):"deliveries"===t?Object.keys(e[n][i.Vk]).sort(((t,r)=>a.T9B(e[n][i.Vk][t][i.Zl])-a.T9B(e[n][i.Vk][r][i.Zl]))):void 0}r()}catch(h){r(h)}}))}}]);
//# sourceMappingURL=2.1b217c65.chunk.js.map