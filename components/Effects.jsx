'use client';
import {useEffect,useRef} from 'react';
const COL=['#b5432a','#e0a526','#2b2724','#f6e3dd','#9e3720'];
const TILT='.card:not(.calc-ctl):not(.calc-out)';
export default function Effects(){
 const bar=useRef(null),cv=useRef(null);
 useEffect(()=>{
  const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  const onScroll=()=>{const h=document.documentElement,p=h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight);if(bar.current)bar.current.style.transform='scaleX('+Math.min(1,p)+')';};
  onScroll();addEventListener('scroll',onScroll,{passive:true});
  const off=[()=>removeEventListener('scroll',onScroll)];
  if(fine&&!rm){
   let cur=null;
   const reset=el=>{if(!el)return;el.classList.remove('tilt');el.style.removeProperty('--rx');el.style.removeProperty('--ry');};
   const move=e=>{
    const el=e.target.closest&&e.target.closest(TILT);
    if(el!==cur){reset(cur);cur=el;}
    if(el){const r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
     el.classList.add('tilt');el.style.setProperty('--rx',((.5-py)*8).toFixed(2)+'deg');el.style.setProperty('--ry',((px-.5)*10).toFixed(2)+'deg');el.style.setProperty('--gx',(px*100)+'%');el.style.setProperty('--gy',(py*100)+'%');}
   };
   const leave=()=>{reset(cur);cur=null;};
   const mag=e=>{document.querySelectorAll('.btn').forEach(b=>{const r=b.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy;
    if(Math.hypot(dx,dy)<110)b.style.translate=(dx*.22).toFixed(1)+'px '+(dy*.3).toFixed(1)+'px';else b.style.translate='';});};
   addEventListener('pointermove',mag,{passive:true});off.push(()=>removeEventListener('pointermove',mag));
   addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',leave);
   off.push(()=>{removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);});
  }
  if(!rm){
   let lastY=scrollY,vel=0,sraf=0;
   const sv=()=>{const y=scrollY;vel=vel*.9+Math.abs(y-lastY)*.35;lastY=y;const m=document.querySelector('.mt'),a=m&&m.getAnimations&&m.getAnimations()[0];if(a)a.playbackRate=1+Math.min(8,vel*.15);sraf=requestAnimationFrame(sv);};
   sraf=requestAnimationFrame(sv);off.push(()=>cancelAnimationFrame(sraf));
   let parts=[],raf=0;
   const run=()=>{const c=cv.current;if(!c)return;const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);
    parts=parts.filter(p=>p.l>0);
    for(const p of parts){p.vy+=.28;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;p.l--;g.save();g.translate(p.x,p.y);g.rotate(p.a);g.globalAlpha=Math.min(1,p.l/30);g.fillStyle=p.c;g.fillRect(-p.w/2,-p.h/2,p.w,p.h);g.restore();}
    if(parts.length)raf=requestAnimationFrame(run);else g.clearRect(0,0,c.width,c.height);};
   const boom=()=>{const c=cv.current;if(!c)return;c.width=innerWidth;c.height=innerHeight;
    const t=document.querySelector('.calc-big'),r=t?t.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2,width:0,height:0};
    const ox=r.left+r.width/2,oy=Math.min(innerHeight*.8,Math.max(80,r.top+r.height/2));
    for(let i=0;i<110;i++){const a=Math.random()*Math.PI*2,s=4+Math.random()*9;
     parts.push({x:ox,y:oy,vx:Math.cos(a)*s,vy:Math.sin(a)*s-6,w:12+Math.random()*8,h:6+Math.random()*4,a:Math.random()*6,va:(Math.random()-.5)*.4,c:COL[i%COL.length],l:90+Math.random()*50});}
    cancelAnimationFrame(raf);raf=requestAnimationFrame(run);};
   addEventListener('ittige-confetti',boom);
   off.push(()=>{cancelAnimationFrame(raf);removeEventListener('ittige-confetti',boom);});
  }
  return()=>off.forEach(f=>f());
 },[]);
 return(<>
  <div className="prog" aria-hidden="true"><i ref={bar}/></div>
  <canvas className="confetti" ref={cv} aria-hidden="true"/>
 </>);
}
