"use strict";(self.webpackChunkbuckets=self.webpackChunkbuckets||[]).push([[704],{704:(t,e,a)=>{a.a(t,(async(t,n)=>{try{a.r(e),a.d(e,{default:()=>V});var r=a(43),c=a(487),o=a(111),s=a(63),l=a(639),i=a(684),u=a(829),d=a(579),h=t([s,l,u]);[s,l,u]=h.then?(await h)():h;const p="expl0000",m="DEL_CVP_PAG_N",g=.25,y=10,v="demand",k="carryover",x="priority",b="regs",j="minflow",w={[v]:4,[k]:3,[x]:2,[b]:4,[j]:4},M={};function V(){const{current:t}=(0,r.useRef)(Object.keys(s.jx)),[e,a]=(0,r.useState)(p),[n,c]=(0,r.useState)(m),[i,h]=(0,u.nC)(g,M[v]),[f,w]=(0,u.nC)(g,M[k]),[V,A]=(0,u.nC)(g,M[x]),[B,T]=(0,u.nC)(g,M[b]),[Y,Z]=(0,u.nC)(g,M[j]),W=(0,r.useMemo)((()=>E(n,e)),[e,n]);(0,r.useEffect)((()=>{a(l.F[C(i,f,V,B,Y)])}),[i,f,V,B,Y]);const q=[{label:"demand [1, 0.9, 0.8, 0.7]",controlVar:v,val:i,setter:h},{label:"carryover [1.0, 1.1, 1.2]",controlVar:k,val:f,setter:w},{label:"priority [0, 1]",controlVar:x,val:V,setter:A},{label:"regs [1, 2, 3, 4]",controlVar:b,val:B,setter:T},{label:"minflow [0, 0.4, 0.6, 0.8]",controlVar:j,val:Y,setter:Z}];return(0,d.jsx)(d.Fragment,{children:(0,d.jsxs)("div",{className:"editor",children:[(0,d.jsxs)("div",{className:"sliders",children:[(0,d.jsx)("select",{value:n,onChange:t=>c(t.target.value),children:t.map((t=>(0,d.jsx)("option",{name:t,value:t,children:t},t)))}),q.map((t=>{let{label:e,controlVar:a,val:r,setter:c}=t;return(0,d.jsxs)("div",{children:[(0,d.jsx)("span",{children:e}),(0,d.jsx)(P,{data:I({demand:i,carryover:f,priority:V,regs:B,minflow:Y},a,n),val:r,setVal:c})]},a)}))]}),(0,d.jsxs)("div",{children:[(0,d.jsx)(o.A,{levelInterp:W,width:300,height:400,resolution:y}),(0,d.jsx)("span",{style:{display:"block",textAlign:"center"},children:e})]})]})})}function P(t){let{data:e,val:a,setVal:n}=t;const o=5,s=5,l=0,i=5,u=400,h=(0,r.useRef)(),f=c.m4Y().range([0,u]),p=c.m4Y().range([50,0]);return(0,r.useEffect)((()=>{h.current.attr("width",u+i+s).attr("height",50+o+l).call((t=>t.node().addEventListener("mousedown",(t=>n(c.m4Y().domain([i,u+i]).clamp(!0)(t.offsetX)))))).call((t=>{t.append("g").attr("transform","translate(".concat(i,",").concat(o,")")).call(c.tlR(c.hqK(c.y17(e[0].length),[0,u])).tickFormat("")).selectAll("path").style("stroke","lightgrey")})).append("g").attr("class","graph-area").attr("transform","translate(".concat(i,",").concat(o,")")).call((t=>t.selectAll("path").data(e).join("path").attr("fill",((t,a)=>c.dM(a/e.length))))).call((t=>t.append("rect").attr("width",u).attr("height",50).attr("fill","none").attr("stroke","lightgrey"))).append("rect").attr("class","razor").attr("fill","red").attr("width",5).attr("height",50)}),[]),(0,r.useEffect)((()=>{h.current.select(".graph-area").selectAll("path").data(e).attr("d",(t=>c.Wcw().x(((e,a)=>f(a/(t.length-1)))).y1((t=>p(t))).y0(p(0))(t)))}),[e]),(0,r.useEffect)((()=>{h.current.select(".graph-area").select(".razor").attr("x",f(a)-2.5)}),[a]),(0,d.jsx)("svg",{className:"line-slider",ref:t=>{h.current=c.Ltv(t)}})}function C(t,e,a,n,r){const o=(t,e)=>c.WT_(c.y17(1,w[e]+1))(t);return"".concat(o(t,v)).concat(o(e,k)).concat(o(a,x)).concat(o(n,b)).concat(o(r,j))}function E(t,e){const a=s.jx[t][s.Vk][e][s.Zl];return c.m4Y().domain((0,i.kd)(0,1,a.length)).range(a.map((t=>t/s.pk))).clamp(!0)}function I(t,e,a){let{demand:n,carryover:r,priority:c,regs:o,minflow:s}=t;const u=[],d=e!==v?[n]:M[v].range(),h=e!==k?[r]:M[k].range(),f=e!==x?[c]:M[x].range(),p=e!==b?[o]:M[b].range(),m=e!==j?[s]:M[j].range();for(const l of d)for(const t of h)for(const e of f)for(const a of p)for(const n of m)u.push([l,t,e,a,n]);const g=u.map((t=>E(a,l.F[C(...t)])));return(0,i.kd)(0,1,y+1).map((t=>g.map((e=>e(t)))))}Object.keys(w).forEach((t=>M[t]=c.WT_((0,i.kd)(0,1,w[t])))),n()}catch(f){n(f)}}))},111:(t,e,a)=>{a.d(e,{A:()=>u});var n=a(487),r=a(43),c=a(684),o=a(579);const s=40,l=10,i=3;function u(t){let{levelInterp:e,colorInterp:a=c.YW,width:u=200,height:d=400,resolution:h=l}=t;const f=(0,r.useId)(),p=(0,r.useRef)(),m=(0,r.useMemo)((()=>(0,c.kd)(0,1,h+1).map((t=>e(t)))),[e,h]),g=(0,c.ZC)(m),y=u-2*i,v=d-i;return(0,r.useLayoutEffect)((()=>{const t=p.current.append("g").attr("class","svg-container").attr("transform","translate(".concat(i,", ").concat(i/2,")"));t.append("defs").append("clipPath").attr("id","bucket-mask-"+f).append("path").attr("class","bucket-mask-path"),t.append("g").attr("class","graph-area").attr("clip-path","url(#bucket-mask-".concat(f,")")),t.append("g").append("path").attr("class","bucket-outline").attr("stroke","lightgray").attr("stroke-linecap","round").attr("stroke-width",i).attr("fill","none")}),[f]),(0,r.useLayoutEffect)((()=>{const t=p.current.attr("width",u).attr("height",d).select(".svg-container");t.select(".bucket-mask-path").attr("d",(0,c.wh)(y,v)),t.select(".bucket-outline").attr("d",(0,c.wh)(y,v).split("z")[0])}),[u,d,y,v]),(0,r.useLayoutEffect)((()=>{const t=p.current.select(".graph-area").selectAll(".bucketBox").data(m).join("rect").attr("class","bucketBox").attr("width",2*y).attr("height",2*v).attr("x",-y/2).attr("fill",((t,e)=>a(e/l)));t.transition("liquidLevel").ease(n.guX.period(.6)).delay(((t,e)=>e*(100/h))).duration(1e3).attr("y",(t=>v-t*v)),t.transition("liquidSway").duration(2e3).delay(((t,e)=>10*e)).ease(n.I1g).attrTween("transform",(function(t,e){const a=g?Math.abs(g[e]-t):0;return t=>"rotate(".concat(Math.sin(Math.min(4*Math.PI*t/(.5*a+.5),4*Math.PI))*a*s*(1-t),", ").concat(y/2,", ",0,")")}))}),[m,g,u,d,y,v,h,a]),(0,o.jsx)("div",{className:"bucket-wrapper",children:(0,o.jsx)("svg",{ref:t=>{p.current=n.Ltv(t)}})})}},684:(t,e,a)=>{a.d(e,{Q2:()=>s,YW:()=>i,ZC:()=>l,kd:()=>c,wh:()=>o});var n=a(487),r=a(43);function c(t,e,a){return n.y17(a).map((n=>n/(a-1)*(e-t)+t))}function o(t,e){let a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.8,c=t*r+t*(1-r)/2,o=t*(1-r)/2,s=[{x:n.GWP(c,t)(a),y:n.GWP(e,0)(a)},{x:c,y:e},{x:o,y:e},{x:n.GWP(o,0)(a),y:n.GWP(e,0)(a)}];return n.n8j().x((function(t){return t.x})).y((function(t){return t.y}))(s)+"z"}function s(t,e,a){let r=t.map((t=>Math.round(t.length/e))),c=n.czq(r);for(;c>a;)r[n.z94(t,((t,a)=>0!==t.length?t.length/e-r[a]:1/0))]-=1,c=n.czq(r);for(;c<a;)r[n.P2Z(t,((t,a)=>0!==t.length?t.length/e-r[a]:-1/0))]+=1,c=n.czq(r);return r}function l(t,e){const a=(0,r.useRef)({value:t,prev:null}),n=a.current.value;return(e?e(t,n):t===n)||(a.current={value:t,prev:n}),a.current.prev}const i=t=>n.dM(n.m4Y([.2,1])(t))},639:(t,e,a)=>{a.a(t,(async(t,n)=>{try{a.d(e,{F:()=>t});const t=await async function(){const t=await(await fetch("./factors.json")).json();return console.log("DATA: loading factors data"),t}();n()}catch(r){n(r)}}),1)},63:(t,e,a)=>{a.a(t,(async(t,n)=>{try{a.d(e,{Vk:()=>s,Zl:()=>l,jx:()=>i,pk:()=>o});var r=a(829),c=t([r]);r=(c.then?(await c)():c)[0];const o=1200,s="scens",l="delivs",i=await async function(){const t=await(await fetch("./all_objectives.json")).json();for(const e of t){for(const t of e[s])t[l]=t[l].map((t=>Math.min(Math.max(0,t),o))).sort(((t,e)=>e-t));e[s]=(0,r.Et)(e[s],(t=>{let{name:e}=t;return e}))}return console.log("DATA: loading objectives data"),(0,r.Et)(t,(t=>{let{obj:e}=t;return e}))}();n()}catch(o){n(o)}}),1)},829:(t,e,a)=>{a.a(t,(async(t,n)=>{try{a.d(e,{C5:()=>m,Et:()=>h,XC:()=>f,Yb:()=>M,cv:()=>w,hh:()=>b,nC:()=>j,si:()=>p,xC:()=>g});var r=a(487),c=a(783),o=a.n(c),s=a(43),l=a(63),i=a(684),u=t([l]);function h(t,e){const a=Object.groupBy(t,e);for(const n of Object.keys(a))a[n]=a[n][0];return a}l=(u.then?(await u)():u)[0];const f={draw:function(t,e){t.moveTo(0,-e/2),t.lineTo(e/4,-e/4),t.arc(0,0,e/Math.sqrt(2)/2,-Math.PI/4,5*Math.PI/4),t.lineTo(0,-e/2),t.closePath()}};function p(t){return(3.1304*t**3-4.2384*t**2+3.3471*t+.0298)/2.4}function m(t,e){return function(a){return e.map((function(e){return[e,r.i2o(a,(function(a){return t(e-a)}))]}))}}function g(t){return function(e){return Math.abs(e/=t)<=1?.75*(1-e*e)/t:0}}function y(t){const e=t/2,a=3*Math.PI/2/20,n=[{x:Math.cos(5*Math.PI/4)*e,y:Math.sin(5*Math.PI/4)*e},{x:0,y:-Math.SQRT2*e}];for(let r=0;r<=20;r++)n.push({x:Math.cos(r*a-Math.PI/4)*e,y:Math.sin(r*a-Math.PI/4)*e});return n}function v(t,e){const a=o().Bounds.create(t),n=a.min.x,c=a.max.x,s=a.min.y,l=a.max.y,i=r.m4Y([n,c]),u=r.m4Y([s,l]),d=[];for(let r=0;r<e;r++)for(;;){const e=i(Math.random()),a=u(Math.random());if(o().Vertices.contains(t,{x:e,y:a})){d.push([e,a]);break}}return d}const k=function(){const t=y(1.4),e=y(1),a=[];for(let n=0;n<t.length-1;n++)a.push([t[n],t[n+1],e[n+1],e[n]]);return a}();let x;function b(t,e,a){x=x||v(y(1),a.length);const n=r.i2o(a.map((t=>{let{r:e}=t;return 2*e})))*Math.floor(Math.sqrt(a.length)),c=x.map((t=>{let[e,a]=t;return[e*n/2,a*n/2]})),s=o().Engine,l=o().Bodies,i=o().Composite,u=s.create(),d=c.sort(((t,e)=>e[1]-t[1])),h=a.map(((a,n)=>{let{r:r,id:c}=a;const[o,s]=d[n];return l.circle(o+t,s+e,2*r,{restitution:0,id:c})})),f=k.map((t=>o().Body.create({position:o().Vertices.centre(t),vertices:t,isStatic:!0}))),p=o().Body.create({isStatic:!0});o().Body.setParts(p,f),o().Body.scale(p,1.4*n,1.4*n),o().Body.translate(p,{x:t,y:e+n/2*.4}),i.add(u.world,[...h,p]);for(let r=0,o=60;r<1*o;r++)s.update(u,1e3/o);return h.map((t=>{let{position:e,id:a}=t;return{id:a,x:e.x,y:e.y}}))}function j(t,e){const[a,n]=(0,s.useState)(t);return[(0,s.useMemo)((()=>e(a)),[a]),(0,s.useCallback)((t=>{n(e(t))}),[])]}function w(t,e,a){const n=a[t][l.Vk][e][l.Zl];return r.m4Y().domain((0,i.kd)(0,1,n.length)).range(n.map((t=>Math.min(1,t/1200)||0))).clamp(!0)}function M(t,e,a){return"median"===t?Object.keys(e[a][l.Vk]).sort(((t,n)=>r.i2o(e[a][l.Vk][t][l.Zl])-r.i2o(e[a][l.Vk][n][l.Zl]))):"deliveries"===t?Object.keys(e[a][l.Vk]).sort(((t,n)=>r.T9B(e[a][l.Vk][t][l.Zl])-r.T9B(e[a][l.Vk][n][l.Zl]))):void 0}n()}catch(d){n(d)}}))}}]);
//# sourceMappingURL=704.9a39017d.chunk.js.map