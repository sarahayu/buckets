"use strict";(self.webpackChunkbuckets=self.webpackChunkbuckets||[]).push([[894],{111:(t,e,n)=>{n.d(e,{A:()=>u});var r=n(760),a=n(43),o=n(684),s=n(579);const i=40,c=10,l=3;function u(t){let{levelInterp:e,colorInterp:n=o.YW,width:u=200,height:h=400,resolution:f=c}=t;const d=(0,a.useId)(),p=(0,a.useRef)(),m=(0,a.useMemo)((()=>(0,o.kd)(0,1,f+1).map((t=>e(t)))),[e,f]),g=(0,o.ZC)(m),y=u-2*l,v=h-l;return(0,a.useLayoutEffect)((()=>{const t=p.current.append("g").attr("class","svg-container").attr("transform","translate(".concat(l,", ").concat(l/2,")"));t.append("defs").append("clipPath").attr("id","bucket-mask-"+d).append("path").attr("class","bucket-mask-path"),t.append("g").attr("class","graph-area").attr("clip-path","url(#bucket-mask-".concat(d,")")),t.append("g").append("path").attr("class","bucket-outline").attr("stroke","lightgray").attr("stroke-linecap","round").attr("stroke-width",l).attr("fill","none")}),[d]),(0,a.useLayoutEffect)((()=>{const t=p.current.attr("width",u).attr("height",h).select(".svg-container");t.select(".bucket-mask-path").attr("d",(0,o.wh)(y,v)),t.select(".bucket-outline").attr("d",(0,o.wh)(y,v).split("z")[0])}),[u,h,y,v]),(0,a.useLayoutEffect)((()=>{const t=p.current.select(".graph-area").selectAll(".bucketBox").data(m).join("rect").attr("class","bucketBox").attr("width",2*y).attr("height",2*v).attr("x",-y/2).attr("fill",((t,e)=>n(e/f)));t.transition("liquidLevel").ease(r.easeElasticOut.period(.6)).delay(((t,e)=>e*(100/f))).duration(1e3).attr("y",(t=>v-t*v)),t.transition("liquidSway").duration(2e3).delay(((t,e)=>10*e)).ease(r.easeQuad).attrTween("transform",(function(t,e){const n=g?Math.abs(g[e]-t):0;return t=>"rotate(".concat(Math.sin(Math.min(4*Math.PI*t/(.5*n+.5),4*Math.PI))*n*i*(1-t),", ").concat(y/2,", ",0,")")}))}),[m,g,u,h,y,v,f,n]),(0,s.jsx)("div",{className:"bucket-wrapper",children:(0,s.jsx)("svg",{ref:t=>{p.current=r.select(t)}})})}},987:(t,e,n)=>{n.d(e,{u:()=>o});var r=n(760),a=n(684);function o(t,e,n,o,s){const i=t.length/n;let c=r.histogram().value((t=>t)).domain(e).thresholds((0,a.kd)(...e,Math.ceil(o/(s/i))))(t),l=(0,a.Q2)(c,n,i),u=[];for(let r=0;r<l.length;r++)for(let e=0;e<l[r];e++)u.push([(c[r].x1+c[r].x0)/2,(e+.5)/i*t.length]);return u}},684:(t,e,n)=>{n.d(e,{Q2:()=>i,YW:()=>l,ZC:()=>c,kd:()=>o,wh:()=>s});var r=n(760),a=n(43);function o(t,e,n){return r.range(n).map((r=>r/(n-1)*(e-t)+t))}function s(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.8,o=t*a+t*(1-a)/2,s=t*(1-a)/2,i=[{x:r.interpolate(o,t)(n),y:r.interpolate(e,0)(n)},{x:o,y:e},{x:s,y:e},{x:r.interpolate(s,0)(n),y:r.interpolate(e,0)(n)}];return r.line().x((function(t){return t.x})).y((function(t){return t.y}))(i)+"z"}function i(t,e,n){let a=t.map((t=>Math.round(t.length/e))),o=r.sum(a);for(;o>n;)a[r.minIndex(t,((t,n)=>0!==t.length?t.length/e-a[n]:1/0))]-=1,o=r.sum(a);for(;o<n;)a[r.maxIndex(t,((t,n)=>0!==t.length?t.length/e-a[n]:-1/0))]+=1,o=r.sum(a);return a}function c(t,e){const n=(0,a.useRef)({value:t,prev:null}),r=n.current.value;return(e?e(t,r):t===r)||(n.current={value:t,prev:r}),n.current.prev}const l=t=>r.interpolateBlues(r.scaleLinear([.2,1])(t))},63:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.d(e,{Vk:()=>i,Xe:()=>f,Zl:()=>c,iL:()=>h,jx:()=>u,pk:()=>s,sQ:()=>l});var a=n(343),o=t([a]);a=(o.then?(await o)():o)[0];const s=1200,i="scens",c="delivs",l="delivs_unord",u=await async function(){const t=await(await fetch("./all_objectives.json")).json();for(const e of t){e[i]=e[i];for(const t of e[i]){const e=t[c].map((t=>Math.min(Math.max(0,t),s)));t[l]=e,t[c]=Array.from(e).sort(((t,e)=>e-t))}e[i]=(0,a.Et)(e[i],(t=>{let{name:e}=t;return e}))}return console.log("DATA: loading objectives data"),(0,a.Et)(t,(t=>{let{obj:e}=t;return e}))}(),h=Object.keys(u),f=Object.keys(Object.values(u)[0][i]);r()}catch(s){r(s)}}),1)},135:(t,e,n)=>{n.d(e,{A:()=>u});var r=n(760),a=n(43),o=n(987),s=n(579);const i=20,c={top:10,right:10,bottom:40,left:10},l={draw:function(t,e){t.moveTo(0,-e/2),t.lineTo(e/4,-e/4),t.arc(0,0,e/Math.SQRT2/2,-Math.PI/4,5*Math.PI/4),t.lineTo(0,-e/2),t.closePath()}};function u(t){let{data:e,domain:n=[0,r.max(e)],width:u=600,height:h=400}=t;const f=(0,a.useRef)(),d=(0,a.useMemo)((()=>(0,o.u)(e,n,e.length/i,u,h)),[e]),p=[0,e.length],m=r.scaleLinear().domain(n).range([0,u]),g=r.scaleLinear().domain(p).range([h,0]);return(0,a.useEffect)((()=>{f.current.selectAll("*").remove();f.current.attr("width",u+c.left+c.right).attr("height",h+c.top+c.bottom).style("pointer-events","none").append("g").attr("class","graph-area").attr("transform","translate(".concat(c.left,",").concat(c.top,")")).append("g").attr("transform","translate(0, ".concat(h,")")).call(r.axisBottom().scale(m).tickFormat(r.format(".2s"))).call((t=>{t.selectAll("line").attr("stroke","gray"),t.selectAll("path").attr("stroke","gray"),t.selectAll("text").attr("fill","gray")})).append("text").attr("fill","black").attr("font-size","2em").attr("transform","translate(".concat(u/2,", ",30,")")).text("Deliveries (TAF)")}),[e]),(0,a.useEffect)((()=>{const t=f.current.select(".graph-area").selectAll(".icons").data(d).join((t=>t.append("g").call((t=>t.append("path"))))).attr("class","icons").call((t=>{t.selectAll("path").attr("d",r.symbol(l,h/i))}));t.attr("transform",(t=>"translate(".concat(m(t[0]),",").concat(g(t[1]),")"))),t.attr("fill","steelblue")}),[d]),(0,s.jsx)("div",{className:"dot-histogram-wrapper",children:(0,s.jsx)("svg",{ref:t=>{f.current=r.select(t)}})})}},146:(t,e,n)=>{n.d(e,{A:()=>p});var r=n(760),a=n(43),o=n(684),s=n(394),i=n(579);const c=Math.SQRT1_2,l=1,u=l+c,h=40,f=10,d=3;function p(t){let{levelInterp:e,colorInterp:n=o.YW,width:c=200,height:p=400,resolution:m=f}=t;const g=(0,a.useId)(),y=(0,a.useRef)(),v=(0,a.useMemo)((()=>(0,o.kd)(0,1,m+1).map((t=>e(t)))),[e,m]),b=(0,o.ZC)(v),w=c-2*d,M=p-d;return(0,a.useLayoutEffect)((()=>{const t=y.current.append("g").attr("class","svg-container").attr("transform","translate(".concat(d,", ").concat(d/2,")"));t.append("defs").append("clipPath").attr("id","bucket-mask-"+g).append("path").attr("class","bucket-mask-path"),t.append("g").attr("class","graph-area").attr("clip-path","url(#bucket-mask-".concat(g,")")),t.append("g").append("path").attr("class","bucket-outline").attr("stroke","lightgray").attr("stroke-linecap","round").attr("stroke-width",d).attr("fill","none")}),[g]),(0,a.useLayoutEffect)((()=>{const t=y.current.attr("width",c).attr("height",p).select(".svg-container"),e=function(t,e){let[n,a]=e;const o=(0,s.bp)(0,1,t,20);return r.line().x((function(t){return t[0]+n})).y((function(t){return t[1]+a}))(o)+"z"}(M*(2*l)/u,[c/2,p*l/u]);t.select(".bucket-mask-path").attr("d",e),t.select(".bucket-outline").attr("d",e)}),[c,p,w,M]),(0,a.useLayoutEffect)((()=>{const t=y.current.select(".graph-area").selectAll(".bucketBox").data(v).join("rect").attr("class","bucketBox").attr("width",2*w).attr("height",2*M).attr("x",-w/2).attr("fill",((t,e)=>n(e/m)));t.transition("liquidLevel").ease(r.easeElasticOut.period(.6)).delay(((t,e)=>e*(100/m))).duration(1e3).attr("y",(t=>M-t*M)),t.transition("liquidSway").duration(2e3).delay(((t,e)=>10*e)).ease(r.easeQuad).attrTween("transform",(function(t,e){const n=b?Math.abs(b[e]-t):0;return t=>"rotate(".concat(Math.sin(Math.min(4*Math.PI*t/(.5*n+.5),4*Math.PI))*n*h*(1-t),", ").concat(w/2,", ",0,")")}))}),[v,b,c,p,w,M,m,n]),(0,i.jsx)("div",{className:"waterdrop-wrapper",children:(0,i.jsx)("svg",{ref:t=>{y.current=r.select(t)}})})}},394:(t,e,n)=>{n.d(e,{YB:()=>f,bp:()=>h,f2:()=>d});var r=n(760);const a=Math.SQRT1_2,o=1,s=a+a,i=o+a,c=(a+o/2)/i;function l(t){if(t>=c){return Math.SQRT1_2*(1-t)/(1-c)}const e=2*(1-t/(s/i))-1,n=Math.acos(e);return Math.sin(n)}function u(t){return(t-a/i)*(1+Math.SQRT2)}function h(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:10;if(Math.abs(t-e)<.01)return[];const s=n/2/o*a,c=1/r,h=[],f=[];let d,p,m,g;for(let o=1;o<=Math.ceil(1/c)&&(d=l(t+(o-1)*c),p=u(t+(o-1)*c),m=l(t+o*c),g=u(t+o*c),!(g/(1+Math.SQRT2)+a/i>=e));o++){const t=[-d*s,-p*s],e=[d*s,-p*s],n=[m*s,-g*s],r=[-m*s,-g*s];h.push(e,n),f.push(t,r)}m=l(e),g=u(e);const y=[-d*s,-p*s],v=[d*s,-p*s],b=[m*s,-g*s],w=[-m*s,-g*s];return h.push(v,b),f.push(y,w),h.push(...f.reverse()),h}function f(t,e,n){(e||r).selectAll(t).style("display",n||"block")}function d(t,e){(e||r).selectAll(t).style("display","none")}},343:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.d(e,{C5:()=>I,Et:()=>d,Ft:()=>W,Ng:()=>E,Ul:()=>_,XC:()=>p,Yb:()=>F,bp:()=>j,cv:()=>z,hh:()=>Z,i7:()=>Y,iJ:()=>G,js:()=>m,nC:()=>Q,si:()=>g,u:()=>N,xC:()=>O});var a=n(981),o=n(760),s=n(783),i=n.n(s),c=n(43),l=n(63),u=n(684),h=t([l]);function d(t,e){const n=Object.groupBy(t,e);for(const r of Object.keys(n))n[r]=n[r][0];return n}l=(h.then?(await h)():h)[0];const p={draw:function(t,e){t.moveTo(0,-e/2),t.lineTo(e/4,-e/4),t.arc(0,0,e/Math.SQRT2/2,-Math.PI/4,5*Math.PI/4),t.lineTo(0,-e/2),t.closePath()}},m="M0,-1L0.5,-0.5A0.707,0.707,0,1,1,-0.5,-0.5L0,-1Z";function g(t){return t-=.0088,Math.min(1,Math.max(0,(3.1304*t**3-4.2384*t**2+3.3471*t+.0298)/2.2326))}const y=Math.SQRT1_2,v=1,b=y+y,w=v+y,M=.75;function x(t){if(t>=M){return Math.SQRT1_2*(1-t)/(1-M)}const e=2*(1-t/(b/w))-1,n=Math.acos(e);return Math.sin(n)}function k(t){return(t-y/w)*(1+Math.SQRT2)}function S(t){return t/(1+Math.SQRT2)+y/w}function j(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2;if(Math.abs(t-e)<.01)return[];const r=n/2/v*y,a=.1,o=[],s=[];let i,c,l,u;for(let m=1;m<=Math.ceil(10)&&(i=x(t+(m-1)*a),c=k(t+(m-1)*a),l=x(t+m*a),u=k(t+m*a),!(S(u)>=e));m++){const t=[-i*r,-c*r],e=[i*r,-c*r],n=[l*r,-u*r],a=[-l*r,-u*r];o.push(e,n),s.push(t,a)}l=x(e),u=k(e);const h=[-i*r,-c*r],f=[i*r,-c*r],d=[l*r,-u*r],p=[-l*r,-u*r];return o.push(f,d),s.push(h,p),o.push(...s.reverse()),o}function E(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2;if(Math.abs(t-e)<.01)return[];const r=n/2/v*y,a=.1,o=[];let s,i,c,l;for(let p=1;p<=Math.ceil(10)&&(s=x(t+(p-1)*a),i=k(t+(p-1)*a),c=x(t+p*a),l=k(t+p*a),!(S(l)>=e));p++){const t=[-s*r,-i*r],e=[s*r,-i*r],n=[c*r,-l*r],a=[-c*r,-l*r];o.push([t,e,n]),o.push([t,n,a])}c=x(e),l=k(e);const u=[-s*r,-i*r],h=[s*r,-i*r],f=[c*r,-l*r],d=[-c*r,-l*r];return o.push([u,h,f]),o.push([u,f,d]),o}function I(t,e){return function(n){return e.map((function(e){return[e,o.mean(n,(function(n){return t(e-n)}))]}))}}function O(t){return function(e){return Math.abs(e/=t)<=1?.75*(1-e*e)/t:0}}function P(t){const e=t/2,n=3*Math.PI/2/16,r=[{x:Math.cos(5*Math.PI/4)*e,y:Math.sin(5*Math.PI/4)*e},{x:0,y:-Math.SQRT2*e}];for(let a=0;a<=16;a++)r.push({x:Math.cos(a*n-Math.PI/4)*e,y:Math.sin(a*n-Math.PI/4)*e});return r}function T(t,e){const n=i().Bounds.create(t),r=n.min.x,a=n.max.x,s=n.min.y,c=n.max.y,l=o.scaleLinear([r,a]),u=o.scaleLinear([s,c]),h=[];for(let o=0;o<e;o++)for(;;){const e=l(Math.random()),n=u(Math.random());if(i().Vertices.contains(t,{x:e,y:n})){h.push([e,n]);break}}return h}const A=function(){const t=P(3),e=P(1),n=[];for(let r=0;r<t.length-2;r++)n.push([t[r],t[r+(r<2?1:2)],e[r+(r<2?1:2)],e[r]]);return n}();let C,R,V,L;function B(t){const e=o.sum(t.map((t=>t**2*3.14)));return Math.floor(2*Math.sqrt(e/3.14)/2)}function Z(t,e,n){let r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];if(r&&V&&n.length===L)return V;C&&n.length===R||(C=o.range(4).map((()=>T(P(1),R=n.length))));const a=B(n.map((t=>{let{r:e}=t;return e}))),s=C[Math.floor(Math.random()*C.length)].map((t=>{let[e,n]=t;return[e*a,n*a]})),c=i().Engine,l=i().Bodies,u=i().Composite,h=c.create(),f=s.sort(((t,e)=>e[1]-t[1])),d=n.map(((t,e)=>{let{r:n,id:r}=t;const[a,o]=f[e];return l.circle(a,o,n,{restitution:0,id:r})})),p=A.map((t=>i().Body.create({position:i().Vertices.centre(t),vertices:t,isStatic:!0}))),m=i().Body.create({isStatic:!0});i().Body.setParts(m,p),i().Body.setCentre(m,{x:0,y:0}),i().Body.scale(m,a,a),u.add(h.world,[...d,m]);for(let o=0,i=60,y=.1;o<i*y;o++)c.update(h,1e3/i);const g=d.map((n=>{let{position:r,id:a}=n;return{id:a,x:r.x+t,y:r.y+e}}));return g.height=a/2/y*w,!r||V&&g.length===L||(V=g,L=g.length),g}function Q(t,e){const[n,r]=(0,c.useState)(t);return[(0,c.useMemo)((()=>e(n)),[n]),(0,c.useCallback)((t=>{r(e(t))}),[])]}function z(t,e,n,r){const a=n[t][l.Vk][e][l.Zl];return o.scaleLinear().domain((0,u.kd)(0,1,a.length)).range(a.map((t=>Math.min(1,t/r)))).clamp(!0)}function F(t,e,n){return"median"===t?Object.keys(e[n][l.Vk]).sort(((t,r)=>o.mean(e[n][l.Vk][t][l.Zl])-o.mean(e[n][l.Vk][r][l.Zl]))):"deliveries"===t?Object.keys(e[n][l.Vk]).sort(((t,r)=>o.max(e[n][l.Vk][t][l.Zl])-o.max(e[n][l.Vk][r][l.Zl]))):"alphabetical"===t?Object.keys(e[n][l.Vk]).sort():void 0}function q(t,e,n){var r;const a=e.split(".");for(let o of a){if(!t)return n;t=t[o]}return null!==(r=t)&&void 0!==r?r:n}function H(t){return"string"===typeof t?e=>q(e,t):t}function _(t,e){return e=H(e),t.sort(((t,n)=>{const r=e(t),a=e(n);return r<a?-1:r>a?1:0}))}function D(t){return t*Math.PI/180}class Y{constructor(t){let{fov:e,near:n,far:r,width:s,height:i,domElement:c,zoomFn:l}=t;this.raycaster=new a.tBo,this.fov=e,this.near=n,this.far=r,this.width=s,this.height=i,this.camera=new a.ubm(e,s/i,n,r+1),this.camera.position.set(0,0,this.far),this.zoom=o.zoom().scaleExtent([this.getScaleFromZ(this.far),this.getScaleFromZ(this.near)]).on("zoom",(t=>{this.d3ZoomHandler(t),this.curTransform=t.transform,l&&l(t)})),this.view=o.select(c),this.view.call(this.zoom),this.zoom.transform(this.view,o.zoomIdentity.translate(this.width/2,this.height/2).scale(this.getScaleFromZ(this.far)))}d3ZoomHandler(t){const e=t.transform.k,n=-(t.transform.x-this.width/2)/e,r=(t.transform.y-this.height/2)/e,a=this.getZFromScale(e);this.camera.position.set(n,r,a)}getScaleFromZ(t){const e=D(this.fov/2),n=2*(Math.tan(e)*t);return this.height/n}getZFromScale(t){const e=D(this.fov/2);return this.height/t/(2*Math.tan(e))}intersectObject(t,e,n){return this.raycaster.setFromCamera({x:t,y:e},this.camera),this.raycaster.intersectObject(n)}}class N{constructor(){this.threeGeom=new a.V23,this.idx=0}addMeshCoords(t,e,n){let r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;const o=[];for(let s=0;s<t.length;s++){const[i,c,l]=t[s],u=new a.Pq0(e.x+i[0],e.y-i[1],r),h=new a.Pq0(e.x+c[0],e.y-c[1],r),f=new a.Pq0(e.x+l[0],e.y-l[1],r);this.threeGeom.vertices.push(u,h,f);const d=new a.nFj(3*this.idx+0,3*this.idx+1,3*this.idx+2);n&&(d.vertexColors.push(n),d.vertexColors.push(n),d.vertexColors.push(n)),this.threeGeom.faces.push(d),o.push(this.idx++)}return o}}function W(t,e,n,r){return{x:t/n*2-1,y:-e/r*2+1}}function G(t){const[e,n]=(0,c.useState)(t),r=(0,c.useRef)(t);(0,c.useEffect)((()=>{r.current=e}),[e]);const a=(0,c.useCallback)((t=>{n(r.current=t)}),[]);return[e,a,r]}r()}catch(f){r(f)}}))},999:(t,e,n)=>{n.d(e,{h:()=>d,p:()=>M});var r=n(43);function a(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?a(Object(n),!0).forEach((function(e){s(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function s(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function i(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!==typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null==n)return;var r,a,o=[],s=!0,i=!1;try{for(n=n.call(t);!(s=(r=n.next()).done)&&(o.push(r.value),!e||o.length!==e);s=!0);}catch(c){i=!0,a=c}finally{try{s||null==n.return||n.return()}finally{if(i)throw a}}return o}(t,e)||function(t,e){if(!t)return;if("string"===typeof t)return c(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return c(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var l=function(t){return"string"===typeof t&&t.includes("px")},u={position:"fixed",left:0,width:"100%",height:0,borderTop:"2px dashed black",zIndex:9999},h={fontSize:"12px",fontFamily:"monospace",margin:0,padding:6},f=function(t){var e=t.offset,n=function(t){return l(t)?t:"".concat(100*t,"%")}(e);return r.createElement("div",{style:o(o({},u),{},{top:n})},r.createElement("p",{style:h},"trigger: ",e))},d=function(t){var e=t.debug,n=t.children,a=t.offset,o=void 0===a?.3:a,s=t.onStepEnter,c=void 0===s?function(){}:s,u=t.onStepExit,h=void 0===u?function(){}:u,d=t.onStepProgress,p=void 0===d?null:d,m=t.threshold,g=void 0===m?4:m,y=l(o),v=i((0,r.useState)(0),2),b=v[0],w=v[1],M=i((0,r.useState)(null),2),x=M[0],k=M[1],S=function(t){w(t)},j=function(t){k(window.innerHeight)};r.useEffect((function(){if(y)return window.addEventListener("resize",j),function(){window.removeEventListener("resize",j)}}),[]);var E="undefined"!==typeof window?x||window.innerHeight:0,I=y?+o.replace("px","")/E:o,O=(0,r.useMemo)((function(){return function(t,e){for(var n=Math.ceil(e/t),r=[],a=1/n,o=0;o<=n;o+=1)r.push(o*a);return r}(g,E)}),[E]);return r.createElement(r.Fragment,null,e&&r.createElement(f,{offset:o}),r.Children.map(n,(function(t,e){return r.cloneElement(t,{scrollamaId:"react-scrollama-".concat(e),offset:I,onStepEnter:c,onStepExit:h,onStepProgress:p,lastScrollTop:b,handleSetLastScrollTop:S,progressThreshold:O,innerHeight:E})})))};const p=new Map,m=new WeakMap;let g,y=0;function v(t){return Object.keys(t).sort().filter((e=>void 0!==t[e])).map((e=>{return"".concat(e,"_").concat("root"===e?(n=t.root)?(m.has(n)||(y+=1,m.set(n,y.toString())),m.get(n)):"0":t[e]);var n})).toString()}function b(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:g;if("undefined"===typeof window.IntersectionObserver&&void 0!==r){const a=t.getBoundingClientRect();return e(r,{isIntersecting:r,target:t,intersectionRatio:"number"===typeof n.threshold?n.threshold:0,time:0,boundingClientRect:a,intersectionRect:a,rootBounds:a}),()=>{}}const{id:a,observer:o,elements:s}=function(t){let e=v(t),n=p.get(e);if(!n){const r=new Map;let a;const o=new IntersectionObserver((e=>{e.forEach((e=>{var n;const o=e.isIntersecting&&a.some((t=>e.intersectionRatio>=t));t.trackVisibility&&"undefined"===typeof e.isVisible&&(e.isVisible=o),null==(n=r.get(e.target))||n.forEach((t=>{t(o,e)}))}))}),t);a=o.thresholds||(Array.isArray(t.threshold)?t.threshold:[t.threshold||0]),n={id:e,observer:o,elements:r},p.set(e,n)}return n}(n);let i=s.get(t)||[];return s.has(t)||s.set(t,i),i.push(e),o.observe(t),function(){i.splice(i.indexOf(e),1),0===i.length&&(s.delete(t),o.unobserve(t)),0===s.size&&(o.disconnect(),p.delete(a))}}function w(){let{threshold:t,delay:e,trackVisibility:n,rootMargin:a,root:o,triggerOnce:s,skip:i,initialInView:c,fallbackInView:l,onChange:u}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const h=r.useRef(),f=r.useRef(),[d,p]=r.useState({inView:!!c});f.current=u;const m=r.useCallback((r=>{void 0!==h.current&&(h.current(),h.current=void 0),i||r&&(h.current=b(r,((t,e)=>{p({inView:t,entry:e}),f.current&&f.current(t,e),e.isIntersecting&&s&&h.current&&(h.current(),h.current=void 0)}),{root:o,rootMargin:a,threshold:t,trackVisibility:n,delay:e},l))}),[Array.isArray(t)?t.toString():t,o,a,s,i,n,l,e]);r.useEffect((()=>{h.current||!d.entry||s||i||p({inView:!!c})}));const g=[m,d.inView,d.entry];return g.ref=g[0],g.inView=g[1],g.entry=g[2],g}var M=function(t){var e=t.children,n=t.data,a=t.handleSetLastScrollTop,o=t.lastScrollTop,s=t.onStepEnter,c=void 0===s?function(){}:s,l=t.onStepExit,u=void 0===l?function(){}:l,h=t.onStepProgress,f=void 0===h?null:h,d=t.offset,p=t.scrollamaId,m=t.progressThreshold,g=t.innerHeight,y="undefined"!==typeof window?document.documentElement.scrollTop:0,v=o<y?"down":"up",b=function(t){return"-".concat(100*t,"% 0px -").concat(100-100*t,"% 0px")}(d),M=(0,r.useRef)(null),x=i((0,r.useState)(!1),2),k=x[0],S=x[1],j=w({rootMargin:b,threshold:0}),E=j.ref,I=j.entry,O=w({rootMargin:(0,r.useMemo)((function(){return function(t,e,n,r){if(!n.current)return"0px";var a=n.current.offsetHeight/r;return"down"===t?"".concat(100*(a-e),"% 0px ").concat(100*e-100,"% 0px"):"-".concat(100*e,"% 0px ").concat(100*a-(100-100*e),"% 0px")}(v,d,M,g)}),[v,d,M,g]),threshold:m}),P=O.ref,T=O.entry,A=(0,r.useCallback)((function(t){M.current=t,E(t),P(t)}),[E,P]);return r.useEffect((function(){if(k){var t=T.target.getBoundingClientRect(),e=t.height,r=t.top,a=Math.min(1,Math.max(0,(window.innerHeight*d-r)/e));f&&f({progress:a,scrollamaId:p,data:n,element:T.target,entry:T,direction:v})}}),[T]),r.useEffect((function(){I&&!I.isIntersecting&&k?(u({element:I.target,scrollamaId:p,data:n,entry:I,direction:v}),S(!1),a(y)):I&&I.isIntersecting&&!k&&(S(!0),c({element:I.target,scrollamaId:p,data:n,entry:I,direction:v}),a(y))}),[I]),r.cloneElement(r.Children.only(e),{"data-react-scrollama-id":p,ref:A,entry:I})}}}]);
//# sourceMappingURL=894.3f1d735f.chunk.js.map