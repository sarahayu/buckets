"use strict";(self.webpackChunkbuckets=self.webpackChunkbuckets||[]).push([[262],{5111:(t,e,n)=>{n.d(e,{A:()=>l});var r=n(5760),o=n(5043),a=n(1684),i=n(579);const s=40,c=10,u=3;function l(t){let{levelInterp:e,colorInterp:n=a.YW,width:l=200,height:h=400,resolution:f=c}=t;const d=(0,o.useId)(),p=(0,o.useRef)(),m=(0,o.useMemo)((()=>(0,a.kd)(0,1,f+1).map((t=>e(t)))),[e,f]),g=(0,a.ZC)(m),y=l-2*u,v=h-u;return(0,o.useLayoutEffect)((()=>{const t=p.current.append("g").attr("class","svg-container").attr("transform","translate(".concat(u,", ").concat(u/2,")"));t.append("defs").append("clipPath").attr("id","bucket-mask-"+d).append("path").attr("class","bucket-mask-path"),t.append("g").attr("class","graph-area").attr("clip-path","url(#bucket-mask-".concat(d,")")),t.append("g").append("path").attr("class","bucket-outline").attr("stroke","lightgray").attr("stroke-linecap","round").attr("stroke-width",u).attr("fill","none")}),[d]),(0,o.useLayoutEffect)((()=>{const t=p.current.attr("width",l).attr("height",h).select(".svg-container");t.select(".bucket-mask-path").attr("d",(0,a.wh)(y,v)),t.select(".bucket-outline").attr("d",(0,a.wh)(y,v).split("z")[0])}),[l,h,y,v]),(0,o.useLayoutEffect)((()=>{const t=p.current.select(".graph-area").selectAll(".bucketBox").data(m).join("rect").attr("class","bucketBox").attr("width",2*y).attr("height",2*v).attr("x",-y/2).attr("fill",((t,e)=>n(e/f)));t.transition("liquidLevel").ease(r.easeElasticOut.period(.6)).delay(((t,e)=>e*(100/f))).duration(1e3).attr("y",(t=>v-t*v)),t.transition("liquidSway").duration(2e3).delay(((t,e)=>10*e)).ease(r.easeQuad).attrTween("transform",(function(t,e){const n=g?Math.abs(g[e]-t):0;return t=>"rotate(".concat(Math.sin(Math.min(4*Math.PI*t/(.5*n+.5),4*Math.PI))*n*s*(1-t),", ").concat(y/2,", ",0,")")}))}),[m,g,l,h,y,v,f,n]),(0,i.jsx)("div",{className:"bucket-wrapper",children:(0,i.jsx)("svg",{ref:t=>{p.current=r.select(t)}})})}},4987:(t,e,n)=>{n.d(e,{u:()=>a});var r=n(5760),o=n(1684);function a(t,e,n,a,i){const s=t.length/n;let c=r.histogram().value((t=>t)).domain(e).thresholds((0,o.kd)(...e,Math.ceil(a/(i/s))))(t),u=(0,o.Q2)(c,n,s),l=[];for(let r=0;r<u.length;r++)for(let e=0;e<u[r];e++)l.push([(c[r].x1+c[r].x0)/2,(e+.5)/s*t.length]);return l}},1684:(t,e,n)=>{n.d(e,{Q2:()=>s,YW:()=>u,ZC:()=>c,kd:()=>a,wh:()=>i});var r=n(5760),o=n(5043);function a(t,e,n){return r.range(n).map((r=>r/(n-1)*(e-t)+t))}function i(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.8,a=t*o+t*(1-o)/2,i=t*(1-o)/2,s=[{x:r.interpolate(a,t)(n),y:r.interpolate(e,0)(n)},{x:a,y:e},{x:i,y:e},{x:r.interpolate(i,0)(n),y:r.interpolate(e,0)(n)}];return r.line().x((function(t){return t.x})).y((function(t){return t.y}))(s)+"z"}function s(t,e,n){let o=t.map((t=>Math.round(t.length/e))),a=r.sum(o);for(;a>n;)o[r.minIndex(t,((t,n)=>0!==t.length?t.length/e-o[n]:1/0))]-=1,a=r.sum(o);for(;a<n;)o[r.maxIndex(t,((t,n)=>0!==t.length?t.length/e-o[n]:-1/0))]+=1,a=r.sum(o);return o}function c(t,e){const n=(0,o.useRef)({value:t,prev:null}),r=n.current.value;return(e?e(t,r):t===r)||(n.current={value:t,prev:r}),n.current.prev}const u=t=>r.interpolateBlues(r.scaleLinear([.2,1])(t))},63:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.d(e,{Vk:()=>s,Xe:()=>f,Zl:()=>c,iL:()=>h,jx:()=>l,pk:()=>i,sQ:()=>u});var o=n(9985),a=t([o]);o=(a.then?(await a)():a)[0];const i=1200,s="scens",c="delivs",u="delivs_unord",l=await async function(){const t=await(await fetch("./all_objectives.json")).json();for(const e of t){e[s]=e[s];for(const t of e[s]){const e=t[c].map((t=>Math.min(Math.max(0,t),i)));t[u]=e,t[c]=Array.from(e).sort(((t,e)=>e-t))}e[s]=(0,o.Et)(e[s],(t=>{let{name:e}=t;return e}))}return console.log("DATA: loading objectives data"),(0,o.Et)(t,(t=>{let{obj:e}=t;return e}))}(),h=Object.keys(l),f=Object.keys(Object.values(l)[0][s]);r()}catch(i){r(i)}}),1)},9985:(t,e,n)=>{n.a(t,(async(t,r)=>{try{n.d(e,{C5:()=>I,Et:()=>d,Ft:()=>G,Ng:()=>E,Ul:()=>_,XC:()=>p,Yb:()=>F,bp:()=>j,cv:()=>z,hh:()=>Z,i7:()=>Y,iJ:()=>N,js:()=>m,nC:()=>Q,si:()=>g,u:()=>W,xC:()=>O});var o=n(3981),a=n(5760),i=n(3783),s=n.n(i),c=n(5043),u=n(63),l=n(1684),h=t([u]);function d(t,e){const n=Object.groupBy(t,e);for(const r of Object.keys(n))n[r]=n[r][0];return n}u=(h.then?(await h)():h)[0];const p={draw:function(t,e){t.moveTo(0,-e/2),t.lineTo(e/4,-e/4),t.arc(0,0,e/Math.SQRT2/2,-Math.PI/4,5*Math.PI/4),t.lineTo(0,-e/2),t.closePath()}},m="M0,-1L0.5,-0.5A0.707,0.707,0,1,1,-0.5,-0.5L0,-1Z";function g(t){return t-=.0088,Math.min(1,Math.max(0,(3.1304*t**3-4.2384*t**2+3.3471*t+.0298)/2.2326))}const y=Math.SQRT1_2,v=1,b=y+y,w=v+y,M=.75;function k(t){if(t>=M){return Math.SQRT1_2*(1-t)/(1-M)}const e=2*(1-t/(b/w))-1,n=Math.acos(e);return Math.sin(n)}function x(t){return(t-y/w)*(1+Math.SQRT2)}function S(t){return t/(1+Math.SQRT2)+y/w}function j(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2;if(Math.abs(t-e)<.01)return[];const r=n/2/v*y,o=.1,a=[],i=[];let s,c,u,l;for(let m=1;m<=Math.ceil(10)&&(s=k(t+(m-1)*o),c=x(t+(m-1)*o),u=k(t+m*o),l=x(t+m*o),!(S(l)>=e));m++){const t=[-s*r,-c*r],e=[s*r,-c*r],n=[u*r,-l*r],o=[-u*r,-l*r];a.push(e,n),i.push(t,o)}u=k(e),l=x(e);const h=[-s*r,-c*r],f=[s*r,-c*r],d=[u*r,-l*r],p=[-u*r,-l*r];return a.push(f,d),i.push(h,p),a.push(...i.reverse()),a}function E(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2;if(Math.abs(t-e)<.01)return[];const r=n/2/v*y,o=.1,a=[];let i,s,c,u;for(let p=1;p<=Math.ceil(10)&&(i=k(t+(p-1)*o),s=x(t+(p-1)*o),c=k(t+p*o),u=x(t+p*o),!(S(u)>=e));p++){const t=[-i*r,-s*r],e=[i*r,-s*r],n=[c*r,-u*r],o=[-c*r,-u*r];a.push([t,e,n]),a.push([t,n,o])}c=k(e),u=x(e);const l=[-i*r,-s*r],h=[i*r,-s*r],f=[c*r,-u*r],d=[-c*r,-u*r];return a.push([l,h,f]),a.push([l,f,d]),a}function I(t,e){return function(n){return e.map((function(e){return[e,a.mean(n,(function(n){return t(e-n)}))]}))}}function O(t){return function(e){return Math.abs(e/=t)<=1?.75*(1-e*e)/t:0}}function P(t){const e=t/2,n=3*Math.PI/2/16,r=[{x:Math.cos(5*Math.PI/4)*e,y:Math.sin(5*Math.PI/4)*e},{x:0,y:-Math.SQRT2*e}];for(let o=0;o<=16;o++)r.push({x:Math.cos(o*n-Math.PI/4)*e,y:Math.sin(o*n-Math.PI/4)*e});return r}function C(t,e){const n=s().Bounds.create(t),r=n.min.x,o=n.max.x,i=n.min.y,c=n.max.y,u=a.scaleLinear([r,o]),l=a.scaleLinear([i,c]),h=[];for(let a=0;a<e;a++)for(;;){const e=u(Math.random()),n=l(Math.random());if(s().Vertices.contains(t,{x:e,y:n})){h.push([e,n]);break}}return h}const T=function(){const t=P(3),e=P(1),n=[];for(let r=0;r<t.length-2;r++)n.push([t[r],t[r+(r<2?1:2)],e[r+(r<2?1:2)],e[r]]);return n}();let R,V,A,L;function B(t){const e=a.sum(t.map((t=>t**2*3.14)));return Math.floor(2*Math.sqrt(e/3.14)/2)}function Z(t,e,n){let r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];if(r&&A&&n.length===L)return A;R&&n.length===V||(R=a.range(4).map((()=>C(P(1),V=n.length))));const o=B(n.map((t=>{let{r:e}=t;return e}))),i=R[Math.floor(Math.random()*R.length)].map((t=>{let[e,n]=t;return[e*o,n*o]})),c=s().Engine,u=s().Bodies,l=s().Composite,h=c.create(),f=i.sort(((t,e)=>e[1]-t[1])),d=n.map(((t,e)=>{let{r:n,id:r}=t;const[o,a]=f[e];return u.circle(o,a,n,{restitution:0,id:r})})),p=T.map((t=>s().Body.create({position:s().Vertices.centre(t),vertices:t,isStatic:!0}))),m=s().Body.create({isStatic:!0});s().Body.setParts(m,p),s().Body.setCentre(m,{x:0,y:0}),s().Body.scale(m,o,o),l.add(h.world,[...d,m]);for(let a=0,s=60,y=.1;a<s*y;a++)c.update(h,1e3/s);const g=d.map((n=>{let{position:r,id:o}=n;return{id:o,x:r.x+t,y:r.y+e}}));return g.height=o/2/y*w,!r||A&&g.length===L||(A=g,L=g.length),g}function Q(t,e){const[n,r]=(0,c.useState)(t);return[(0,c.useMemo)((()=>e(n)),[n]),(0,c.useCallback)((t=>{r(e(t))}),[])]}function z(t,e,n,r){const o=n[t][u.Vk][e][u.Zl];return a.scaleLinear().domain((0,l.kd)(0,1,o.length)).range(o.map((t=>Math.min(1,t/r)))).clamp(!0)}function F(t,e,n){return"median"===t?Object.keys(e[n][u.Vk]).sort(((t,r)=>a.mean(e[n][u.Vk][t][u.Zl])-a.mean(e[n][u.Vk][r][u.Zl]))):"deliveries"===t?Object.keys(e[n][u.Vk]).sort(((t,r)=>a.max(e[n][u.Vk][t][u.Zl])-a.max(e[n][u.Vk][r][u.Zl]))):"alphabetical"===t?Object.keys(e[n][u.Vk]).sort():void 0}function q(t,e,n){var r;const o=e.split(".");for(let a of o){if(!t)return n;t=t[a]}return null!==(r=t)&&void 0!==r?r:n}function H(t){return"string"===typeof t?e=>q(e,t):t}function _(t,e){return e=H(e),t.sort(((t,n)=>{const r=e(t),o=e(n);return r<o?-1:r>o?1:0}))}function D(t){return t*Math.PI/180}class Y{constructor(t){let{fov:e,near:n,far:r,width:i,height:s,domElement:c,zoomFn:u}=t;this.raycaster=new o.tBo,this.fov=e,this.near=n,this.far=r,this.width=i,this.height=s,this.camera=new o.ubm(e,i/s,n,r+1),this.camera.position.set(0,0,this.far),this.zoom=a.zoom().scaleExtent([this.getScaleFromZ(this.far),this.getScaleFromZ(this.near)]).on("zoom",(t=>{this.d3ZoomHandler(t),this.curTransform=t.transform,u&&u(t)})),this.view=a.select(c),this.view.call(this.zoom),this.zoom.transform(this.view,a.zoomIdentity.translate(this.width/2,this.height/2).scale(this.getScaleFromZ(this.far)))}d3ZoomHandler(t){const e=t.transform.k,n=-(t.transform.x-this.width/2)/e,r=(t.transform.y-this.height/2)/e,o=this.getZFromScale(e);this.camera.position.set(n,r,o)}getScaleFromZ(t){const e=D(this.fov/2),n=2*(Math.tan(e)*t);return this.height/n}getZFromScale(t){const e=D(this.fov/2);return this.height/t/(2*Math.tan(e))}intersectObject(t,e,n){return this.raycaster.setFromCamera({x:t,y:e},this.camera),this.raycaster.intersectObject(n)}}class W{constructor(){this.threeGeom=new o.V23,this.idx=0}addMeshCoords(t,e,n){let r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;const a=[];for(let i=0;i<t.length;i++){const[s,c,u]=t[i],l=new o.Pq0(e.x+s[0],e.y-s[1],r),h=new o.Pq0(e.x+c[0],e.y-c[1],r),f=new o.Pq0(e.x+u[0],e.y-u[1],r);this.threeGeom.vertices.push(l,h,f);const d=new o.nFj(3*this.idx+0,3*this.idx+1,3*this.idx+2);n&&(d.vertexColors.push(n),d.vertexColors.push(n),d.vertexColors.push(n)),this.threeGeom.faces.push(d),a.push(this.idx++)}return a}}function G(t,e,n,r){return{x:t/n*2-1,y:-e/r*2+1}}function N(t){const[e,n]=(0,c.useState)(t),r=(0,c.useRef)(t);(0,c.useEffect)((()=>{r.current=e}),[e]);const o=(0,c.useCallback)((t=>{n(r.current=t)}),[]);return[e,o,r]}r()}catch(f){r(f)}}))},1146:(t,e,n)=>{n.d(e,{A:()=>p});var r=n(5760),o=n(5043),a=n(1684),i=n(3394),s=n(579);const c=Math.SQRT1_2,u=1,l=u+c,h=40,f=10,d=3;function p(t){let{levelInterp:e,colorInterp:n=a.YW,width:c=200,height:p=400,resolution:m=f}=t;const g=(0,o.useId)(),y=(0,o.useRef)(),v=(0,o.useMemo)((()=>(0,a.kd)(0,1,m+1).map((t=>e(t)))),[e,m]),b=(0,a.ZC)(v),w=c-2*d,M=p-d;return(0,o.useLayoutEffect)((()=>{const t=y.current.append("g").attr("class","svg-container").attr("transform","translate(".concat(d,", ").concat(d/2,")"));t.append("defs").append("clipPath").attr("id","bucket-mask-"+g).append("path").attr("class","bucket-mask-path"),t.append("g").attr("class","graph-area").attr("clip-path","url(#bucket-mask-".concat(g,")")),t.append("g").append("path").attr("class","bucket-outline").attr("stroke","lightgray").attr("stroke-linecap","round").attr("stroke-width",d).attr("fill","none")}),[g]),(0,o.useLayoutEffect)((()=>{const t=y.current.attr("width",c).attr("height",p).select(".svg-container"),e=function(t,e){let[n,o]=e;const a=(0,i.bp)(0,1,t,20);return r.line().x((function(t){return t[0]+n})).y((function(t){return t[1]+o}))(a)+"z"}(M*(2*u)/l,[c/2,p*u/l]);t.select(".bucket-mask-path").attr("d",e),t.select(".bucket-outline").attr("d",e)}),[c,p,w,M]),(0,o.useLayoutEffect)((()=>{const t=y.current.select(".graph-area").selectAll(".bucketBox").data(v).join("rect").attr("class","bucketBox").attr("width",2*w).attr("height",2*M).attr("x",-w/2).attr("fill",((t,e)=>n(e/m)));t.transition("liquidLevel").ease(r.easeElasticOut.period(.6)).delay(((t,e)=>e*(100/m))).duration(1e3).attr("y",(t=>M-t*M)),t.transition("liquidSway").duration(2e3).delay(((t,e)=>10*e)).ease(r.easeQuad).attrTween("transform",(function(t,e){const n=b?Math.abs(b[e]-t):0;return t=>"rotate(".concat(Math.sin(Math.min(4*Math.PI*t/(.5*n+.5),4*Math.PI))*n*h*(1-t),", ").concat(w/2,", ",0,")")}))}),[v,b,c,p,w,M,m,n]),(0,s.jsx)("div",{className:"waterdrop-wrapper",children:(0,s.jsx)("svg",{ref:t=>{y.current=r.select(t)}})})}},3394:(t,e,n)=>{n.d(e,{YB:()=>f,bp:()=>h,f2:()=>d});var r=n(5760);const o=Math.SQRT1_2,a=1,i=o+o,s=a+o,c=(o+a/2)/s;function u(t){if(t>=c){return Math.SQRT1_2*(1-t)/(1-c)}const e=2*(1-t/(i/s))-1,n=Math.acos(e);return Math.sin(n)}function l(t){return(t-o/s)*(1+Math.SQRT2)}function h(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:10;if(Math.abs(t-e)<.01)return[];const i=n/2/a*o,c=1/r,h=[],f=[];let d,p,m,g;for(let a=1;a<=Math.ceil(1/c)&&(d=u(t+(a-1)*c),p=l(t+(a-1)*c),m=u(t+a*c),g=l(t+a*c),!(g/(1+Math.SQRT2)+o/s>=e));a++){const t=[-d*i,-p*i],e=[d*i,-p*i],n=[m*i,-g*i],r=[-m*i,-g*i];h.push(e,n),f.push(t,r)}m=u(e),g=l(e);const y=[-d*i,-p*i],v=[d*i,-p*i],b=[m*i,-g*i],w=[-m*i,-g*i];return h.push(v,b),f.push(y,w),h.push(...f.reverse()),h}function f(t,e,n){(e||r).selectAll(t).style("display",n||"block")}function d(t,e){(e||r).selectAll(t).style("display","none")}},3999:(t,e,n)=>{n.d(e,{h:()=>d,p:()=>M});var r=n(5043);function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function a(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach((function(e){i(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function s(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!==typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null==n)return;var r,o,a=[],i=!0,s=!1;try{for(n=n.call(t);!(i=(r=n.next()).done)&&(a.push(r.value),!e||a.length!==e);i=!0);}catch(c){s=!0,o=c}finally{try{i||null==n.return||n.return()}finally{if(s)throw o}}return a}(t,e)||function(t,e){if(!t)return;if("string"===typeof t)return c(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return c(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var u=function(t){return"string"===typeof t&&t.includes("px")},l={position:"fixed",left:0,width:"100%",height:0,borderTop:"2px dashed black",zIndex:9999},h={fontSize:"12px",fontFamily:"monospace",margin:0,padding:6},f=function(t){var e=t.offset,n=function(t){return u(t)?t:"".concat(100*t,"%")}(e);return r.createElement("div",{style:a(a({},l),{},{top:n})},r.createElement("p",{style:h},"trigger: ",e))},d=function(t){var e=t.debug,n=t.children,o=t.offset,a=void 0===o?.3:o,i=t.onStepEnter,c=void 0===i?function(){}:i,l=t.onStepExit,h=void 0===l?function(){}:l,d=t.onStepProgress,p=void 0===d?null:d,m=t.threshold,g=void 0===m?4:m,y=u(a),v=s((0,r.useState)(0),2),b=v[0],w=v[1],M=s((0,r.useState)(null),2),k=M[0],x=M[1],S=function(t){w(t)},j=function(t){x(window.innerHeight)};r.useEffect((function(){if(y)return window.addEventListener("resize",j),function(){window.removeEventListener("resize",j)}}),[]);var E="undefined"!==typeof window?k||window.innerHeight:0,I=y?+a.replace("px","")/E:a,O=(0,r.useMemo)((function(){return function(t,e){for(var n=Math.ceil(e/t),r=[],o=1/n,a=0;a<=n;a+=1)r.push(a*o);return r}(g,E)}),[E]);return r.createElement(r.Fragment,null,e&&r.createElement(f,{offset:a}),r.Children.map(n,(function(t,e){return r.cloneElement(t,{scrollamaId:"react-scrollama-".concat(e),offset:I,onStepEnter:c,onStepExit:h,onStepProgress:p,lastScrollTop:b,handleSetLastScrollTop:S,progressThreshold:O,innerHeight:E})})))};const p=new Map,m=new WeakMap;let g,y=0;function v(t){return Object.keys(t).sort().filter((e=>void 0!==t[e])).map((e=>{return"".concat(e,"_").concat("root"===e?(n=t.root)?(m.has(n)||(y+=1,m.set(n,y.toString())),m.get(n)):"0":t[e]);var n})).toString()}function b(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:g;if("undefined"===typeof window.IntersectionObserver&&void 0!==r){const o=t.getBoundingClientRect();return e(r,{isIntersecting:r,target:t,intersectionRatio:"number"===typeof n.threshold?n.threshold:0,time:0,boundingClientRect:o,intersectionRect:o,rootBounds:o}),()=>{}}const{id:o,observer:a,elements:i}=function(t){let e=v(t),n=p.get(e);if(!n){const r=new Map;let o;const a=new IntersectionObserver((e=>{e.forEach((e=>{var n;const a=e.isIntersecting&&o.some((t=>e.intersectionRatio>=t));t.trackVisibility&&"undefined"===typeof e.isVisible&&(e.isVisible=a),null==(n=r.get(e.target))||n.forEach((t=>{t(a,e)}))}))}),t);o=a.thresholds||(Array.isArray(t.threshold)?t.threshold:[t.threshold||0]),n={id:e,observer:a,elements:r},p.set(e,n)}return n}(n);let s=i.get(t)||[];return i.has(t)||i.set(t,s),s.push(e),a.observe(t),function(){s.splice(s.indexOf(e),1),0===s.length&&(i.delete(t),a.unobserve(t)),0===i.size&&(a.disconnect(),p.delete(o))}}function w(){let{threshold:t,delay:e,trackVisibility:n,rootMargin:o,root:a,triggerOnce:i,skip:s,initialInView:c,fallbackInView:u,onChange:l}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const h=r.useRef(),f=r.useRef(),[d,p]=r.useState({inView:!!c});f.current=l;const m=r.useCallback((r=>{void 0!==h.current&&(h.current(),h.current=void 0),s||r&&(h.current=b(r,((t,e)=>{p({inView:t,entry:e}),f.current&&f.current(t,e),e.isIntersecting&&i&&h.current&&(h.current(),h.current=void 0)}),{root:a,rootMargin:o,threshold:t,trackVisibility:n,delay:e},u))}),[Array.isArray(t)?t.toString():t,a,o,i,s,n,u,e]);r.useEffect((()=>{h.current||!d.entry||i||s||p({inView:!!c})}));const g=[m,d.inView,d.entry];return g.ref=g[0],g.inView=g[1],g.entry=g[2],g}var M=function(t){var e=t.children,n=t.data,o=t.handleSetLastScrollTop,a=t.lastScrollTop,i=t.onStepEnter,c=void 0===i?function(){}:i,u=t.onStepExit,l=void 0===u?function(){}:u,h=t.onStepProgress,f=void 0===h?null:h,d=t.offset,p=t.scrollamaId,m=t.progressThreshold,g=t.innerHeight,y="undefined"!==typeof window?document.documentElement.scrollTop:0,v=a<y?"down":"up",b=function(t){return"-".concat(100*t,"% 0px -").concat(100-100*t,"% 0px")}(d),M=(0,r.useRef)(null),k=s((0,r.useState)(!1),2),x=k[0],S=k[1],j=w({rootMargin:b,threshold:0}),E=j.ref,I=j.entry,O=w({rootMargin:(0,r.useMemo)((function(){return function(t,e,n,r){if(!n.current)return"0px";var o=n.current.offsetHeight/r;return"down"===t?"".concat(100*(o-e),"% 0px ").concat(100*e-100,"% 0px"):"-".concat(100*e,"% 0px ").concat(100*o-(100-100*e),"% 0px")}(v,d,M,g)}),[v,d,M,g]),threshold:m}),P=O.ref,C=O.entry,T=(0,r.useCallback)((function(t){M.current=t,E(t),P(t)}),[E,P]);return r.useEffect((function(){if(x){var t=C.target.getBoundingClientRect(),e=t.height,r=t.top,o=Math.min(1,Math.max(0,(window.innerHeight*d-r)/e));f&&f({progress:o,scrollamaId:p,data:n,element:C.target,entry:C,direction:v})}}),[C]),r.useEffect((function(){I&&!I.isIntersecting&&x?(l({element:I.target,scrollamaId:p,data:n,entry:I,direction:v}),S(!1),o(y)):I&&I.isIntersecting&&!x&&(S(!0),c({element:I.target,scrollamaId:p,data:n,entry:I,direction:v}),o(y))}),[I]),r.cloneElement(r.Children.only(e),{"data-react-scrollama-id":p,ref:T,entry:I})}}}]);
//# sourceMappingURL=262.1da66775.chunk.js.map