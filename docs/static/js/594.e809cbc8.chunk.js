"use strict";(self.webpackChunkbuckets=self.webpackChunkbuckets||[]).push([[594],{594:(t,e,n)=>{n.a(t,(async(t,a)=>{try{n.r(e),n.d(e,{default:()=>b});var r=n(243),o=n(43),c=n(684),s=n(63),i=n(829),l=n(216),h=n(579),u=t([s,i]);[s,i]=u.then?(await u)():u;const p=5,m=3,f=.1,y=20,v=1.5,x=1;function b(t){let{watercolor:e=!1}=t;const{current:n}=(0,o.useRef)(Object.keys(s.jx)),a=(0,l.Zp)(),u=(0,o.useRef)(),[d,b]=(0,o.useState)(!1),g=(0,o.useRef)(),M=(0,o.useRef)(),j=(0,o.useMemo)((()=>{const t={},e={};n.forEach((e=>t[e]=(0,i.Yb)("median",s.jx,e).filter(((t,e)=>e%y==0)).reverse()));const a=Math.floor(t[n[0]].length/2);return n.sort(((e,n)=>r.JZy(s.jx[e][s.Vk][t[e][a]][s.Zl])-r.JZy(s.jx[n][s.Vk][t[n][a]][s.Zl]))).forEach((n=>{e[n]=t[n]})),e}),[]),k=(0,o.useMemo)((()=>{const t={};return n.forEach((e=>{t[e]=j[e].map((t=>{const n=(0,i.cv)(e,t,s.jx,s.pk);return(0,c.kd)(0,1,p+1).map((t=>n(t)))}))})),t}),[]);return(0,o.useLayoutEffect)((()=>{u.current={width:window.innerWidth,height:window.innerHeight},g.current.attr("width",u.current.width).attr("height",u.current.height)}),[]),(0,o.useLayoutEffect)((()=>{const t=u.current.width,e=u.current.height,n=Object.keys(k).map((t=>(0,i.hh)(0,0,k[t].map(((t,e)=>({r:Math.max(2,1*(d?1:Math.max(t[0],f))*m*v),id:e})))).map((e=>{let{id:n,x:a,y:r}=e;return{levs:k[t][n].map(((e,a)=>1*Math.max(e,0==a?f:0)*(d?1/Math.max(k[t][n][0],f):1)*m)),maxLev:(d?1:1*Math.max(k[t][n][0],f))*m,tilt:50*Math.random()-25,dur:100*Math.random()+400,startX:a,startY:r,obj:t}})))).reverse(),o={},s=(0,i.hh)(0,0,n.map(((t,e)=>({r:o[e]=Math.max(1,8*Math.sqrt(r.czq(t.map((t=>t.maxLev)))/Math.PI)),id:e})))).map(((t,e)=>{let{x:n,y:a}=t;return{x:n,y:a,tilt:50*Math.random()-25,r:o[e]}}));M.current=g.current.selectAll(".largeDrop").data(n,((t,e)=>t[0].obj)).join((t=>t.append("g").each((function(t,e){const n=r.Ltv(this);0==e&&g.current.append("rect").attr("id","overlay").attr("pointer-events","none").attr("width",u.current.width).attr("height",u.current.height).attr("fill","white").attr("opacity",.5).attr("visibility","hidden"),r.Ltv(this.parentNode).append("text").attr("text-anchor","middle").attr("id","drop-".concat(e)),n.append("g").attr("class","rotateClass"),n.append("rect").attr("class","bbox").style("visibility","hidden"),n.on("mouseover",(function(){r.Ltv("#drop-".concat(e)).style("opacity",1),r.Ltv("#overlay").style("visibility","visible"),r.Ltv(this).raise()})).on("mouseout",(function(){r.Ltv("#drop-".concat(e)).style("opacity",0),r.Ltv(this).lower(),r.Ltv("#overlay").style("visibility","hidden")}))})))).attr("class","largeDrop").attr("transform",((n,a)=>"translate(".concat(s[a].x+t/2,", ").concat(s[a].y+e/2,")"))).each((function(t,e){const n=r.Ltv(this);r.Ltv("#drop-".concat(e)).text(t[0].obj).style("opacity",0),r.Ltv(this).select(".rotateClass").attr("transform","rotate(".concat(s[e].tilt,")")).selectAll(".smallDrop").data(t,((t,e)=>e)).join((t=>t.append("g").attr("class","smallDrop").each((function(t,n){let{levs:a}=t;r.Ltv(this).append("defs").append("clipPath").attr("id","drop-mask-".concat(e,"-").concat(n)).append("path").attr("d",i.js),r.Ltv(this).append("g").attr("clip-path","url(#drop-mask-".concat(e,"-").concat(n,")")).selectAll("rect").data(a,((t,e)=>e)).join("rect").attr("fill",((t,e)=>(0,c.YW)(e/p)))})))).attr("transform",(t=>{let{startX:e,startY:n,tilt:a}=t;return"translate(".concat(e,", ").concat(n,") rotate(").concat(a,")")})).each((function(t){let{levs:e,maxLev:n}=t;r.Ltv(this).selectAll("rect").data(e,((t,e)=>e)).attr("width",2*n).attr("height",2*n).attr("x",-n).attr("y",(t=>n*Math.SQRT1_2-(0,i.si)(t/n)*(n*(1+Math.SQRT1_2))+(0===t?x:0))),r.Ltv(this).select("path").attr("transform","scale(".concat(n,")"))}));const o=n.select(".rotateClass");n.on("click",(function(){a("/RecursiveDropletsBasicApp?obj=".concat(t[0].obj,"&norm=").concat(d?"true":"false"))})),n.select(".bbox").attr("x",o.node().getBBox().x).attr("y",o.node().getBBox().y).attr("width",o.node().getBBox().width).attr("height",o.node().getBBox().height),g.current.select("#drop-".concat(e)).attr("x",o.node().getBoundingClientRect().x+o.node().getBoundingClientRect().width/2).attr("y",o.node().getBoundingClientRect().y)}))}),[k,d]),(0,h.jsxs)("div",{className:"bubbles-wrapper",children:[(0,h.jsxs)("div",{className:"bubbles-input-area",children:[(0,h.jsx)("input",{type:"checkbox",id:"norm",checked:d,onChange:()=>{b((t=>!t))}}),(0,h.jsx)("label",{htmlFor:"norm",children:"normalize"})]}),(0,h.jsx)("div",{className:"bubbles-svg-wrapper"+(e?"-painter":""),children:(0,h.jsx)("svg",{className:"bubbles-svg"+(e?"-painter":""),ref:t=>{g.current=r.Ltv(t)}})})]})}a()}catch(d){a(d)}}))},684:(t,e,n)=>{n.d(e,{Q2:()=>s,YW:()=>l,ZC:()=>i,kd:()=>o,wh:()=>c});var a=n(243),r=n(43);function o(t,e,n){return a.y17(n).map((a=>a/(n-1)*(e-t)+t))}function c(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.8,o=t*r+t*(1-r)/2,c=t*(1-r)/2,s=[{x:a.GWP(o,t)(n),y:a.GWP(e,0)(n)},{x:o,y:e},{x:c,y:e},{x:a.GWP(c,0)(n),y:a.GWP(e,0)(n)}];return a.n8j().x((function(t){return t.x})).y((function(t){return t.y}))(s)+"z"}function s(t,e,n){let r=t.map((t=>Math.round(t.length/e))),o=a.czq(r);for(;o>n;)r[a.z94(t,((t,n)=>0!==t.length?t.length/e-r[n]:1/0))]-=1,o=a.czq(r);for(;o<n;)r[a.P2Z(t,((t,n)=>0!==t.length?t.length/e-r[n]:-1/0))]+=1,o=a.czq(r);return r}function i(t,e){const n=(0,r.useRef)({value:t,prev:null}),a=n.current.value;return(e?e(t,a):t===a)||(n.current={value:t,prev:a}),n.current.prev}const l=t=>a.dM(a.m4Y([.2,1])(t))},63:(t,e,n)=>{n.a(t,(async(t,a)=>{try{n.d(e,{Vk:()=>s,Zl:()=>i,jx:()=>l,pk:()=>c});var r=n(829),o=t([r]);r=(o.then?(await o)():o)[0];const c=1200,s="scens",i="delivs",l=await async function(){const t=await(await fetch("./all_objectives.json")).json();for(const e of t){e[s]=e[s];for(const t of e[s])t[i]=t[i].map((t=>Math.min(Math.max(0,t),c))).sort(((t,e)=>e-t));e[s]=(0,r.Et)(e[s],(t=>{let{name:e}=t;return e}))}return console.log("DATA: loading objectives data"),(0,r.Et)(t,(t=>{let{obj:e}=t;return e}))}();a()}catch(c){a(c)}}),1)},829:(t,e,n)=>{n.a(t,(async(t,a)=>{try{n.d(e,{C5:()=>y,Et:()=>d,XC:()=>p,Yb:()=>B,cv:()=>L,hh:()=>k,js:()=>m,nC:()=>w,si:()=>f,xC:()=>v});var r=n(243),o=n(783),c=n.n(o),s=n(43),i=n(63),l=n(684),h=t([i]);function d(t,e){const n=Object.groupBy(t,e);for(const a of Object.keys(n))n[a]=n[a][0];return n}i=(h.then?(await h)():h)[0];const p={draw:function(t,e){t.moveTo(0,-e/2),t.lineTo(e/4,-e/4),t.arc(0,0,e/Math.SQRT2/2,-Math.PI/4,5*Math.PI/4),t.lineTo(0,-e/2),t.closePath()}},m="M0,-1L0.5,-0.5A0.707,0.707,0,1,1,-0.5,-0.5L0,-1Z";function f(t){return t-=.0088,Math.min(1,Math.max(0,(3.1304*t**3-4.2384*t**2+3.3471*t+.0298)/2.2326))}function y(t,e){return function(n){return e.map((function(e){return[e,r.i2o(n,(function(n){return t(e-n)}))]}))}}function v(t){return function(e){return Math.abs(e/=t)<=1?.75*(1-e*e)/t:0}}function x(t){const e=t/2,n=3*Math.PI/2/16,a=[{x:Math.cos(5*Math.PI/4)*e,y:Math.sin(5*Math.PI/4)*e},{x:0,y:-Math.SQRT2*e}];for(let r=0;r<=16;r++)a.push({x:Math.cos(r*n-Math.PI/4)*e,y:Math.sin(r*n-Math.PI/4)*e});return a}function b(t,e){const n=c().Bounds.create(t),a=n.min.x,o=n.max.x,s=n.min.y,i=n.max.y,l=r.m4Y([a,o]),h=r.m4Y([s,i]),u=[];for(let r=0;r<e;r++)for(;;){const e=l(Math.random()),n=h(Math.random());if(c().Vertices.contains(t,{x:e,y:n})){u.push([e,n]);break}}return u}const g=function(){const t=x(3),e=x(1),n=[];for(let a=0;a<t.length-2;a++)n.push([t[a],t[a+(a<2?1:2)],e[a+(a<2?1:2)],e[a]]);return n}();let M,j;function k(t,e,n){M&&n.length===j||(M=r.y17(4).map((()=>b(x(1),j=n.length))));const a=r.czq(n.map((t=>{let{r:e}=t;return e**2*3.14}))),o=Math.floor(2*Math.sqrt(a/3.14)/2),s=M[Math.floor(Math.random()*M.length)].map((t=>{let[e,n]=t;return[e*o,n*o]})),i=c().Engine,l=c().Bodies,h=c().Composite,u=i.create(),d=s.sort(((t,e)=>e[1]-t[1])),p=n.map(((t,e)=>{let{r:n,id:a}=t;const[r,o]=d[e];return l.circle(r,o,n,{restitution:0,id:a})})),m=g.map((t=>c().Body.create({position:c().Vertices.centre(t),vertices:t,isStatic:!0}))),f=c().Body.create({isStatic:!0});c().Body.setParts(f,m),c().Body.setCentre(f,{x:0,y:0}),c().Body.scale(f,1.1*o,1.1*o),h.add(u.world,[...p,f]);for(let r=0,c=60,y=.3;r<c*y;r++)i.update(u,1e3/c);return p.map((n=>{let{position:a,id:r}=n;return{id:r,x:a.x+t,y:a.y+e+.1*o}}))}function w(t,e){const[n,a]=(0,s.useState)(t);return[(0,s.useMemo)((()=>e(n)),[n]),(0,s.useCallback)((t=>{a(e(t))}),[])]}function L(t,e,n,a){const o=n[t][i.Vk][e][i.Zl];return r.m4Y().domain((0,l.kd)(0,1,o.length)).range(o.map((t=>Math.min(1,t/a)||0))).clamp(!0)}function B(t,e,n){return"median"===t?Object.keys(e[n][i.Vk]).sort(((t,a)=>r.i2o(e[n][i.Vk][t][i.Zl])-r.i2o(e[n][i.Vk][a][i.Zl]))):"deliveries"===t?Object.keys(e[n][i.Vk]).sort(((t,a)=>r.T9B(e[n][i.Vk][t][i.Zl])-r.T9B(e[n][i.Vk][a][i.Zl]))):"alphabetical"===t?Object.keys(e[n][i.Vk]).sort():void 0}a()}catch(u){a(u)}}))}}]);
//# sourceMappingURL=594.e809cbc8.chunk.js.map