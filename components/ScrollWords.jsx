'use client';
import {useEffect,useRef} from 'react';
export default function ScrollWords({text}){
 const ref=useRef(null),words=text.split(' ');
 useEffect(()=>{
  const el=ref.current,sp=[...el.querySelectorAll('span')];
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){sp.forEach(s=>s.classList.add('on'));return;}
  let raf=0;
  const upd=()=>{raf=0;const r=el.getBoundingClientRect(),vh=innerHeight,p=Math.min(1,Math.max(0,(vh*.85-r.top)/(r.height+vh*.35)));
   const n=Math.round(p*sp.length);sp.forEach((s,i)=>s.classList.toggle('on',i<n));};
  const on=()=>{if(!raf)raf=requestAnimationFrame(upd);};
  upd();addEventListener('scroll',on,{passive:true});addEventListener('resize',on);
  return()=>{removeEventListener('scroll',on);removeEventListener('resize',on);if(raf)cancelAnimationFrame(raf);};
 },[]);
 return <p className="sw" ref={ref} aria-label={text}>{words.map((w,i)=><span key={i} aria-hidden="true">{w} </span>)}</p>;
}
