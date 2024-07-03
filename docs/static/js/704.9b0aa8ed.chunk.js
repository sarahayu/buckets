"use strict";(self.webpackChunkbuckets=self.webpackChunkbuckets||[]).push([[704],{704:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.r(e),n.d(e,{default:()=>C});var a=n(43),s=n(668),o=n(111),c=n(63),i=n(639),l=n(684),h=n(829),u=n(579),d=t([c,i,h]);[c,i,h]=d.then?(await d)():d;const p="expl0000",m="DEL_CVP_PAG_N",g=0,y=10,v="demand",k="carryover",x="priority",M="regs",w="minflow",b={[v]:5,[k]:3,[x]:2,[M]:4,[w]:5},j={};function C(){const{current:t}=(0,a.useRef)(Object.keys(c.jx)),[e,n]=(0,a.useState)(p),[r,s]=(0,a.useState)(m),[l,d]=(0,h.nC)(g,j[v]),[f,b]=(0,h.nC)(g,j[k]),[C,E]=(0,h.nC)(g,j[x]),[T,I]=(0,h.nC)(g,j[M]),[z,A]=(0,h.nC)(g,j[w]),F=(0,a.useMemo)((()=>S(r,e)),[e,r]);(0,a.useEffect)((()=>{n(i.F[V(l,f,C,T,z)])}),[l,f,C,T,z]);const B=[{label:"demand [1, 0.9, 0.8, 0.7, 0.6]",controlVar:v,val:l,setter:d},{label:"carryover [1.0, 1.2, 1.3]",controlVar:k,val:f,setter:b},{label:"priority [0, 1]",controlVar:x,val:C,setter:E},{label:"regs [1, 2, 3, 4]",controlVar:M,val:T,setter:I},{label:"minflow [0, 0.4, 0.6, 0.7, 0.8]",controlVar:w,val:z,setter:A}];return(0,u.jsx)(u.Fragment,{children:(0,u.jsxs)("div",{className:"editor",children:[(0,u.jsxs)("div",{className:"sliders",children:[(0,u.jsx)("select",{value:r,onChange:t=>s(t.target.value),children:t.map((t=>(0,u.jsx)("option",{name:t,value:t,children:t},t)))}),B.map((t=>{let{label:e,controlVar:n,val:a,setter:s}=t;return(0,u.jsxs)("div",{children:[(0,u.jsx)("span",{children:e}),(0,u.jsx)(P,{data:Z({demand:l,carryover:f,priority:C,regs:T,minflow:z},n,r),val:a,setVal:s})]},n)}))]}),(0,u.jsxs)("div",{children:[(0,u.jsx)(o.A,{levelInterp:F,width:300,height:400,resolution:y}),(0,u.jsx)("span",{style:{display:"block",textAlign:"center"},children:e})]})]})})}function P(t){let{data:e,val:n,setVal:r}=t;const o=5,c=5,i=0,h=5,d=400,f=(0,a.useRef)(),p=s.m4Y().range([0,d]),m=s.m4Y().range([50,0]);return(0,a.useEffect)((()=>{f.current.attr("width",d+h+c).attr("height",50+o+i).call((t=>t.node().addEventListener("mousedown",(t=>r(s.m4Y().domain([h,d+h]).clamp(!0)(t.offsetX)))))).call((t=>{t.append("g").attr("transform","translate(".concat(h,",").concat(o,")")).call(s.tlR(s.hqK(s.y17(e[0].length),[0,d])).tickFormat("")).selectAll("path").style("stroke","lightgrey")})).append("g").attr("class","graph-area").attr("transform","translate(".concat(h,",").concat(o,")")).call((t=>t.selectAll("path").data(e).join("path").attr("fill",((t,n)=>(0,l.YW)(n/e.length))))).call((t=>t.append("rect").attr("width",d).attr("height",50).attr("fill","none").attr("stroke","lightgrey"))).append("rect").attr("class","razor").attr("fill","red").attr("width",5).attr("height",50)}),[]),(0,a.useEffect)((()=>{f.current.select(".graph-area").selectAll("path").data(e).attr("d",(t=>s.Wcw().x(((e,n)=>p(n/(t.length-1)))).y1((t=>m(t))).y0(m(0))(t)))}),[e]),(0,a.useEffect)((()=>{f.current.select(".graph-area").select(".razor").attr("x",p(n)-2.5)}),[n]),(0,u.jsx)("svg",{className:"line-slider",ref:t=>{f.current=s.Ltv(t)}})}function V(t,e,n,r,a){const o=(t,e)=>s.WT_(s.y17(1,b[e]+1))(t);return console.log("".concat(o(t,v)).concat(o(e,k)).concat(o(n,x)).concat(o(r,M)).concat(o(a,w))),"".concat(o(t,v)).concat(o(e,k)).concat(o(n,x)).concat(o(r,M)).concat(o(a,w))}function S(t,e){console.log(e);const n=c.jx[t][c.Vk][e][c.Zl];return s.m4Y().domain((0,l.kd)(0,1,n.length)).range(n.map((t=>t/c.pk))).clamp(!0)}function Z(t,e,n){let{demand:r,carryover:a,priority:s,regs:o,minflow:c}=t;const h=[],u=e!==v?[r]:j[v].range(),d=e!==k?[a]:j[k].range(),f=e!==x?[s]:j[x].range(),p=e!==M?[o]:j[M].range(),m=e!==w?[c]:j[w].range();for(const i of u)for(const t of d)for(const e of f)for(const n of p)for(const r of m)h.push([i,t,e,n,r]);const g=h.map((t=>S(n,i.F[V(...t)])));return(0,l.kd)(0,1,y+1).map((t=>g.map((e=>e(t)))))}Object.keys(b).forEach((t=>j[t]=s.WT_((0,l.kd)(0,1,b[t])))),r()}catch(f){r(f)}}))},111:(t,e,n)=>{n.d(e,{A:()=>h});var r=n(668),a=n(43),s=n(684),o=n(579);const c=40,i=10,l=3;function h(t){let{levelInterp:e,colorInterp:n=s.YW,width:h=200,height:u=400,resolution:d=i}=t;const f=(0,a.useId)(),p=(0,a.useRef)(),m=(0,a.useMemo)((()=>(0,s.kd)(0,1-1/d,d).map((t=>e(t)))),[e,d]),g=(0,s.ZC)(m),y=h-2*l,v=u-l;return(0,a.useLayoutEffect)((()=>{const t=p.current.append("g").attr("class","svg-container").attr("transform","translate(".concat(l,", ").concat(l/2,")"));t.append("defs").append("clipPath").attr("id","bucket-mask-"+f).append("path").attr("class","bucket-mask-path"),t.append("g").attr("class","graph-area").attr("clip-path","url(#bucket-mask-".concat(f,")")),t.append("g").append("path").attr("class","bucket-outline").attr("stroke","lightgray").attr("stroke-linecap","round").attr("stroke-width",l).attr("fill","none")}),[f]),(0,a.useLayoutEffect)((()=>{const t=p.current.attr("width",h).attr("height",u).select(".svg-container");t.select(".bucket-mask-path").attr("d",(0,s.wh)(y,v)),t.select(".bucket-outline").attr("d",(0,s.wh)(y,v).split("z")[0])}),[h,u,y,v]),(0,a.useLayoutEffect)((()=>{const t=p.current.select(".graph-area").selectAll(".bucketBox").data(m).join("rect").attr("class","bucketBox").attr("width",2*y).attr("height",2*v).attr("x",-y/2).attr("fill",((t,e)=>n(e/(d-1))));t.transition("liquidLevel").ease(r.guX.period(.6)).delay(((t,e)=>e*(100/d))).duration(1e3).attr("y",(t=>v-t*v)),t.transition("liquidSway").duration(2e3).delay(((t,e)=>10*e)).ease(r.I1g).attrTween("transform",(function(t,e){const n=g?Math.abs(g[e]-t):0;return t=>"rotate(".concat(Math.sin(Math.min(4*Math.PI*t/(.5*n+.5),4*Math.PI))*n*c*(1-t),", ").concat(y/2,", ",0,")")}))}),[m,g,h,u,y,v,d,n]),(0,o.jsx)("div",{className:"bucket-wrapper",children:(0,o.jsx)("svg",{ref:t=>{p.current=r.Ltv(t)}})})}},684:(t,e,n)=>{n.d(e,{Q2:()=>c,YW:()=>l,ZC:()=>i,kd:()=>s,wh:()=>o});var r=n(668),a=n(43);function s(t,e,n){return r.y17(n).map((r=>r/(n-1)*(e-t)+t))}function o(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.8,s=t*a+t*(1-a)/2,o=t*(1-a)/2,c=[{x:r.GWP(s,t)(n),y:r.GWP(e,0)(n)},{x:s,y:e},{x:o,y:e},{x:r.GWP(o,0)(n),y:r.GWP(e,0)(n)}];return r.n8j().x((function(t){return t.x})).y((function(t){return t.y}))(c)+"z"}function c(t,e,n){let a=t.map((t=>Math.round(t.length/e))),s=r.czq(a);for(;s>n;)a[r.z94(t,((t,n)=>0!==t.length?t.length/e-a[n]:1/0))]-=1,s=r.czq(a);for(;s<n;)a[r.P2Z(t,((t,n)=>0!==t.length?t.length/e-a[n]:-1/0))]+=1,s=r.czq(a);return a}function i(t,e){const n=(0,a.useRef)({value:t,prev:null}),r=n.current.value;return(e?e(t,r):t===r)||(n.current={value:t,prev:r}),n.current.prev}const l=t=>r.dM(r.m4Y([.2,1])(t))},639:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.d(e,{F:()=>t});const t=await async function(){const t=await(await fetch("./factors.json")).json();return console.log("DATA: loading factors data"),t}();r()}catch(a){r(a)}}),1)},63:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.d(e,{Vk:()=>c,Xe:()=>d,Zl:()=>i,iL:()=>u,jx:()=>h,pk:()=>o,sQ:()=>l});var a=n(829),s=t([a]);a=(s.then?(await s)():s)[0];const o=1200,c="scens",i="delivs",l="delivs_unord",h=await async function(){const t=await(await fetch("./all_objectives.json")).json();for(const e of t){e[c]=e[c];for(const t of e[c]){const e=t[i].map((t=>Math.min(Math.max(0,t),o)));t[l]=e,t[i]=Array.from(e).sort(((t,e)=>e-t))}e[c]=(0,a.Et)(e[c],(t=>{let{name:e}=t;return e}))}return console.log("DATA: loading objectives data"),(0,a.Et)(t,(t=>{let{obj:e}=t;return e}))}(),u=Object.keys(h),d=Object.keys(Object.values(h)[0][c]);r()}catch(o){r(o)}}),1)},829:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.d(e,{C5:()=>P,Et:()=>f,Ng:()=>C,XC:()=>p,Yb:()=>Y,bp:()=>j,cv:()=>R,hh:()=>B,i7:()=>O,iJ:()=>_,js:()=>m,nC:()=>L,u:()=>W,xC:()=>V});var a=n(981),s=n(668),o=n(783),c=n.n(o),i=n(43),l=n(63),h=n(684),u=t([l]);function f(t,e){const n=Object.groupBy(t,e);for(const r of Object.keys(n))n[r]=n[r][0];return n}l=(u.then?(await u)():u)[0];const p={draw:function(t,e){t.moveTo(0,-e/2),t.lineTo(e/4,-e/4),t.arc(0,0,e/Math.SQRT2/2,-Math.PI/4,5*Math.PI/4),t.lineTo(0,-e/2),t.closePath()}},m="M0,-1L0.5,-0.5A0.707,0.707,0,1,1,-0.5,-0.5L0,-1Z";const g=Math.SQRT1_2,y=1,v=g+g,k=y+g,x=.75;function M(t){if(t>=x){return Math.SQRT1_2*(1-t)/(1-x)}const e=2*(1-t/(v/k))-1,n=Math.acos(e);return Math.sin(n)}function w(t){return(t-g/k)*(1+Math.SQRT2)}function b(t){return t/(1+Math.SQRT2)+g/k}function j(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2;if(Math.abs(t-e)<.01)return[];const r=n/2/y*g,a=.1,s=[],o=[];let c,i,l,h;for(let m=1;m<=Math.ceil(10)&&(c=M(t+(m-1)*a),i=w(t+(m-1)*a),l=M(t+m*a),h=w(t+m*a),!(b(h)>=e));m++){const t=[-c*r,-i*r],e=[c*r,-i*r],n=[l*r,-h*r],a=[-l*r,-h*r];s.push(e,n),o.push(t,a)}l=M(e),h=w(e);const u=[-c*r,-i*r],d=[c*r,-i*r],f=[l*r,-h*r],p=[-l*r,-h*r];return s.push(d,f),o.push(u,p),s.push(...o.reverse()),s}function C(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2;if(Math.abs(t-e)<.01)return[];const r=n/2/y*g,a=.1,s=[];let o,c,i,l;for(let p=1;p<=Math.ceil(10)&&(o=M(t+(p-1)*a),c=w(t+(p-1)*a),i=M(t+p*a),l=w(t+p*a),!(b(l)>=e));p++){const t=[-o*r,-c*r],e=[o*r,-c*r],n=[i*r,-l*r],a=[-i*r,-l*r];s.push([t,e,n]),s.push([t,n,a])}i=M(e),l=w(e);const h=[-o*r,-c*r],u=[o*r,-c*r],d=[i*r,-l*r],f=[-i*r,-l*r];return s.push([h,u,d]),s.push([h,d,f]),s}function P(t,e){return function(n){return e.map((function(e){return[e,s.i2o(n,(function(n){return t(e-n)}))]}))}}function V(t){return function(e){return Math.abs(e/=t)<=1?.75*(1-e*e)/t:0}}function S(t){const e=t/2,n=3*Math.PI/2/16,r=[{x:Math.cos(5*Math.PI/4)*e,y:Math.sin(5*Math.PI/4)*e},{x:0,y:-Math.SQRT2*e}];for(let a=0;a<=16;a++)r.push({x:Math.cos(a*n-Math.PI/4)*e,y:Math.sin(a*n-Math.PI/4)*e});return r}function Z(t,e){const n=c().Bounds.create(t),r=n.min.x,a=n.max.x,o=n.min.y,i=n.max.y,l=s.m4Y([r,a]),h=s.m4Y([o,i]),u=[];for(let s=0;s<e;s++)for(;;){const e=l(Math.random()),n=h(Math.random());if(c().Vertices.contains(t,{x:e,y:n})){u.push([e,n]);break}}return u}const E=function(){const t=S(3),e=S(1),n=[];for(let r=0;r<t.length-2;r++)n.push([t[r],t[r+(r<2?1:2)],e[r+(r<2?1:2)],e[r]]);return n}();let T,I,z,A;function F(t){const e=s.czq(t.map((t=>t**2*3.14)));return Math.floor(2*Math.sqrt(e/3.14)/2)}function B(t,e,n){let r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];if(r&&z&&n.length===A)return z;T&&n.length===I||(T=s.y17(4).map((()=>Z(S(1),I=n.length))));const a=F(n.map((t=>{let{r:e}=t;return e}))),o=T[Math.floor(Math.random()*T.length)].map((t=>{let[e,n]=t;return[e*a,n*a]})),i=c().Engine,l=c().Bodies,h=c().Composite,u=i.create(),d=o.sort(((t,e)=>e[1]-t[1])),f=n.map(((t,e)=>{let{r:n,id:r}=t;const[a,s]=d[e];return l.circle(a,s,n,{restitution:0,id:r})})),p=E.map((t=>c().Body.create({position:c().Vertices.centre(t),vertices:t,isStatic:!0}))),m=c().Body.create({isStatic:!0});c().Body.setParts(m,p),c().Body.setCentre(m,{x:0,y:0}),c().Body.scale(m,a,a),h.add(u.world,[...f,m]);for(let s=0,c=60,g=.1;s<c*g;s++)i.update(u,1e3/c);const y=f.map((n=>{let{position:r,id:a}=n;return{id:a,x:r.x+t,y:r.y+e}}));return y.height=a/2/g*k,!r||z&&y.length===A||(z=y,A=y.length),y}function L(t,e){const[n,r]=(0,i.useState)(t);return[(0,i.useMemo)((()=>e(n)),[n]),(0,i.useCallback)((t=>{r(e(t))}),[])]}function R(t,e,n,r){const a=n[t][l.Vk][e][l.Zl];return s.m4Y().domain((0,h.kd)(0,1,a.length)).range(a.map((t=>Math.min(1,t/r)))).clamp(!0)}function Y(t,e,n){return"median"===t?Object.keys(e[n][l.Vk]).sort(((t,r)=>s.i2o(e[n][l.Vk][t][l.Zl])-s.i2o(e[n][l.Vk][r][l.Zl]))):"deliveries"===t?Object.keys(e[n][l.Vk]).sort(((t,r)=>s.T9B(e[n][l.Vk][t][l.Zl])-s.T9B(e[n][l.Vk][r][l.Zl]))):"alphabetical"===t?Object.keys(e[n][l.Vk]).sort():void 0}function q(t){return t*Math.PI/180}class O{constructor(t){let{fov:e,near:n,far:r,width:o,height:c,domElement:i,zoomFn:l}=t;this.fov=e,this.near=n,this.far=r,this.width=o,this.height=c,this.camera=new a.ubm(e,o/c,n,r+1),this.camera.position.set(0,0,this.far),this.zoom=s.s_O().scaleExtent([this.getScaleFromZ(this.far),this.getScaleFromZ(this.near)]).on("zoom",(t=>{this.d3ZoomHandler(t),this.curTransform=t.transform,l&&l(t)})),this.view=s.Ltv(i),this.view.call(this.zoom),this.zoom.transform(this.view,s.GSI.translate(this.width/2,this.height/2).scale(this.getScaleFromZ(this.far)))}d3ZoomHandler(t){const e=t.transform.k,n=-(t.transform.x-this.width/2)/e,r=(t.transform.y-this.height/2)/e,a=this.getZFromScale(e);this.camera.position.set(n,r,a)}getScaleFromZ(t){const e=q(this.fov/2),n=2*(Math.tan(e)*t);return this.height/n}getZFromScale(t){const e=q(this.fov/2);return this.height/t/(2*Math.tan(e))}}class W{constructor(){this.threeGeom=new a.V23,this.idx=0}addMeshCoords(t,e,n){let r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;const s=[];for(let o=0;o<t.length;o++){const[c,i,l]=t[o],h=new a.Pq0(e.x+c[0],e.y-c[1],r),u=new a.Pq0(e.x+i[0],e.y-i[1],r),d=new a.Pq0(e.x+l[0],e.y-l[1],r);this.threeGeom.vertices.push(h,u,d);const f=new a.nFj(3*this.idx+0,3*this.idx+1,3*this.idx+2);n&&(f.vertexColors.push(n),f.vertexColors.push(n),f.vertexColors.push(n)),this.threeGeom.faces.push(f),s.push(this.idx++)}return s}}function _(t){const[e,n]=(0,i.useState)(t),r=(0,i.useRef)(t);(0,i.useEffect)((()=>{r.current=e}),[e]);const a=(0,i.useCallback)((t=>{n(r.current=t)}),[]);return[e,a,r]}r()}catch(d){r(d)}}))}}]);
//# sourceMappingURL=704.9b0aa8ed.chunk.js.map