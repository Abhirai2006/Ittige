'use client';
import {useEffect,useRef,useState} from 'react';
import {model,breakEven,CLAY,OTHER_DAILY} from '../lib/model';
const f2=x=>x.toFixed(2);
const inr=x=>Math.round(x).toLocaleString('en-IN');
export default function Calculator(){
 const [plastic,setPlastic]=useState(5),[sand,setSand]=useState(1.35),[share,setShare]=useState(0.3),[up,setUp]=useState(false);
 const other=OTHER_DAILY*(up?1.5:1);
 const m=model({plastic,sand,share,other}),be=breakEven({sand,share,other});
 const diff=m.perBrick-CLAY,same=Math.abs(diff)<0.25;
 const verdict=same?'About the same as clay':diff<0?`Cheaper than clay by Rs ${f2(-diff)}`:`Dearer than clay by Rs ${f2(diff)}`;
 const tone=same?'mid':diff<0?'good':'bad';
 const priceLabel=plastic>0?`Ittige pays Rs ${f2(plastic)} per kg`:plastic===0?'The plastic is free':`The city pays Ittige Rs ${f2(-plastic)} per kg`;
 const bars=[['Fly ash brick',7,'m'],['Red clay brick',CLAY,'m'],['Cement brick (small)',14,'m'],['Ittige, your settings',m.perBrick,'i']];
 const max=Math.max(24,m.perBrick+1);
 const hit=m.perBrick<=CLAY+0.25,was=useRef(false);
 useEffect(()=>{if(hit&&!was.current)window.dispatchEvent(new CustomEvent('ittige-confetti'));was.current=hit;},[hit]);
 const preset=(p,s)=>{setPlastic(p);setSand(s);setShare(0.3);setUp(false);};
 const toClay=()=>setPlastic(Math.max(-2,Math.min(20,Math.round(be*100)/100)));
 return(<section className="sec calc" id="calculator">
  <h2 className="rv">Try the numbers yourself</h2>
  <p className="lead rv">Drag the plastic price and watch the cost of one brick change. It is the same model as the report. Labour, power, transport and overhead are our assumptions, and you can test them too.</p>
  <div className="calc-grid">
   <div className="card calc-ctl">
    <div className="calc-presets" role="group" aria-label="Preset cases">
     <button type="button" onClick={()=>preset(0,1.16)}>Low case</button>
     <button type="button" onClick={()=>preset(5,1.35)}>Base case</button>
     <button type="button" onClick={()=>preset(14,1.55)}>High case</button>
     <button type="button" onClick={toClay}>Match clay</button>
    </div>
    <label htmlFor="cp">Price of plastic: <b>{priceLabel}</b></label>
    <input id="cp" type="range" min="-2" max="20" step="0.25" value={plastic} onChange={e=>setPlastic(+e.target.value)}/>
    <div className="calc-ends"><span>City pays Rs 2</span><span>Rs 0</span><span>Rs 20 per kg</span></div>
    <label htmlFor="cs">Price of sand: <b>Rs {f2(sand)} per kg</b></label>
    <input id="cs" type="range" min="1" max="2" step="0.01" value={sand} onChange={e=>setSand(+e.target.value)}/>
    <div className="calc-mix" role="group" aria-label="Plastic share of the mix">
     <button type="button" aria-pressed={share===0.3} onClick={()=>setShare(0.3)}>30% plastic<small>our model</small></button>
     <button type="button" aria-pressed={share===0.2} onClick={()=>setShare(0.2)}>20% plastic<small>like Rhino Machines</small></button>
    </div>
    <label className="calc-check"><input type="checkbox" checked={up} onChange={e=>setUp(e.target.checked)}/> Raise other daily costs by 50% <small>(now Rs {inr(other)} a day)</small></label>
   </div>
   <div className="card calc-out" aria-live="polite">
    <p className="calc-small">Cost to make one brick</p>
    <p key={f2(m.perBrick)} className="calc-big">Rs {f2(m.perBrick)}</p>
    <p key={tone} className={'calc-verdict '+tone}>{verdict}</p>
    <div className="calc-bars">{bars.map(([n,v,k])=><div className="calc-row" key={n}><span>{n}</span><div className="calc-track"><i className={k} style={{width:Math.max(2,v/max*100)+'%'}}/><em>Rs {f2(v)}</em></div></div>)}</div>
    <div className="calc-parts"><div><b>Rs {f2(m.parts.plastic)}</b><span>plastic</span></div><div><b>Rs {f2(m.parts.sand)}</b><span>sand</span></div><div><b>Rs {f2(m.parts.other)}</b><span>other costs</span></div></div>
    <p className="calc-note">{be>=0?`With these settings Ittige can pay up to Rs ${f2(be)} per kg for plastic and still match clay.`:`With these settings the city would have to pay Ittige about Rs ${f2(-be)} per kg to take the plastic for Ittige to match clay.`}</p>
    <p className="calc-note">The unit makes about {inr(m.bricks)} bricks a day and costs about Rs {inr(m.day)} a day to run.</p>
   </div>
  </div>
  <p className="src">Model output for a pilot taking in 1 tonne of plastic a day, with 3 kg bricks. Clay is the Mysuru dealer price of about Rs 10. At 20% plastic the unit makes more bricks a day, so the extra work may raise labour and machine costs: tick the box to see that case. This is a planning model, not a forecast.</p>
 </section>);
}
