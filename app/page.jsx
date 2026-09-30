'use client';
import {useEffect,useRef,useState} from 'react';
import dynamic from 'next/dynamic';
const BrickScene=dynamic(()=>import('../components/BrickScene'),{ssr:false});
// EDIT HERE: add photo paths (put files in public/team, e.g. '/team/abhishek.jpg'), roles and links
const TEAM=[
 {name:'Abhishek Rai A',reg:'24SEAI003',photo:'',role:'',links:[]},
 {name:'Akshay S Bharadwaj',reg:'24SEAI005',photo:'',role:'',links:[]},
 {name:'Faabid Faizal',reg:'24SEAI026',photo:'',role:'',links:[]},
 {name:'Nirmitha D',reg:'24SEAI051',photo:'',role:'',links:[]}];
const BARS=[['Fly ash brick',7,'m'],['Red clay brick',10,'m'],['Cement brick (small)',14,'m'],['Ittige low case',10.3,'i'],['Ittige base case',15.2,'i'],['Ittige high case',23.8,'i']];
function Count({to,dec=0,suffix=''}){const [v,setV]=useState(0),ref=useRef(null);
 useEffect(()=>{const io=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;io.disconnect();const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/1400);setV(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f);};requestAnimationFrame(f);},{threshold:.4});io.observe(ref.current);return()=>io.disconnect();},[to]);
 return <span ref={ref}>{v.toLocaleString('en-IN',{minimumFractionDigits:dec,maximumFractionDigits:dec})}{suffix}</span>;}
export default function Page(){
 useEffect(()=>{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');}),{threshold:.25});document.querySelectorAll('.rv').forEach(n=>io.observe(n));return()=>io.disconnect();},[]);
 return(<main>
  <header className="hero"><div className="bricks" aria-hidden="true">{Array.from({length:40}).map((_,i)=><b key={i} style={{'--i':i,'--r':Math.floor(i/5)}}/>)}</div>
   <div className="hin"><p className="eyebrow">Management and Entrepreneurship | Social Entrepreneurship</p><h1>Ittige</h1><p className="sub">Turning Mysuru's plastic waste into pavers and blocks.</p><a className="btn" href="#build">Watch a block being made</a></div></header>
  <section className="sec"><h2 className="rv">Mysuru makes about 550 tonnes of waste every day</h2>
   <div className="stats">{[[550,0,'','tonnes of solid waste per day'],[248,0,'','tonnes of it is dry waste'],[4.1,1,' million','tonnes of plastic waste in India in 2020-21']].map((s,i)=>
    <div className="card rv" key={i} style={{'--d':i*120+'ms'}}><strong><Count to={s[0]} dec={s[1]} suffix={s[2]}/></strong><span>{s[3]}</span></div>)}</div>
   <p className="src">Sources: Mysuru City Corporation officer in Deccan Herald; CPCB data via PIB. Full links are in the report.</p></section>
  <BrickScene/>
  <section className="sec"><h2 className="rv">The honest numbers</h2><p className="lead rv">A red clay brick in Mysuru is listed at about Rs 10. Our pilot model gives Rs 10 to Rs 24, depending on what we pay for plastic.</p>
   <div className="chart">{BARS.map(([n,v,k],i)=><div className="row rv" key={n} style={{'--d':i*90+'ms'}}><span>{n}</span><div className="track"><i className={k} style={{'--w':(v/24*100)+'%'}}/><em>Rs {v}</em></div></div>)}</div>
   <p className="src">Market: Mysuru dealer listing and a price tracker. Ittige: our model with labelled assumptions. Ittige matches clay only if plastic is nearly free or the city pays to have it taken.</p></section>
  <section className="sec alt"><h2 className="rv">Why packaging film, not bottles</h2><div className="two"><div className="card rv"><h3>Bottles (PET)</h3><p>About 90% are already collected and collectors are paid for them. PET also bonded worse with sand than LDPE in one study.</p></div><div className="card hot rv"><h3>Film and caps</h3><p>Carry bags and milk pouches are LDPE film, and caps are PP or HDPE. Low value, often no buyer, and they bind well with sand when melted. Layered sachets stay out until tested. The bottle in the animation is only a hook.</p></div></div></section>
  <section className="sec"><h2 className="rv">The team</h2><div className="team">{TEAM.map(t=><div className="card tm rv" key={t.reg}>{t.photo?<img src={t.photo} alt={t.name}/>:<div className="ph">Photo</div>}<h3>{t.name}</h3><p>{t.reg}</p>{t.role&&<p>{t.role}</p>}{t.links.map(l=><a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>)}</div>)}</div></section>
  <footer className="foot"><p>Ittige is a course business plan. Every figure is cited in the report or labelled as an assumption. University of Mysore School of Engineering, Mysuru.</p></footer>
 </main>);}
