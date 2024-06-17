"use strict";(self.webpackChunkbuckets=self.webpackChunkbuckets||[]).push([[746],{746:(t,e,n)=>{n.a(t,(async(t,a)=>{try{n.r(e),n.d(e,{default:()=>M});var r=n(243),c=n(43),o=n(684),s=n(63),i=n(829),l=n(475),u=n(579),h=t([s,i]);[s,i]=h.then?(await h)():h;const m=5,p=2,f=7,y=.1,x=2.5,v=1;function M(t){let{watercolor:e=!1}=t;const{current:n}=(0,c.useRef)(Object.keys(s.jx)),a=(0,c.useRef)(),[h,d]=(0,c.useState)(p),[M,b]=(0,c.useState)(!1),[g]=(0,l.ok)(),k=(0,c.useRef)(),j=(0,c.useMemo)((()=>(0,i.Yb)("median",s.jx,n[h]).reverse()),[h]),w=(0,c.useMemo)((()=>j.map((t=>{const e=(0,i.cv)(n[h],t,s.jx,s.pk);return(0,o.kd)(0,1,m+1).map(((t,n)=>e(t)))}))),[h]);return(0,c.useLayoutEffect)((()=>{a.current={width:window.innerWidth,height:window.innerHeight},k.current.attr("width",a.current.width).attr("height",a.current.height),g.get("obj")&&n.includes(g.get("obj"))&&(d(n.indexOf(g.get("obj"))),b("true"==g.get("norm")))}),[]),(0,c.useLayoutEffect)((()=>{const t=a.current.width,e=a.current.height,n=(0,i.hh)(t/2,e/2,w.map(((t,e)=>({r:1*(M?1:Math.max(t[0],y))*f*x,id:e})))).map((t=>{let{id:e,x:n,y:a}=t;return{levs:w[e].map(((t,n)=>1*Math.max(t,0==n?y:0)*(M?1/Math.max(w[e][0],y):1)*f)),maxLev:(M?1:1*Math.max(w[e][0],y))*f,tilt:50*Math.random()-25,dur:100*Math.random()+400,startX:n,startY:a-4*f*Math.random(),endX:n,endY:a}}));k.current.selectAll(".smallDrop").data(n,((t,e)=>e)).join((t=>t.append("g").attr("class","smallDrop").each((function(t,e){let{levs:n}=t;r.Ltv(this).append("defs").append("clipPath").attr("id","drop-mask-"+e).append("path").attr("d",i.js),r.Ltv(this).append("g").attr("clip-path","url(#drop-mask-".concat(e,")")).selectAll("rect").data(n,((t,e)=>e)).join("rect").attr("fill",((t,e)=>(0,o.YW)(e/m)))})))).attr("transform",(t=>{let{startX:e,startY:n,tilt:a}=t;return"translate(".concat(e,", ").concat(n,") rotate(").concat(a,")")})).style("opacity",0).each((function(t){let{levs:e,maxLev:n}=t;r.Ltv(this).selectAll("rect").data(e,((t,e)=>e)).attr("width",2*n).attr("height",2*n).attr("x",-n).attr("y",(t=>n*Math.SQRT1_2-(0,i.si)(t/n)*(n*(1+Math.SQRT1_2))+(0===t?v:0))),r.Ltv(this).select("path").attr("transform","scale(".concat(n,")"))})).call((t=>{t.transition().duration((t=>{let{dur:e}=t;return e})).ease(r.yfw).attr("transform",(t=>{let{endX:e,endY:n,tilt:a}=t;return"translate(".concat(e,", ").concat(n,") rotate(").concat(a,")")})).style("opacity",1)}))}),[w,M]),(0,u.jsxs)("div",{className:"bubbles-wrapper",children:[(0,u.jsxs)("div",{className:"bubbles-input-area",children:[(0,u.jsx)("select",{value:h,onChange:t=>d(parseInt(t.target.value)),children:n.map(((t,e)=>(0,u.jsx)("option",{name:e,value:e,children:t},e)))}),(0,u.jsx)("input",{type:"checkbox",id:"norm",checked:M,onChange:()=>{b((t=>!t))}}),(0,u.jsx)("label",{htmlFor:"norm",children:"normalize"})]}),(0,u.jsx)("div",{className:"bubbles-svg-wrapper"+(e?"-painter":""),children:(0,u.jsx)("svg",{className:"bubbles-svg"+(e?"-painter":""),ref:t=>{k.current=r.Ltv(t)}})})]})}a()}catch(d){a(d)}}))},684:(t,e,n)=>{n.d(e,{Q2:()=>s,YW:()=>l,ZC:()=>i,kd:()=>c,wh:()=>o});var a=n(243),r=n(43);function c(t,e,n){return a.y17(n).map((a=>a/(n-1)*(e-t)+t))}function o(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.8,c=t*r+t*(1-r)/2,o=t*(1-r)/2,s=[{x:a.GWP(c,t)(n),y:a.GWP(e,0)(n)},{x:c,y:e},{x:o,y:e},{x:a.GWP(o,0)(n),y:a.GWP(e,0)(n)}];return a.n8j().x((function(t){return t.x})).y((function(t){return t.y}))(s)+"z"}function s(t,e,n){let r=t.map((t=>Math.round(t.length/e))),c=a.czq(r);for(;c>n;)r[a.z94(t,((t,n)=>0!==t.length?t.length/e-r[n]:1/0))]-=1,c=a.czq(r);for(;c<n;)r[a.P2Z(t,((t,n)=>0!==t.length?t.length/e-r[n]:-1/0))]+=1,c=a.czq(r);return r}function i(t,e){const n=(0,r.useRef)({value:t,prev:null}),a=n.current.value;return(e?e(t,a):t===a)||(n.current={value:t,prev:a}),n.current.prev}const l=t=>a.dM(a.m4Y([.2,1])(t))},63:(t,e,n)=>{n.a(t,(async(t,a)=>{try{n.d(e,{Vk:()=>s,Zl:()=>i,jx:()=>l,pk:()=>o});var r=n(829),c=t([r]);r=(c.then?(await c)():c)[0];const o=1200,s="scens",i="delivs",l=await async function(){const t=await(await fetch("./all_objectives.json")).json();for(const e of t){e[s]=e[s];for(const t of e[s])t[i]=t[i].map((t=>Math.min(Math.max(0,t),o))).sort(((t,e)=>e-t));e[s]=(0,r.Et)(e[s],(t=>{let{name:e}=t;return e}))}return console.log("DATA: loading objectives data"),(0,r.Et)(t,(t=>{let{obj:e}=t;return e}))}();a()}catch(o){a(o)}}),1)},829:(t,e,n)=>{n.a(t,(async(t,a)=>{try{n.d(e,{C5:()=>y,Et:()=>d,XC:()=>m,Yb:()=>C,cv:()=>P,hh:()=>j,js:()=>p,nC:()=>w,si:()=>f,xC:()=>x});var r=n(243),c=n(783),o=n.n(c),s=n(43),i=n(63),l=n(684),u=t([i]);function d(t,e){const n=Object.groupBy(t,e);for(const a of Object.keys(n))n[a]=n[a][0];return n}i=(u.then?(await u)():u)[0];const m={draw:function(t,e){t.moveTo(0,-e/2),t.lineTo(e/4,-e/4),t.arc(0,0,e/Math.SQRT2/2,-Math.PI/4,5*Math.PI/4),t.lineTo(0,-e/2),t.closePath()}},p="M0,-1L0.5,-0.5A0.707,0.707,0,1,1,-0.5,-0.5L0,-1Z";function f(t){return t-=.0088,Math.min(1,Math.max(0,(3.1304*t**3-4.2384*t**2+3.3471*t+.0298)/2.2326))}function y(t,e){return function(n){return e.map((function(e){return[e,r.i2o(n,(function(n){return t(e-n)}))]}))}}function x(t){return function(e){return Math.abs(e/=t)<=1?.75*(1-e*e)/t:0}}function v(t){const e=t/2,n=3*Math.PI/2/16,a=[{x:Math.cos(5*Math.PI/4)*e,y:Math.sin(5*Math.PI/4)*e},{x:0,y:-Math.SQRT2*e}];for(let r=0;r<=16;r++)a.push({x:Math.cos(r*n-Math.PI/4)*e,y:Math.sin(r*n-Math.PI/4)*e});return a}function M(t,e){const n=o().Bounds.create(t),a=n.min.x,c=n.max.x,s=n.min.y,i=n.max.y,l=r.m4Y([a,c]),u=r.m4Y([s,i]),h=[];for(let r=0;r<e;r++)for(;;){const e=l(Math.random()),n=u(Math.random());if(o().Vertices.contains(t,{x:e,y:n})){h.push([e,n]);break}}return h}const b=function(){const t=v(3),e=v(1),n=[];for(let a=0;a<t.length-2;a++)n.push([t[a],t[a+(a<2?1:2)],e[a+(a<2?1:2)],e[a]]);return n}();let g,k;function j(t,e,n){g&&n.length===k||(g=r.y17(4).map((()=>M(v(1),k=n.length))));const a=r.czq(n.map((t=>{let{r:e}=t;return e**2*3.14}))),c=Math.floor(2*Math.sqrt(a/3.14)/2),s=g[Math.floor(Math.random()*g.length)].map((t=>{let[e,n]=t;return[e*c,n*c]})),i=o().Engine,l=o().Bodies,u=o().Composite,h=i.create(),d=s.sort(((t,e)=>e[1]-t[1])),m=n.map(((t,e)=>{let{r:n,id:a}=t;const[r,c]=d[e];return l.circle(r,c,n,{restitution:0,id:a})})),p=b.map((t=>o().Body.create({position:o().Vertices.centre(t),vertices:t,isStatic:!0}))),f=o().Body.create({isStatic:!0});o().Body.setParts(f,p),o().Body.setCentre(f,{x:0,y:0}),o().Body.scale(f,1.1*c,1.1*c),u.add(h.world,[...m,f]);for(let r=0,o=60,y=.3;r<o*y;r++)i.update(h,1e3/o);return m.map((n=>{let{position:a,id:r}=n;return{id:r,x:a.x+t,y:a.y+e+.1*c}}))}function w(t,e){const[n,a]=(0,s.useState)(t);return[(0,s.useMemo)((()=>e(n)),[n]),(0,s.useCallback)((t=>{a(e(t))}),[])]}function P(t,e,n,a){const c=n[t][i.Vk][e][i.Zl];return r.m4Y().domain((0,l.kd)(0,1,c.length)).range(c.map((t=>Math.min(1,t/a)||0))).clamp(!0)}function C(t,e,n){return"median"===t?Object.keys(e[n][i.Vk]).sort(((t,a)=>r.i2o(e[n][i.Vk][t][i.Zl])-r.i2o(e[n][i.Vk][a][i.Zl]))):"deliveries"===t?Object.keys(e[n][i.Vk]).sort(((t,a)=>r.T9B(e[n][i.Vk][t][i.Zl])-r.T9B(e[n][i.Vk][a][i.Zl]))):"alphabetical"===t?Object.keys(e[n][i.Vk]).sort():void 0}a()}catch(h){a(h)}}))}}]);
//# sourceMappingURL=746.6d11544e.chunk.js.map