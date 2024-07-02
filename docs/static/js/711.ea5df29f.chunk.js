"use strict";(self.webpackChunkbuckets=self.webpackChunkbuckets||[]).push([[711],{711:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.r(e),n.d(e,{default:()=>m});var s=n(43),a=n(668),o=n(684),i=n(63),c=n(829),h=n(579),u=t([i,c]);[i,c]=u.then?(await u)():u;const f=10,d=3,p=0;function m(t){let{width:e=600,height:n=600}=t;const{current:r}=(0,s.useRef)(Object.keys(i.jx)),[u,l]=(0,s.useState)(p),m=(0,s.useRef)(),g=(0,s.useMemo)((()=>(0,c.Yb)("median",i.jx,r[u])),[u]),v=(0,s.useMemo)((()=>Array.from(g).filter(((t,e)=>(0,o.kd)(0,.9,20).map((t=>Math.floor((t+.05)*g.length))).includes(e)))),[g]),M=(0,s.useMemo)((()=>(0,o.kd)(0,1,f+1).map((t=>v.map((e=>(0,c.cv)(r[u],e,i.jx,i.pk)(t)))))),[v,u]),y=e-2*d,x=n-d,k=a.m4Y().range([0,y]),b=a.m4Y().range([x,0]);return(0,s.useEffect)((()=>{const t=m.current.attr("width",e).attr("height",n).append("g").attr("class","svg-container").attr("transform","translate(".concat(d,", ").concat(d/2,")"));t.append("defs").append("clipPath").attr("id","bucket-mask").append("path").attr("d",(0,o.wh)(y,x)),t.append("g").attr("class","graph-area").attr("clip-path","url(#bucket-mask)"),t.append("path").attr("d",(0,o.wh)(y,x).split("z")[0]).attr("stroke","lightgray").attr("stroke-linecap","round").attr("stroke-width",d).attr("fill","none")}),[]),(0,s.useEffect)((()=>{m.current.select(".graph-area").selectAll("path").data(M).join("path").attr("fill",((t,e)=>a.dM(e/M.length))).transition().duration(500).attr("d",(t=>{const e=[t[0]];for(let n=1;n<t.length;n++)e.push(t[n-1]),e.push(t[n]);return a.Wcw().x((function(e,n){return k(Math.ceil(n/2)/(t.length-1))})).y1((t=>b(t))).y0((()=>b(0)))(e)}))}),[M]),(0,h.jsxs)("div",{className:"big-bucket-wrapper",children:[(0,h.jsx)("select",{value:u,onChange:t=>l(parseInt(t.target.value)),children:r.map(((t,e)=>(0,h.jsx)("option",{name:e,value:e,children:t})))}),(0,h.jsx)("svg",{ref:t=>{m.current=a.Ltv(t)}})]})}r()}catch(l){r(l)}}))},684:(t,e,n)=>{n.d(e,{Q2:()=>i,YW:()=>h,ZC:()=>c,kd:()=>a,wh:()=>o});var r=n(668),s=n(43);function a(t,e,n){return r.y17(n).map((r=>r/(n-1)*(e-t)+t))}function o(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.8,a=t*s+t*(1-s)/2,o=t*(1-s)/2,i=[{x:r.GWP(a,t)(n),y:r.GWP(e,0)(n)},{x:a,y:e},{x:o,y:e},{x:r.GWP(o,0)(n),y:r.GWP(e,0)(n)}];return r.n8j().x((function(t){return t.x})).y((function(t){return t.y}))(i)+"z"}function i(t,e,n){let s=t.map((t=>Math.round(t.length/e))),a=r.czq(s);for(;a>n;)s[r.z94(t,((t,n)=>0!==t.length?t.length/e-s[n]:1/0))]-=1,a=r.czq(s);for(;a<n;)s[r.P2Z(t,((t,n)=>0!==t.length?t.length/e-s[n]:-1/0))]+=1,a=r.czq(s);return s}function c(t,e){const n=(0,s.useRef)({value:t,prev:null}),r=n.current.value;return(e?e(t,r):t===r)||(n.current={value:t,prev:r}),n.current.prev}const h=t=>r.dM(r.m4Y([.2,1])(t))},63:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.d(e,{Vk:()=>i,Xe:()=>f,Zl:()=>c,iL:()=>l,jx:()=>u,pk:()=>o,sQ:()=>h});var s=n(829),a=t([s]);s=(a.then?(await a)():a)[0];const o=1200,i="scens",c="delivs",h="delivs_unord",u=await async function(){const t=await(await fetch("./all_objectives.json")).json();for(const e of t){e[i]=e[i];for(const t of e[i])t[h]=t[c],t[c]=t[h].map((t=>Math.min(Math.max(0,t),o))).sort(((t,e)=>e-t));e[i]=(0,s.Et)(e[i],(t=>{let{name:e}=t;return e}))}return console.log("DATA: loading objectives data"),(0,s.Et)(t,(t=>{let{obj:e}=t;return e}))}(),l=Object.keys(u),f=Object.keys(Object.values(u)[0][i]);r()}catch(o){r(o)}}),1)},829:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.d(e,{C5:()=>S,Et:()=>d,Ng:()=>P,XC:()=>p,Yb:()=>F,bp:()=>j,cv:()=>q,hh:()=>E,i7:()=>Q,iJ:()=>A,js:()=>m,nC:()=>Y,u:()=>W,xC:()=>Z});var s=n(981),a=n(668),o=n(783),i=n.n(o),c=n(43),h=n(63),u=n(684),l=t([h]);function d(t,e){const n=Object.groupBy(t,e);for(const r of Object.keys(n))n[r]=n[r][0];return n}h=(l.then?(await l)():l)[0];const p={draw:function(t,e){t.moveTo(0,-e/2),t.lineTo(e/4,-e/4),t.arc(0,0,e/Math.SQRT2/2,-Math.PI/4,5*Math.PI/4),t.lineTo(0,-e/2),t.closePath()}},m="M0,-1L0.5,-0.5A0.707,0.707,0,1,1,-0.5,-0.5L0,-1Z";const g=Math.SQRT1_2,v=1,M=g+g,y=v+g,x=.75;function k(t){if(t>=x){return Math.SQRT1_2*(1-t)/(1-x)}const e=2*(1-t/(M/y))-1,n=Math.acos(e);return Math.sin(n)}function b(t){return(t-g/y)*(1+Math.SQRT2)}function w(t){return t/(1+Math.SQRT2)+g/y}function j(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2;if(Math.abs(t-e)<.01)return[];const r=n/2/v*g,s=.1,a=[],o=[];let i,c,h,u;for(let m=1;m<=Math.ceil(10)&&(i=k(t+(m-1)*s),c=b(t+(m-1)*s),h=k(t+m*s),u=b(t+m*s),!(w(u)>=e));m++){const t=[-i*r,-c*r],e=[i*r,-c*r],n=[h*r,-u*r],s=[-h*r,-u*r];a.push(e,n),o.push(t,s)}h=k(e),u=b(e);const l=[-i*r,-c*r],f=[i*r,-c*r],d=[h*r,-u*r],p=[-h*r,-u*r];return a.push(f,d),o.push(l,p),a.push(...o.reverse()),a}function P(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2;if(Math.abs(t-e)<.01)return[];const r=n/2/v*g,s=.1,a=[];let o,i,c,h;for(let p=1;p<=Math.ceil(10)&&(o=k(t+(p-1)*s),i=b(t+(p-1)*s),c=k(t+p*s),h=b(t+p*s),!(w(h)>=e));p++){const t=[-o*r,-i*r],e=[o*r,-i*r],n=[c*r,-h*r],s=[-c*r,-h*r];a.push([t,e,n]),a.push([t,n,s])}c=k(e),h=b(e);const u=[-o*r,-i*r],l=[o*r,-i*r],f=[c*r,-h*r],d=[-c*r,-h*r];return a.push([u,l,f]),a.push([u,f,d]),a}function S(t,e){return function(n){return e.map((function(e){return[e,a.i2o(n,(function(n){return t(e-n)}))]}))}}function Z(t){return function(e){return Math.abs(e/=t)<=1?.75*(1-e*e)/t:0}}function C(t){const e=t/2,n=3*Math.PI/2/16,r=[{x:Math.cos(5*Math.PI/4)*e,y:Math.sin(5*Math.PI/4)*e},{x:0,y:-Math.SQRT2*e}];for(let s=0;s<=16;s++)r.push({x:Math.cos(s*n-Math.PI/4)*e,y:Math.sin(s*n-Math.PI/4)*e});return r}function T(t,e){const n=i().Bounds.create(t),r=n.min.x,s=n.max.x,o=n.min.y,c=n.max.y,h=a.m4Y([r,s]),u=a.m4Y([o,c]),l=[];for(let a=0;a<e;a++)for(;;){const e=h(Math.random()),n=u(Math.random());if(i().Vertices.contains(t,{x:e,y:n})){l.push([e,n]);break}}return l}const z=function(){const t=C(3),e=C(1),n=[];for(let r=0;r<t.length-2;r++)n.push([t[r],t[r+(r<2?1:2)],e[r+(r<2?1:2)],e[r]]);return n}();let V,B,I,O;function R(t){const e=a.czq(t.map((t=>t**2*3.14)));return Math.floor(2*Math.sqrt(e/3.14)/2)}function E(t,e,n){let r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];if(r&&I&&n.length===O)return I;V&&n.length===B||(V=a.y17(4).map((()=>T(C(1),B=n.length))));const s=R(n.map((t=>{let{r:e}=t;return e}))),o=V[Math.floor(Math.random()*V.length)].map((t=>{let[e,n]=t;return[e*s,n*s]})),c=i().Engine,h=i().Bodies,u=i().Composite,l=c.create(),f=o.sort(((t,e)=>e[1]-t[1])),d=n.map(((t,e)=>{let{r:n,id:r}=t;const[s,a]=f[e];return h.circle(s,a,n,{restitution:0,id:r})})),p=z.map((t=>i().Body.create({position:i().Vertices.centre(t),vertices:t,isStatic:!0}))),m=i().Body.create({isStatic:!0});i().Body.setParts(m,p),i().Body.setCentre(m,{x:0,y:0}),i().Body.scale(m,s,s),u.add(l.world,[...d,m]);for(let a=0,i=60,g=.1;a<i*g;a++)c.update(l,1e3/i);const v=d.map((n=>{let{position:r,id:s}=n;return{id:s,x:r.x+t,y:r.y+e}}));return v.height=s/2/g*y,!r||I&&v.length===O||(I=v,O=v.length),v}function Y(t,e){const[n,r]=(0,c.useState)(t);return[(0,c.useMemo)((()=>e(n)),[n]),(0,c.useCallback)((t=>{r(e(t))}),[])]}function q(t,e,n,r){const s=n[t][h.Vk][e][h.Zl];return a.m4Y().domain((0,u.kd)(0,1,s.length)).range(s.map((t=>Math.min(1,t/r)))).clamp(!0)}function F(t,e,n){return"median"===t?Object.keys(e[n][h.Vk]).sort(((t,r)=>a.i2o(e[n][h.Vk][t][h.Zl])-a.i2o(e[n][h.Vk][r][h.Zl]))):"deliveries"===t?Object.keys(e[n][h.Vk]).sort(((t,r)=>a.T9B(e[n][h.Vk][t][h.Zl])-a.T9B(e[n][h.Vk][r][h.Zl]))):"alphabetical"===t?Object.keys(e[n][h.Vk]).sort():void 0}function G(t){return t*Math.PI/180}class Q{constructor(t){let{fov:e,near:n,far:r,width:o,height:i,domElement:c,zoomFn:h}=t;this.fov=e,this.near=n,this.far=r,this.width=o,this.height=i,this.camera=new s.ubm(e,o/i,n,r+1),this.camera.position.set(0,0,this.far),this.zoom=a.s_O().scaleExtent([this.getScaleFromZ(this.far),this.getScaleFromZ(this.near)]).on("zoom",(t=>{this.d3ZoomHandler(t),this.curTransform=t.transform,h&&h(t)})),this.view=a.Ltv(c),this.view.call(this.zoom),this.zoom.transform(this.view,a.GSI.translate(this.width/2,this.height/2).scale(this.getScaleFromZ(this.far)))}d3ZoomHandler(t){const e=t.transform.k,n=-(t.transform.x-this.width/2)/e,r=(t.transform.y-this.height/2)/e,s=this.getZFromScale(e);this.camera.position.set(n,r,s)}getScaleFromZ(t){const e=G(this.fov/2),n=2*(Math.tan(e)*t);return this.height/n}getZFromScale(t){const e=G(this.fov/2);return this.height/t/(2*Math.tan(e))}}class W{constructor(){this.threeGeom=new s.V23,this.idx=0}addMeshCoords(t,e,n){let r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;const a=[];for(let o=0;o<t.length;o++){const[i,c,h]=t[o],u=new s.Pq0(e.x+i[0],e.y-i[1],r),l=new s.Pq0(e.x+c[0],e.y-c[1],r),f=new s.Pq0(e.x+h[0],e.y-h[1],r);this.threeGeom.vertices.push(u,l,f);const d=new s.nFj(3*this.idx+0,3*this.idx+1,3*this.idx+2);n&&(d.vertexColors.push(n),d.vertexColors.push(n),d.vertexColors.push(n)),this.threeGeom.faces.push(d),a.push(this.idx++)}return a}}function A(t){const[e,n]=(0,c.useState)(t),r=(0,c.useRef)(t);(0,c.useEffect)((()=>{r.current=e}),[e]);const s=(0,c.useCallback)((t=>{n(r.current=t)}),[]);return[e,s,r]}r()}catch(f){r(f)}}))}}]);
//# sourceMappingURL=711.ea5df29f.chunk.js.map