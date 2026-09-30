'use client';
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
const G=9.8,W=1.84,H0=0.85,HB=0.6,D=0.88,BASE=0.12,FX=4.6;
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease=x=>x*x*(3-2*x);
const seg=(p,a,b)=>clamp((p-a)/(b-a));
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
// free fall with bouncing: closed form, so it can be scrubbed forwards and backwards
function drop(y0,fl,t,e){if(t<=0)return y0;const h=y0-fl;if(h<=0)return fl;const t1=Math.sqrt(2*h/G);if(t<t1)return y0-0.5*G*t*t;t-=t1;let v=G*t1*e;for(let i=0;i<9&&v>0.1;i++){const tf=2*v/G;if(t<tf)return fl+v*t-0.5*G*t*t;t-=tf;v*=e;}return fl;}
function launch(y0,vy,fl,t,e){if(t<=0)return y0;const ta=vy/G;if(t<ta)return y0+vy*t-0.5*G*t*t;return drop(y0+vy*vy/(2*G),fl,t-ta,e);}
function brickTex(){const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');const r=rng(7);g.fillStyle='#857a6f';g.fillRect(0,0,512,512);
 const base=['#9c8f80','#6d6359','#b3a18b','#7a7066','#5f574f'];for(let i=0;i<9000;i++){g.fillStyle=base[(r()*base.length)|0];const s=1+r()*3;g.fillRect(r()*512,r()*512,s,s);}
 const fl=['#c8412d','#ece8df','#3c6fa8','#d9a21b','#2f8f6b'];g.globalAlpha=.85;for(let i=0;i<220;i++){g.fillStyle=fl[(r()*fl.length)|0];g.beginPath();g.ellipse(r()*512,r()*512,2+r()*6,1+r()*3,r()*3,0,6.28);g.fill();}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t;}
