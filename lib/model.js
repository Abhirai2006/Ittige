// The same pilot model as the report (Chapter 7). One tonne of plastic a day.
export const CLAY=10;               // red clay brick in Mysuru, dealer listing (Rs)
export const OTHER_DAILY=8600;      // labour 3,600 + power 2,000 + transport 1,000 + overhead 1,500 + machine 500
export const BRICK_KG=3;
export function model({plastic,sand,share,other}){
  const blocks=1000/share;                              // kg of blocks from 1 tonne of plastic
  const sandKg=blocks*(1-share);
  const bricks=Math.floor(blocks/BRICK_KG/100)*100;     // rounded down to the nearest hundred, as in the report
  const day=plastic*1000+sandKg*sand+other;
  return {bricks,day,perBrick:day/bricks,parts:{plastic:plastic*1000/bricks,sand:sandKg*sand/bricks,other:other/bricks}};
}
export function breakEven({sand,share,other}){            // plastic price at which one brick costs the same as clay
  const blocks=1000/share,sandKg=blocks*(1-share),bricks=Math.floor(blocks/BRICK_KG/100)*100;
  return (CLAY*bricks-sandKg*sand-other)/1000;
}
