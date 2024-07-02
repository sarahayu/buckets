"use strict";(self.webpackChunkbuckets=self.webpackChunkbuckets||[]).push([[746],{746:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.r(e),n.d(e,{default:()=>g});var a=n(53),o=n(43),c=n(684),s=n(63),l=n(829),i=n(475),u=n(579),h=t([s,l]);[s,l]=h.then?(await h)():h;const p=5,f=2,m=7,y=.1,x=2.5;function g(t){let{watercolor:e=!1}=t;const{current:n}=(0,o.useRef)(Object.keys(s.jx)),r=(0,o.useRef)(),[h,d]=(0,o.useState)(f),[g,v]=(0,o.useState)(!1),[b]=(0,i.ok)(),M=(0,o.useRef)(),k=(0,o.useMemo)((()=>(0,l.Yb)("median",s.jx,n[h]).reverse()),[h]),j=(0,o.useMemo)((()=>k.map((t=>{const e=(0,l.cv)(n[h],t,s.jx,s.pk);return(0,c.kd)(0,1,p+1).map(((t,n)=>e(t)))}))),[h]),w=(0,o.useRef)();return(0,o.useLayoutEffect)((()=>{r.current={width:window.innerWidth,height:window.innerHeight},w.current=a.s_O().scaleExtent([1,10]).translateExtent([[-r.current.width/2,-r.current.height/2],[1.5*r.current.width,1.5*r.current.height]]).on("zoom",(function(t){M.current.select(".svg-trans").attr("transform",t.transform),M.current.selectAll(".text-scale").attr("transform","scale(".concat(1/t.transform.k,")"))})).on("start",(t=>"wheel"!==(t.sourceEvent||{}).type&&M.current.style("cursor","grabbing"))).on("end",(()=>M.current.style("cursor","grab"))),M.current.attr("width",r.current.width).attr("height",r.current.height).style("cursor","grab").call((t=>t.append("g").attr("class","svg-trans"))).call(w.current),b.get("obj")&&n.includes(b.get("obj"))&&(d(n.indexOf(b.get("obj"))),v("true"==b.get("norm")))}),[]),(0,o.useLayoutEffect)((()=>{const t=r.current.width,e=r.current.height;M.current.call(w.current.transform,a.GSI);const n=(0,l.hh)(t/2,e/2,j.map(((t,e)=>({r:1*(g?1:Math.max(t[0],y))*m*x,id:e})))).map((t=>{let{id:e,x:n,y:r}=t;return{levs:j[e].map(((t,n)=>1*Math.max(t,0==n?y:0)*(g?1/Math.max(j[e][0],y):1)*m)),maxLev:(g?1:1*Math.max(j[e][0],y))*m,tilt:50*Math.random()-25,dur:100*Math.random()+400,startX:n,startY:r-4*m*Math.random(),endX:n,endY:r,scen:k[e]}}));M.current.select(".svg-trans").selectAll(".smallDrop").data(n,((t,e)=>e)).join((t=>t.append("g").attr("class","smallDrop").each((function(t,e){let{levs:n}=t;a.Ltv(this.parentNode).append("g").attr("id","drop-".concat(e)).append("g").attr("class","text-scale").append("text").style("font-size",16).attr("text-anchor","middle");const r=a.Ltv(this);r.append("rect").attr("class","bbox").style("visibility","hidden"),r.on("mouseover",(function(){M.current.selectAll(".smallDrop").style("opacity",.5),r.style("opacity",1),M.current.select("#drop-".concat(e)).style("opacity",1)})).on("mouseout",(function(){M.current.selectAll(".smallDrop").style("opacity",1),M.current.select("#drop-".concat(e)).style("opacity",0)}));const o=a.Ltv(this).append("defs").append("linearGradient").attr("id","drop-fill-".concat(e)).attr("x1","0%").attr("x2","0%").attr("y1","0%").attr("y2","100%");n.forEach(((t,e)=>{o.append("stop").attr("stop-color",(0,c.YW)(e/p)),o.append("stop").attr("stop-color",(0,c.YW)(e/p))})),a.Ltv(this).append("path").attr("d",l.js).attr("fill","url(#drop-fill-".concat(e,")"))})))).attr("transform",(t=>{let{startX:e,startY:n,tilt:r}=t;return"translate(".concat(e,", ").concat(n,") rotate(").concat(r,")")})).style("opacity",0).each((function(t,e){let{levs:n,maxLev:r,scen:o}=t;const c=a.Ltv(this);a.Ltv("#drop-".concat(e)).style("opacity",0).select("text").text(o),c.selectAll("path").attr("transform","scale(".concat(r,")")),c.selectAll("stop").each((function(t,e){let o=Math.floor(e/2);0===e%2&&(o-=1),-1===o?a.Ltv(this).attr("offset","".concat(0,"%")):a.Ltv(this).attr("offset","".concat(100*(1-n[o]/r),"%"))})),c.transition().duration((t=>{let{dur:e}=t;return e})).ease(a.yfw).attr("transform",(t=>{let{endX:e,endY:n,tilt:r}=t;return"translate(".concat(e,", ").concat(n,") rotate(").concat(r,")")})).style("opacity",1).on("end",(()=>{const t=c.select("path");c.select(".bbox").attr("x",t.node().getBBox().x).attr("y",t.node().getBBox().y).attr("width",t.node().getBBox().width).attr("height",t.node().getBBox().height),M.current.select("#drop-".concat(e)).attr("transform","translate(".concat(t.node().getBoundingClientRect().x+t.node().getBoundingClientRect().width/2,", ").concat(t.node().getBoundingClientRect().y,")"))})).call((t=>{}))})).call((t=>{}))}),[j,g]),(0,u.jsxs)("div",{className:"bubbles-wrapper",children:[(0,u.jsxs)("div",{className:"bubbles-input-area",children:[(0,u.jsx)("select",{value:h,onChange:t=>d(parseInt(t.target.value)),children:n.map(((t,e)=>(0,u.jsx)("option",{name:e,value:e,children:t},e)))}),(0,u.jsx)("input",{type:"checkbox",id:"norm",checked:g,onChange:()=>{v((t=>!t))}}),(0,u.jsx)("label",{htmlFor:"norm",children:"normalize"})]}),(0,u.jsx)("div",{className:"bubbles-svg-wrapper"+(e?"-painter":""),children:(0,u.jsx)("svg",{className:"bubbles-svg"+(e?"-painter":""),ref:t=>{M.current=a.Ltv(t)}})})]})}r()}catch(d){r(d)}}))},684:(t,e,n)=>{n.d(e,{Q2:()=>s,YW:()=>i,ZC:()=>l,kd:()=>o,wh:()=>c});var r=n(53),a=n(43);function o(t,e,n){return r.y17(n).map((r=>r/(n-1)*(e-t)+t))}function c(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.8,o=t*a+t*(1-a)/2,c=t*(1-a)/2,s=[{x:r.GWP(o,t)(n),y:r.GWP(e,0)(n)},{x:o,y:e},{x:c,y:e},{x:r.GWP(c,0)(n),y:r.GWP(e,0)(n)}];return r.n8j().x((function(t){return t.x})).y((function(t){return t.y}))(s)+"z"}function s(t,e,n){let a=t.map((t=>Math.round(t.length/e))),o=r.czq(a);for(;o>n;)a[r.z94(t,((t,n)=>0!==t.length?t.length/e-a[n]:1/0))]-=1,o=r.czq(a);for(;o<n;)a[r.P2Z(t,((t,n)=>0!==t.length?t.length/e-a[n]:-1/0))]+=1,o=r.czq(a);return a}function l(t,e){const n=(0,a.useRef)({value:t,prev:null}),r=n.current.value;return(e?e(t,r):t===r)||(n.current={value:t,prev:r}),n.current.prev}const i=t=>r.dM(r.m4Y([.2,1])(t))},63:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.d(e,{Vk:()=>s,Zl:()=>l,jx:()=>i,pk:()=>c});var a=n(829),o=t([a]);a=(o.then?(await o)():o)[0];const c=1200,s="scens",l="delivs",i=await async function(){const t=await(await fetch("./all_objectives.json")).json();for(const e of t){e[s]=e[s];for(const t of e[s])t[l]=t[l].map((t=>Math.min(Math.max(0,t),c))).sort(((t,e)=>e-t));e[s]=(0,a.Et)(e[s],(t=>{let{name:e}=t;return e}))}return console.log("DATA: loading objectives data"),(0,a.Et)(t,(t=>{let{obj:e}=t;return e}))}();r()}catch(c){r(c)}}),1)},829:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.d(e,{C5:()=>m,Et:()=>d,XC:()=>p,Yb:()=>B,cv:()=>w,hh:()=>k,js:()=>f,nC:()=>j,xC:()=>y});var a=n(53),o=n(783),c=n.n(o),s=n(43),l=n(63),i=n(684),u=t([l]);function d(t,e){const n=Object.groupBy(t,e);for(const r of Object.keys(n))n[r]=n[r][0];return n}l=(u.then?(await u)():u)[0];const p={draw:function(t,e){t.moveTo(0,-e/2),t.lineTo(e/4,-e/4),t.arc(0,0,e/Math.SQRT2/2,-Math.PI/4,5*Math.PI/4),t.lineTo(0,-e/2),t.closePath()}},f="M0,-1L0.5,-0.5A0.707,0.707,0,1,1,-0.5,-0.5L0,-1Z";function m(t,e){return function(n){return e.map((function(e){return[e,a.i2o(n,(function(n){return t(e-n)}))]}))}}function y(t){return function(e){return Math.abs(e/=t)<=1?.75*(1-e*e)/t:0}}function x(t){const e=t/2,n=3*Math.PI/2/16,r=[{x:Math.cos(5*Math.PI/4)*e,y:Math.sin(5*Math.PI/4)*e},{x:0,y:-Math.SQRT2*e}];for(let a=0;a<=16;a++)r.push({x:Math.cos(a*n-Math.PI/4)*e,y:Math.sin(a*n-Math.PI/4)*e});return r}function g(t,e){const n=c().Bounds.create(t),r=n.min.x,o=n.max.x,s=n.min.y,l=n.max.y,i=a.m4Y([r,o]),u=a.m4Y([s,l]),h=[];for(let a=0;a<e;a++)for(;;){const e=i(Math.random()),n=u(Math.random());if(c().Vertices.contains(t,{x:e,y:n})){h.push([e,n]);break}}return h}const v=function(){const t=x(3),e=x(1),n=[];for(let r=0;r<t.length-2;r++)n.push([t[r],t[r+(r<2?1:2)],e[r+(r<2?1:2)],e[r]]);return n}();let b,M;function k(t,e,n){b&&n.length===M||(b=a.y17(4).map((()=>g(x(1),M=n.length))));const r=a.czq(n.map((t=>{let{r:e}=t;return e**2*3.14}))),o=Math.floor(2*Math.sqrt(r/3.14)/2),s=b[Math.floor(Math.random()*b.length)].map((t=>{let[e,n]=t;return[e*o,n*o]})),l=c().Engine,i=c().Bodies,u=c().Composite,h=l.create(),d=s.sort(((t,e)=>e[1]-t[1])),p=n.map(((t,e)=>{let{r:n,id:r}=t;const[a,o]=d[e];return i.circle(a,o,n,{restitution:0,id:r})})),f=v.map((t=>c().Body.create({position:c().Vertices.centre(t),vertices:t,isStatic:!0}))),m=c().Body.create({isStatic:!0});c().Body.setParts(m,f),c().Body.setCentre(m,{x:0,y:0}),c().Body.scale(m,1.1*o,1.1*o),u.add(h.world,[...p,m]);for(let a=0,c=60,y=.3;a<c*y;a++)l.update(h,1e3/c);return p.map((n=>{let{position:r,id:a}=n;return{id:a,x:r.x+t,y:r.y+e+.1*o}}))}function j(t,e){const[n,r]=(0,s.useState)(t);return[(0,s.useMemo)((()=>e(n)),[n]),(0,s.useCallback)((t=>{r(e(t))}),[])]}function w(t,e,n,r){const o=n[t][l.Vk][e][l.Zl];return a.m4Y().domain((0,i.kd)(0,1,o.length)).range(o.map((t=>Math.min(1,t/r)||0))).clamp(!0)}function B(t,e,n){return"median"===t?Object.keys(e[n][l.Vk]).sort(((t,r)=>a.i2o(e[n][l.Vk][t][l.Zl])-a.i2o(e[n][l.Vk][r][l.Zl]))):"deliveries"===t?Object.keys(e[n][l.Vk]).sort(((t,r)=>a.T9B(e[n][l.Vk][t][l.Zl])-a.T9B(e[n][l.Vk][r][l.Zl]))):"alphabetical"===t?Object.keys(e[n][l.Vk]).sort():void 0}r()}catch(h){r(h)}}))}}]);
//# sourceMappingURL=746.28f8b962.chunk.js.map