const MATS=[['Carry bag film','LDPE','#ece8df'],['Milk pouch film','LDPE','#9fc4e0'],['Bottle caps','HDPE or PP','#c8412d'],['A few bottle flakes','PET, story only','#bfe3f2']];
const CAP=[['A bottle drops','It falls under gravity and bounces once. The bottle is only our visual hook. The real feed is film and caps.'],['Shredded into flakes','Carry bags, milk pouches and bottle caps are sorted and shredded. Each piece flies, bounces and settles. A few bottle flakes are only for the story.'],['Sand joins the mix','About 70% sand by weight in our model. Sand grains fall and mix in with the plastic pieces.'],['Into the furnace','Heat melts the plastic so it coats the sand grains and becomes the binder.'],['Pressed','The hot mix is squeezed into shape. Watch it spring back a little.'],['Cooling','No kiln firing, no water, no cement. The mould opens.'],['One Ittige block','Made from code, not a photo. Still to be lab tested before anything is sold.']];
export default function BrickScene(){
 const wrapRef=useRef(null),cv=useRef(null),bar=useRef(null),[stage,setStage]=useState(0);
 useEffect(()=>{
  const canvas=cv.current,wr=wrapRef.current;
  const R=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
  const S=new THREE.Scene(),cam=new THREE.PerspectiveCamera(34,1,0.1,80);
  S.add(new THREE.HemisphereLight(0xffffff,0xd6cbbd,1.0));
  const sun=new THREE.DirectionalLight(0xffffff,1.6);sun.position.set(-5,10,7);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const sc=sun.shadow.camera;sc.left=-10;sc.right=12;sc.top=9;sc.bottom=-4;sc.near=1;sc.far=40;S.add(sun);
  const heat=new THREE.PointLight(0xff7a1a,0,10);heat.position.set(FX,1.3,0.5);S.add(heat);
  const std=o=>new THREE.MeshStandardMaterial(o),bx=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  const steel=std({color:0x59544f,roughness:.5,metalness:.55});
  const add=(geo,mat,x,y,z,parent,shadow=true)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=shadow;m.receiveShadow=true;parent.add(m);return m;};
  const bench=add(bx(26,0.3,3.4),std({color:0xd8cfc4,roughness:.9}),2.3,-0.15,0,S,false);
  const fur=new THREE.Group();fur.position.set(FX,0,0);S.add(fur);
  const glowMat=std({color:0x3a2a22,emissive:0xff5a00,emissiveIntensity:0,roughness:.7});
  add(bx(3.2,2.5,0.16),glowMat,0,1.25,-1.0,fur);add(bx(3.2,0.3,2.2),steel,0,2.65,0,fur);add(bx(0.3,2.5,2.2),steel,-1.75,1.25,0,fur);add(bx(0.3,2.5,2.2),steel,1.75,1.25,0,fur);
  add(new THREE.CylinderGeometry(0.28,0.28,1.2,20),steel,0.9,3.5,-0.5,fur);
  const B=new THREE.Group();S.add(B);
  add(bx(W+0.3,BASE,D+0.3),steel,0,BASE/2,0,B);
  const wallMat=std({color:0x8a8580,roughness:.35,metalness:.7,transparent:true,opacity:.5});
  const wl=add(bx(0.06,1.15,D+0.1),wallMat,-(W/2+0.03),BASE+0.575,0,B,false),wrr=add(bx(0.06,1.15,D+0.1),wallMat,W/2+0.03,BASE+0.575,0,B,false),wb=add(bx(W+0.12,1.15,0.06),wallMat,0,BASE+0.575,-(D/2+0.03),B,false);
  const tex=brickTex();tex.repeat.set(2,1);
  const brickMat=std({map:tex,bumpMap:tex,bumpScale:1.2,roughness:.92,emissive:0xff5a00,emissiveIntensity:0});
  const slab=add(bx(1,1,1),brickMat,0,0,0,B);slab.visible=false;
  const press=add(bx(W,0.15,D),steel,0,6,0,B);
  const hop=add(new THREE.CylinderGeometry(0.7,0.14,0.8,28,1,true),std({color:0x59544f,roughness:.5,metalness:.5,side:THREE.DoubleSide}),0,5.9,0,B,false);
  const prof=[[0,0],[.26,0],[.28,.06],[.28,.9],[.24,1.05],[.12,1.22],[.09,1.32],[.09,1.5],[0,1.5]].map(([x,y])=>new THREE.Vector2(x,y-0.75));
  const bottle=new THREE.Group();const bm=new THREE.Mesh(new THREE.LatheGeometry(prof,28),new THREE.MeshPhysicalMaterial({color:0xbfe3f2,transparent:true,opacity:.6,roughness:.08,clearcoat:1,side:THREE.DoubleSide}));bm.castShadow=true;bottle.add(bm);
  const cap=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.11,0.14,20),std({color:0xc8412d,roughness:.5}));cap.position.y=0.8;bottle.add(cap);B.add(bottle);
  const NF=100,NC=26,NG=420,r=rng(11);
  const flMat=std({color:0xffffff,roughness:.35,transparent:true,opacity:.92,emissive:0xff5a00,emissiveIntensity:0});
  const fl=new THREE.InstancedMesh(bx(0.2,0.012,0.14),flMat,NF);fl.castShadow=true;B.add(fl);
  const capMat=std({color:0xffffff,roughness:.45,emissive:0xff5a00,emissiveIntensity:0});
  const cp=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.055,0.055,0.04,14),capMat,NC);cp.castShadow=true;B.add(cp);
  const grMat=std({color:0xc9b28a,roughness:1});
  const gr=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.05,0),grMat,NG);gr.castShadow=true;B.add(gr);
  const mk=()=>({vx:(r()-.5)*1.6,vz:(r()-.5)*.8,vy:1.5+r()*2.2,y0:.35+r()*.3,fl:BASE+.02+r()*.12,x0:(r()-.5),z0:(r()-.5)*.4,sp:(r()-.5)*14,rx:r()*3,rz:r()*3,sx:.7+r()*.7,sz:.7+r()*.6});
  const F=Array.from({length:NF},mk),C=Array.from({length:NC},mk);
  const bagC=['#ece8df','#2b2724','#3c6fa8','#c8412d'],pouchC=['#dcebf5','#9fc4e0'],capC=['#c8412d','#3c6fa8','#ece8df','#2f8f6b','#d9a21b'],col=new THREE.Color();
  F.forEach((f,i)=>{const u=r();col.set(u<.45?bagC[(r()*4)|0]:u<.85?pouchC[(r()*2)|0]:'#bfe3f2');fl.setColorAt(i,col);});
  C.forEach((c,i)=>{c.fl=BASE+.03+r()*.1;col.set(capC[(r()*5)|0]);cp.setColorAt(i,col);});
  fl.instanceColor.needsUpdate=true;cp.instanceColor.needsUpdate=true;
  const Gp=Array.from({length:NG},(_,i)=>({x:(r()-.5)*(W-.15),z:(r()-.5)*(D-.15),d:(i/NG)*1.4+r()*.15,l:BASE+.05+(i/NG)*.68+r()*.03,rx:r()*6,rz:r()*6}));
  const dm=new THREE.Object3D(),white=new THREE.Color(0xffffff),hot=new THREE.Color(0xff7a1a),sand=new THREE.Color(0xc9b28a),dark=new THREE.Color(0x5a4636);
  const TH=[0,.18,.34,.5,.66,.78,.9];let lastStage=-1;
  function update(p,clock){
   const camX=2.3*ease(seg(p,.46,.56))-2.3*ease(seg(p,.82,.92)),dist=Math.max(11.5,10.5/cam.aspect);
   cam.position.set(camX,2.6,dist);cam.lookAt(camX,2.1,0);
   B.position.x=FX*ease(seg(p,.5,.62))-FX*ease(seg(p,.84,.93));
   const t0=seg(p,0,.17)*1.9;bottle.position.y=drop(6.6,BASE+.3,t0,.3);bottle.rotation.z=(Math.PI/2)*ease(clamp((t0-.7)/.55));
   const bs=1-seg(p,.18,.205);bottle.scale.setScalar(Math.max(bs,1e-4));bottle.visible=bs>.001;
   const s1=seg(p,.18,.34)*2.2,s2=seg(p,.34,.5)*2.6,m1=seg(p,.5,.58),m=seg(p,.575,.605);
   const put=(mesh,arr,n,wide)=>{for(let i=0;i<n;i++){const f=arr[i],t=s1,k=(1-Math.exp(-3*Math.max(t,0)))/3,sp=f.sp*Math.min(Math.max(t,0),1.2),fz=1-ease(clamp((t-1.1)/.7));
    dm.position.set(f.x0+f.vx*k,launch(f.y0,f.vy,f.fl,t,.35),f.z0+f.vz*k);dm.rotation.set((f.rx+sp*.5)*fz,sp,f.rz*fz);
    const v=Math.max((p>.19&&t>0)?1-m:0,1e-4);dm.scale.set(v*(wide?f.sx:1),v,v*(wide?f.sz:1));dm.updateMatrix();mesh.setMatrixAt(i,dm.matrix);}mesh.instanceMatrix.needsUpdate=true;};
   put(fl,F,NF,true);put(cp,C,NC,false);flMat.emissiveIntensity=capMat.emissiveIntensity=m1*.9;flMat.color.lerpColors(white,hot,m1*.5);capMat.color.copy(flMat.color);
   for(let i=0;i<NG;i++){const g=Gp[i],t=s2-g.d,tr=Math.min(Math.max(t,0),1.1);
    dm.position.set(g.x,drop(5.5,g.l,t,.12),g.z);dm.rotation.set(g.rx+tr*4,0,g.rz+tr*3);
    dm.scale.setScalar(Math.max((p>.34&&t>0)?1-m:0,1e-4));dm.updateMatrix();gr.setMatrixAt(i,dm.matrix);}
   gr.instanceMatrix.needsUpdate=true;grMat.color.lerpColors(sand,dark,m1);hop.visible=p>.33&&p<.5;
   const pt=seg(p,.68,.8)*.9,hh=HB+(H0-HB)*Math.exp(-4*pt)*Math.cos(8*pt);
   press.position.y=BASE+hh+.075+2.8*(1-ease(seg(p,.62,.68)))+3*ease(seg(p,.8,.86));
   slab.visible=p>.575;press.visible=p>.6&&p<.87;const sy=Math.max(hh*Math.max(m,.02),.001);slab.scale.set(W-.04,sy,D-.04);
   slab.position.y=BASE+sy/2+1.05*ease(seg(p,.9,.95));
   slab.rotation.y=7*ease(seg(p,.9,1))+.4*clock*ease(seg(p,.95,1));slab.rotation.x=.4*ease(seg(p,.92,1));
   brickMat.emissiveIntensity=1.1*(1-seg(p,.72,.92))*clamp(m*4);
   const gl=seg(p,.48,.56)*(1-seg(p,.8,.92));glowMat.emissiveIntensity=1.4*gl;heat.intensity=40*gl;
   const wo=ease(seg(p,.78,.84));wl.position.x=-(W/2+.03)-.9*wo;wrr.position.x=W/2+.03+.9*wo;wl.visible=wrr.visible=wb.visible=p<.9;
   let s=0;TH.forEach((t,i)=>{if(p>=t)s=i;});if(s!==lastStage){lastStage=s;setStage(s);}
  }
  let cur=0,target=0,raf;
  const onScroll=()=>{const b=wr.getBoundingClientRect();target=clamp(-b.top/Math.max(1,b.height-innerHeight));};
  const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();};
  const t00=performance.now();
  const loop=()=>{cur+=(target-cur)*.12;if(Math.abs(target-cur)<1e-4)cur=target;update(cur,(performance.now()-t00)/1000);if(bar.current)bar.current.style.transform=`scaleX(${cur})`;R.render(S,cam);raf=requestAnimationFrame(loop);};
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',resize);resize();onScroll();cur=target;loop();
  return()=>{cancelAnimationFrame(raf);removeEventListener('scroll',onScroll);removeEventListener('resize',resize);R.dispose();};
 },[]);
 return(<section ref={wrapRef} className="scene" id="build" style={{height:'760vh'}}><div className="stick"><canvas ref={cv}/>
  <div className="cap"><span>{stage+1} / 7</span><h3>{CAP[stage][0]}</h3><p>{CAP[stage][1]}</p></div>
  {stage>=1&&stage<=3&&<div className="legend"><h4>Going into the mix</h4>{MATS.map(m=><div key={m[0]}><i style={{background:m[2]}}/><b>{m[0]}</b><span>{m[1]}</span></div>)}<p>Screened out: PVC, and layered sachets until tested.</p></div>}
  <div className="bar"><i ref={bar}/></div><p className="note">Drawn live in your browser from code. No video, no photo.</p></div></section>);
}
