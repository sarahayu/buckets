"use strict";(self.webpackChunkbuckets=self.webpackChunkbuckets||[]).push([[711],{711:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.r(e),n.d(e,{default:()=>m});var a=n(43),o=n(243),c=n(684),s=n(63),i=n(829),u=n(579),l=t([s,i]);[s,i]=l.then?(await l)():l;const d=10,p=3,f=0;function m(t){let{width:e=600,height:n=600}=t;const{current:r}=(0,a.useRef)(Object.keys(s.jx)),[l,h]=(0,a.useState)(f),m=(0,a.useRef)(),y=(0,a.useMemo)((()=>(0,i.Yb)("median",s.jx,r[l])),[l]),g=(0,a.useMemo)((()=>Array.from(y).filter(((t,e)=>(0,c.kd)(0,.9,20).map((t=>Math.floor((t+.05)*y.length))).includes(e)))),[y]),k=(0,a.useMemo)((()=>(0,c.kd)(0,1,d+1).map((t=>g.map((e=>(0,i.cv)(r[l],e,s.jx,s.pk)(t)))))),[g,l]),M=e-2*p,x=n-p,v=o.m4Y().range([0,M]),b=o.m4Y().range([x,0]);return(0,a.useEffect)((()=>{const t=m.current.attr("width",e).attr("height",n).append("g").attr("class","svg-container").attr("transform","translate(".concat(p,", ").concat(p/2,")"));t.append("defs").append("clipPath").attr("id","bucket-mask").append("path").attr("d",(0,c.wh)(M,x)),t.append("g").attr("class","graph-area").attr("clip-path","url(#bucket-mask)"),t.append("path").attr("d",(0,c.wh)(M,x).split("z")[0]).attr("stroke","lightgray").attr("stroke-linecap","round").attr("stroke-width",p).attr("fill","none")}),[]),(0,a.useEffect)((()=>{m.current.select(".graph-area").selectAll("path").data(k).join("path").attr("fill",((t,e)=>o.dM(e/k.length))).transition().duration(500).attr("d",(t=>{const e=[t[0]];for(let n=1;n<t.length;n++)e.push(t[n-1]),e.push(t[n]);return o.Wcw().x((function(e,n){return v(Math.ceil(n/2)/(t.length-1))})).y1((t=>b(t))).y0((()=>b(0)))(e)}))}),[k]),(0,u.jsxs)("div",{className:"big-bucket-wrapper",children:[(0,u.jsx)("select",{value:l,onChange:t=>h(parseInt(t.target.value)),children:r.map(((t,e)=>(0,u.jsx)("option",{name:e,value:e,children:t})))}),(0,u.jsx)("svg",{ref:t=>{m.current=o.Ltv(t)}})]})}r()}catch(h){r(h)}}))},684:(t,e,n)=>{n.d(e,{Q2:()=>s,YW:()=>u,ZC:()=>i,kd:()=>o,wh:()=>c});var r=n(243),a=n(43);function o(t,e,n){return r.y17(n).map((r=>r/(n-1)*(e-t)+t))}function c(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.8,o=t*a+t*(1-a)/2,c=t*(1-a)/2,s=[{x:r.GWP(o,t)(n),y:r.GWP(e,0)(n)},{x:o,y:e},{x:c,y:e},{x:r.GWP(c,0)(n),y:r.GWP(e,0)(n)}];return r.n8j().x((function(t){return t.x})).y((function(t){return t.y}))(s)+"z"}function s(t,e,n){let a=t.map((t=>Math.round(t.length/e))),o=r.czq(a);for(;o>n;)a[r.z94(t,((t,n)=>0!==t.length?t.length/e-a[n]:1/0))]-=1,o=r.czq(a);for(;o<n;)a[r.P2Z(t,((t,n)=>0!==t.length?t.length/e-a[n]:-1/0))]+=1,o=r.czq(a);return a}function i(t,e){const n=(0,a.useRef)({value:t,prev:null}),r=n.current.value;return(e?e(t,r):t===r)||(n.current={value:t,prev:r}),n.current.prev}const u=t=>r.dM(r.m4Y([.2,1])(t))},63:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.d(e,{Vk:()=>s,Zl:()=>i,jx:()=>u,pk:()=>c});var a=n(829),o=t([a]);a=(o.then?(await o)():o)[0];const c=1200,s="scens",i="delivs",u=await async function(){const t=await(await fetch("./all_objectives.json")).json();for(const e of t){e[s]=e[s];for(const t of e[s])t[i]=t[i].map((t=>Math.min(Math.max(0,t),c))).sort(((t,e)=>e-t));e[s]=(0,a.Et)(e[s],(t=>{let{name:e}=t;return e}))}return console.log("DATA: loading objectives data"),(0,a.Et)(t,(t=>{let{obj:e}=t;return e}))}();r()}catch(c){r(c)}}),1)},829:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.d(e,{C5:()=>y,Et:()=>d,XC:()=>p,Yb:()=>C,cv:()=>P,hh:()=>j,js:()=>f,nC:()=>w,si:()=>m,xC:()=>g});var a=n(243),o=n(783),c=n.n(o),s=n(43),i=n(63),u=n(684),l=t([i]);function d(t,e){const n=Object.groupBy(t,e);for(const r of Object.keys(n))n[r]=n[r][0];return n}i=(l.then?(await l)():l)[0];const p={draw:function(t,e){t.moveTo(0,-e/2),t.lineTo(e/4,-e/4),t.arc(0,0,e/Math.SQRT2/2,-Math.PI/4,5*Math.PI/4),t.lineTo(0,-e/2),t.closePath()}},f="M0,-1L0.5,-0.5A0.707,0.707,0,1,1,-0.5,-0.5L0,-1Z";function m(t){return t-=.0088,Math.min(1,Math.max(0,(3.1304*t**3-4.2384*t**2+3.3471*t+.0298)/2.2326))}function y(t,e){return function(n){return e.map((function(e){return[e,a.i2o(n,(function(n){return t(e-n)}))]}))}}function g(t){return function(e){return Math.abs(e/=t)<=1?.75*(1-e*e)/t:0}}function k(t){const e=t/2,n=3*Math.PI/2/16,r=[{x:Math.cos(5*Math.PI/4)*e,y:Math.sin(5*Math.PI/4)*e},{x:0,y:-Math.SQRT2*e}];for(let a=0;a<=16;a++)r.push({x:Math.cos(a*n-Math.PI/4)*e,y:Math.sin(a*n-Math.PI/4)*e});return r}function M(t,e){const n=c().Bounds.create(t),r=n.min.x,o=n.max.x,s=n.min.y,i=n.max.y,u=a.m4Y([r,o]),l=a.m4Y([s,i]),h=[];for(let a=0;a<e;a++)for(;;){const e=u(Math.random()),n=l(Math.random());if(c().Vertices.contains(t,{x:e,y:n})){h.push([e,n]);break}}return h}const x=function(){const t=k(3),e=k(1),n=[];for(let r=0;r<t.length-2;r++)n.push([t[r],t[r+(r<2?1:2)],e[r+(r<2?1:2)],e[r]]);return n}();let v,b;function j(t,e,n){v&&n.length===b||(v=a.y17(4).map((()=>M(k(1),b=n.length))));const r=a.czq(n.map((t=>{let{r:e}=t;return e**2*3.14}))),o=Math.floor(2*Math.sqrt(r/3.14)/2),s=v[Math.floor(Math.random()*v.length)].map((t=>{let[e,n]=t;return[e*o,n*o]})),i=c().Engine,u=c().Bodies,l=c().Composite,h=i.create(),d=s.sort(((t,e)=>e[1]-t[1])),p=n.map(((t,e)=>{let{r:n,id:r}=t;const[a,o]=d[e];return u.circle(a,o,n,{restitution:0,id:r})})),f=x.map((t=>c().Body.create({position:c().Vertices.centre(t),vertices:t,isStatic:!0}))),m=c().Body.create({isStatic:!0});c().Body.setParts(m,f),c().Body.setCentre(m,{x:0,y:0}),c().Body.scale(m,1.1*o,1.1*o),l.add(h.world,[...p,m]);for(let a=0,c=60,y=.3;a<c*y;a++)i.update(h,1e3/c);return p.map((n=>{let{position:r,id:a}=n;return{id:a,x:r.x+t,y:r.y+e+.1*o}}))}function w(t,e){const[n,r]=(0,s.useState)(t);return[(0,s.useMemo)((()=>e(n)),[n]),(0,s.useCallback)((t=>{r(e(t))}),[])]}function P(t,e,n,r){const o=n[t][i.Vk][e][i.Zl];return a.m4Y().domain((0,u.kd)(0,1,o.length)).range(o.map((t=>Math.min(1,t/r)||0))).clamp(!0)}function C(t,e,n){return"median"===t?Object.keys(e[n][i.Vk]).sort(((t,r)=>a.i2o(e[n][i.Vk][t][i.Zl])-a.i2o(e[n][i.Vk][r][i.Zl]))):"deliveries"===t?Object.keys(e[n][i.Vk]).sort(((t,r)=>a.T9B(e[n][i.Vk][t][i.Zl])-a.T9B(e[n][i.Vk][r][i.Zl]))):"alphabetical"===t?Object.keys(e[n][i.Vk]).sort():void 0}r()}catch(h){r(h)}}))}}]);
//# sourceMappingURL=711.6ba09e11.chunk.js.map