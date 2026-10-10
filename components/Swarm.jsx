'use client';
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
const SHAPES=['Scatter','Brick','ITTIGE','MUSE','Sphere'];
const PAL=['#b5432a','#e0a526','#2b2724','#3c6fa8','#2f8f6b','#c9b28a'];
function textPts(word,n){
 const c=document.createElement('canvas');c.width=1000;c.height=300;const g=c.getContext('2d');
 g.font='700 230px Georgia,Cambria,serif';g.textAlign='center';g.textBaseline='middle';g.fillText(word,500,160);
 const d=g.getImageData(0,0,1000,300).data,pts=[];
 for(let y=0;y<300;y+=2)for(let x=0;x<1000;x+=2)if(d[(y*1000+x)*4+3]>128)pts.push([(x-500)/105,-(y-150)/105]);
 const out=new Float32Array(n*3);
 for(let i=0;i<n;i++){const p=pts[(Math.random()*pts.length)|0]||[0,0];out[i*3]=p[0];out[i*3+1]=p[1];out[i*3+2]=(Math.random()-.5)*.5;}
 return out;
}
function build(kind,n){
 const o=new Float32Array(n*3);
 for(let i=0;i<n;i++){let x,y,z;
  if(kind==='scatter'){x=(Math.random()-.5)*12;y=(Math.random()-.5)*5.5;z=(Math.random()-.5)*4;}
  else if(kind==='sphere'){const u=Math.random()*2-1,t=Math.random()*6.2832,r=Math.sqrt(1-u*u);const s=2.3;x=r*Math.cos(t)*s;y=u*s;z=r*Math.sin(t)*s;}
  else{const hx=1.9,hy=.7,hz=.95;x=(Math.random()*2-1)*hx;y=(Math.random()*2-1)*hy;z=(Math.random()*2-1)*hz;
   if(Math.random()<.75){const f=(Math.random()*3)|0,s=Math.random()<.5?-1:1;if(f===0)x=s*hx;else if(f===1)y=s*hy;else z=s*hz;}}
  o[i*3]=x;o[i*3+1]=y;o[i*3+2]=z;}
 return o;
}
export default function Swarm(){
 const cv=useRef(null),box=useRef(null),api=useRef({}),user=useRef(false),[sel,setSel]=useState(1);
 useEffect(()=>{
  const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N=innerWidth<700?5500:9000,canvas=cv.current;
  const R=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  const S=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,2,.1,60);cam.position.z=9;
  const T=[build('scatter',N),build('brick',N),textPts('ITTIGE',N),textPts('MUSE',N),build('sphere',N)];
  const pos=new Float32Array(T[0]),col=new Float32Array(N*3),ks=new Float32Array(N),ph=new Float32Array(N),c=new THREE.Color();
  for(let i=0;i<N;i++){c.set(PAL[(Math.random()*PAL.length)|0]);col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;ks[i]=.025+Math.random()*.06;ph[i]=Math.random()*6.28;}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const mat=new THREE.PointsMaterial({size:.06,vertexColors:true,sizeAttenuation:true,transparent:true,opacity:.95});
  const pts=new THREE.Points(geo,mat),grp=new THREE.Group();grp.add(pts);S.add(grp);
  let cur=1,vis=true,raf=0,px=99,py=99,t0=performance.now(),last=t0;
  const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();};
  const move=e=>{const r=canvas.getBoundingClientRect(),nx=((e.clientX-r.left)/r.width)*2-1,ny=-(((e.clientY-r.top)/r.height)*2-1);
   const hh=Math.tan(cam.fov*Math.PI/360)*cam.position.z;px=nx*hh*cam.aspect;py=ny*hh;};
  const out=()=>{px=py=99;};
  canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerleave',out);
  const io=new IntersectionObserver(([e])=>{vis=e.isIntersecting;},{threshold:.05});io.observe(canvas);
  api.current.go=i=>{if(i===cur)return;cur=i;if(!rm)for(let j=0;j<N;j++){pos[j*3]+=(Math.random()-.5)*.9;pos[j*3+1]+=(Math.random()-.5)*.9;pos[j*3+2]+=(Math.random()-.5)*.9;}};
  const loop=()=>{raf=requestAnimationFrame(loop);if(!vis)return;
   const now=performance.now(),t=(now-t0)/1000,fr=Math.min(6,(now-last)/16.7);last=now;const tg=T[cur],spin=cur===1||cur===4;
   const rr=((grp.rotation.y+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;
   grp.rotation.y=spin?grp.rotation.y+.006*fr:grp.rotation.y-rr*Math.min(1,.08*fr);
   grp.rotation.x+=((spin?.18:0)-grp.rotation.x)*.05;
   for(let i=0;i<N;i++){const k=rm?1:1-Math.pow(1-ks[i],fr),j=i*3,w=rm?0:.012;
    let x=pos[j],y=pos[j+1],z=pos[j+2];
    x+=(tg[j]-x)*k+Math.sin(t*.9+ph[i])*w;y+=(tg[j+1]-y)*k+Math.cos(t*.8+ph[i])*w;z+=(tg[j+2]-z)*k;
    if(!rm&&px<90){const dx=x-px,dy=y-py,d2=dx*dx+dy*dy;if(d2<1.4){const d=Math.sqrt(d2)+.001,f=(1.18-d)*.28;x+=dx/d*f;y+=dy/d*f;}}
    pos[j]=x;pos[j+1]=y;pos[j+2]=z;}
   geo.attributes.position.needsUpdate=true;R.render(S,cam);};
  window.addEventListener('resize',resize);resize();loop();
  const auto=rm?0:setInterval(()=>{if(!user.current)setSel(s=>(s+1)%5);},4200);
  return()=>{cancelAnimationFrame(raf);clearInterval(auto);window.removeEventListener('resize',resize);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',out);io.disconnect();geo.dispose();mat.dispose();R.dispose();};
 },[]);
 useEffect(()=>{api.current.go&&api.current.go(sel);},[sel]);
 return(<section className="sec swarm" ref={box}><h2 className="rv">Play with {innerWidthLabel()} pieces of plastic</h2>
  <p className="lead rv">Thin film is light, colourful and everywhere. Pick a shape and watch the loose flakes pull together, then push your pointer through them.</p>
  <div className="swarm-box rv"><canvas ref={cv} role="img" aria-label={'Thousands of plastic flakes forming a shape: '+SHAPES[sel]}/></div>
  <div className="swarm-btns" role="group" aria-label="Pick a shape">{SHAPES.map((s,i)=><button key={s} aria-pressed={sel===i} className={sel===i?'on':''} onClick={()=>{user.current=true;setSel(i);}}>{s}</button>)}</div>
  <p className="src">Drawn live in your browser from code. Not a photo and not a video.</p></section>);
}
function innerWidthLabel(){return '9,000';}
